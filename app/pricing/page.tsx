import type { Metadata } from "next";
import Link from "next/link";
import { Ico } from "../icons";

export const metadata: Metadata = {
  title: "Pricing | Dhidroid Labs",
  description: "Transparent pricing for web, mobile and AI product engineering. Fixed-scope, time-and-materials and retainer engagements based in India.",
};

const plans = [
  {
    name: "Discovery",
    price: "₹25,000",
    unit: "one-time",
    tag: "Best to start",
    desc: "A focused workshop to define the problem, users, scope and a realistic plan before any build begins.",
    features: [
      "1–2 day structured workshop",
      "Problem and user definition",
      "Scope and milestone plan",
      "Technology recommendation",
      "Written discovery report",
    ],
    cta: "Book discovery",
    href: "/contact",
    highlight: false,
  },
  {
    name: "MVP Build",
    price: "₹1,50,000",
    unit: "starting from",
    tag: "Most popular",
    desc: "A focused first release designed to test your most important assumptions — no unnecessary features.",
    features: [
      "Full-stack web or mobile app",
      "Written scope and milestones",
      "Iterative, demo-able builds",
      "Automated checks on every change",
      "Deployment and documentation",
      "30-day post-launch support",
    ],
    cta: "Start a project",
    href: "/contact",
    highlight: true,
  },
  {
    name: "Growth Retainer",
    price: "₹60,000",
    unit: "per month",
    tag: "",
    desc: "Ongoing product engineering — new features, fixes, reviews and improvements on a regular cadence.",
    features: [
      "Agreed monthly scope",
      "Priority response",
      "Code reviews and architecture input",
      "AI and automation pilots",
      "Monthly progress reports",
    ],
    cta: "Discuss retainer",
    href: "/contact",
    highlight: false,
  },
];

const addons = [
  ["code", "Technical audit", "A written review of your existing codebase, architecture or tech stack.", "₹20,000"],
  ["mobile", "Mobile app", "React Native Android + iOS from your existing web product.", "₹80,000+"],
  ["gears", "AI integration", "Knowledge assistant, document workflow or process automation pilot.", "₹50,000+"],
  ["pen", "Design handoff", "Figma designs converted to production-ready, accessible components.", "₹30,000+"],
];

const faqs: [string, string][] = [
  ["Are these prices fixed?", "Discovery and MVP prices are fixed-scope. The final number for a build is confirmed after the discovery session so there are no surprises mid-project."],
  ["Do you charge GST?", "GST is applicable as per Indian tax regulations and will be listed separately on the invoice."],
  ["What payment terms do you use?", "Typically 50% upfront and 50% on delivery for fixed-scope work. Retainers are billed monthly in advance."],
  ["Can I start without a discovery session?", "Yes, if the scope is already clear and well-documented. We will confirm whether discovery is needed after a brief conversation."],
  ["Do you offer equity or deferred payment?", "Not currently. All engagements require a confirmed written agreement before work starts."],
  ["What if the scope changes mid-project?", "Changes are quoted separately and agreed in writing before additional work begins."],
];

export default function Pricing() {
  return (
    <main className="sub">
      <header className="sh">
        <h1>Transparent pricing for real projects.</h1>
        <p>Every engagement starts with clarity on scope, timeline and cost. No retainers locked in before we understand your problem.</p>
        <a
          href="/docs/Dhidroid Labs Theme and Implementation Playbook.docx"
          download
          className="btn ink"
          style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Playbook
        </a>
      </header>

      {/* Pricing cards */}
      <div className="pr-grid">
        {plans.map((p) => (
          <div key={p.name} className={`pr-card${p.highlight ? " pr-card--hi" : ""}`}>
            <div className="pr-badge-row">{p.tag && <span className="pr-tag">{p.tag}</span>}</div>
            <h2 className="pr-name">{p.name}</h2>
            <div className="pr-price">
              <span className="pr-amt">{p.price}</span>
              <span className="pr-unit">{p.unit}</span>
            </div>
            <p className="pr-desc">{p.desc}</p>
            <ul className="pr-features">
              {p.features.map((f) => (
                <li key={f}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href={p.href} className={`btn ${p.highlight ? "ink" : "paper"} pr-cta`}>{p.cta}</Link>
          </div>
        ))}
      </div>

      <p className="note" style={{ marginTop: 20 }}>All prices in Indian Rupees (₹) and exclude GST. Final scope confirmed after discovery.</p>

      {/* Add-ons */}
      <section className="wrap" style={{ paddingTop: 72, paddingBottom: 0 }}>
        <h2>Add-ons and standalone work</h2>
        <div className="cards" style={{ marginTop: 40 }}>
          {addons.map(([icon, title, body, price]) => (
            <div key={title} className="c">
              <span className="ic"><Ico n={icon} /></span>
              <span className="tag">{price}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Playbook CTA */}
      <section className="pr-playbook">
        <div className="pr-playbook-in">
          <div>
            <h2 style={{ textAlign: "left", color: "var(--ink)", fontSize: "clamp(20px,2.4vw,28px)" }}>Dhidroid Labs Playbook</h2>
            <p>Our theme and implementation guide — covering process, tech decisions, component patterns and delivery standards.</p>
          </div>
          <a
            href="/docs/Dhidroid Labs Theme and Implementation Playbook.docx"
            download
            className="btn ink"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0, height: 46, fontSize: 15 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Playbook (.docx)
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap" style={{ paddingTop: 72 }}>
        <h2>Pricing questions</h2>
        <div className="cnt-qs" style={{ margin: "32px auto 0", maxWidth: "72ch" }}>
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <div className="wrap">
        <div className="band">
          <div>
            <h3>Not sure which plan fits?</h3>
            <p>Describe your project and we'll recommend the right starting point, honestly.</p>
          </div>
          <Link className="btn ink" href="/contact">Talk to us</Link>
        </div>
      </div>
    </main>
  );
}
