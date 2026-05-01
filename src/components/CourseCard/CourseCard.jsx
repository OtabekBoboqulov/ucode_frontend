import React from 'react';
import {Link} from 'react-router-dom';
import {MEDIA_BASE_URL} from '../../constants.jsx';
import './CourseCard.css';

const CourseCard = ({course, btn_text}) => {
  return (
    <div className="course-card">
      <div className="relative overflow-hidden">
        <img
          src={`${MEDIA_BASE_URL}${course.banner_image}`}
          alt={course.name}
          className="banner_image"
        />
        <div className="absolute top-4 left-4">
          <span className={`course-complexity ${course.complexity.toLowerCase()}`}>
            {course.complexity}
          </span>
        </div>
      </div>
      <div className="course-content">
        <h3 className="course-title">{course.name}</h3>
        <p className="course-description">{course.description}</p>
        <Link to={`/courses/${course.id}`} className="block">
          <button className="start-course">
            {btn_text}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
