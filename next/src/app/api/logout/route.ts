import { createNhostClient } from "@/lib/nhost/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const nhost = await createNhostClient();
  const session = nhost.getUserSession();

  if (session) {
    try {
      await nhost.auth.signOut({ refreshToken: session.refreshToken });
    } catch (err) {
      console.error(err);
    }
  }

  nhost.clearSession();

  return NextResponse.redirect(new URL("/", req.url));
}
