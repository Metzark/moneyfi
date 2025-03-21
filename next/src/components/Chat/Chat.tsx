"use client";

import styles from "./Chat.module.css";
import { useState } from "react";

export default function Chat() {
  return (
    <div className={styles.container}>
      <div className={styles.advisor}>
        <div className={styles.avatar}>
          <img src="/tom.webp" alt="Advisor avatar" />
        </div>
        <div className={styles.description}>
          <h3>Tom</h3>
          <p>Tom used to work as an accountant, but now he is a financial advisor.</p>
        </div>
      </div>
      <div className={styles.chats}>
        <ul>
          <li className={`${styles.message} ${styles.user}`}>
            <p>Hello, how are you?</p>
          </li>
          <li className={`${styles.message} ${styles.advisor}`}>
            <p>I'm fine, thank you!</p>
            <button title="Play audio">
              <Play />
            </button>
          </li>
        </ul>
      </div>
      <div className={styles.input}>
        <textarea placeholder={`Chat with Tom...`} />
        <button>Send</button>
      </div>
    </div>
  );
}

function Play() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="1em" fill="currentColor">
      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
    </svg>
  );
}
