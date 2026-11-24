import type { Metadata } from "next";
import Link from "next/link";
import { getMDXFiles } from "../../lib/mdx";
import { Ico } from "../icons";
import { Cta } from "../cta";

export const metadata: Metadata = {
  title: "Blog | Dhidroid Labs",
  description: "Practical notes on engineering decisions, small experiments and building software for real people.",
};

export default function Blog() {
  const posts = getMDXFiles("blog");
  return (
    <main className="sub">
      <header className="sh">
        <h1>Ideas from the build process.</h1>
        <p>Notes about engineering decisions, small experiments and the questions that come up when building software for actual people.</p>
      </header>
      <div className="cards">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="c">
            {p.fm.icon && <span className="ic"><Ico n={p.fm.icon} /></span>}
            {p.fm.date && <span className="tag">{new Date(p.fm.date).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}</span>}
            <h3>{p.fm.title}</h3>
            <p>{p.fm.excerpt ?? ""}</p>
          </Link>
        ))}
      </div>
      <Cta h="Want notes like these by email?" p="Join the newsletter for new articles and experiments from the lab." />
    </main>
  );
}
