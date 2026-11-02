import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/blog-index";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "The journal",
  description:
    "Notes on engineering, design, and the practice of building thoughtful digital products.",
};

export default async function JournalPage() {
  const posts = await getAllPosts();
  return <BlogIndex posts={posts} />;
}
