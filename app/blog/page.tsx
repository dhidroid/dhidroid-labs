import Link from "next/link";
import { getPosts } from "../../lib/published-content";
import { pageMetadata } from "../../lib/seo";
import { Ico } from "../icons";
import { Cta } from "../cta";
import { CmsImage } from "../cms-body";

export function generateMetadata() {
  return pageMetadata("/blog", {
    title: "Blog | Dhidroid Labs",
    description: "Practical notes on engineering decisions, small experiments and building software for real people.",
  });
}

export default async function Blog() {
  const posts = await getPosts();
  return (
    <main className="sub">
      <header className="sh">
        <h1>Ideas from the build process.</h1>
        <p>Notes about engineering decisions, small experiments and the questions that come up when building software for actual people.</p>
      </header>
      <div className="cards">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="c">
            {p.image?.url ? <CmsImage image={p.image} className="blog-card-image" /> : (
              <span className="ic"><Ico n={p.icon ?? "news"} /></span>
            )}
            {p.date && <time className="tag" dateTime={p.date}>{new Date(p.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", timeZone: "Asia/Kolkata" })}</time>}
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
          </Link>
        ))}
      </div>
      <Cta h="Want notes like these by email?" p="Join the newsletter for new articles and experiments from the lab." />
    </main>
  );
}
