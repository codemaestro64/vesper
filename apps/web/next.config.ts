import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@vesper/types"],
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];

    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_PROXY_TARGET}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
