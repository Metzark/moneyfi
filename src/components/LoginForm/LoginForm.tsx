"use client";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm({ isSignup = false }: { isSignup?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!email || !password) {
        setError("Please enter an email and password");
        return;
      }

      setError("");
      setIsLoading(true);

      const res = await fetch(`/api/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      }

      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{isSignup ? "Sign up" : "Login"}</h2>
      <div className={styles.formGroup}>
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="email"
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="password"
          disabled={isLoading}
        />
      </div>
      <p className={styles.error}>{error}</p>
      <button type="submit" aria-label="login" disabled={isLoading}>
        Go
      </button>
      <p className={styles.link}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Login" : "Sign up"}</Link>
      </p>
    </form>
  );
}
