import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  error: string | null;
  success: boolean;
};

export async function POST(req: Request) {
  const supabase: SupabaseClient = await createClient();

  // Get login data from request
  const data: LoginRequest = await req.json();

  // Login user
  const { error }: { error: Error | null } = await supabase.auth.signInWithPassword(data);

  const response: LoginResponse = {
    error: error ? error.message : null,
    success: !Boolean(error),
  };

  if (!response.success) {
    return NextResponse.json(response, { status: 500 });
  }

  return NextResponse.json(response, { status: 200 });
}
