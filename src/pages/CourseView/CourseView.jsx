import React, {useEffect, useState} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {BASE_URL, MEDIA_BASE_URL} from '../../constants.jsx';
import {refreshToken, isAuthorized} from '../../utils/auth-utils.jsx';
import Error from "../../components/Error/Error.jsx";
import './CourseView.css';
import HomeButton from "../../components/HomeButton/HomeButton.jsx";
import LoadingAnimation from "../../components/LoadingAnimation.jsx";
import LessonCard from "../../components/LessonCard/LessonCard.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import plus from "../../assets/plus.png";

const CourseView = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [lessonsData, setLessonsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  let userData = JSON.parse(localStorage.getItem('loginData'));

  const getCourseData = async () => {
    if (!isAuthorized()) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      userData = JSON.parse(localStorage.getItem('loginData'));
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
        console.log(data.lessons.length);
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
          <LoadingAnimation/>
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
        <div className="lessonsGrid">
          {lessonsData.map((lesson) => (
            <Link to={`/courses/${id}/lessons/${lesson.id}`} key={`${id}${lesson.id}`}>
              <LessonCard lessonData={lesson} key={lesson.id}
                          userLesson={lesson.user_lessons.find((item) => item.user === userData.id)}/>
            </Link>
          ))}
          {userData && userData.is_staff && (
            <Link to={`/courses/${id}/lessons/create`} className="create-lesson"
                  state={{
                    'serial_number': lessonsData.length + 1,
                    'assigned_score': lessonsData.map((item) => item.max_score).reduce((a, b) => a + b, 0)
                  }}>
              <img src={plus} alt="Add" className="plus-lesson-image"/>
            </Link>
          )}
        </div>
      </div>
      <HomeButton/>
      <Footer/>
    </div>
  );
};

export default CourseView;