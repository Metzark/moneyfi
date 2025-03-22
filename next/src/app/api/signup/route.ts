import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type SignupData = {
  email: string;
  password: string;
};

type SignupResponse = {
  error: string | null;
  success: boolean;
};

export async function POST(req: Request) {
  const supabase: SupabaseClient = await createClient();

  const data: SignupData = await req.json();

  const { error }: { error: Error | null } = await supabase.auth.signUp(data);

  const response: SignupResponse = {
    error: error ? error.message : null,
    success: !Boolean(error),
  };

  return NextResponse.json(response, { status: response.success ? 200 : 500 });
}
