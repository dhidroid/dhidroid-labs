"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog";

export function BlogIndex({ posts }: { posts: BlogPostMeta[] }) {
  const [category, setCategory] = useState("All notes");
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const categories = [
    "All notes",
    ...new Set(posts.map((post) => post.category)),
  ];
  const visiblePosts =
    category === "All notes"
      ? posts
      : posts.filter((post) => post.category === category);

  return (
    <>
      <section className="journal-feature-section">
        <div className="journal-container">
          <div className="journal-masthead">
            <p className="section-label">The Dhidroid Journal</p>
            <p>Notes on engineering, design, and the work in between.</p>
          </div>
          {featured ? (
            <div className="journal-feature">
              <Link
                href={`/blog/${featured.slug}`}
                className="journal-photo-mount"
                aria-label={`Read ${featured.title}`}
              >
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  width={1280}
                  height={720}
                  sizes="(max-width: 760px) 100vw, 660px"
                  className="journal-feature-photo"
                  preload
                />
              </Link>
              <div className="journal-feature-copy">
                <p className="journal-meta">
                  {featured.category} <span>·</span> {featured.readTime}
                </p>
                <h1>
                  <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h1>
                <p className="journal-description">{featured.description}</p>
                <Link className="text-link" href={`/blog/${featured.slug}`}>
                  Read the featured note{" "}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="journal-empty">
              <h1 className="section-heading">Notes from the work.</h1>
              <p>Our next journal entry is on its way.</p>
            </div>
          )}
        </div>
      </section>

      <section
        className="journal-index-section"
        aria-label="All journal entries"
      >
        <div className="journal-container">
          <div
            className="journal-categories"
            role="group"
            aria-label="Filter articles by category"
          >
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                className={
                  category === item
                    ? "journal-category is-active"
                    : "journal-category"
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="journal-results-count" role="status" aria-live="polite">
            {visiblePosts.length} {visiblePosts.length === 1 ? "note" : "notes"}
            {category !== "All notes" ? ` in ${category}` : " from the studio"}
          </p>
          <div className="journal-card-grid">
            {visiblePosts.map((post) => (
              <article key={post.slug} className="journal-card">
                <div className="journal-card-meta">
                  <span>{post.category}</span>
                  <span>{post.readTime.replace(" read", "")}</span>
                </div>
                <h2>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p>{post.description}</p>
                <Link className="text-link" href={`/blog/${post.slug}`}>
                  Read the note <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="journal-contact">
        <div className="journal-container">
          <p className="section-label">
            A conversation is a good place to start
          </p>
          <h2 className="section-heading">Have something in mind?</h2>
          <p>Bring us a question, an idea, or a problem worth working on.</p>
          <Link className="button button-dark" href="/contact">
            Start a conversation <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
