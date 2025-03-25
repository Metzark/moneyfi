import styles from "./page.module.css";
import Advisor from "@/components/Advisor/Advisor";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Page() {
  const supabase = await createClient();

  const { data: advisors, error } = await supabase.from("advisors").select("*");

  if (error) {
    console.error(error);
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>
          Welcome to <span className={styles.moneyfi}>MoneyFi</span>
        </h1>
        <p>Where unconventional wisdom meets your financial future</p>
        <Link className={styles.getStarted} href="/signup">
          Get Started
        </Link>
      </section>

      <section className={styles.about}>
        <h2>
          What is <span className={styles.moneyfi}>MoneyFi</span>?
        </h2>
        <p>
          MoneyFi is where traditional financial advice meets real personality. We've assembled a unique team of financial advisors who bring their
          authentic selves to every consultation. Whether you're looking for ultra-conservative investment strategies, extreme money-saving
          techniques, or high-risk opportunities, our advisors offer transparent, unfiltered financial guidance that matches your style.
        </p>
        <p>
          No cookie-cutter advice. No corporate jargon. Just real people giving real financial advice - from saving every penny to making bold
          investment moves.
        </p>
      </section>

      <section className={styles.advisors}>
        <h2>Meet Our Advisors</h2>
        <div className={styles.advisorGrid}>
          {advisors?.map((advisor) => (
            <Advisor key={advisor.name} advisor={advisor} />
          ))}
        </div>
      </section>
      <footer className={styles.footer}>
        <p>
          Powered by <a href="https://openai.com">OpenAI</a> and <a href="https://elevenlabs.io">ElevenLabs</a>
        </p>
      </footer>
    </main>
  );
}
