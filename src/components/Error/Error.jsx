import React from 'react';
import './Error.css';

const Error = ({error_message}) => {
  return (
    <div className="error">
      {error_message}
    </div>
  );
};

export default Error;
