import React, {useEffect, useState} from 'react';
import './LessonView.css';
import {useNavigate, useParams} from "react-router-dom";
import HomeButton from "../../components/HomeButton/HomeButton.jsx";
import {isAuthorized, refreshToken} from "../../utils/auth-utils.jsx";
import {BASE_URL} from "../../constants.jsx";
import Error from "../../components/Error/Error.jsx";

const LessonView = () => {
  const {id, lessonId} = useParams();
  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  let userData = JSON.parse(localStorage.getItem('loginData'));

  const getLessonData = async () => {
    if (!isAuthorized()) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      userData = JSON.parse(localStorage.getItem('loginData'));
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${BASE_URL}/api/lessons/${Number(lessonId)}/`, {
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
          const retryResponse = await fetch(`${BASE_URL}/api/lessons/${Number(lessonId)}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loginData'))?.access}`,
            },
          });

          if (!retryResponse.ok) {
            throw new Error(`Failed to fetch lesson data: ${retryResponse.status}`);
          }

          const retryData = await retryResponse.json();
          setLessonData(retryData.lesson || {});
        } else {
          localStorage.removeItem('loginData');
          navigate('/login');
        }
      } else if (!response.ok) {
        throw new Error(`Failed to fetch course data: ${response.status}`);
      } else {
        const data = await response.json();
        console.log(data);
        setLessonData(data.lessons || {});
      }
    } catch (err) {
      console.error('Error fetching lesson data:', err);
      setError(err.message || 'An error occurred while fetching lesson data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLessonData();
  }, [id])

  return (
    <div>
      {id} - {lessonId}
      <HomeButton/>
    </div>
  );
};

export default LessonView;
