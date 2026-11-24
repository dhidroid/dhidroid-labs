import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMDXFiles } from "../../../lib/mdx";
import { Dev } from "../../dev";
import { Cta } from "../../cta";

export const dynamicParams = false;
export function generateStaticParams() {
  return getMDXFiles("projects").map((f) => ({ slug: f.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getMDXFiles("projects").find((f) => f.slug === slug);
  if (!p) return {};
  return { title: `${p.fm.title} | Dhidroid Labs`, description: p.fm.summary };
}

export default async function ProjectMDX({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const files = getMDXFiles("projects");
  const idx = files.findIndex((f) => f.slug === slug);
  if (idx < 0) notFound();
  const p = files[idx];
  const prev = files[idx + 1];
  const next = files[idx - 1];

  return (
    <main className="sub proj">
      <Link href="/projects" className="back">  All projects</Link>
      <header className="sh">
        <small className="tag" style={{ display: "block", marginBottom: 10 }}>{p.fm.type}</small>
        <h1>{p.fm.title}</h1>
        <p>{p.fm.summary}</p>
      </header>
      <div className="meta">
        <div><span>Type</span>{p.fm.type}</div>
        <div><span>Status</span>{p.fm.status ?? "Independent prototype"}</div>
        {p.fm.stack && (
          <div><span>Stack</span>
            <div className="stk">{(p.fm.stack as string[]).map((s) => <Dev key={s} n={s} />)}</div>
          </div>
        )}
      </div>
      <div className="pb mdx-body" dangerouslySetInnerHTML={{ __html: p.html }} />
      <div className="pn">
        {prev ? <Link href={`/projects/${prev.slug}`}>  {prev.fm.title}</Link> : <span />}
        {next ? <Link href={`/projects/${next.slug}`}>{next.fm.title} →</Link> : <span />}
      </div>
      <Cta h="Facing a similar problem?" p="Tell us what you're trying to solve and we'll suggest a practical first step." />
    </main>
  );
}
