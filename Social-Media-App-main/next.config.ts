import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    dangerouslyAllowLocalIP: true,

    remotePatterns: [
      // Pexels
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },

      // Laravel Storage - 127.0.0.1
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },

      // Laravel Storage - localhost
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;