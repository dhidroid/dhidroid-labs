import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pages } from "../data";
import { Ico } from "../icons";
import { Dev } from "../dev";
import { Track } from "../charts";
import { pageMetadata } from "../../lib/seo";
import { queryPublished } from "../../lib/sanity";
import Faq05, { type FaqItem } from "@/components/ui/faq-05";

export const dynamicParams = false;
const reserved = new Set(["developers", "contact"]);
export function generateStaticParams() {
  return Object.keys(pages).filter((slug) => !reserved.has(slug)).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = pages[slug];
  return p ? pageMetadata(`/${slug}`, { title: `${p.name} | Dhidroid Labs`, description: p.intro }) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = pages[slug];
  if (!p) notFound();
  const faqs = slug === "faq" ? await queryPublished<FaqItem[]>(`
    *[_type == "faq" && defined(question) && defined(answer)] | order(coalesce(order, 9999) asc, _createdAt asc)
    {"id": _id, "q": question, "a": answer}
  `) : undefined;
  const faqItems = slug === "faq"
    ? (faqs?.length ? faqs : p.text?.map(([q, a], index) => ({ id: `item-${index + 1}`, q, a })))
    : undefined;
  return (
    <main className="sub">
      {faqItems ? <Faq05 items={faqItems} intro={p.intro} headingAs="h1" defaultValue={faqItems[0]?.id} /> : (
        <header className="sh"><h1>{p.title}</h1><p>{p.intro}</p></header>
      )}
      {p.track && <div className="chart scroll"><Track items={p.track} label={`${p.name}: ${p.track.map((s) => s.t).join(", ")}`} /></div>}
      {p.cards && (
        <div className="cards">
          {p.cards.map((c) => {
            const inner = (<><span className="ic"><Ico n={c.icon} /></span><h3>{c.title}</h3><p>{c.body}</p>{c.stack && <div className="stk">{c.stack.map((s) => <Dev key={s} n={s} />)}</div>}</>);
            return c.href ? <Link key={c.title} href={c.href} className="c">{inner}</Link> : <div key={c.title} className="c">{inner}</div>;
          })}
        </div>
      )}
      {p.text && !faqItems && <div className="legal">{p.text.map(([h, b]) => <section key={h}><h2>{h}</h2><p>{b}</p></section>)}</div>}
      {!p.legal && (
        <div className="wrap"><div className="band"><div><h3>Have a real-world problem in mind?</h3><p>Let’s explore whether a small, carefully designed solution could help.</p></div><Link className="btn ink" href="/contact">Start a project</Link></div></div>
      )}
    </main>
  );
}
