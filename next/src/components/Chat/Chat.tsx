"use client";

import styles from "./Chat.module.css";
import { useAdvisors } from "@/hooks/useAdvisors";
import { useMessages } from "@/hooks/useMessages";
import Message from "../Message/Message";
import { useState } from "react";

export default function Chat() {
  // Get the next advisor
  const { advisor, nextAdvisor, error } = useAdvisors();

  // Get the messages for the current advisor
  const messages = useMessages(advisor);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle sending a message
  const handleSend = async () => {
    if (!message) return;

    try {
      setLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: message, advisor_id: advisor?.id }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.advisor}>
        <div className={styles.avatar}>
          {advisor?.image_url ? <img src={advisor.image_url} alt="Advisor avatar" /> : <AdvisorPlaceholderAvatar />}
        </div>
        <div className={styles.description}>
          <h3>{advisor?.name}</h3>
          <p>{advisor?.description}</p>
        </div>
        <button title="Switch Advisor" onClick={nextAdvisor}>
          <Switch />
        </button>
      </div>
      <div className={styles.chats}>
        <ul>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </ul>
      </div>
      <div className={styles.input}>
        <textarea placeholder={`Chat with ${advisor?.name || "Tom"}...`} value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

function Switch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="1em" fill="currentColor">
      <path d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z" />
    </svg>
  );
}

function AdvisorPlaceholderAvatar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
    </svg>
  );
}
