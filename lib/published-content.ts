import { cache } from "react";
import type { PortableTextBlock } from "@portabletext/react";
import { projects as prototypes } from "../app/data";
import { getMDXFiles, type MDXFile } from "./mdx";
import { projectTechnologies, type ProjectTechnology } from "./project-technologies";
import { queryPublished } from "./sanity";

export type ContentImage = { url: string; alt?: string; width?: number; height?: number };
export type Seo = { title?: string; description?: string; image?: string };
export type RichText = (PortableTextBlock | { _type: string; _key?: string })[];

type Entry = {
  slug: string;
  title: string;
  summary: string;
  date?: string;
  updatedAt?: string;
  image?: ContentImage;
  seo?: Seo;
  icon?: string;
};

type Project = Entry & {
  type: string;
  status?: string;
  stack: ProjectTechnology[];
  role?: string;
  year?: string;
  featured?: boolean;
};

type Post = Entry & { author?: string; categories?: string[]; readingTime?: number };
type ProjectDetail = Project & {
  description?: string;
  challenge?: string;
  solution?: RichText;
  results?: string;
  gallery?: ContentImage[];
  link?: string;
  github?: string;
  markdown?: string;
  local?: MDXFile;
};
type PostDetail = Post & {
  body?: RichText;
  markdown?: string;
  relatedProjects?: { slug: string; title: string }[];
  local?: MDXFile;
};
type SanityProject = Omit<ProjectDetail, "stack"> & { stack?: unknown; solutionText?: string };

const imageFields = `"url": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height`;
export const seoFields = `title, description, "image": image.asset->url`;
const projectFilter = `_type == "project" && defined(slug.current) && defined(title)`;
const postFilter = `_type == "post" && defined(slug.current) && defined(title) && (!defined(publishedAt) || dateTime(publishedAt) <= dateTime(now()))`;
const projectFields = `"slug": slug.current, title, "summary": coalesce(tagline, summary, ""), description,
  "type": coalesce(type, categories[defined(@->title)][0]->title, "Project"), status, role, year, featured,
  "stack": coalesce(stack, techStack, technologies), "solutionText": pt::text(solution),
  "updatedAt": _updatedAt, image{${imageFields}}, seo{${seoFields}}`;
const postFields = `"slug": slug.current, title, "summary": coalesce(excerpt, pt::text(body), ""),
  "date": coalesce(publishedAt, _createdAt), "updatedAt": _updatedAt, "author": author->name,
  "categories": categories[]->title, readingTime, "image": mainImage{${imageFields}}, seo{${seoFields}}`;

export function excerpt(text: string | undefined, maxLength = 155): string {
  const normalized = text?.replace(/\s+/g, " ").trim() ?? "";
  if (normalized.length <= maxLength) return normalized;
  const boundary = normalized.lastIndexOf(" ", maxLength - 1);
  return `${normalized.slice(0, boundary > maxLength / 2 ? boundary : maxLength - 1)}…`;
}

function normalize<T extends Entry>(entry: T): T {
  return { ...entry, title: entry.title.trim(), summary: excerpt(entry.summary) };
}

function normalizeProject({ stack, solutionText, ...entry }: SanityProject): ProjectDetail {
  return normalize({
    ...entry,
    summary: entry.summary?.trim() || entry.description || "",
    stack: projectTechnologies(stack, [entry.title, entry.description, solutionText]),
  });
}

function mergeEntries<T extends Entry>(published: T[], local: T[]): T[] {
  const bySlug = new Map<string, T>();
  for (const entry of [...published, ...local]) {
    if (!bySlug.has(entry.slug)) bySlug.set(entry.slug, entry);
  }
  return [...bySlug.values()];
}

function localProject(file: MDXFile): ProjectDetail {
  const { slug, fm } = file;
  return {
    slug, title: fm.title, summary: fm.summary ?? "", icon: fm.icon, stack: projectTechnologies(fm.stack),
    type: fm.type ?? "Project", status: fm.status ?? "Independent prototype", local: file,
  };
}

function localPost(file: MDXFile): PostDetail {
  const { slug, fm } = file;
  return { slug, title: fm.title, summary: fm.excerpt ?? "", icon: fm.icon, date: fm.date, readingTime: fm.readingTime, local: file };
}

function validEntry(entry: Entry): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(entry.slug) && Boolean(entry.title?.trim());
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const entries = await queryPublished<SanityProject[]>(`*[${projectFilter}] | order(coalesce(featured, false) desc, _updatedAt desc, _id asc){${projectFields}}`);
  const remote = (entries ?? []).filter(validEntry).map(normalizeProject);
  const local = getMDXFiles("projects").map(localProject);
  const orderedPrototypes = prototypes.flatMap(({ slug }) => local.find((entry) => entry.slug === slug) ?? []);
  return mergeEntries(remote, mergeEntries(orderedPrototypes, local));
});

export const getProject = cache(async (slug: string): Promise<ProjectDetail | undefined> => {
  const entry = await queryPublished<SanityProject>(`*[${projectFilter} && slug.current == $slug] | order(_updatedAt desc, _id asc)[0]{
    ${projectFields}, challenge, solution, results, link, github,
    "markdown": coalesce(markdown, bodyMarkdown), "gallery": gallery[defined(asset->url)]{${imageFields}}
  }`, { slug });
  if (entry && validEntry(entry)) return normalizeProject(entry);
  const file = getMDXFiles("projects").find((item) => item.slug === slug);
  return file && localProject(file);
});

export const getPosts = cache(async (): Promise<Post[]> => {
  const entries = await queryPublished<Post[]>(`*[${postFilter}] | order(coalesce(publishedAt, _createdAt) desc, _id asc){${postFields}}`);
  const remote = (entries ?? []).filter(validEntry).map(normalize);
  const local = getMDXFiles("blog").map(localPost);
  return mergeEntries(remote, local).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
});

export const getPost = cache(async (slug: string): Promise<PostDetail | undefined> => {
  const entry = await queryPublished<PostDetail>(`*[${postFilter} && slug.current == $slug] | order(_updatedAt desc, _id asc)[0]{
    ${postFields}, body[]{..., _type == "image" => {${imageFields}}},
    "markdown": coalesce(markdown, bodyMarkdown),
    "relatedProjects": relatedProjects[defined(@->slug.current) && defined(@->title)]->{"slug": slug.current, title}
  }`, { slug });
  if (entry && validEntry(entry)) return normalize(entry);
  const file = getMDXFiles("blog").find((item) => item.slug === slug);
  return file && localPost(file);
});
