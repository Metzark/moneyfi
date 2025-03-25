import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Chat from "@/components/Chat/Chat";

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // If user is not logged in, redirect to login page
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <main>
      <Chat />
    </main>
  );
}
