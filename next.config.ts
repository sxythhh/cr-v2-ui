import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { hostname: "assets-2-prod.whop.com" },
      { hostname: "saqnibxhsephhucwjbdw.supabase.co" },
      { hostname: "ui-avatars.com" },
      { hostname: "assets.dub.co" },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
