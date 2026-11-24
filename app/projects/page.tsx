import type { Metadata } from "next";
import Link from "next/link";
import { getMDXFiles } from "../../lib/mdx";
import { Ico } from "../icons";
import { Dev } from "../dev";
import { Cta } from "../cta";

export const metadata: Metadata = {
  title: "Projects | Dhidroid Labs",
  description: "Independent prototypes and experiments, described with honest notes on scope and status.",
};

export default function Projects() {
  const projects = getMDXFiles("projects");
  return (
    <main className="sub">
      <header className="sh">
        <h1>Projects, described honestly.</h1>
        <p>Everything here is independent work: prototypes and experiments, not client engagements. Each page says what was explored and where the limits are.</p>
      </header>
      <div className="cards">
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="c">
            {p.fm.icon && <span className="ic"><Ico n={p.fm.icon} /></span>}
            <small className="tag">{p.fm.type}</small>
            <h3>{p.fm.title}</h3>
            <p>{p.fm.summary}</p>
            {p.fm.stack && (
              <div className="stk">{(p.fm.stack as string[]).map((s) => <Dev key={s} n={s} />)}</div>
            )}
          </Link>
        ))}
      </div>
      <Cta />
    </main>
  );
}
