import React from "react";
import styles from "./DollarSignBackground.module.css";

const DollarSignBackground: React.FC = () => {
  const dollarSigns = Array.from({ length: 64 }, (_, i) => "$");

  return (
    <div className={styles.backgroundContainer}>
      {dollarSigns.map((sign, index) => (
        <span key={index} className={styles.dollarSign} style={{ animationDelay: `${index * 0.1}s` }}>
          {sign}
        </span>
      ))}
    </div>
  );
};

export default DollarSignBackground;
