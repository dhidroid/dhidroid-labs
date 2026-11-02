import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

type EditorialPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  asideLabel: string;
  asideText: string;
  asideHref: string;
  asideLinkLabel: string;
  children: ReactNode;
};

export function EditorialPage({
  eyebrow,
  title,
  description,
  asideLabel,
  asideText,
  asideHref,
  asideLinkLabel,
  children,
}: EditorialPageProps) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="editorial-page">
        <header className="editorial-hero">
          <div className="container editorial-hero-grid">
            <div>
              <p className="section-label">{eyebrow}</p>
              <h1>{title}</h1>
            </div>
            <div className="editorial-deck">
              <span className="editorial-spark" aria-hidden="true">
                ✳
              </span>
              <p>{description}</p>
            </div>
          </div>
        </header>

        <div className="container editorial-body">
          <aside className="editorial-aside">
            <p className="section-label">{asideLabel}</p>
            <p>{asideText}</p>
            <Link className="text-link" href={asideHref}>
              {asideLinkLabel} <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </aside>
          <article className="editorial-prose">{children}</article>
        </div>

        <section className="editorial-outro">
          <div className="container editorial-outro-inner">
            <div>
              <p className="section-label">Pull up a chair</p>
              <h2>
                Have a question
                <br />
                you’re sitting with?
              </h2>
            </div>
            <Link className="button button-dark" href="/contact">
              Start a conversation <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
