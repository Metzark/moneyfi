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
        <h1>Welcome to MoneyFi</h1>
        <p>Where unconventional wisdom meets your financial future</p>
        <Link className={styles.getStarted} href="/signup">
          Get Started
        </Link>
      </section>

      <section className={styles.advisors}>
        <h2>Meet Our Advisors</h2>
        <div className={styles.advisorGrid}>
          {advisors?.map((advisor) => (
            <Advisor key={advisor.name} advisor={advisor} />
          ))}
        </div>
      </section>
    </main>
  );
}
