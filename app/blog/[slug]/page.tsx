import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return {
    title: `${post.title} — Journal`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="journal-article" role="status" aria-live="polite">
          <div className="journal-article-header">
            <p className="section-label">The Dhidroid Journal</p>
            <p className="section-heading" style={{ marginTop: 28 }}>
              Opening the note…
            </p>
          </div>
        </div>
      }
    >
      <BlogPostContent params={params} />
    </Suspense>
  );
}

async function BlogPostContent({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const related = (await getAllPosts())
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);
  const contents = post.headings.filter((heading) => heading.level === 2);
  const date = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${post.date}T00:00:00Z`));

  return (
    <>
      <article className="journal-article">
        <header className="journal-article-header">
          <p className="journal-article-category">
            {post.category} <span>·</span> Field notes
          </p>
          <h1>{post.title}</h1>
          <p className="journal-byline">
            Dhidroid <span>·</span> <time dateTime={post.date}>{date}</time>{" "}
            <span>·</span> {post.readTime}
          </p>
        </header>
        <div className="journal-reading-layout">
          <aside className="journal-article-sidebar">
            <Link href="/journal" className="journal-back-link">
              <ArrowLeft size={14} aria-hidden="true" /> All notes
            </Link>
            {contents.length > 0 && (
              <nav aria-label="Article contents">
                <p className="section-label">In this note</p>
                <ol>
                  {contents.map((heading) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`}>{heading.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <p className="journal-margin-note">
              A note from the practice of building thoughtful digital products.
            </p>
          </aside>
          <div className="journal-article-body">
            <MarkdownContent content={post.content} />
            <Link className="text-link journal-article-cta" href="/contact">
              Have a question about your project?{" "}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="journal-related">
          <div className="journal-container">
            <h2 className="section-label">Related reading</h2>
            <div className="journal-related-grid">
              {related.map((item) => (
                <article key={item.slug}>
                  <p className="journal-meta">{item.category}</p>
                  <h3>
                    <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <Link className="text-link" href={`/blog/${item.slug}`}>
                    Read the note <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
