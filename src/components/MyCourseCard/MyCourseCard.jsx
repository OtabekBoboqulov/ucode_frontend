import React from 'react';
import {MEDIA_BASE_URL} from "../../constants.jsx";
import {motion} from 'framer-motion';
import './MyCourseCard.css'
import ProgressBar from "../ProgressBar/ProgressBar.jsx";
import {Link} from "react-router-dom";
import {useInView} from "react-intersection-observer";

const MyCourseCard = ({courseData}) => {
  const userData = JSON.parse(localStorage.getItem("loginData"));
  const {ref, inView} = useInView({triggerOnce: true});
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
          <ProgressBar progressValue={courseData.user_courses.find(item => item.user === userData.id).progress}/>
          <div className="continue-btn-container">
            <Link to={`/courses/${courseData.id}`} className="continue-btn">
              Davom etish
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyCourseCard;
