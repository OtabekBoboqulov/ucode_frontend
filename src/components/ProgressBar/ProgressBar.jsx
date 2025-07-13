import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({progressValue}) => {
  return (
    <div className='relative'>
      <div className="progress-bar">
        <div className="progress-bar-inner" style={{width: `${progressValue}%`}}></div>
        <div className="my-progress-value">
          {progressValue}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
