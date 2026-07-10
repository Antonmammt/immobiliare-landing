import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "x-vercel-no-toolbar", value: "1" },
        ],
      },
    ];
  },
};

export default nextConfig;
