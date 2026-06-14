import LoginForm from "@/components/LoginForm/LoginForm";
import { createNhostClient } from "@/lib/nhost/server";
import { redirect } from "next/navigation";

export default async function Signup() {
  const nhost = await createNhostClient();

  if (nhost.getUserSession()) {
    redirect("/advice");
  }

  return (
    <main>
      <LoginForm isSignup={true} />
    </main>
  );
}
