import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["https://moneyfi.metzark.com"],
  },
};

export default nextConfig;
