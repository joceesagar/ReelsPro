import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {

    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.daisyui.com"
      }
    ],
  },
};

export default nextConfig;
