import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  GitFork,
  Globe2,
  MapPin,
  Rss,
  Star,
  Users,
} from "lucide-react";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import ContributionSkyline from "@/components/ui/contribution-skyline";
import { DevIcon, type DevIconName } from "@/components/ui/dev-icon";
import { SocialIcon } from "@/components/ui/social-icon";
import type { BlogPostMeta } from "@/lib/blog";
import type {
  ContributionDay,
  DeveloperConfig,
  GitHubProfile,
  GitHubRepository,
  MediumArticle,
} from "@/lib/developers";

type DeveloperDetailProps = {
  config: DeveloperConfig;
  profile: GitHubProfile | null;
  repositories: GitHubRepository[];
  contributions: { days: ContributionDay[]; total: number } | null;
  mediumArticles: MediumArticle[];
  journalPosts: BlogPostMeta[];
};

const projectThumbnails = [
  "/images/workshop.jpg",
  "/images/journal-landscape.jpg",
  "/images/hero-landscape.jpg",
] as const;

const languageIcons: Partial<Record<string, DevIconName>> = {
  TypeScript: "typescript",
  JavaScript: "javascript",
  React: "react",
  "Next.js": "nextjs",
  "Node.js": "nodejs",
  Python: "python",
  PostgreSQL: "postgresql",
  Dockerfile: "docker",
  HTML: "html5",
  CSS: "css3",
  Java: "java",
  Go: "go",
  Rust: "rust",
  PHP: "php",
  Ruby: "ruby",
};

function languageIcon(language: string | null) {
  return language ? languageIcons[language] : undefined;
}

function externalUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function formattedDate(value: string | null) {
  if (!value) return "Recently";
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function DeveloperDetail({
  config,
  profile,
  repositories,
  contributions,
  mediumArticles,
  journalPosts,
}: DeveloperDetailProps) {
  const login = profile?.login || config.githubUsername;
  const name = profile?.name?.trim() || login;
  const bio = profile?.bio?.trim() || config.bio;
  const reposUrl = `https://github.com/${encodeURIComponent(login)}?tab=repositories`;
  const mediumUsername = config.socialProfiles.mediumUsername;
  const mediumUrl = mediumUsername
    ? `https://medium.com/@${encodeURIComponent(mediumUsername)}`
    : null;
  const twitterUrl =
    config.socialProfiles.twitterUrl ??
    (profile?.twitter_username
      ? `https://x.com/${encodeURIComponent(profile.twitter_username)}`
      : null);
  const websiteUrl = profile?.blog?.trim() ? externalUrl(profile.blog.trim()) : null;

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="developers-page developer-profile-page">
        <header className="developer-profile-hero">
          <div className="container">
            <Link className="developer-back-link" href="/developers">
              <ArrowLeft size={15} aria-hidden="true" /> All developers
            </Link>
            <div className="developer-profile-layout">
              <div className="developer-profile-photo">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={`${name} profile photo`}
                    fill
                    sizes="(max-width: 760px) 100vw, 50vw"
                    preload
                  />
                ) : (
                  <span className="developer-profile-photo__fallback" aria-hidden="true">
                    {name.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="developer-profile-copy">
                <p className="section-label">Developer profile · @{login}</p>
                <h1>{name}</h1>
                <p>{bio}</p>
                {profile?.location && (
                  <span className="developer-location"><MapPin size={14} /> {profile.location}</span>
                )}
                <div className="developer-social-links" aria-label={`${name} social profiles`}>
                  <a href={`https://github.com/${encodeURIComponent(login)}`} target="_blank" rel="noopener noreferrer">
                    <SocialIcon name="github" size={16} /> GitHub <ExternalLink size={12} aria-hidden="true" />
                  </a>
                  {websiteUrl && (
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Globe2 size={16} aria-hidden="true" /> Website <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                  {twitterUrl && (
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name="x" size={16} />
                      X / Twitter <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                  {config.socialProfiles.linkedinUrl && (
                    <a href={config.socialProfiles.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name="linkedin" size={16} />
                      LinkedIn <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                  {config.socialProfiles.instagramUrl && (
                    <a href={config.socialProfiles.instagramUrl} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name="instagram" size={16} />
                      Instagram <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                  {config.socialProfiles.stackOverflowUrl && (
                    <a href={config.socialProfiles.stackOverflowUrl} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name="stackoverflow" size={16} /> Stack Overflow <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                  {mediumUrl && (
                    <a href={mediumUrl} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name="medium" size={16} /> Medium <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                </div>
                {profile && (
                  <div className="developer-profile-stats">
                    <span><DevIcon name="git" size={15} decorative /> {profile.public_repos} public repositories</span>
                    <span><Users size={15} /> {profile.followers} followers</span>
                    <span><Users size={15} /> {profile.following} following</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="container developer-profile-content">
          <section className="developer-section developer-projects" aria-labelledby="developer-projects-title">
            <div className="developer-section-heading">
              <div>
                <p className="section-label">On GitHub</p>
                <h2 id="developer-projects-title">Projects and experiments.</h2>
              </div>
              <a href={reposUrl} target="_blank" rel="noreferrer" className="text-link">
                All repositories <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            {repositories.length ? (
              <div className="developer-repo-grid">
                {repositories.map((repository, index) => {
                  const icon = languageIcon(repository.language);
                  return (
                    <article className="developer-repo-card" key={repository.id}>
                      <div className="developer-repo-card__thumbnail" aria-hidden="true">
                        <Image
                          src={projectThumbnails[index % projectThumbnails.length]}
                          alt=""
                          fill
                          sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        />
                        <span className="developer-repo-card__thumbnail-label">Project · {String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <div className="developer-repo-card__body">
                        <div className="developer-repo-card__top">
                          {icon ? <DevIcon name={icon} size={18} decorative /> : <DevIcon name="git" size={18} decorative />}
                          <a href={repository.html_url} target="_blank" rel="noreferrer" aria-label={`Open ${repository.name} on GitHub`}>
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </a>
                        </div>
                        <h3><a href={repository.html_url} target="_blank" rel="noreferrer">{repository.name}</a></h3>
                        <p>{repository.description || "An open-source project shared on GitHub."}</p>
                        <div className="developer-repo-card__meta">
                          {repository.language && (
                            <span className="developer-repo-language">
                              {icon ? <DevIcon name={icon} size={14} decorative /> : <i className="language-dot" />}
                              {repository.language}
                            </span>
                          )}
                          <span><Star size={13} /> {repository.stargazers_count}</span>
                          <span><GitFork size={13} /> {repository.forks_count}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="developer-empty-state">
                <p>Public repositories couldn’t be loaded right now.</p>
                <a href={reposUrl} target="_blank" rel="noreferrer" className="text-link">Browse GitHub <ArrowUpRight size={14} /></a>
              </div>
            )}
          </section>

          <section className="developer-section developer-activity" aria-labelledby="developer-activity-title">
            <div className="developer-section-heading">
              <div>
                <p className="section-label">A year on the workbench</p>
                <h2 id="developer-activity-title">Contribution calendar.</h2>
              </div>
              <a href={`https://github.com/${encodeURIComponent(login)}`} target="_blank" rel="noreferrer" className="text-link">
                View GitHub profile <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            {contributions ? (
              <ContributionSkyline
                data={contributions.days}
                title={<><strong>{new Intl.NumberFormat("en").format(contributions.total)}</strong> GitHub contributions in the last year</>}
                unit="contribution"
                unitPlural="contributions"
                defaultView="2d"
                footer="Public contribution history from GitHub · Focus a day for details"
              />
            ) : (
              <div className="developer-activity-setup">
                <p className="section-label">Calendar connection</p>
                <h3>Connect GitHub GraphQL to show the real activity calendar.</h3>
                <p>
                  Add a server-side <code>GITHUB_TOKEN</code> to <code>.env.local</code>. The profile and public repositories still load without it.
                </p>
              </div>
            )}
          </section>

          <section className="developer-section developer-writing" aria-labelledby="developer-writing-title">
            <div className="developer-section-heading">
              <div>
                <p className="section-label">Notes and reading</p>
                <h2 id="developer-writing-title">Writing from the work.</h2>
              </div>
            </div>

            {mediumUrl ? (
              <div className="developer-feed-block">
                <div className="developer-feed-heading">
                  <div><Rss size={16} aria-hidden="true" /><h3>Medium · RSS feed</h3></div>
                  <a href={mediumUrl} target="_blank" rel="noreferrer" className="text-link">
                    Follow on Medium <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
                {mediumArticles.length ? (
                  <div className="developer-writing-grid">
                    {mediumArticles.map((article) => (
                      <article className="developer-writing-card" key={article.link}>
                        <p className="section-label">Medium · {formattedDate(article.date)}</p>
                        <h4><a href={article.link} target="_blank" rel="noreferrer">{article.title}</a></h4>
                        {article.excerpt && <p>{article.excerpt}</p>}
                        <a href={article.link} target="_blank" rel="noreferrer" className="text-link">Read on Medium <ArrowUpRight size={14} /></a>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="developer-feed-empty">The Medium feed is connected, but no recent stories are available.</p>
                )}
              </div>
            ) : (
              <div className="developer-feed-connect">
                <Rss size={17} aria-hidden="true" />
                <p><strong>Medium RSS is ready to connect.</strong> Add this developer’s Medium handle to <code>socialProfiles.mediumUsername</code> in <code>data/developers.json</code>.</p>
              </div>
            )}

            <div className="developer-feed-block developer-feed-block--journal">
              <div className="developer-feed-heading">
                <div><BookOpen size={16} aria-hidden="true" /><h3>Dhidroid Journal</h3></div>
                <Link href="/journal" className="text-link">All notes <ArrowUpRight size={14} aria-hidden="true" /></Link>
              </div>
              {journalPosts.length ? (
                <div className="developer-writing-grid">
                  {journalPosts.slice(0, 3).map((post) => (
                    <article className="developer-writing-card" key={post.slug}>
                      <p className="section-label">{post.category} · {formattedDate(post.date)}</p>
                      <h4><Link href={`/blog/${post.slug}`}>{post.title}</Link></h4>
                      <p>{post.description}</p>
                      <Link href={`/blog/${post.slug}`} className="text-link">Read the note <ArrowUpRight size={14} aria-hidden="true" /></Link>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="developer-feed-empty">New journal notes are on the way.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
