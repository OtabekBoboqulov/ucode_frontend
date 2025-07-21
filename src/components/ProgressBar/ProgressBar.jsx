import React, { useEffect, useState } from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progressValue }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(Math.max(0, Math.min(100, progressValue)));
    }, 100);

    return () => clearTimeout(timer);
  }, [progressValue]);

  const getBackgroundColor = (value) => {
    if (value < 33) return 'progress-red';
    if (value < 66) return 'progress-yellow';
    if (value < 100) return 'progress-green';
    return 'progress-gold';
  };

  return (
    <div className="relative">
      <div className="progress-bar">
        <div
          className={`progress-bar-inner ${getBackgroundColor(width)}`}
          style={{ width: `${width}%` }}
        ></div>
        <div className="my-progress-value">{progressValue.toFixed(2)}%</div>
      </div>
    </div>
  );
};

export default ProgressBar;