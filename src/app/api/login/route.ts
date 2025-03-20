import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

interface LoginData {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  const supabase: SupabaseClient = await createClient();

  const data: LoginData = await req.json();

  const { error }: { error: Error | null } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return new Response(JSON.stringify({ error: error.message, success: false }), { status: 500 });
  }

  return new Response(JSON.stringify({ error: null, success: true }), { status: 200 });
}
