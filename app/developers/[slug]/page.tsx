import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { developers } from "../data";
import { GithubGraph } from "../../githubgraph";
import { Dev } from "../../dev";
import { Ico } from "../../icons";
import { Cta } from "../../cta";

export const dynamicParams = false;

export function generateStaticParams() {
  return developers.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dev = developers.find((d) => d.slug === slug);
  if (!dev) return {};
  return {
    title: `${dev.name} | Dhidroid Labs`,
    description: `${dev.title} — ${dev.tagline}. Based in ${dev.location}.`,
  };
}

export default async function DeveloperDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dev = developers.find((d) => d.slug === slug);
  if (!dev) notFound();

  return (
    <main className="sub dev-detail">
      {/* Back button */}
      <Link href="/developers" className="back">
        ← Meet all developers
      </Link>

      {/* Developer Hero */}
      <section className="dev-detail-hero">
        <div className="dev-detail-avatar-col">
          <div className="dev-detail-img-wrap">
            <img
              src={dev.image}
              alt={dev.name}
              className="dev-detail-img"
              width={340}
              height={340}
            />
            <div className="dev-status-badge">
              <span className="dev-status-dot" />
              <span>Available for projects</span>
            </div>
          </div>

          <div className="dev-detail-stats">
            {dev.stats.map((s) => (
              <div key={s.label} className="dev-stat-box">
                <span className="dev-stat-val">{s.value}</span>
                <span className="dev-stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dev-detail-info-col">
          <small className="tag" style={{ display: "inline-block", marginBottom: 8 }}>
            {dev.role}
          </small>
          <h1 className="dev-detail-name">
            {dev.name.split(" ")[0]}<br />
            <i>{dev.name.split(" ").slice(1).join(" ")}</i>
          </h1>
          <p className="dev-detail-tagline">{dev.tagline}</p>
          <p className="dev-detail-bio">{dev.bio}</p>

          <div className="dev-detail-meta-row">
            <span><Ico n="pin" /> {dev.location}</span>
            <span><Ico n="calendar" /> {dev.experienceYears} experience</span>
            <span><Ico n="globe" /> Remote worldwide</span>
          </div>

          <div className="row" style={{ marginTop: 24 }}>
            <Link href="/contact" className="btn ink">
              Work with {dev.name.split(" ")[0]}
            </Link>
            <a
              href={dev.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn paper"
              style={{ display: "inline-flex", gap: 8 }}
            >
              <Ico n="linkedin" /> LinkedIn
            </a>
            <a
              href={`https://github.com/${dev.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn line"
              style={{ display: "inline-flex", gap: 8 }}
            >
              GitHub
            </a>
            <a
              href={dev.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="btn line"
            >
              Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* GitHub Contribution Graph Section */}
      <section className="wrap" style={{ paddingTop: 64, paddingBottom: 0 }}>
        <h2>GitHub activity & code cadence</h2>
        <p style={{ textAlign: "center", color: "var(--mute)", maxWidth: "58ch", margin: "12px auto 28px", fontSize: 14 }}>
          Public contribution frequency over the past 365 days across product repositories, open-source explorations, and client prototypes.
        </p>

        <div className="dev-graph-wrap">
          <div className="dev-graph-meta-header">
            <div>
              <strong>@{dev.github}</strong>
              <span style={{ color: "var(--mute)", marginLeft: 8, fontSize: 13 }}>on GitHub</span>
            </div>
            <a
              href={`https://github.com/${dev.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn line"
              style={{ height: 32, fontSize: 12, padding: "0 10px" }}
            >
              Open profile ↗
            </a>
          </div>
          <GithubGraph username={dev.github} label={`${dev.name}'s GitHub commit graph`} />
          <p style={{ marginTop: 14, fontSize: 12, color: "var(--mute)", textAlign: "center" }}>
            Visualisation reflects git commit distribution and verified contributions.
          </p>
        </div>
      </section>

      {/* Engineering Philosophy */}
      <section className="wrap" style={{ paddingTop: 72, paddingBottom: 0 }}>
        <h2>Engineering philosophy</h2>
        <div className="cards" style={{ marginTop: 36 }}>
          {dev.philosophy.map((p, idx) => {
            const [title, desc] = p.split(": ");
            return (
              <div key={idx} className="c">
                <span className="ic"><Ico n={idx === 0 ? "compass" : idx === 1 ? "rocket" : "shield"} /></span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section className="wrap" style={{ paddingTop: 72, paddingBottom: 0 }}>
        <h2>Background and approach</h2>
        <div className="dev-about-paragraphs" style={{ maxWidth: "68ch", margin: "28px auto 0" }}>
          {dev.about.map((p, idx) => (
            <p key={idx} style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(38,35,35,.8)", marginBottom: 18 }}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Technical Competencies */}
      <section className="wrap" style={{ paddingTop: 72, paddingBottom: 0 }}>
        <h2>Technical competencies</h2>
        <div className="cards" style={{ marginTop: 40 }}>
          {dev.skills.map((s) => (
            <div key={s.name} className="c">
              <span className="ic"><Ico n={s.icon} /></span>
              <small className="tag" style={{ textTransform: "uppercase", fontSize: 11 }}>{s.level}</small>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Complete Tech Stack */}
      <section className="wrap" style={{ paddingBottom: 0 }}>
        <h2>Tools and stack</h2>
        <div className="dev-stack" style={{ marginTop: 36 }}>
          {dev.stack.map((s) => (
            <div key={s} className="dev-stack-item">
              <Dev n={s} />
              <span>{s.replace("microsoftsqlserver:plain", "MSSQL").split(":")[0]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="wrap" style={{ paddingBottom: 0 }}>
        <h2>Career trajectory</h2>
        <ol className="dev-timeline" style={{ marginTop: 40 }}>
          {dev.journey.map((item) => (
            <li key={item.period} className="dev-tl-item">
              <span className="dev-tl-year">{item.period}</span>
              <div className="dev-tl-body">
                <strong>{item.role}</strong>
                <span className="dev-tl-co">{item.org}</span>
                <p>{item.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Featured Projects Built */}
      <section className="wrap" style={{ paddingBottom: 0 }}>
        <h2>Selected prototype projects</h2>
        <p style={{ textAlign: "center", color: "var(--mute)", maxWidth: "56ch", margin: "12px auto 36px", fontSize: 14 }}>
          Explorations designed and engineered by {dev.name.split(" ")[0]} to test real-world technical and user assumptions.
        </p>
        <div className="cards">
          {dev.featuredProjects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="c">
              <small className="tag">Independent Prototype</small>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="stk" style={{ marginTop: 16 }}>
                {p.stack.map((s) => (
                  <Dev key={s} n={s} />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Cta
        h={`Ready to build with ${dev.name.split(" ")[0]}?`}
        p="Tell us what you're trying to solve and we'll schedule a discovery conversation."
      />
    </main>
  );
}
