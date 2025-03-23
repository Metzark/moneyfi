import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type SignupRequest = {
  email: string;
  password: string;
  test: boolean;
};

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

  // Get signup data from request
  const data: SignupRequest = await req.json();

  const signupData: SignupData = {
    email: data.email,
    password: data.password,
  };

  // If test is true, use test email and password (basically a one time use email and password for testing)
  if (data.test) {
    signupData.email = `test_${Math.floor(Math.random() * 1000000)}@test.com`;
    signupData.password = `test_${Math.floor(Math.random() * 1000000)}`;
  }

  // Sign the user up
  const { error }: { error: Error | null } = await supabase.auth.signUp(signupData);

  const response: SignupResponse = {
    error: error ? error.message : null,
    success: !Boolean(error),
  };

  if (!response.success) {
    return NextResponse.json(response, { status: 500 });
  }

  return NextResponse.redirect(new URL("/", req.url));
}
