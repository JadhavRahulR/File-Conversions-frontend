import React, { useState, useRef } from "react";
import "./tts.css";

const TTS = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const chunksRef = useRef([]);
  const indexRef = useRef(0);

  const MAX_CHARS = 2000;
  const CHUNK_SIZE = 400;

  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "hi-IN", name: "Hindi" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "pt-BR", name: "Portuguese" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "zh-CN", name: "Chinese" },
    { code: "ar-SA", name: "Arabic" }
  ];

  const splitText = () => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let chunks = [];
    let current = "";

    sentences.forEach(s => {
      if ((current + s).length <= CHUNK_SIZE) {
        current += s;
      } else {
        chunks.push(current);
        current = s;
      }
    });

    if (current) chunks.push(current);
    return chunks;
  };

  // 🔊 Speak chunks
  const speakNext = () => {
    if (indexRef.current >= chunksRef.current.length) {
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      chunksRef.current[indexRef.current]
    );
    utterance.lang = language;

    utterance.onend = () => {
      indexRef.current++;
      speakNext();
    };

    speechSynthesis.speak(utterance);
  };

  // ▶️ Convert & Listen
  const playAudio = () => {
    if (!text.trim()) return;

    speechSynthesis.cancel();
    chunksRef.current = splitText();
    indexRef.current = 0;
    setIsPlaying(true);

    const start = () => speakNext();

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = start;
    } else {
      start();
    }
  };

  // ⏹️ Stop
  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // 🔁 Replay
  const replayAudio = () => {
    playAudio();
  };

  // ⬇️ Download MP3 (unchanged logic)
  const downloadAudio = async () => {
    if (!text.trim()) return;

    speechSynthesis.cancel();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorderRef.current.ondataavailable = e => {
      audioChunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tts-audio.mp3";
      a.click();
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);

    const chunks = splitText();
    let i = 0;

    const speakNextDownload = () => {
      if (i >= chunks.length) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[i]);
      utterance.lang = language;
      utterance.onend = () => {
        i++;
        speakNextDownload();
      };

      speechSynthesis.speak(utterance);
    };

    speakNextDownload();
  };

  return (
    <div className="tts-container">
      <h1>Text to Speech Tool</h1>
      <p>Listen online, stop, replay, or download MP3</p>

      <select value={language} onChange={e => setLanguage(e.target.value)}>
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Enter text here..."
        value={text}
        maxLength={MAX_CHARS}
        onChange={e => setText(e.target.value)}
      />

      <div className="char-count">
        {text.length} / {MAX_CHARS} characters
      </div>

      <div className="tts-buttons">
        <button onClick={playAudio}>🔊 Convert & Listen</button>
        <button onClick={stopAudio} disabled={!isPlaying}>⏹️ Stop</button>
        <button onClick={replayAudio}>🔁 Replay</button>
        <button onClick={downloadAudio} disabled={isRecording}>
          ⬇️ Download MP3
        </button>
      </div>
    </div>
  );
};

export default TTS;
