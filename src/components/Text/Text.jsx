import React from 'react';
import DOMPurify from 'dompurify';

const Text = ({content}) => {
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: ['a'],
    ADD_ATTR: ['href', 'target', 'rel'],
  });

  return (
    <div className="md:text-lg text-sm text-justify dark:text-white"
         dangerouslySetInnerHTML={{__html: sanitizedContent}}/>
  );
};

export default Text;
