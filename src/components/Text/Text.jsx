import React from 'react';

const Text = ({content}) => {
  return (
    <div className="md:text-lg text-sm text-justify dark:text-white">
      {content}
    </div>
  );
};

export default Text;
