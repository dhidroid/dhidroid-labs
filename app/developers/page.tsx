import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { developers } from "./data";
import { Dev } from "../dev";
import { Ico } from "../icons";
import { Cta } from "../cta";
import { GithubGraph } from "../githubgraph";

export const metadata: Metadata = {
  title: "Meet Our Developers | Dhidroid Labs",
  description: "Meet the engineers and specialists behind Dhidroid Labs. Founder-led, transparent software engineering for web, mobile, and AI products.",
};

export default function DevelopersPage() {
  return (
    <main className="sub">
      {/* Header */}
      <header className="sh">
        <small className="tag" style={{ display: "inline-block", marginBottom: 12 }}>Team & Collaborators</small>
        <h1>Meet the developers behind the lab.</h1>
        <p>
          Dhidroid Labs is an independent, engineer-led product studio. You work directly with the developers shaping your technical decisions, ensuring faster feedback, clear accountability, and zero agency fluff.
        </p>
      </header>

      {/* Developer Image-Based Cards Grid */}
      <section className="dev-grid-section">
        <div className="dev-cards">
          {developers.map((dev) => (
            <article key={dev.slug} className="dev-card">
              <div className="dev-card-media">
                <div className="dev-card-img-wrap">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="dev-card-img"
                    width={400}
                    height={400}
                    loading="lazy"
                  />
                  <div className="dev-status-badge">
                    <span className="dev-status-dot" />
                    <span>Available</span>
                  </div>
                </div>
              </div>

              <div className="dev-card-content">
                <div className="dev-card-header">
                  <div>
                    <h2 className="dev-card-name">
                      <Link href={`/developers/${dev.slug}`}>{dev.name}</Link>
                    </h2>
                    <p className="dev-card-role">{dev.title}</p>
                  </div>
                  <span className="dev-card-exp">{dev.experienceYears}</span>
                </div>

                <p className="dev-card-bio">{dev.bio}</p>

                <div className="dev-card-skills">
                  <span className="dev-card-sublabel">Core Focus</span>
                  <div className="dev-card-chips">
                    {["React Native", "TypeScript", "Next.js", "AI & Automation", "APIs"].map((c) => (
                      <span key={c} className="dev-chip">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="dev-card-stack">
                  <span className="dev-card-sublabel">Tech Stack</span>
                  <div className="stk" style={{ marginTop: 6 }}>
                    {dev.stack.slice(0, 6).map((s) => (
                      <Dev key={s} n={s} />
                    ))}
                  </div>
                </div>

                <div className="dev-card-actions">
                  <Link href={`/developers/${dev.slug}`} className="btn ink" style={{ flex: 1, justifyContent: "center" }}>
                    View Full Profile & GitHub →
                  </Link>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn paper"
                    aria-label={`${dev.name} LinkedIn`}
                    style={{ padding: "0 12px" }}
                  >
                    <Ico n="linkedin" />
                  </a>
                </div>
              </div>
            </article>
          ))}

          {/* Collaborator / Network Card */}
          <article className="dev-card dev-card--collab">
            <div className="dev-card-media">
              <div className="dev-card-img-wrap">
                <img
                  src="/dev-collaborator.svg"
                  alt="Specialist Network"
                  className="dev-card-img"
                  width={400}
                  height={400}
                  loading="lazy"
                />
                <div className="dev-status-badge dev-status-badge--collab">
                  <span className="dev-status-dot dev-status-dot--purple" />
                  <span>By Invitation</span>
                </div>
              </div>
            </div>

            <div className="dev-card-content">
              <div className="dev-card-header">
                <div>
                  <h2 className="dev-card-name">Specialist Collaborators</h2>
                  <p className="dev-card-role">Designers, QA Engineers & Cloud Architects</p>
                </div>
              </div>

              <p className="dev-card-bio">
                When a project requires specialised expertise — such as bespoke UI/UX motion design, security penetration testing, or cloud infrastructure tuning — vetted specialists join with your explicit approval.
              </p>

              <div className="dev-card-skills">
                <span className="dev-card-sublabel">Disciplines</span>
                <div className="dev-card-chips">
                  <span className="dev-chip">Figma & UI/UX</span>
                  <span className="dev-chip">Playwright & QA</span>
                  <span className="dev-chip">DevOps & Cloud</span>
                  <span className="dev-chip">Security Audit</span>
                </div>
              </div>

              <div className="dev-card-actions" style={{ marginTop: "auto" }}>
                <Link href="/contact" className="btn paper" style={{ width: "100%", justifyContent: "center" }}>
                  Join our collaborator roster →
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* GitHub Activity Teaser */}
      <section className="wrap" style={{ paddingTop: 72, paddingBottom: 0 }}>
        <h2>Engineering in the open</h2>
        <p style={{ textAlign: "center", color: "var(--mute)", maxWidth: "54ch", margin: "12px auto 28px", fontSize: 14 }}>
          Consistent, verified work delivered with transparent commits, traceable branch histories, and continuous integration.
        </p>
        <div className="dev-graph-wrap">
          <GithubGraph username="dhidroid" label="DhineshKumar's GitHub contribution history" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 16, fontSize: 13, color: "var(--mute)" }}>
            <span>Active repositories: <strong>dhidroid</strong></span>
            <Link href="/developers/dhineshkumar" style={{ color: "#2f8fe8", fontWeight: 500 }}>
              View full profile details & stats →
            </Link>
          </div>
        </div>
      </section>

      {/* Studio Working Principles */}
      <section className="wrap" style={{ paddingTop: 72, paddingBottom: 0 }}>
        <h2>How we work together</h2>
        <div className="cards" style={{ marginTop: 36 }}>
          <div className="c">
            <span className="ic"><Ico n="user" /></span>
            <h3>One direct technical lead</h3>
            <p>You speak directly with the developer writing your software. No project manager intermediaries translating messages back and forth.</p>
          </div>
          <div className="c">
            <span className="ic"><Ico n="shield" /></span>
            <h3>Clean handover & ownership</h3>
            <p>Every repository is organized so any skilled developer can run, test, and build it within ten minutes of cloning.</p>
          </div>
          <div className="c">
            <span className="ic"><Ico n="rocket" /></span>
            <h3>Fast, iterative progress</h3>
            <p>Frequent preview links, automated test runs, and clear weekly milestones keep you confident in what is being shipped.</p>
          </div>
        </div>
      </section>

      <Cta h="Ready to discuss your project?" p="Tell us what you're trying to solve. We'll suggest a sensible first release and roadmap." />
    </main>
  );
}
