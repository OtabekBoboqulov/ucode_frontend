import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL, MEDIA_BASE_URL } from '../../constants.jsx';
import { refreshToken, isAuthorized } from '../../utils/auth-utils.jsx';
import Header from '../../components/Header/Header.jsx';
import Error from "../../components/Error/Error.jsx";
import './CourseView.css';
import HomeButton from "../../components/HomeButton/HomeButton.jsx";

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [lessonsData, setLessonsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCourseData = async () => {
    if (!isAuthorized()) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem('loginData'));
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${BASE_URL}/api/courses/${Number(id)}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData?.access}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        const refreshResult = await refreshToken();
        if (refreshResult === 'success') {
          // Retry fetching course data
          const retryResponse = await fetch(`${BASE_URL}/api/courses/${Number(id)}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loginData'))?.access}`,
            },
          });

          if (!retryResponse.ok) {
            throw new Error(`Failed to fetch course data: ${retryResponse.status}`);
          }

          const retryData = await retryResponse.json();
          setCourseData(retryData.course || {});
          setLessonsData(retryData.lessons || []);
        } else {
          localStorage.removeItem('loginData');
          navigate('/login');
        }
      } else if (!response.ok) {
        throw new Error(`Failed to fetch course data: ${response.status}`);
      } else {
        const data = await response.json();
        setCourseData(data.course || {});
        setLessonsData(data.lessons || []);
      }
    } catch (err) {
      console.error('Error fetching course data:', err);
      setError(err.message || 'An error occurred while fetching course data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCourseData();
  }, [id]);

  return (
    <div>
      <div className="course-view">
        {isLoading ? (
          <p>Loading course...</p>
        ) : error ? (
          <Error error_message={error}/>
        ) : (
          <div className="course-banner">
              <img
                src={`${MEDIA_BASE_URL}${courseData.banner_image}`}
                alt="Course banner"
                className="banner-image"
              />
          </div>
        )}
      </div>
      <HomeButton/>
    </div>
  );
};

export default CourseView;