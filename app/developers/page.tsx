import Link from "next/link";
import { pageMetadata } from "../../lib/seo";
import { developers } from "./data";
import { Ico } from "../icons";
import { Cta } from "../cta";
import styles from "./developers.module.css";

export function generateMetadata() {
  return pageMetadata("/developers", {
    title: "Developers | Dhidroid Labs",
    description: "Meet the founder and engineering lead at Dhidroid Labs, an independent software studio.",
  });
}

const workingPrinciples = [
  ["user", "Direct access to your engineer", "Discuss scope, trade-offs and feedback with the person building the product."],
  ["rocket", "Review work as it ships", "Use working previews and agreed milestones to review progress and adjust priorities."],
  ["shield", "Own the handover", "Get the repository, setup instructions and deployment notes so your team can take over."],
];

export default function DevelopersPage() {
  return (
    <main className={`sub ${styles.page}`}>
      <header className="sh">
        <h1>Meet the engineer behind <i>Dhidroid Labs.</i></h1>
        <p>You work directly with the founder, from the first technical decision through delivery.</p>
      </header>

      <div className={styles.directory}>
        {developers.map((dev) => (
          <article className={styles.profile} key={dev.slug}>
            <div className={styles.portrait}>
              <img src={dev.image} alt="" width={400} height={400} />
            </div>
            <div className={styles.profileBody}>
              <p className={styles.eyebrow}>{dev.title}</p>
              <h2 className={styles.name}>{dev.name}</h2>
              <p>{dev.tagline}</p>
              <ul className={styles.metadata}>
                <li><Ico n="pin" /> {dev.location}</li>
                <li><Ico n="calendar" /> {dev.experienceYears} experience</li>
              </ul>
              <div className={styles.actions}>
                <Link href={`/developers/${dev.slug}`} className="btn ink">View developer profile <span aria-hidden="true">→</span></Link>
                <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="btn line">
                  <Ico n="linkedin" /> LinkedIn
                </a>
              </div>
            </div>
          </article>
        ))}

        <section className={styles.collaborators}>
          <div>
            <h2>Specialist collaborators</h2>
            <p>Independent specialists can join with your approval when a project needs design, QA, cloud or security expertise.</p>
          </div>
          <Link href="/contact" className="btn line">Discuss collaborating <span aria-hidden="true">→</span></Link>
        </section>
      </div>

      <section className={styles.section}>
        <h2>How we work together</h2>
        <div className={styles.cards}>
          {workingPrinciples.map(([icon, title, description]) => (
            <article className="c" key={title}>
              <span className="ic"><Ico n={icon} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <Cta h="Have a project in mind?" p="Tell us what you want to build or improve." />
    </main>
  );
}
