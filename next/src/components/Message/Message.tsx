import styles from "./Message.module.css";
import { Message as MessageType } from "@/types/types";

export default function Message({ message }: { message: MessageType }) {
  return (
    <li className={`${styles.message} ${message.from_user ? styles.user : styles.advisor}`}>
      <p>{message.message}</p>
      {!message.from_user && (
        <button title="Play audio">
          <Play />
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
