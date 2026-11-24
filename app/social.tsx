import { Dev } from "./dev";
import { Marquee } from "./marquee";
import { clients, reviews } from "./data";

// Sample entries (sample: true) show only in development, so no placeholder names reach production.
const live = process.env.NODE_ENV === "production";
const tech: [string, string][] = [["React", "react"], ["TypeScript", "typescript"], ["Next.js", "nextjs"], ["Node.js", "nodejs"], ["Python", "python"], ["PostgreSQL", "postgresql"], ["Docker", "docker"], ["Git", "git"], ["GitHub", "github"], ["Figma", "figma"]];

export function TechMarquee() {
  return <Marquee label="Technologies we build with">{tech.map(([t, d]) => <span className="tl" key={t}><Dev n={d} />{t}</span>)}</Marquee>;
}

export function Clients() {
  const list = clients.filter((c) => !live || !c.sample);
  if (!list.length) return null;
  return (
    <section className="clients">
      <h2>Our clients</h2>
      <Marquee label="Our clients">{list.map((c) => <span className="tl" key={c.name}>{c.name}{c.sample && <em>sample</em>}</span>)}</Marquee>
    </section>
  );
}

export function Reviews() {
  const list = reviews.filter((r) => !live || !r.sample);
  if (!list.length) return null;
  return (
    <section className="wrap">
      <h2>What clients say</h2>
      <div className="rev">
        {list.map((r) => (
          <figure className="c" key={r.name + r.quote}>
            <blockquote>{r.quote}</blockquote>
            <figcaption><b>{r.name}</b>{r.role}{r.sample && <em> sample</em>}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
