import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { DevIcon } from "@/components/ui/dev-icon";
import type { DeveloperConfig, GitHubProfile } from "@/lib/developers";

export type DeveloperDirectoryEntry = {
  config: DeveloperConfig;
  profile: GitHubProfile | null;
};

export function DeveloperDirectory({ developers }: { developers: DeveloperDirectoryEntry[] }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="developers-page">
        <header className="developers-hero">
          <div className="container developers-hero__inner">
            <p className="section-label">People behind the practice</p>
            <h1>Meet our developers.</h1>
            <p>
              Curious people, useful projects, and the ideas we’re learning from along the way.
            </p>
            <span className="developers-hero__index">A small team · Open by nature</span>
          </div>
        </header>

        <section className="container developers-directory" aria-labelledby="developers-list-title">
          <div className="developers-section-heading">
            <div>
              <p className="section-label">The people</p>
              <h2 id="developers-list-title">Good work starts with good questions.</h2>
            </div>
            <p>Profiles, projects, and writing gathered from the places we share our work.</p>
          </div>

          {developers.length ? (
            <div className="developer-card-grid">
              {developers.map(({ config, profile }) => {
                const name = profile?.name?.trim() || config.githubUsername;
                return (
                  <article className="developer-card" key={config.slug}>
                    <Link
                      className="developer-card__avatar-link"
                      href={`/developers/${config.slug}`}
                      aria-label={`View ${name}'s profile`}
                    >
                      {profile?.avatar_url ? (
                        <Image
                          className="developer-avatar"
                          src={profile.avatar_url}
                          alt={`${name} profile photo`}
                          fill
                          sizes="(max-width: 760px) 42vw, (max-width: 1100px) 25vw, 20vw"
                        />
                      ) : (
                        <span className="developer-avatar developer-avatar--fallback" aria-hidden="true">
                          {name.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </Link>
                    <div className="developer-card__main">
                      <p className="section-label">Developer · @{config.githubUsername}</p>
                      <h3><Link href={`/developers/${config.slug}`}>{name}</Link></h3>
                      <p className="developer-card__bio">{profile?.bio || config.bio}</p>
                      <div className="developer-card__stats">
                        {profile && <span><DevIcon name="git" size={14} decorative /> {profile.public_repos} public repos</span>}
                        {profile && <span><Users size={14} /> {profile.followers} followers</span>}
                      </div>
                    </div>
                    <Link className="developer-card__open text-link" href={`/developers/${config.slug}`}>
                      View profile <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="developer-empty">Developer profiles will appear here soon.</p>
          )}
        </section>

        <section className="developers-invite">
          <div className="container developers-invite__inner">
            <div>
              <p className="section-label">Build in the open</p>
              <h2>Interested in working together?</h2>
            </div>
            <Link href="/contact" className="button button-dark">
              Start a conversation <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
