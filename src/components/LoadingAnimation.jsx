import React from 'react';

const LoadingAnimation = () => {
  return (
    <div>
      <div className="flex flex-row gap-2 h-60 justify-center items-center">
        <div className="w-4 h-4 rounded-full bg-blue-500 dark:bg-amber-500 animate-bounce"></div>
        <div
          className="w-4 h-4 rounded-full bg-blue-500 dark:bg-amber-500 animate-bounce [animation-delay:-.3s]"></div>
        <div
          className="w-4 h-4 rounded-full bg-blue-500 dark:bg-amber-500 animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
