import React from 'react';
import './Section.css';

const Section = ({title, textSize}) => {
  return (
    <div className={`section ${textSize ? textSize : 'text-xl'}`}>
      <span className="text-blue-600 dark:text-amber-500">&lt;</span>
      {title}
      <span className="text-blue-600 dark:text-amber-500">&gt;</span>
    </div>
  );
};

export default Section;