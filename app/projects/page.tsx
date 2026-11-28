import Link from "next/link";
import { getProjects } from "../../lib/published-content";
import { pageMetadata } from "../../lib/seo";
import { Ico } from "../icons";
import { ProjectStack } from "../project-stack";
import { Cta } from "../cta";

export function generateMetadata() {
  return pageMetadata("/projects", {
    title: "Projects | Dhidroid Labs",
    description: "Selected software projects, independent prototypes and experiments by Dhidroid Labs.",
  });
}

export default async function Projects() {
  const projects = await getProjects();
  return (
    <main className="sub">
      <header className="sh">
        <h1>Projects and experiments.</h1>
        <p>Explore selected work and independent prototypes. Each project describes the problem and what was built or explored.</p>
      </header>
      <div className="cards">
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="c">
            <span className="ic"><Ico n={p.icon ?? "layers"} /></span>
            <small className="tag">{p.type}</small>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            <ProjectStack technologies={p.stack} />
          </Link>
        ))}
      </div>
      <Cta />
    </main>
  );
}
