import Link from "next/link";
import { Ico } from "./icons";
import { Track } from "./charts";
import { pipeline } from "./data";
import { HeroArt } from "./heroart";
import { TechMarquee, Clients, Reviews, getSocialContent } from "./social";
import { getProjects } from "../lib/published-content";
import { pageMetadata } from "../lib/seo";
import { ProjectStack } from "./project-stack";

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

export function generateMetadata() {
  return pageMetadata("/", {
    title: "Dhidroid Labs | Web, Mobile & AI Product Engineering",
    description: "Dhidroid Labs builds thoughtful web apps, React Native mobile products and practical AI automation for founders and growing businesses.",
  });
}

export default async function Home() {
  const [projects, social] = await Promise.all([getProjects(), getSocialContent()]);
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

      <section className="wrap" id="hub" aria-labelledby="work">
        <h2 id="work">Inside the Dhidroid Labs</h2>
        <p className="portfolio-intro">
          Dhidroid Labs is a founder-led, one-person studio. Explore selected work and prototypes
          across mobile apps, web platforms and everyday business workflows.
        </p>
        <div className="cards portfolio-projects">
          {projects.slice(0, 5).map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="c">
              <div className="portfolio-card-header" aria-hidden="true">
                <span className="ic"><Ico n={project.icon ?? "hammer"} /></span>
                <span className="portfolio-card-arrow">
                  <Ico n="arrow-right" />
                </span>
              </div>
              <div>
                <small className="tag">{project.type}</small>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <ProjectStack technologies={project.stack} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" id="services">
        <h2>What we can help you build</h2>
        <div className="cards">
          {build.map(([i, t, b]) => <Link key={t} href="/services" className="c"><span className="ic"><Ico n={i} /></span><h3>{t}</h3><p>{b}</p></Link>)}
        </div>
        <div className="three four" style={{ marginTop: 48 }}>{values.map(([a, b]) => <p key={a}><strong>{a}</strong>{b}</p>)}</div>
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

      <Clients entries={social.clients} />

      <Reviews entries={social.reviews} />

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
