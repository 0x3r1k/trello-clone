import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    FIVEMANAGE_TOKEN: process.env.FIVEMANAGE_TOKEN,
    LIVEBLOCKS_SECRET_KEY: process.env.LIVEBLOCKS_SECRET_KEY,
  },
};

export default nextConfig;
