import React from 'react';
import './Section.css';

const Section = ({title, textSize, textSizeSm}) => {
  return (
    <div className={`section ${textSize ? textSize : 'text-xl'} ${textSizeSm ? textSizeSm : ''}`}>
      <span className="text-blue-600 dark:text-amber-500">&lt;</span>
      {title}
      <span className="text-blue-600 dark:text-amber-500">&gt;</span>
    </div>
  );
};

export default Section;