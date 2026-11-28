import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import { resolve } from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  htmlLimitedBots: /.*/,
  webpack(config) {
    config.module.rules.push({ test: /\.mdx?$/, include: resolve("content"), type: "asset/source" });
    return config;
  },
};

export default (phase) => {
  if (phase !== PHASE_DEVELOPMENT_SERVER) return nextConfig;

  // Next sets PORT to the actual listening port before loading the dev config.
  const port = process.env.PORT;
  const devDirectory = port && /^\d+$/.test(port) ? `.next-dev/${port}` : ".next-dev";

  return {
    ...nextConfig,
    pageExtensions: ["dev.ts", "tsx", "ts", "jsx", "js"],
    distDir: devDirectory,
  };
};
