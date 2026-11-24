import type { MetadataRoute } from "next";
import { getMDXFiles } from "../lib/mdx";
import { siteUrl } from "../lib/site-url";
import { pages } from "./data";
import { developers } from "./developers/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = ["", "blog", "projects", "pricing", "engineering", "newsletter", ...Object.keys(pages)];

  return [
    ...publicPages.map((path) => ({ url: new URL(path, siteUrl).href })),
    ...developers.map(({ slug }) => ({ url: new URL(`/developers/${slug}`, siteUrl).href })),
    ...getMDXFiles("projects").map(({ slug }) => ({ url: new URL(`/projects/${slug}`, siteUrl).href })),
    ...getMDXFiles("blog").map(({ slug, fm }) => ({
      url: new URL(`/blog/${slug}`, siteUrl).href,
      ...(fm.date && Number.isFinite(Date.parse(fm.date)) ? { lastModified: new Date(fm.date) } : {}),
    })),
  ];
}
