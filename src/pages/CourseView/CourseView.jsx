import React, {useEffect, useState} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {BASE_URL, MEDIA_BASE_URL} from '../../constants.jsx';
import {refreshToken, isAuthorized, isStaff} from '../../utils/auth-utils.jsx';
import Error from "../../components/Error/Error.jsx";
import './CourseView.css';
import HomeButton from "../../components/HomeButton/HomeButton.jsx";
import LoadingAnimation from "../../components/LoadingAnimation.jsx";
import LessonCard from "../../components/LessonCard/LessonCard.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import plus from "../../assets/plus.png";
import Modal from "react-modal";
import PopupMessage from "../../components/PopupMessage/PopupMessage.jsx";
import {isVip} from "../../utils/lesson-utils.jsx";

const CourseView = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [lessonsData, setLessonsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isDeleteAskOpen, setIsDeleteAskOpen] = useState(false)
  const [deleteLessonId, setDeleteLessonId] = useState(null);
  const [isVipAskOpen, setIsVipAskOpen] = useState(true);
  const [hasVip, setHasVip] = useState(true);

  let userData = JSON.parse(localStorage.getItem('loginData'));

  const closeDeleteAskModal = () => {
    setIsDeleteAskOpen(false);
  }

  const openDeleteAskModal = (courseId) => {
    setDeleteLessonId(courseId);
    setIsDeleteAskOpen(true);
  }

  const closeVipAskModal = () => {
    setIsVipAskOpen(false);
  };

  const openVipAskModal = () => {
    setIsVipAskOpen(true);
  };

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
          setHasVip(isVip(retryData.course));
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
        setHasVip(isVip(data.course));
      }
    } catch (err) {
      console.error('Error fetching course data:', err);
      setError(err.message || 'An error occurred while fetching course data');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLesson = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/lessons/delete/${deleteLessonId}/`, {
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
      setDeleteLessonId(null);
      await getCourseData();
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
    getCourseData();
  }, [id]);

  return (
    <div>
      {!hasVip && !isStaff() && (
        <Modal
          isOpen={isVipAskOpen}
          onRequestClose={closeVipAskModal}
          className="modal-window"
          overlayClassName="modal-overlay"
          contentLabel="Delete Course"
        >
          <div className="plan-title">
            To'xtovsiz o'qish uchun <a href="https://en.wikipedia.org/wiki/Sudo" className="sudo-plan" target="_blank"
                                          title="Sudo — bu tizimda maxsus ruxsat bilan bajariladigan
buyruqlarni ishlatish imkonini beruvchi atama.
Dasturchilar orasida yuqori darajadagi kirish
belgisi sifatida ishlatiladi.">sudo</a> obunasini
            sotib oling!
          </div>
          <div className="plan-cards-container">
            <div className="plan-card">
              <div className="plan-card-name">Tekin</div>
              <div className="plan-card-subtitle">Tanishib chiqmoqchi bo'lganlar uchun</div>
              <div className="plan-card-price">0 UZS</div>
              <ul className="plan-card-features">
                <li className="plan-card-feature">Videodarslar</li>
                <li className="plan-card-feature">Dars materiallaridan to'liq foydalanish</li>
                <li className="plan-card-feature">Test savollari</li>
                <li className="plan-card-feature">Savollar uchun cheklangan urinishlar</li>
                <li className="plan-card-feature locked-feature group">
                  Dasturlash savollari
                  <div className="tooltip">
                    Faqat SUDO obunachilar uchun
                    <div className="tooltip-arrow"/>
                  </div>
                </li>
                <li className="plan-card-feature locked-feature group">
                  Kurs yakunida sertifikar olish
                  <div className="tooltip">
                    Faqat SUDO obunachilar uchun
                    <div className="tooltip-arrow"/>
                  </div>
                </li>
              </ul>
              <button className="plan-card-button" onClick={closeVipAskModal}>Davom etish</button>
            </div>
            <div className="plan-card">
              <div className="plan-card-name">SUDO</div>
              <div className="plan-card-subtitle">To'liq foydalanish va serrtifikat olish uchun</div>
              <div className="plan-card-price">50,000 UZS</div>
              <ul className="plan-card-features">
                <li className="plan-card-feature">Videodarslar</li>
                <li className="plan-card-feature">Dars materiallaridan to'liq foydalanish</li>
                <li className="plan-card-feature">Test savollari</li>
                <li className="plan-card-feature">Dasturlash savollari</li>
                <li className="plan-card-feature">Savollar uchun cheksiz urinishlar</li>
                <li className="plan-card-feature">Kurs yakunida sertifikar olish</li>
              </ul>
              <a href="https://t.me/otabek_boboqulov2" target="_blank" className="plan-card-button">Xarid qilish</a>
            </div>
          </div>
        </Modal>
      )}
      <div className="course-view">
        {isLoading ? (
          <LoadingAnimation/>
        ) : error ? (
          <Error error_message={error}/>
        ) : (
          <div>
            <div className="course-banner">
              <img
                src={`${MEDIA_BASE_URL}${courseData.banner_image}`}
                alt="Course banner"
                className="banner-image"
              />
            </div>
            <div className="course-view-description">
              {courseData.description}
            </div>
          </div>
        )}
        {!hasVip && (
          <div className="get-vip">
            <button className="get-vip-btn" onClick={openVipAskModal}>
              SUDO obunasini sotib oling!
            </button>
          </div>
        )}
        <div className="lessonsGrid">
          {lessonsData.map((lesson) => (
            <div className="relative">
              <Link to={`/courses/${id}/lessons/${lesson.id}`} key={`${id}${lesson.id}`}>
                <LessonCard lessonData={lesson} key={lesson.id}
                            userLesson={lesson.user_lessons.find((item) => item.user === userData.id)}/>
              </Link>
              {isAuthorized() && isStaff() && (
                <button className="delete-course-btn" onClick={() => openDeleteAskModal(lesson.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                       stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                  </svg>
                </button>
              )}
            </div>
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
        {message && (
          <PopupMessage message={message}/>
        )}
        {userData && userData.is_staff && (
          <div className="edit-course-btn-container">
            <Link to={`/courses/${id}/edit`} className="edit-course-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                   stroke="currentColor" className="size-6 inline-block">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
              </svg>
            </Link>
          </div>
        )}
      </div>
      <Modal
        isOpen={isDeleteAskOpen}
        onRequestClose={closeDeleteAskModal}
        className="modal-window"
        overlayClassName="modal-overlay"
        contentLabel="Delete Lesson"
      >
        <h2 className="modal-title">Darsni o'chirmoqchimisiz?</h2>
        <div className="delete-btn-group">
          <button className="delete-course" onClick={deleteLesson}>Ha</button>
          <button className="cancel-delete" onClick={closeDeleteAskModal}>Bekor qilish</button>
        </div>
      </Modal>
      <Footer/>
      <HomeButton/>
    </div>
  );
};

export default CourseView;