import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ngoài Vercel (server riêng, Docker) thì build ra .next/standalone: chỉ cần `node server.js`, không cần cài lại node_modules.
  // Trên Vercel để mặc định. Xem docs/SELF_HOST.md.
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
