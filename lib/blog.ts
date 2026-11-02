import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import matter from "gray-matter";
import { getMarkdownHeadings, type MarkdownHeading } from "@/lib/markdown";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  featured: boolean;
};

export type BlogPost = BlogPostMeta & {
  content: string;
  headings: MarkdownHeading[];
};

const postsDirectory = path.join(process.cwd(), "content", "blog");
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function requiredString(
  data: Record<string, unknown>,
  field: string,
  slug: string,
) {
  const value = data[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Blog post "${slug}" needs a non-empty "${field}" field.`);
  }
  return value.trim();
}

function parsePost(slug: string, source: string): BlogPost {
  const { data, content } = matter(source);
  const rawDate =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : requiredString(data, "date", slug);
  const timestamp = Date.parse(rawDate);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(rawDate) ||
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString().slice(0, 10) !== rawDate
  ) {
    throw new Error(`Blog post "${slug}" needs a valid YYYY-MM-DD date.`);
  }

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: requiredString(data, "title", slug),
    description: requiredString(data, "description", slug),
    category: requiredString(data, "category", slug),
    date: rawDate,
    readTime:
      typeof data.readTime === "string" && data.readTime.trim()
        ? data.readTime.trim()
        : `${Math.max(1, Math.ceil(words / 200))} min read`,
    image: requiredString(data, "image", slug),
    imageAlt: requiredString(data, "imageAlt", slug),
    featured: data.featured === true,
    content: content.trim(),
    headings: getMarkdownHeadings(content),
  };
}

/** Invalid URL slugs never reach the filesystem. Missing articles return null. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  "use cache";
  cacheLife("max");
  if (!validSlug.test(slug)) return null;
  try {
    const source = await readFile(
      path.join(postsDirectory, `${slug}.md`),
      "utf8",
    );
    return parsePost(slug, source);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  "use cache";
  cacheLife("max");
  let files: string[];
  try {
    files = await readdir(postsDirectory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map((file) => getPostBySlug(file.slice(0, -3))),
  );

  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    )
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      date: post.date,
      readTime: post.readTime,
      image: post.image,
      imageAlt: post.imageAlt,
      featured: post.featured,
    }));
}

export async function getFeaturedPost(): Promise<BlogPostMeta | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.featured) ?? posts[0];
}
