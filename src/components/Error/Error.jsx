import React from 'react';
import './Error.css';

const Error = ({error_message}) => {
  return (
    <div className="error-container">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="error-icon">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0m-9 3.75h.008v.008H12v-.008Z" />
      </svg>
      <div className="error-message">
        {error_message}
      </div>
    </div>
  );
};

export default Error;
