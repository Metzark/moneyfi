"use client";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginForm({ isSignup = false }: { isSignup?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | null, test: boolean = false) => {
    try {
      e?.preventDefault();

      if (!test && (!email || !password)) {
        setError("Please enter an email and password");
        return;
      }

      setError("");
      setIsLoading(true);

      const res = await fetch(`/api/${isSignup || test ? "signup" : "login"}`, {
        method: "POST",
        body: JSON.stringify({ email, password, test }),
      });

      // Check if response is a redirect
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to home page
      router.push("/advice");
      window.location.href = "/advice";
    } catch (err) {
      console.error(err);
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
      <button className={styles.submit} type="submit" aria-label="login" disabled={isLoading}>
        Go
      </button>
      <p className={styles.link}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Login" : "Sign up"}</Link>
      </p>
      <p className={styles.link}>
        Use a test account?{" "}
        <button type="button" onClick={() => handleSubmit(null, true)}>
          Test
        </button>
      </p>
    </form>
  );
}
