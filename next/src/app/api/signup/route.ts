import { createNhostClient } from "@/lib/nhost/server";
import type { ErrorResponse } from "@nhost/nhost-js/auth";
import type { FetchError } from "@nhost/nhost-js/fetch";
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
  const data: SignupRequest = await req.json();

  const signupData: SignupData = {
    email: data.email,
    password: data.password,
  };

  if (data.test) {
    signupData.email = `test_${Math.floor(Math.random() * 1000000)}@test.com`;
    signupData.password = `test_${Math.floor(Math.random() * 1000000)}`;
  }

  if (!signupData.email || !signupData.password) {
    const response: SignupResponse = {
      error: "Email and password are required",
      success: false,
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    const nhost = await createNhostClient();
    const res = await nhost.auth.signUpEmailPassword({
      email: signupData.email,
      password: signupData.password,
    });

    if (res.body.session) {
      const response: SignupResponse = {
        error: null,
        success: true,
      };
      return NextResponse.json(response, { status: 200 });
    }

    const response: SignupResponse = {
      error: "Account created. Please check your email to verify your account before signing in.",
      success: false,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const error = err as FetchError<ErrorResponse>;
    const response: SignupResponse = {
      error: error.message,
      success: false,
    };
    return NextResponse.json(response, { status: error.status || 500 });
  }
}
