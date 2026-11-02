import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";
import { aboutPageData } from "@/content/pages/about.mdx";

export const metadata: Metadata = {
  title: "About Dhidroid",
  description: aboutPageData.hero.summary,
};

export default function AboutRoute() {
  return <AboutPage />;
}
