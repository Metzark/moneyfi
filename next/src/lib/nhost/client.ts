import { createClient, type NhostClient } from "@nhost/nhost-js";
import { CookieStorage } from "@nhost/nhost-js/session";

let client: NhostClient | null = null;

export function getNhostClient(): NhostClient {
  if (!client) {
    client = createClient({
      region: process.env.NEXT_PUBLIC_NHOST_REGION || "local",
      subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || "local",
      storage: new CookieStorage({
        secure: process.env.NODE_ENV === "production",
      }),
    });
  }

  return client;
}
