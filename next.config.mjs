import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

export default (phase) => {
  if (phase !== PHASE_DEVELOPMENT_SERVER) return withMDX(nextConfig);

  // Next sets PORT to the actual listening port before loading the dev config.
  const port = process.env.PORT;
  const devDirectory = port && /^\d+$/.test(port) ? `.next-dev/${port}` : ".next-dev";

  return withMDX({
    ...nextConfig,
    output: undefined,
    distDir: devDirectory,
  });
};
