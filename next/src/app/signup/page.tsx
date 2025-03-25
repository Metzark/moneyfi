import LoginForm from "@/components/LoginForm/LoginForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function Login() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // If user is logged in, redirect to home page
  if (data?.user) {
    redirect("/advice");
  }

  return (
    <main>
      <LoginForm isSignup={true} />
    </main>
  );
}
