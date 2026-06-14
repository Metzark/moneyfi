import { createNhostClient } from "@/lib/nhost/server";
import type { ErrorResponse } from "@nhost/nhost-js/auth";
import type { FetchError } from "@nhost/nhost-js/fetch";
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
  const data: LoginRequest = await req.json();

  if (!data.email || !data.password) {
    const response: LoginResponse = {
      error: "Email and password are required",
      success: false,
    };
    return NextResponse.json(response, { status: 400 });
  }

  try {
    const nhost = await createNhostClient();
    const res = await nhost.auth.signInEmailPassword({
      email: data.email,
      password: data.password,
    });

    if (!res.body.session) {
      const response: LoginResponse = {
        error: "Failed to sign in. Please check your credentials.",
        success: false,
      };
      return NextResponse.json(response, { status: 401 });
    }

    const response: LoginResponse = {
      error: null,
      success: true,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const error = err as FetchError<ErrorResponse>;
    const response: LoginResponse = {
      error: error.message,
      success: false,
    };
    return NextResponse.json(response, { status: error.status || 500 });
  }
}
