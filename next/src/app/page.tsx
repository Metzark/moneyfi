import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { createClient } from "@/lib/supabase/server";
import Chat from "@/components/Chat/Chat";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <main>
      <Chat />
    </main>
  );
}
