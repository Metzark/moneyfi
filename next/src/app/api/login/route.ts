import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  error: string | null;
  success: boolean;
};

export async function POST(req: Request) {
  const supabase: SupabaseClient = await createClient();

  const data: LoginData = await req.json();

  const { error }: { error: Error | null } = await supabase.auth.signInWithPassword(data);

  const response: LoginResponse = {
    error: error ? error.message : null,
    success: !Boolean(error),
  };

  return new Response(JSON.stringify(response), { status: response.success ? 200 : 500 });
}
