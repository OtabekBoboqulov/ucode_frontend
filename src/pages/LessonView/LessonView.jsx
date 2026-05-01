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
  const [hasVip, setHasVip] = useState(false);
  let userData = JSON.parse(localStorage.getItem('loginData'));

  const startLesson = async () => {
    await fetch(`${BASE_URL}/api/lessons/${Number(lessonId)}/start/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${userData?.access}`,
      },
    });
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
      const response = await fetch(`${BASE_URL}/api/lessons/${Number(lessonId)}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${userData?.access}`,
        },
      });

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
          const retryData = await retryResponse.json();
          setComponents(retryData.lesson.components || []);
          setLessonData(retryData.lesson || {});
          setHasVip(retryData.is_vip);
          const nextLessonResponse = await fetch(`${BASE_URL}/api/courses/${Number(id)}/next-lesson/${retryData.lesson.serial_number}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loginData'))?.access}`,
            },
          });
          const nextLessonData = await nextLessonResponse.json();
          setNextLesson(nextLessonData.id || 0);
        } else {
          localStorage.removeItem('loginData');
          navigate('/login');
        }
      } else {
        const data = await response.json();
        setLessonData(data.lesson || {});
        setComponents(data.lesson.components || []);
        setHasVip(data.is_vip);
        const nextLessonResponse = await fetch(`${BASE_URL}/api/courses/${Number(id)}/next-lesson/${data.lesson.serial_number}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userData?.access}`,
          },
        });
        const nextLessonData = await nextLessonResponse.json();
        setNextLesson(nextLessonData.id || 0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLessonData();
  }, [lessonId]);

  return (
    <div className="bg-background min-h-screen" id="outer-container">
      <LessonsSidebar courseId={id}/>
      <div className="lesson-view" id="page-wrap">
        <div className="max-w-5xl mx-auto">
          {lessonData.title && (
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                <span className="text-primary mr-4">{lessonData.serial_number}.</span>
                {lessonData.title}
              </h1>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
            </div>
          )}

          <div className="lesson-materials-container">
            <div className="terminal-header">
              <div className="terminal-controls">
                <div className="terminal-dot dot-red"></div>
                <div className="terminal-dot dot-yellow"></div>
                <div className="terminal-dot dot-green"></div>
              </div>
              <div className="terminal-title">lesson_content.md</div>
              <div className="w-12"></div>
            </div>

            <div className="lesson-content-area">
              {components && components.map((component) => {
                if (component.type === 'video') {
                  return <Video key={component.id} videoUrl={component.data.video_url}/>;
                } else if (component.type === 'text') {
                  return <Text key={component.id} content={component.data.content}/>;
                } else if (component.type === 'mcq') {
                  return <MultipleChoiceQuestion question_data={component.data} key={component.id} id={component.id} isVip={hasVip}/>
                } else if (component.type === 'moq') {
                  return <MultipleOptionsQuestion question_data={component.data} key={component.id} id={component.id} isVip={hasVip}/>
                } else if (component.type === 'coding') {
                  return <CodingQuestion question_data={component.data} key={component.id} id={component.id} isVip={hasVip} courseId={id}/>
                }
                return null;
              })}

              {lessonData.lesson_materials && (
                <div className="mt-12 pt-12 border-t border-white/5">
                  <a href={`${MEDIA_BASE_URL}${lessonData.lesson_materials}`} target='_blank' className="lesson-materials">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Dars materiallarini yuklab olish
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="lesson-control-btns">
            <div className="relative group">
              <button className='restart-lesson-btn' onClick={() => window.location.reload()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
              <div className="tooltip">Qaytadan boshlash</div>
            </div>

            {nextLesson > 0 && (
              <div className="relative group">
                <button className='next-lesson-btn' onClick={() => navigate(`/courses/${id}/lessons/${nextLesson}`)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <div className="tooltip">Keyingi dars</div>
              </div>
            )}
          </div>

          {nextLesson === 0 && (
            <div className="last-lesson-message mt-12">
              Tabriklaymiz! Bu kursdagi so'nggi dars edi. Sertifikatingizni&nbsp;
              <Link to="/courses/enrolled" className="last-lesson-message-link">Mening kurslarim</Link>
              &nbsp;bo'limidan yuklab olishingiz mumkin.
            </div>
          )}
        </div>
      </div>
      <HomeButton/>
      {isLoading && <LoadingAnimation />}
    </div>
  );
};

export default LessonView;
