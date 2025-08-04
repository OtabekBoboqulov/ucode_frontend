import React, {useEffect, useState} from 'react';
import {BASE_URL, MEDIA_BASE_URL} from "../../constants.jsx";
import {motion} from 'framer-motion';
import './MyCourseCard.css'
import ProgressBar from "../ProgressBar/ProgressBar.jsx";
import {Link} from "react-router-dom";
import {useInView} from "react-intersection-observer";
import Error from "../Error/Error.jsx";
import ButtonLoadingAnimation from "../ButtonLoadingAnimation/ButtonLoadingAnimation.jsx";
import Modal from "react-modal";

const MyCourseCard = ({courseData}) => {
  const userData = JSON.parse(localStorage.getItem("loginData"));
  const {ref, inView} = useInView({triggerOnce: true});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVipAskOpen, setIsVipAskOpen] = useState(false);
  const hasVip = courseData.user_courses.find((user_course) => (user_course.user === userData.id)).is_vip;

  const openVipAskModal = () => {
    setIsVipAskOpen(true);
  };

  const closeVipAskModal = () => {
    setIsVipAskOpen(false);
  };

  const getCertificate = async () => {
    if (!hasVip) {
      openVipAskModal();
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/courses/certificate/${courseData.id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userData.access}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate certificate');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${courseData.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div ref={ref}
                initial={{opacity: 0, y: 50}}
                animate={inView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 1}}>
      <div className="my-course-card">
        <div className="my-course-banner">
          <img src={`${MEDIA_BASE_URL}${courseData.banner_image}`} alt="course banner"
               className="my-course-banner-img"/>
        </div>
        <div className="my-course-data">
          <div className="my-course-name">
            {courseData.name}
          </div>
          <div className="my-course-complexity">
            {courseData.complexity}
          </div>
          <div className="my-course-description">
            {courseData.description}
          </div>
          <div className="my-course-created-at">
            O'quvchilar: {courseData.user_courses.length}&nbsp;&middot;&nbsp;
            {(courseData.time_since_creation.years && `${courseData.time_since_creation.years} yil oldin`) ||
              (courseData.time_since_creation.months && `${courseData.time_since_creation.months} oy oldin`) ||
              (courseData.time_since_creation.days && `${courseData.time_since_creation.days} kun oldin`) ||
              'Bugun'}
          </div>
          <ProgressBar
            progressValue={(courseData.user_courses.find(item => item.user === userData.id).progress) / courseData.total_score * 100}/>
          {error && (
            <Error error_message={error}/>
          )}
          <div className="continue-btn-container">
            {courseData.user_courses.find(item => item.user === userData.id).is_completed ? (
              <button className="continue-btn" onClick={getCertificate}>
                {isLoading ? (
                  <ButtonLoadingAnimation/>
                ) : ('Sertifikatni yuklab olish')}
              </button>
            ) : (
              <Link to={`/courses/${courseData.id}`} className="continue-btn">
                Davom etish
              </Link>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isVipAskOpen}
        onRequestClose={closeVipAskModal}
        className="modal-window"
        overlayClassName="modal-overlay"
        contentLabel="Delete Course"
      >
        <h2 className="modal-title">Sertifikatni olish uchun SUDO obunasi talab etiladi</h2>
        <div className="delete-btn-group">
          <Link to={`/courses/${courseData.id}`} className="subscribe-to-course">Obuna bo'lish</Link>
          <button className="cancel-delete" onClick={closeVipAskModal}>Bekor qilish</button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default MyCourseCard;
