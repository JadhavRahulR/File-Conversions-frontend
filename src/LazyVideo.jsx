// components/LazyVideo.jsx
import React, { useEffect, useRef } from "react";
import "./LazyVideo.css"

const LazyVideo = ({ src, poster, title , description,controls = true }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.load();
            observer.unobserve(video);
          }
        });
      });
      observer.observe(video);
    } else {
      video.load();
    }
  }, []);

  return (
    <div className="intro-video-container">
      <video
        ref={videoRef}
        className="intro-video"
        playsInline
        muted
        preload="none"
        poster={poster}
        controls={controls}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h3 className="intro-video-title">{title}</h3>
  <p className="intro-video-description">
    {description}
  </p>
    </div>
    
  );
};

export default LazyVideo;
