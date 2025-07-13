import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import CourseCard from '../components/CourseCard/CourseCard.jsx';
import Intro from '../components/Intro/Intro.jsx';
import Section from '../components/Section/Section.jsx';
import CreateCourse from '../components/CreateCourse/CreateCourse.jsx';
import Footer from '../components/Footer/Footer.jsx';
import '../components/Section/Section.css';
import './index.css';
import {BASE_URL} from '../constants.jsx';
import {refreshToken, isAuthorized} from '../utils/auth-utils.jsx';
import LoadingAnimation from "../components/LoadingAnimation.jsx";

const Index = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/courses/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data);

      if (isAuthorized()) {
        const userData = JSON.parse(localStorage.getItem('loginData'));
        const coursesResponse = await fetch(`${BASE_URL}/api/courses/enrolled/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userData?.access}`,
          },
        });

        if (coursesResponse.status === 401) {
          const refreshResult = await refreshToken();
          if (refreshResult === 'success') {
            const retryResponse = await fetch(`${BASE_URL}/api/courses/enrolled/`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loginData'))?.access}`,
              },
            });

            if (!retryResponse.ok) {
              throw new Error(`Failed to fetch enrolled courses: ${retryResponse.status}`);
            }
            const data = await retryResponse.json();
            setEnrolledCourses(data.enrolled_courses_ids);
          } else {
            localStorage.removeItem('loginData');
            navigate('/login');
          }
        } else if (!coursesResponse.ok) {
          throw new Error(`Failed to fetch enrolled courses: ${coursesResponse.status}`);
        } else {
          const data = await coursesResponse.json();
          setEnrolledCourses(data.enrolled_courses_ids);
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);
  return (
    <div>
      <div className="main">
        <Header/>
        <div className="container mx-auto pt-10">
          <Intro/>
          <Section title="Kurslar" textSize='text-4xl'/>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12" id="courses">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard course={course} btn_text={enrolledCourses.includes(course.id) ? 'Davom etish' : 'Boshlash'}
                            key={course.id}/>
              ))
            ) : ''}
            {isAuthorized() && JSON.parse(localStorage.getItem('loginData'))?.is_staff && <CreateCourse/>}
          </section>
          {isLoading && (
            <LoadingAnimation/>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Index;