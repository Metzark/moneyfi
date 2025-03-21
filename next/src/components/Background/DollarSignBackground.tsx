import React from "react";
import styles from "./DollarSignBackground.module.css";

const dollarSigns: string[] = Array.from({ length: 64 }, (_, i) => "$");

export default function DollarSignBackground() {
  return (
    <div className={styles.backgroundContainer}>
      {dollarSigns.map((sign, index) => (
        <span key={index} className={styles.dollarSign} style={{ animationDelay: `${index * 0.1}s` }}>
          {sign}
        </span>
      ))}
    </div>
  );
}
