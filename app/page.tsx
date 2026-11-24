import Link from "next/link";
import { Dev } from "./dev";
import { Ico } from "./icons";
import { Radial, Track, type TreeNode } from "./charts";
import { pipeline } from "./data";
import { HeroArt } from "./heroart";
import { TechMarquee, Clients, Reviews } from "./social";

const leaf = (...n: string[]) => n.map((name) => ({ name }));
const tree: TreeNode = { name: "Dhidroid Labs", children: [
  { name: "Web apps", children: leaf("React", "TypeScript", "Next.js") },
  { name: "Mobile apps", children: leaf("React Native", "TypeScript") },
  { name: "AI and automation", children: leaf("Python", "FastAPI", "RAG") },
  { name: "MVP and discovery", children: leaf("Prototype", "Milestone plan") },
  { name: "Backend and APIs", children: leaf("API contracts", "PostgreSQL") },
  { name: "Cloud and DevOps", children: leaf("Deployment", "Monitoring") },
  { name: "Modernization", children: leaf("Technical review", "Backlog") },
] };

const build = [
  ["code", "Web applications", "From customer portals and dashboards to full-stack SaaS products."],
  ["mobile", "Mobile applications", "React Native experiences for Android and iOS, from prototype to release."],
  ["gears", "AI and workflow automation", "Knowledge assistants, document workflows and connected business processes."],
  ["rocket", "Product MVPs", "A focused first release designed to test your most important assumptions."],
];
const values = [
  ["Start with clarity.", "Understand the workflow before designing the solution."],
  ["Build with intention.", "Choose architecture that fits the real scope."],
  ["Make progress visible.", "Share milestones, demos and decisions."],
  ["Leave room to grow.", "Document key choices and plan sustainable ownership."],
];
const steps = [
  ["Discover", "Understand the problem, users, constraints and success."],
  ["Define", "Agree on a realistic scope, approach and milestones."],
  ["Build", "Deliver iterative, reviewable software with testing."],
  ["Improve", "Validate, refine and hand over what comes next."],
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <HeroArt />
        <div className="hero-in">
          <small className="eb">Independent product engineering studio</small>
          <h1>Build something useful.<br /><span>Build it well.</span></h1>
          <p>A promising idea needs more than code. Dhidroid Labs helps founders and teams plan, build and improve web platforms, mobile apps and AI-powered tools that solve real problems.</p>
          <div className="row">
            <Link className="btn ink" href="/contact">Start a project</Link>
            <Link className="btn line" href="/projects">Explore our work</Link>
          </div>
        </div>
        <ul className="chips" aria-hidden="true">
          <li><b /> Product engineering</li><li><b /> Mobile experiences</li><li className="run"><b /> Applied AI and automation</li>
        </ul>
      </section>

      <section className="trust">
        <TechMarquee />
        <p>Founder-led. Built around clear communication, practical scope and responsible engineering. Capabilities and timelines are confirmed per engagement.</p>
      </section>

      <section className="wrap" id="hub">
        <div className="hub-eyebrow">
          <span className="hub-pill">How we think</span>
        </div>
        <h2 className="hub-h">
          The right product starts<br />with the right question.
        </h2>
        <p className="hub-sub">
          Before deciding <em>what</em> to build, we ask <strong>who it's for</strong> and <strong>what they're actually trying to get done</strong>. The answers shape the scope, the technology and the first release.
        </p>
        <div className="hub-qs">
          {[
            ["Who is using this?", "Name a real person, not a market segment. The specific user determines every design decision."],
            ["What are they doing today?", "The existing workaround — a spreadsheet, a WhatsApp group, a manual process — shows what your product has to beat."],
            ["What's the one thing it must do?", "If you can't describe the core value in a sentence, the scope is too wide for a first release."],
            ["How will you know it worked?", "Choose a measurable signal before building. Not 'people like it' — something you can observe."],
          ].map(([q, a]) => (
            <div key={q} className="hub-q">
              <span className="hub-q-dot" />
              <div>
                <strong>{q}</strong>
                <p>{a}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="stage one">
          <div className="chart scroll"><Radial data={tree} label="Services offered by Dhidroid Labs and the tools or deliverables behind each" /></div>
        </div>
        <p className="cap">Seven services — and the tools or deliverables behind each.</p>
        <div className="three four">{values.map(([a, b]) => <p key={a}><strong>{a}</strong>{b}</p>)}</div>
      </section>

      <section className="wrap" id="services">
        <h2>What we can help you build</h2>
        <div className="cards">
          {build.map(([i, t, b]) => <Link key={t} href="/services" className="c"><span className="ic"><Ico n={i} /></span><h3>{t}</h3><p>{b}</p></Link>)}
        </div>
      </section>

      <section className="wrap" id="work">
        <h2>Selected experiments and engineering work<br /><span>each labelled by status and ownership</span></h2>
        <div className="cards">
          {[["Expense Tracker", "Offline-first mobile experience.", "react"], ["Talent Matching Explorer", "Structured AI assessment concept.", "python"], ["Knowledge Assistant", "Retrieval-focused question answering.", "python"]].map(([t, b, d]) => (
            <Link key={t} href="/projects" className="c"><h3>{t}</h3><p>{b} Independent prototype.</p><div className="stk"><Dev n={d} /></div></Link>
          ))}
        </div>
      </section>

      <section className="wrap" id="engineering">
        <h2>Engineering that holds up as the product grows<br /><span>checks on every change, tests in layers</span></h2>
        <div className="stage one"><div className="chart scroll"><Track items={pipeline} label="Delivery pipeline: pull request, static checks, tests, build, preview, release" /></div></div>
        <p className="cap">A reference delivery pipeline, adapted to each project.</p>
        <div className="row" style={{ justifyContent: "center" }}><Link className="btn ink" href="/engineering">See the engineering practice</Link></div>
      </section>

      <section className="wrap" id="process">
        <h2>A simple way to work together</h2>
        <ol className="steps">{steps.map(([t, d], i) => <li key={t}><em>{i + 1}</em><h3>{t}</h3><p>{d}</p></li>)}</ol>
      </section>

      <Clients />

      <Reviews />

      <section className="sky">
        <h2>Your idea doesn’t need<br /><span>a perfect brief.</span></h2>
        <p>Tell us what you’re trying to solve. We’ll help identify the next useful step, whether that’s a discovery conversation, a small prototype or a product review.</p>
        <div className="row" style={{ justifyContent: "center" }}>
          <Link className="btn paper" href="/contact">Discuss a project</Link>
          <Link className="btn glass" href="/faq">Ask a technical question</Link>
        </div>
      </section>
    </main>
  );
}
