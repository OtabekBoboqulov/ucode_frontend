import React, { useState } from 'react';
import thanosSnap from '../../assets/thanos-snap.mp4';
import './NotFound.css';
import HomeButton from "../../components/HomeButton/HomeButton.jsx";

const NotFound = () => {
  const [showGif, setShowGif] = useState(true);

  const handleGifEnd = () => {
    setShowGif(false);
  };

  // Create lots of dust squares across the entire page
  const dustSquares = [];
  const numSquares = 500; // Lots of squares for dust effect
  const screenParts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  screenParts.forEach((part) => {
    for (let i = 0; i < numSquares; i++) {
      const x = Math.random() * part; // Random position across full width
      const y = Math.random() * 100; // Random position across full height

      // Create dust concentration effect - more squares on the right side
      const dustIntensity = x > 60 ? Math.random() : Math.random() * 0.7;

      if (dustIntensity > 0.3) { // Only show some squares for scattered effect
        dustSquares.push({
          id: `dust-${i}`,
          left: `${x}%`,
          top: `${y}%`,
          size: Math.random() * (150 * (100 - part) / 100) + 4, // Random size between 4-16px
          rotation: Math.random() * 360, // Random rotation
        });
      }
    }
  });

  return (
    <div className="not-found-container">
      {showGif ? (
        <video
          src={thanosSnap}
          className="thanos-video"
          autoPlay
          muted
          onLoadedData={() => {
            setTimeout(handleGifEnd, 2700);
          }}
          onEnded={handleGifEnd}
        />
      ) : (
        <div>
          <div className="not-found-text-container">
            <h1 className="not-found-text">404<br/>Page Not Found</h1>
          </div>
          {dustSquares.map((square) => (
            <div
              key={square.id}
              className="dust-square"
              style={{
                left: square.left,
                top: square.top,
                width: `${square.size}px`,
                height: `${square.size}px`,
                transform: `rotate(${square.rotation}deg)`,
              }}
            />
          ))}
        </div>
      )}
      <HomeButton/>
    </div>
  );
};

export default NotFound;