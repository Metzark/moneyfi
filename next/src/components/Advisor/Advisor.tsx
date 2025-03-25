import styles from "./Advisor.module.css";
import Image from "next/image";

export default function Advisor({ advisor }: any) {
  return (
    <div className={styles.advisorCard}>
      <div className={styles.advisorImageContainer}>
        <Image width={200} height={200} src={advisor.image_url} alt={advisor.name} />
      </div>
      <div className={styles.advisorContent}>
        <h3>{advisor.name}</h3>
        <h4>{advisor.title}</h4>
        <p>{advisor.full_bio}</p>
        {/* <div className={styles.specialties}>
          {advisor.specialties.map((specialty: any) => (
            <span key={specialty} className={styles.specialty}>
              {specialty}
            </span>
          ))}
        </div> */}
      </div>
    </div>
  );
}
