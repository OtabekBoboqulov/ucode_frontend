import React, {useEffect} from 'react';
import banner from '../../assets/default_banner.jpg';
import './CourseCard.css';
import {truncate_text} from "../../utils/text-utils.jsx";
import {motion} from 'framer-motion';
import {useInView} from 'react-intersection-observer';
import {MEDIA_BASE_URL} from "../../constants.jsx";
import {Link} from "react-router-dom";

const CourseCard = ({course, btn_text}) => {
  const {ref, inView} = useInView({triggerOnce: true});
  return (
    <motion.div className="course-card"
                ref={ref}
                initial={{opacity: 0, y: 50}}
                animate={inView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 1}}>
      <div className="banner relative">
        <img src={`${MEDIA_BASE_URL}${course.banner_image}`} alt="Banner" className="banner_image"/>
        <div className="course-data">
          <div className="course-title">
            {course.name}
            <div className={`course-complexity ${course.complexity}`}>{course.complexity}</div>
          </div>
          <div className="course-description">
            {truncate_text(course.description, 70)}
          </div>
          <button className="start-course cursor-pointer"><Link to={`/courses/${course.id}`}>
            {btn_text}
          </Link></button>
        </div>
        <div className="bg-transparent absolute top-0 right-0 p-2 text-gray-500">
          {(course.time_since_creation.years && `${course.time_since_creation.years} yil oldin`) ||
            (course.time_since_creation.months && `${course.time_since_creation.months} oy oldin`) ||
            (course.time_since_creation.days && `${course.time_since_creation.days} kun oldin`) ||
            'Bugun'}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;