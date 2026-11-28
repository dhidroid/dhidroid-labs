import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "../lib/published-content";
import { siteUrl } from "../lib/site-url";
import { pages } from "./data";
import { developers } from "./developers/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const publicPages = ["", "blog", "projects", "pricing", "engineering", "newsletter", ...Object.keys(pages)];
  const entries = (section: string, list: { slug: string; updatedAt?: string; date?: string }[]) => list.map((item) => {
    const date = item.updatedAt ?? item.date;
    return {
      url: new URL(`/${section}/${item.slug}`, siteUrl).href,
      ...(date && Number.isFinite(Date.parse(date)) ? { lastModified: new Date(date) } : {}),
    };
  });

  return [
    ...publicPages.map((path) => ({ url: new URL(path, siteUrl).href })),
    ...developers.map(({ slug }) => ({ url: new URL(`/developers/${slug}`, siteUrl).href })),
    ...entries("projects", projects),
    ...entries("blog", posts),
  ];
}
