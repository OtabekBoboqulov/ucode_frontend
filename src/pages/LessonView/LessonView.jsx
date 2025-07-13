import React, {useEffect, useState} from 'react';
import './LessonView.css';
import {Link, useNavigate, useParams} from "react-router-dom";
import HomeButton from "../../components/HomeButton/HomeButton.jsx";
import {isAuthorized, refreshToken} from "../../utils/auth-utils.jsx";
import {BASE_URL, MEDIA_BASE_URL} from "../../constants.jsx";
import Error from "../../components/Error/Error.jsx";
import Video from "../../components/Video/Video.jsx";
import LoadingAnimation from "../../components/LoadingAnimation.jsx";
import Section from "../../components/Section/Section.jsx";
import Text from "../../components/Text/Text.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import MultipleChoiceQuestion from "../../components/MultipleChoiceQuestion/MultipleChoiceQuestion.jsx";
import MultipleOptionsQuestion from "../../components/MultipleOptionsQuestion/MultipleOptionsQuestion.jsx";
import CodingQuestion from "../../components/CodingQuestion/CodingQuestion.jsx";
import LessonsSidebar from "../../components/LessonsSidebar/LessonsSidebar.jsx";

const LessonView = () => {
  const {id, lessonId} = useParams();
  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState({});
  const [components, setComponents] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  let userData = JSON.parse(localStorage.getItem('loginData'));

  const startLesson = async (lessonId) => {
    const response = await fetch(`${BASE_URL}/api/lessons/${Number(lessonId)}/start/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${userData?.access}`,
      },
    });
    const data = await response.json();
  }

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
          setComponents(retryData.components || []);
          setLessonData(retryData || {});
          if (!retryData.user_lessons.find((item) => item.user === userData.id)) {
            startLesson(retryData.id);
          }
          const nextLessonResponse = await fetch(`${BASE_URL}/api/courses/${Number(id)}/next-lesson/${retryData.serial_number}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loginData'))?.access}`,
            },
          });
          if (!nextLessonResponse.ok) {
            throw new Error(`Failed to fetch next lesson data: ${nextLessonResponse.status}`);
          }
          const nextLessonData = await nextLessonResponse.json();
          setNextLesson(nextLessonData.id || {});
        } else {
          localStorage.removeItem('loginData');
          navigate('/login');
        }
      } else if (!response.ok) {
        throw new Error(`Failed to fetch course data: ${response.status}`);
      } else {
        const data = await response.json();
        setLessonData(data || {});
        setComponents(data.components || []);
        if (!data.user_lessons.find((item) => item.user === userData.id)) {
          startLesson(data.id);
        }
        const nextLessonResponse = await fetch(`${BASE_URL}/api/courses/${Number(id)}/next-lesson/${data.serial_number}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loginData'))?.access}`,
          },
        });
        if (!nextLessonResponse.ok) {
          throw new Error(`Failed to fetch next lesson data: ${nextLessonResponse.status}`);
        }
        const nextLessonData = await nextLessonResponse.json();
        setNextLesson(nextLessonData.id || {});
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
  }, [lessonId]);

  return (
    <div className="bg-[#BFCDE0] dark:bg-[#223C5B]" id="outer-container">
      {error ? (
        <Error error_message={error}/>
      ) : ''}
      {isLoading ? (
        <LoadingAnimation/>
      ) : ''}
      <LessonsSidebar courseId={id}/>
      <div className="lesson-view" id="page-wrap">
        {lessonData.title && (
          <div className="lesson-caption">
            <Section title={`${lessonData.serial_number}. ${lessonData.title}`} textSize='md:text-4xl'
                     textSizeSm='text-lg'/>
          </div>
        )}
        {components && components.map((component) => {
          if (component.type === 'video') {
            return <Video key={component.id} videoUrl={component.data.video_url}/>;
          } else if (component.type === 'text') {
            return <Text key={component.id} content={component.data.content}/>;
          } else if (component.type === 'mcq') {
            return <MultipleChoiceQuestion question_data={component.data} key={component.id} id={component.id}/>
          } else if (component.type === 'moq') {
            return <MultipleOptionsQuestion question_data={component.data} key={component.id} id={component.id}/>
          } else if (component.type === 'coding') {
            return <CodingQuestion question_data={component.data} key={component.id} id={component.id}/>
          }
          return null;
        })}
        {lessonData.lesson_materials && (
          <div className="lesson-materials">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                 className="bi bi-file-earmark-zip inline-block" viewBox="0 0 16 16">
              <path
                d="M5 7.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v.938l.4 1.599a1 1 0 0 1-.416 1.074l-.93.62a1 1 0 0 1-1.11 0l-.929-.62a1 1 0 0 1-.415-1.074L5 8.438zm2 0H6v.938a1 1 0 0 1-.03.243l-.4 1.598.93.62.929-.62-.4-1.598A1 1 0 0 1 7 8.438z"/>
              <path
                d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1h-2v1h-1v1h1v1h-1v1h1v1H6V5H5V4h1V3H5V2h1V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
            </svg>
            &nbsp;
            <a href={`${MEDIA_BASE_URL}${lessonData.lesson_materials}`} target='_blank'>
              Dars materiallari
            </a>
          </div>
        )}
        {nextLesson && nextLesson > 0 && (
          <div className="next-lesson">
            <Link className='next-lesson-btn' to={`/courses/${id}/lessons/${nextLesson}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                   className="bi bi-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd"
                      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
              </svg>
            </Link>
          </div>
        )}
      </div>
      <HomeButton/>
    </div>
  );
};

export default LessonView;
