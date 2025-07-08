import React from 'react';
import './Video.css';

const Video = ({videoUrl}) => {
  return (
    <div className="my-5">
      <div className="video-container">
        <iframe src={`https://www.youtube.com/embed/${videoUrl.split('youtu.be/')[1]}?vq=hd1080`}
                title="YouTube video player" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen className="lesson-video"></iframe>
      </div>
    </div>
  );
};

export default Video;
