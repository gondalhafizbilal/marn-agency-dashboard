import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Emits .next/standalone with a self-contained server.js and only the
  // node_modules actually reached at runtime. Required by the Docker image
  // used for ECS Fargate — without it the runtime stage would have to carry
  // the full dependency tree.
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    const backendTarget = process.env.NEXT_PUBLIC_API_URL ?? "https://api.dev.marnqatar.com/v1";

    return [
      {
        source: "/api/:path*",
        destination: `${backendTarget.replace(/\/$/, "")}/:path*`,
      },
      {
        source: "/:locale/api/:path*",
        destination: `${backendTarget.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
  allowedDevOrigins: ["192.168.18.17"],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "framer-motion",
      "@tanstack/react-query",
      "zustand",
    ],
  },
};

export default withNextIntl(nextConfig);
