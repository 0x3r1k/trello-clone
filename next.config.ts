import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    FIVEMANAGE_TOKEN: process.env.FIVEMANAGE_TOKEN,
  },
};

export default nextConfig;
