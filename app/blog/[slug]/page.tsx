import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toPlainText } from "@portabletext/react";
import { getPost, getPosts } from "../../../lib/published-content";
import { pageMetadata } from "../../../lib/seo";
import { Ico } from "../../icons";
import { Cta } from "../../cta";
import { CmsBody, CmsImage, MarkdownBody } from "../../cms-body";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return pageMetadata(`/blog/${post.slug}`, {
    title: `${post.title} | Dhidroid Labs`, description: post.summary, image: post.image?.url, publishedTime: post.date,
  }, post.seo);
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();
  const index = posts.findIndex((entry) => entry.slug === slug);
  const prev = index >= 0 ? posts[index + 1] : undefined;
  const next = posts[index - 1];

  const markdown = post.local?.content ?? (typeof post.markdown === "string" ? post.markdown : undefined);
  const text = markdown ?? toPlainText(post.body ?? []);
  const mins = post.readingTime ?? Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
  const relatedProjects = post.relatedProjects?.filter(({ slug }) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug));

  return (
    <main className="sub post">
      <Link href="/blog" className="back">All articles</Link>
      <header className="sh">
        {post.icon && <span className="ic" style={{ display: "inline-grid", placeItems: "center", width: 40, height: 40, marginBottom: 16, background: "#f1f1ee", borderRadius: 10, boxShadow: "inset 0 0 0 1px #fff, 0 0 0 1px rgba(0,0,0,.08)" }}><Ico n={post.icon} /></span>}
        <h1>{post.title}</h1>
        <p style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {post.author && <span>{post.author}</span>}
          {post.date && <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Kolkata" })}</time>}
          <span>{mins} min read</span>
        </p>
      </header>
      <div className="pb mdx-body">
        <CmsImage image={post.image} eager />
        {markdown ? <MarkdownBody value={markdown} /> : post.body && <CmsBody value={post.body} />}
      </div>
      {!!relatedProjects?.length && (
        <section className="pb mdx-body">
          <h2>Related projects</h2>
          <ul>
            {relatedProjects.map(({ slug, title }) => <li key={slug}><Link href={`/projects/${slug}`}>{title}</Link></li>)}
          </ul>
        </section>
      )}
      <div className="pn">
        {prev ? <Link href={`/blog/${prev.slug}`}>{prev.title}</Link> : <span />}
        {next ? <Link href={`/blog/${next.slug}`}>{next.title} →</Link> : <span />}
      </div>
      <Cta h="Get notes like this by email." p="New articles and lab experiments, sent when they're ready." />
    </main>
  );
}
