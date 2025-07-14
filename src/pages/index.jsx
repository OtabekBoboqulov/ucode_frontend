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
import {refreshToken, isAuthorized, isStaff} from '../utils/auth-utils.jsx';
import LoadingAnimation from "../components/LoadingAnimation.jsx";
import PopupMessage from "../components/PopupMessage/PopupMessage.jsx";
import Modal from "react-modal";

const Index = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isDeleteAskOpen, setIsDeleteAskOpen] = useState(false)
  const [deleteCourseId, setDeleteCourseId] = useState(null);

  const closeDeleteAskModal = () => {
    setIsDeleteAskOpen(false);
  }

  const openDeleteAskModal = (courseId) => {
    setDeleteCourseId(courseId);
    setIsDeleteAskOpen(true);
  }

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

  const deleteCourse = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('loginData'));
      const response = await fetch(`${BASE_URL}/api/courses/delete/${deleteCourseId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.access}`
        }
      });
      if (!response.ok) {
        window.location.href = '/login';
        localStorage.removeItem('loginData');
      }
      setIsDeleteAskOpen(false);
      setDeleteCourseId(null);
      await getCourses();
      const data = await response.json();
      setMessage(data.message);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (e) {
      console.error(e);
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
                <div className="relative">
                  <CourseCard course={course}
                              btn_text={enrolledCourses.includes(course.id) ? 'Davom etish' : 'Boshlash'}
                              key={course.id}/>
                  {isAuthorized() && isStaff() && (
                    <button className="delete-course-btn" onClick={() => openDeleteAskModal(course.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                           stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))
            ) : ''}
            {isAuthorized() && JSON.parse(localStorage.getItem('loginData'))?.is_staff && <CreateCourse/>}
          </section>
          {message && (
            <PopupMessage message={message}/>
          )}
          {isLoading && (
            <LoadingAnimation/>
          )}
        </div>
      </div>
      <Modal
        isOpen={isDeleteAskOpen}
        onRequestClose={closeDeleteAskModal}
        className="modal-window"
        overlayClassName="modal-overlay"
        contentLabel="Delete Course"
      >
        <h2 className="modal-title">Kursni o'chirmoqchimisiz?</h2>
        <div className="delete-btn-group">
          <button className="delete-course" onClick={deleteCourse}>Ha</button>
          <button className="cancel-delete" onClick={closeDeleteAskModal}>Bekor qilish</button>
        </div>
      </Modal>
      <Footer/>
    </div>
  );
};

export default Index;