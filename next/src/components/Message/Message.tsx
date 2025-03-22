import styles from "./Message.module.css";
import { Message as MessageType } from "@/types/types";
import { useState, useRef, useEffect } from "react";

export default function Message({ message }: { message: MessageType }) {
  const [isPlaying, setIsPlaying] = useState(message.auto_play || false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element when message has audio URL
    if (message.audio_url && !audioRef.current) {
      audioRef.current = new Audio(message.audio_url);

      // Add event listeners
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
      audioRef.current.addEventListener("pause", () => setIsPlaying(false));
      audioRef.current.addEventListener("play", () => setIsPlaying(true));
    }

    // Cleanup audio stuff
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("ended", () => setIsPlaying(false));
        audioRef.current.removeEventListener("pause", () => setIsPlaying(false));
        audioRef.current.removeEventListener("play", () => setIsPlaying(true));
        audioRef.current = null;
      }
    };
  }, [message.audio_url]);

  // Auto play when message.auto_play is true (on new advisor message)
  useEffect(() => {
    if (!audioRef.current) return;

    if (message.auto_play) {
      audioRef.current.play();
    }
  }, [message.auto_play]);

  // Handle playing/pausing the audio
  const handlePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <li className={`${styles.message} ${message.from_user ? styles.user : styles.advisor}`}>
      <p>{message.message}</p>
      {!message.from_user && message.audio_url && (
        <button onClick={handlePlay} title={isPlaying ? "Pause audio" : "Play audio"}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
      )}
    </li>
  );
}

function Play() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="1em" fill="currentColor">
      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
    </svg>
  );
}

function Pause() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" height="1em" fill="currentColor">
      <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
    </svg>
  );
}
