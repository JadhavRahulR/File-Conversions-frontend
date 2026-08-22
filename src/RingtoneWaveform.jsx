import { useEffect, useRef, useState } from "react";
import "./ringtoneWaveform.css";

export default function RingtoneWaveform({
  audioFile,
  audioRef,
  duration,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
}) {
  const waveformRef = useRef(null);

  const [bars, setBars] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  // const [isPlaying, setIsPlaying] = useState(false);


  const togglePlay = async () => {
  const audio = audioRef?.current;

  if (!audio) return;

  try {

    // Already playing → pause
    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    const start = Number(startTime) || 0;
    const end = Number(endTime) || duration;

    // Agar audio selection ke bahar hai
    // to Start se play karo
    if (
      audio.currentTime < start ||
      audio.currentTime >= end
    ) {
      audio.currentTime = start;
    }

    await audio.play();

    setIsPlaying(true);

  } catch (error) {
    console.error("Audio play error:", error);
  }
};


useEffect(() => {

  const audio = audioRef?.current;

  if (!audio) return;

  const handleTimeUpdate = () => {

    const start = Number(startTime) || 0;
    const end = Number(endTime) || duration;

    if (audio.currentTime >= end) {

      audio.pause();

      audio.currentTime = start;

      setIsPlaying(false);
    }
  };


  const handleWaveformClick = async (e) => {
  if (!waveformRef.current) return;

  const audio = audioRef?.current;

  if (!audio || !duration) return;

  const rect =
    waveformRef.current.getBoundingClientRect();

  let percentage =
    (e.clientX - rect.left) / rect.width;

  percentage = Math.max(
    0,
    Math.min(1, percentage)
  );

  const clickedTime =
    percentage * duration;

  // Red playhead ko immediately move karo
  setCurrentTime(clickedTime);

  // Audio ko clicked position par le jao
  audio.currentTime = clickedTime;

  // Click karte hi play
  try {
    await audio.play();
    setIsPlaying(true);
  } catch (error) {
    console.error("Audio play error:", error);
  }
};

  const handleEnded = () => {
    setIsPlaying(false);
  };

  audio.addEventListener(
    "timeupdate",
    handleTimeUpdate
  );

  audio.addEventListener(
    "ended",
    handleEnded
  );

  return () => {

    audio.removeEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.removeEventListener(
      "ended",
      handleEnded
    );

  };

}, [
  audioRef,
  startTime,
  endTime,
  duration
]);

  // --------------------------------------------------
  // Generate waveform bars
  // --------------------------------------------------

  useEffect(() => {
    if (!audioFile) {
      setBars([]);
      return;
    }

    let cancelled = false;

    const generateWaveform = async () => {
      try {
        const arrayBuffer = await audioFile.arrayBuffer();

        const audioContext =
          new (window.AudioContext ||
            window.webkitAudioContext)();

        const audioBuffer =
          await audioContext.decodeAudioData(
            arrayBuffer
          );

        const channelData =
          audioBuffer.getChannelData(0);

        const barCount = 180;

        const samplesPerBar =
          Math.floor(
            channelData.length / barCount
          );

        const generatedBars = [];

        for (let i = 0; i < barCount; i++) {
          const start =
            i * samplesPerBar;

          const end =
            Math.min(
              start + samplesPerBar,
              channelData.length
            );

          let sum = 0;

          for (let j = start; j < end; j++) {
            sum += Math.abs(channelData[j]);
          }

          const average =
            sum / Math.max(1, end - start);

          const height = Math.max(
            8,
            Math.min(
              100,
              average * 180
            )
          );

          generatedBars.push(height);
        }

        if (!cancelled) {
          setBars(generatedBars);
        }

        audioContext.close();

      } catch (error) {
        console.error(
          "Waveform generation error:",
          error
        );
      }
    };

    generateWaveform();

    return () => {
      cancelled = true;
    };
  }, [audioFile]);


  // --------------------------------------------------
  // Convert X position to time
  // --------------------------------------------------

  const positionToTime = (clientX) => {
    if (!waveformRef.current || !duration) {
      return 0;
    }

    const rect =
      waveformRef.current.getBoundingClientRect();

    let percentage =
      (clientX - rect.left) / rect.width;

    percentage = Math.max(
      0,
      Math.min(1, percentage)
    );

    return percentage * duration;
  };


  // --------------------------------------------------
  // Mouse move
  // --------------------------------------------------

  useEffect(() => {

  const handleMove = (e) => {

    if (!dragging) return;

    const time = positionToTime(e.clientX);

    // --------------------------------
    // START HANDLE
    // --------------------------------

    if (dragging === "start") {

      const newStart = Math.min(
        time,
        Number(endTime) - 0.1
      );

      setStartTime(
        Math.max(
          0,
          Number(newStart.toFixed(1))
        )
      );
    }


    // --------------------------------
    // END HANDLE
    // --------------------------------

    if (dragging === "end") {

      const newEnd = Math.max(
        time,
        Number(startTime) + 0.1
      );

      setEndTime(
        Math.min(
          duration,
          Number(newEnd.toFixed(1))
        )
      );
    }


    // --------------------------------
    // WHOLE SELECTION DRAG
    // --------------------------------

    if (dragging === "selection") {

      const selectionLength =
        Number(endTime) - Number(startTime);

      // Selection ke center ko mouse
      // position par rakhenge
      let newStart =
        time - selectionLength / 2;

      let newEnd =
        newStart + selectionLength;


      // --------------------------------
      // Left boundary
      // --------------------------------

      if (newStart < 0) {

        newStart = 0;
        newEnd = selectionLength;

      }


      // --------------------------------
      // Right boundary
      // --------------------------------

      if (newEnd > duration) {

        newEnd = duration;

        newStart =
          duration - selectionLength;

      }


      // --------------------------------
      // Final safety
      // --------------------------------

      newStart = Math.max(
        0,
        newStart
      );

      newEnd = Math.min(
        duration,
        newEnd
      );


      setStartTime(
        Number(newStart.toFixed(1))
      );

      setEndTime(
        Number(newEnd.toFixed(1))
      );
    }

  };


  const handleUp = () => {
    setDragging(null);
  };


  window.addEventListener(
    "mousemove",
    handleMove
  );

  window.addEventListener(
    "mouseup",
    handleUp
  );


  return () => {

    window.removeEventListener(
      "mousemove",
      handleMove
    );

    window.removeEventListener(
      "mouseup",
      handleUp
    );

  };

}, [
  dragging,
  duration,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
]);

  useEffect(() => {
  const audio = audioRef?.current;

  if (!audio) return;

  const updatePlayhead = () => {
    setCurrentTime(audio.currentTime);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(audio.currentTime);
  };

  audio.addEventListener(
    "timeupdate",
    updatePlayhead
  );

  audio.addEventListener(
    "play",
    handlePlay
  );

  audio.addEventListener(
    "pause",
    handlePause
  );

  audio.addEventListener(
    "ended",
    handleEnded
  );

  return () => {
    audio.removeEventListener(
      "timeupdate",
      updatePlayhead
    );

    audio.removeEventListener(
      "play",
      handlePlay
    );

    audio.removeEventListener(
      "pause",
      handlePause
    );

    audio.removeEventListener(
      "ended",
      handleEnded
    );
  };

}, [audioRef]);

  // --------------------------------------------------
  // Touch move
  // --------------------------------------------------

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!dragging) return;

      const touch =
        e.touches[0];

      if (!touch) return;

      const time =
        positionToTime(
          touch.clientX
        );

      if (dragging === "start") {

        const newStart =
          Math.min(
            time,
            Number(endTime) - 0.1
          );

        setStartTime(
          Math.max(
            0,
            Number(newStart.toFixed(1))
          )
        );
      }

      if (dragging === "end") {

        const newEnd =
          Math.max(
            time,
            Number(startTime) + 0.1
          );

        setEndTime(
          Math.min(
            duration,
            Number(newEnd.toFixed(1))
          )
        );
      }
    };

    const handleTouchEnd = () => {
      setDragging(null);
    };

    window.addEventListener(
      "touchmove",
      handleTouchMove,
      { passive: false }
    );

    window.addEventListener(
      "touchend",
      handleTouchEnd
    );

    return () => {
      window.removeEventListener(
        "touchmove",
        handleTouchMove
      );

      window.removeEventListener(
        "touchend",
        handleTouchEnd
      );
    };
  }, [
    dragging,
    duration,
    startTime,
    endTime,
    setStartTime,
    setEndTime,
  ]);


  // --------------------------------------------------
  // Handle percentage
  // --------------------------------------------------

  const startPercent =
    duration
      ? (Number(startTime) / duration) * 100
      : 0;

  const endPercent =
    duration
      ? (Number(endTime) / duration) * 100
      : 100;


      const playheadPercent =
  duration > 0
    ? (Number(currentTime) / duration) * 100
    : 0;
  // --------------------------------------------------
  // Render
  // --------------------------------------------------


  const handleWaveformClick = async (e) => {
  if (!waveformRef.current) return;

  const audio = audioRef?.current;

  if (!audio || !duration) return;

  const rect =
    waveformRef.current.getBoundingClientRect();

  let percentage =
    (e.clientX - rect.left) / rect.width;

  percentage = Math.max(
    0,
    Math.min(1, percentage)
  );

  const clickedTime =
    percentage * duration;

  setCurrentTime(clickedTime);

  audio.currentTime = clickedTime;

  try {
    await audio.play();
    setIsPlaying(true);
  } catch (error) {
    console.error("Audio play error:", error);
  }
};
  return (
    <div className="ringtone-waveform-wrapper">

      <div className="ringtone-waveform-time">

        <span>
          {Number(startTime || 0).toFixed(1)}s
        </span>

        <span>
          {Number(endTime || 0).toFixed(1)}s
        </span>

      </div>


      <div 
  ref={waveformRef} 
  className="ringtone-waveform"
  onClick={handleWaveformClick}
>

        {/* Selection overlay */}

       <div
  className="ringtone-selection"
  style={{
    left: `${startPercent}%`,
    width: `${endPercent - startPercent}%`,
  }}
  onMouseDown={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging("selection");
  }}
  onTouchStart={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging("selection");
  }}
>
</div>


        {/* Waveform bars */}

        <div className="ringtone-bars">

          {bars.map((height, index) => {

            const barPercent =
              (index / bars.length) * 100;

            const selected =
              barPercent >= startPercent &&
              barPercent <= endPercent;

            return (
              <div
                key={index}
                className={
                  selected
                    ? "ringtone-bar selected"
                    : "ringtone-bar"
                }
                style={{
                  height: `${height}%`,
                }}
              />
            );

          })}

        </div>

                {/* Current playback position */}

        <div
          className="ringtone-playhead"
          style={{
            left: `${playheadPercent}%`,
          }}
        >
          <div className="ringtone-playhead-time">
            {Number(currentTime).toFixed(1)}s
          </div>
        </div>


        {/* Start handle */}

        <div
          className="ringtone-handle ringtone-start-handle"
          style={{
            left: `${startPercent}%`,
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            setDragging("start");
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setDragging("start");
          }}
        >

          <div className="ringtone-handle-label">
            Start
          </div>

        </div>


        {/* End handle */}

        <div
          className="ringtone-handle ringtone-end-handle"
          style={{
            left: `${endPercent}%`,
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            setDragging("end");
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setDragging("end");
          }}
        >

          <div className="ringtone-handle-label">
            End
          </div>

        </div>

      </div>


      {/* Time labels */}

      <div className="ringtone-waveform-scale">

        <span>
          0:00
        </span>

        <span>
          {Math.floor(duration / 60)}:
          {String(
            Math.floor(duration % 60)
          ).padStart(2, "0")}
        </span>

      </div>


      {/* Selected Ringtone Info */}

{/* Selected Ringtone Info */}

<div className="selected-ringtone-info">

  <div className="selected-ringtone-title">
    Selected Ringtone
  </div>

  <div className="selected-ringtone-details">

    <div className="selected-time">
      <span>Start</span>
      <strong>
        {Number(startTime || 0).toFixed(1)} sec
      </strong>
    </div>

    <div className="selected-time">
      <span>End</span>
      <strong>
        {Number(endTime || 0).toFixed(1)} sec
      </strong>
    </div>

    <div className="selected-time">
      <span>Length</span>
      <strong>
        {Math.max(
          0,
          Number(endTime || 0) -
          Number(startTime || 0)
        ).toFixed(1)} sec
      </strong>
    </div>

  </div>

</div>


{/* Play Button */}

<div className="ringtone-waveform-play">

  <button
    type="button"
    onClick={togglePlay}
    className="ringtone-play-btn"
  >
    {isPlaying ? "❚❚ Pause" : "▶ Play"}
  </button>

</div>


{/* Waveform */}



    </div>
  );
}