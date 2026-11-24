import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMDXFiles } from "../../../lib/mdx";
import { Dev } from "../../dev";
import { Ico } from "../../icons";
import { Cta } from "../../cta";

export const dynamicParams = false;
export function generateStaticParams() {
  return getMDXFiles("blog").map((f) => ({ slug: f.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getMDXFiles("blog").find((f) => f.slug === slug);
  if (!post) return {};
  return { title: `${post.fm.title} | Dhidroid Labs`, description: post.fm.excerpt };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const files = getMDXFiles("blog");
  const idx = files.findIndex((f) => f.slug === slug);
  if (idx < 0) notFound();
  const post = files[idx];
  const prev = files[idx + 1];
  const next = files[idx - 1];

  const mins = post.fm.readingTime ?? Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));

  return (
    <main className="sub post">
      <Link href="/blog" className="back">← All articles</Link>
      <header className="sh">
        {post.fm.icon && <span className="ic" style={{ display: "inline-grid", placeItems: "center", width: 40, height: 40, marginBottom: 16, background: "#f1f1ee", borderRadius: 10, boxShadow: "inset 0 1px 1px #fff, 0 0 0 1px var(--line)" }}><Ico n={post.fm.icon} /></span>}
        <h1>{post.fm.title}</h1>
        <p style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {post.fm.date && <span>{new Date(post.fm.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>}
          <span>{mins} min read</span>
        </p>
      </header>
      <div className="pb mdx-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      <div className="pn">
        {prev ? <Link href={`/blog/${prev.slug}`}>← {prev.fm.title}</Link> : <span />}
        {next ? <Link href={`/blog/${next.slug}`}>{next.fm.title} →</Link> : <span />}
      </div>
      <Cta h="Get notes like this by email." p="New articles and lab experiments, sent when they're ready." />
    </main>
  );
}
