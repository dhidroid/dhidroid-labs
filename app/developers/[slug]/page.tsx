import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { developers } from "../data";
import { Dev } from "../../dev";
import { Ico } from "../../icons";
import { Cta } from "../../cta";
import styles from "../developers.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return developers.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dev = developers.find((profile) => profile.slug === slug);
  if (!dev) return {};
  return {
    title: `${dev.name} | Dhidroid Labs`,
    description: dev.bio,
  };
}

export default async function DeveloperDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dev = developers.find((profile) => profile.slug === slug);
  if (!dev) notFound();

  return (
    <main className={`sub ${styles.page}`}>
      <Link href="/developers" className={styles.back}><span aria-hidden="true">←</span> All developers</Link>

      <header className={styles.profile}>
        <div className={styles.portrait}>
          <img src={dev.image} alt="" width={400} height={400} />
        </div>
        <div className={styles.profileBody}>
          <p className={styles.eyebrow}>{dev.title}</p>
          <h1 className={styles.name}>{dev.name}</h1>
          <p>{dev.bio}</p>
          <ul className={styles.metadata}>
            <li><Ico n="pin" /> {dev.location}</li>
            <li><Ico n="calendar" /> {dev.experienceYears} experience</li>
            <li><Ico n="globe" /> Remote worldwide</li>
          </ul>
          <div className={styles.actions}>
            <Link href="/contact" className="btn ink">Discuss a project</Link>
            <a href={`https://github.com/${dev.github}`} className="btn line" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={dev.linkedin} className="btn line" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={dev.portfolio} className="btn line" target="_blank" rel="noopener noreferrer">Personal portfolio</a>
          </div>
        </div>
      </header>

      <nav className={styles.jumpLinks} aria-label="Profile sections">
        <a href="#about">About</a>
        <a href="#expertise">Expertise</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
      </nav>

      <section className={styles.section} id="about">
        <h2>Background and approach</h2>
        <div className={styles.about}>
          <div className={styles.prose}>
            {dev.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <ul className={styles.principles}>
            {dev.philosophy.map(({ title, description }) => (
              <li key={title}>
                <strong>{title}</strong>
                <p>{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section} id="expertise">
        <h2>Technical expertise</h2>
        <div className={styles.cards}>
          {dev.skills.map((skill) => (
            <article key={skill.name} className="c">
              <span className="ic"><Ico n={skill.icon} /></span>
              <h3>{skill.name}</h3>
              <p>{skill.desc}</p>
            </article>
          ))}
        </div>
        <h3 className={styles.stackTitle}>Tools and stack</h3>
        <ul className={styles.stack}>
          {dev.stack.map(({ icon, name }) => (
            <li key={icon}>
              <span aria-hidden="true"><Dev n={icon} /></span>
              {name}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} id="experience">
        <h2>Experience</h2>
        <ol className={styles.timeline}>
          {dev.journey.map((item) => (
            <li key={item.period}>
              <span className={styles.period}>{item.period}</span>
              <div>
                <h3>{item.role}</h3>
                <p className={styles.organization}>{item.org}</p>
                <p>{item.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} id="projects">
        <h2>Selected prototypes</h2>
        <div className={`${styles.cards} ${styles.projects}`}>
          {dev.featuredProjects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="c">
              <div className={styles.projectHeading}>
                <h3>{project.title}</h3>
                <span aria-hidden="true">↗</span>
              </div>
              <p>{project.desc}</p>
              <div className="stk">
                {project.stack.map((technology) => <Dev key={technology} n={technology} />)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Cta h="Have a project in mind?" p="Share what you want to build and where you need engineering help." />
    </main>
  );
}
