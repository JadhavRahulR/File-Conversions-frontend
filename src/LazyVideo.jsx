import React, { useEffect, useRef, useState } from "react";
import "./LazyVideo.css";

const LazyVideo = ({
  src,
  youtubeId,
  poster,
  title,
  description,
  controls = true
}) => {
  const videoRef = useRef(null);
  const [play, setPlay] = useState(false);

  // Lazy load only for MP4
  useEffect(() => {
    if (youtubeId) return; // skip for YouTube

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
  }, [youtubeId]);

  return (
    <div className="intro-video-container">

      {/* 🔥 YouTube Mode */}
      {youtubeId ? (
        <div
          onClick={() => setPlay(true)}
          style={{ position: "relative", cursor: "pointer" }}
        >
          {!play ? (
            <>
              <img
                src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                alt="Video Thumbnail"
                style={{ width: "100%", borderRadius: "10px",height:"475px" }}
              />

              <div
  style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70px",
    height: "70px",
    backgroundColor: "rgb(48, 97, 95)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s",
    color:"white"
  }}
>
                ▶
              </div>
            </>
          ) : (
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title="YouTube video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </div>
      ) : (
        /* 🎬 MP4 Mode */
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
        </video>
      )}

      {/* Text */}
      <h3 className="intro-video-title">{title}</h3>
      <p className="intro-video-description">{description}</p>

    </div>
  );
};

export default LazyVideo;