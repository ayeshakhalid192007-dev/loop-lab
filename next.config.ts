import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // fully static — deploy anywhere
  images: { unoptimized: true }, // required for static export
};

export default nextConfig;
