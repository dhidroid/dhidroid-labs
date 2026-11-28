import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "../../../lib/published-content";
import { pageMetadata } from "../../../lib/seo";
import { Cta } from "../../cta";
import { CmsBody, CmsImage, MarkdownBody } from "../../cms-body";
import { ProjectStack } from "../../project-stack";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  return pageMetadata(`/projects/${project.slug}`, {
    title: `${project.title} | Dhidroid Labs`, description: project.summary, image: project.image?.url,
  }, project.seo);
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();
  const index = projects.findIndex((entry) => entry.slug === slug);
  const prev = index >= 0 ? projects[index + 1] : undefined;
  const next = projects[index - 1];

  return (
    <main className="sub proj">
      <Link href="/projects" className="back">All projects</Link>
      <header className="sh">
        <small className="tag" style={{ display: "block", marginBottom: 10 }}>{project.type}</small>
        <h1>{project.title}</h1>
        {project.summary && <p>{project.summary}</p>}
      </header>
      <div className="meta">
        <div><span>Type</span>{project.type}</div>
        {project.status && <div><span>Status</span>{project.status}</div>}
        {project.role && <div><span>Role</span>{project.role}</div>}
        {project.year && <div><span>Year</span>{project.year}</div>}
        {!!project.stack.length && (
          <div><span>Stack</span>
            <ProjectStack technologies={project.stack} />
          </div>
        )}
      </div>
      {project.local ? <div className="pb mdx-body"><MarkdownBody value={project.local.content} /></div> : (
        <div className="pb mdx-body">
          <CmsImage image={project.image} eager />
          {typeof project.markdown === "string" && project.markdown
            ? <MarkdownBody value={project.markdown} />
            : project.description && <MarkdownBody value={project.description} />}
          {project.challenge && <section><h2>Challenge</h2><MarkdownBody value={project.challenge} /></section>}
          {!!project.solution?.length && <section><h2>Approach</h2><CmsBody value={project.solution} /></section>}
          {project.results && <section><h2>Results</h2><MarkdownBody value={project.results} /></section>}
          {project.gallery?.map((image, index) => <CmsImage key={`${image.url}-${index}`} image={image} />)}
          <div className="row">
            {project.link && /^https?:\/\//i.test(project.link) && <a href={project.link} className="btn line">Visit project</a>}
            {project.github && /^https?:\/\//i.test(project.github) && <a href={project.github} className="btn line">View source code</a>}
          </div>
        </div>
      )}
      <div className="pn">
        {prev ? <Link href={`/projects/${prev.slug}`}>{prev.title}</Link> : <span />}
        {next ? <Link href={`/projects/${next.slug}`}>{next.title} →</Link> : <span />}
      </div>
      <Cta h="Facing a similar problem?" p="Tell us what you're trying to solve and we'll suggest a practical first step." />
    </main>
  );
}
