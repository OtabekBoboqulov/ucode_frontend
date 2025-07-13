import React, {useEffect, useState} from 'react';
import {BASE_URL} from "../../constants.jsx";
import {isAuthorized, refreshToken} from "../../utils/auth-utils.jsx";
import Error from "../../components/Error/Error.jsx";
import Section from "../../components/Section/Section.jsx";
import HomeButton from "../../components/HomeButton/HomeButton.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import './MyCourses.css';
import {Link} from "react-router-dom";
import MyCourseCard from "../../components/MyCourseCard/MyCourseCard.jsx";
import LoadingAnimation from "../../components/LoadingAnimation.jsx";

const MyCourses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [coursesData, setCoursesData] = useState([]);
  let userData = JSON.parse(localStorage.getItem('loginData'));

  const handleSearchTextChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
  };

  const handleSearchFilterChange = (e) => {
    const filter = e.target.value;
    setSearchFilter(filter);
  }

  const getCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/courses/enrolled/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.access}`
        }
      });

      if (response.status === 401) {
        const refreshResult = await refreshToken();
        if (refreshResult === 'success') {
          const retryResponse = await fetch(`${BASE_URL}/api/courses/enrolled/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userData.access}`
            }
          });
          if (!retryResponse.ok) {
            throw new Error(`Failed to fetch lesson data: ${retryResponse.status}`);
          }

          const retryData = await retryResponse.json();
          setCoursesData(retryData.enrolled_courses)
        } else {
          localStorage.removeItem('loginData');
          navigate('/login');
        }
      } else if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      } else {
        const data = await response.json();
        setCoursesData(data.enrolled_courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthorized()) {
      window.location.href = '/';
    }
    getCourses();
  }, []);

  return (
    <div>
      <div className="main pt-4">
        <Section title="Mening kurslarim" textSize='text-4xl'/>
        <div className="my-courses-toolbar">
          <input type="text" placeholder="Kurslarni qidirish..." className="course-searchbar"
                 onChange={handleSearchTextChange} value={searchText}/>
          <div className="relative inline-block">
            <select className="search-filter" onChange={handleSearchFilterChange} defaultValue={searchFilter}>
              <option value="">Hammasi</option>
              <option value="junior">Junior</option>
              <option value="middle">Middle</option>
              <option value="senior">Senior</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="courses-view">
          {isLoading && (
            <LoadingAnimation/>
          )}
          {coursesData.length > 0 && (
            <div className="courses-grid">
              {coursesData.map((course, i) => {
                return (
                  <div>
                  {
                    course.name.toLowerCase().includes(searchText.toLowerCase()) &&
                    course.complexity.toLowerCase().includes(searchFilter.toLowerCase()) && (
                      <MyCourseCard key={i} courseData={course}/>
                    )
                  }
                  </div>
                )
              })}
            </div>
          ) || (
            <div className="no-courses">
              <p>Boshlangan kurslar mavjud emas</p>
              <p>Birinchi kursingizni boshlash uchun quyidagi tugmani bosing</p>
              <Link to="/#courses" className="go-to-courses">Boshlash</Link>
            </div>
          )}
        </div>
      </div>
      <Footer/>
      <HomeButton/>
    </div>
  );
};

export default MyCourses;
