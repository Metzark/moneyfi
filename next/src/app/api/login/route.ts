import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

  return NextResponse.json(response, { status: response.success ? 200 : 500 });
}
