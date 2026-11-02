import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/blog-index";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on engineering, design, and the practice of building thoughtful digital products.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return <BlogIndex posts={posts} />;
}
