import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint:{
        //remove these lines if you want to use eslint
        ignoreDuringBuilds: true,
    },
    typescript:{
        ignoreBuildErrors: true,
    },
 images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      
    ],
  },};

export default nextConfig;
