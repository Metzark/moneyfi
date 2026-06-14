"use client";

import styles from "./Advisor.module.css";
import { Advisor as AdvisorType } from "@/types/types";
import { useState } from "react";

export default function Advisor({ advisor }: { advisor: AdvisorType }) {
  const [imageError, setImageError] = useState(false);
  const showImage = advisor.image_url && !imageError;

  return (
    <div className={styles.advisorCard}>
      <div className={styles.advisorImageContainer}>
        {showImage ? <img src={advisor.image_url!} alt={advisor.name} onError={() => setImageError(true)} /> : <AdvisorPlaceholderAvatar />}
      </div>
      <div className={styles.advisorContent}>
        <h3>{advisor.name}</h3>
        <h4>{advisor.description}</h4>
        <p>{advisor.full_bio || advisor.description}</p>
      </div>
    </div>
  );
}

function AdvisorPlaceholderAvatar() {
  return (
    <svg className={styles.placeholder} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
      <path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
    </svg>
  );
}
