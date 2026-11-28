import { Dev } from "./dev";
import { Marquee } from "./marquee";
import { clients, reviews, type Client, type Review } from "./data";
import { queryPublished } from "../lib/sanity";
import type { Testimonial } from "@/components/ui/testimonials-13";

// Sample entries (sample: true) show only in development, so no placeholder names reach production.
const live = process.env.NODE_ENV === "production";
const tech: [string, string][] = [["React", "react"], ["TypeScript", "typescript"], ["Next.js", "nextjs"], ["Node.js", "nodejs"], ["Python", "python"], ["PostgreSQL", "postgresql"], ["Docker", "docker"], ["Git", "git"], ["GitHub", "github"], ["Figma", "figma"]];

export function TechMarquee() {
  return <Marquee label="Technologies we build with">{tech.map(([t, d]) => <span className="tl" key={t}><Dev n={d} />{t}</span>)}</Marquee>;
}

export async function getSocialContent() {
  const content = await queryPublished<{ clients: Client[]; reviews: Testimonial[] }>(`{
    "clients": *[_type == "client" && defined(name)] | order(coalesce(order, 9999) asc, name asc){name, sample},
    "reviews": *[_type in ["review", "testimonial"] && defined(name) && defined(coalesce(quote, testimonial))]
      | order(_createdAt desc){
        "id": _id, name, "quote": coalesce(quote, testimonial), "role": coalesce(role, designation), company, sample,
        "avatar": coalesce(avatar.asset->url, image.asset->url, avatar), "logo": coalesce(logo.asset->url, logo),
        "href": select(defined(project->slug.current) => "/projects/" + project->slug.current)
      }
  }`);
  return {
    clients: content?.clients.length ? content.clients : clients,
    reviews: content?.reviews.length ? content.reviews : reviews,
  };
}

export function Clients({ entries }: { entries: Client[] }) {
  const list = entries.filter((c) => !live || !c.sample);
  if (!list.length) return null;
  return (
    <section className="clients">
      <h2>Our clients</h2>
      <Marquee label="Our clients" scrollOnOverflow>{list.map((c) => <span className="tl" key={c.name}>{c.name}{c.sample && <em>sample</em>}</span>)}</Marquee>
    </section>
  );
}

export function Reviews({ entries }: { entries: (Review | Testimonial)[] }) {
  const list = entries.filter((entry) => !live || !entry.sample);
  if (!list.length) return null;
  return (
    <section className="wrap">
      <h2>What clients say</h2>
      <div className="rev">
        {list.map((entry) => {
          const id = "id" in entry ? entry.id : entry.name + entry.quote;
          const role = "role" in entry ? entry.role : undefined;
          return (
            <figure className="c" key={id}>
              <blockquote>{entry.quote}</blockquote>
              <figcaption>
                <b>{entry.name}</b>
                {role}
                {entry.sample && <em> sample</em>}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
