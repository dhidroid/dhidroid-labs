import type { Metadata } from "next";
import { cache } from "react";
import { excerpt, seoFields, type Seo } from "./published-content";
import { queryPublished } from "./sanity";
import { siteUrl } from "./site-url";

const getSeoSettings = cache(() => queryPublished<{ defaults?: Seo; pages: ({ path: string } & Seo)[] }>(`{
  "defaults": *[_type == "siteSettings"] | order(_updatedAt desc)[0].seo{${seoFields}},
  "pages": *[_type == "pageSeo" && defined(path)] | order(_updatedAt desc){path, ${seoFields}}
}`));

type PageDetails = { title: string; description?: string; image?: string; publishedTime?: string };

export async function pageMetadata(path: string, details: PageDetails, entry?: Seo): Promise<Metadata> {
  const settings = await getSeoSettings();
  const override = settings?.pages.find((page) => page.path === path);
  const home = path === "/" ? settings?.defaults : undefined;
  const title = override?.title?.trim() || entry?.title?.trim() || home?.title?.trim() || details.title;
  const description = override?.description?.trim() || entry?.description?.trim() || home?.description?.trim() || excerpt(details.description);
  const image = override?.image || entry?.image || details.image || settings?.defaults?.image;
  const url = new URL(path, siteUrl).href;
  const publishedTime = details.publishedTime;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, siteName: "Dhidroid Labs",
      ...(publishedTime ? { type: "article", publishedTime } : { type: "website" }),
      ...(image ? { images: [image] } : {}),
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image] } : {}) },
  };
}
