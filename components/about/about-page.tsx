import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import AboutContent, { aboutPageData } from "@/content/pages/about.mdx";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import Map from "@/components/ui/map";

export function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="about-page">
        <section className="container about-bento" aria-label="About Dhidroid Labs">
          <article className="about-bento__card about-bento__intro">
            <p className="section-label">{aboutPageData.hero.eyebrow}</p>
            <h1>{aboutPageData.hero.title}</h1>
            <p>{aboutPageData.hero.summary}</p>
            <div className="about-bento__actions">
              {aboutPageData.hero.links.map((link) => (
                <Link className="text-link" href={link.href} key={link.href}>
                  {link.label} <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </article>

          <article className="about-bento__card about-bento__map">
            <div className="about-bento__map-visual">
              <Map
                background={aboutPageData.map.background}
                markers={aboutPageData.map.markers}
              />
            </div>
            <div className="about-bento__map-caption">
              <p className="section-label">
                <MapPin size={13} aria-hidden="true" /> {aboutPageData.map.label}
              </p>
              <h2>{aboutPageData.map.title}</h2>
              <p>{aboutPageData.map.summary}</p>
            </div>
          </article>

          <article className="about-bento__card about-bento__mission">
            <p className="section-label">{aboutPageData.mission.label}</p>
            <h2>{aboutPageData.mission.title}</h2>
            <p>{aboutPageData.mission.summary}</p>
          </article>

          <article className="about-bento__card about-bento__founder">
            <div className="about-bento__founder-heading">
              <span className="about-bento__founder-mark" aria-hidden="true">
                D
              </span>
              <p className="section-label">{aboutPageData.founder.label}</p>
            </div>
            <h2>{aboutPageData.founder.name}</h2>
            <p>{aboutPageData.founder.summary}</p>
            <a
              className="text-link"
              href={aboutPageData.founder.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {aboutPageData.founder.profileLinkLabel} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </article>

          <article className="about-bento__card about-bento__practice">
            <p className="section-label">{aboutPageData.rhythm.label}</p>
            <ol>
              {aboutPageData.rhythm.steps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span> {step}
                </li>
              ))}
            </ol>
          </article>

          <article className="about-bento__card about-bento__focus">
            <p className="section-label">{aboutPageData.focus.label}</p>
            <h2>{aboutPageData.focus.title}</h2>
            <div className="about-bento__tags" aria-label="Engineering interests">
              {aboutPageData.focus.areas.map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
          </article>
        </section>

        <section className="about-story">
          <div className="container about-story__heading">
            <p className="section-label">{aboutPageData.story.eyebrow}</p>
            <h2>{aboutPageData.story.title}</h2>
          </div>
          <div className="container editorial-body about-story__body">
            <aside className="editorial-aside">
              <p className="section-label">{aboutPageData.story.asideLabel}</p>
              <p>{aboutPageData.story.asideText}</p>
              <Link className="text-link" href={aboutPageData.story.asideHref}>
                {aboutPageData.story.asideLinkLabel} <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </aside>
            <article className="editorial-prose">
              <AboutContent />
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
