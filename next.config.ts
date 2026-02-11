import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-expect-error - eslint config type might be missing in newer next types
  eslint: {
    ignoreDuringBuilds: true, // Because old code is garbage and we don't want to fix it right now trust me when i say garbage ai code
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "content.api.pharminc.in",
        port: "",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
