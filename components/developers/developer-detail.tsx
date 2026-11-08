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

const socialLinkClassName =
  "inline-flex min-h-[38px] items-center gap-2 border border-[#bfd8d3] bg-[#e8f7f5] px-3 text-[10px] text-[#4c5249] transition-colors hover:border-[#91b8b0] hover:bg-white";

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
  const websiteUrl = profile?.blog?.trim()
    ? externalUrl(profile.blog.trim())
    : null;

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="overflow-hidden bg-paper text-ink">
        <header className="bg-paper pt-[30px] pb-[45px] md:pt-8 md:pb-[62px]">
          <div className="container">
            <Link
              className="mb-[33px] inline-flex items-center gap-[7px] text-[11px] text-[#74796f] transition-colors hover:text-accent md:mb-[25px]"
              href="/developers"
            >
              <ArrowLeft size={15} aria-hidden="true" /> All developers
            </Link>
            <div className="grid min-h-0 grid-cols-1 border border-line min-[761px]:min-h-[clamp(390px,43vw,570px)] min-[761px]:grid-cols-2">
              <div className="relative aspect-[1.5] min-w-0 overflow-hidden bg-[#dfe5d9] min-[761px]:aspect-auto min-[761px]:min-h-[clamp(390px,43vw,570px)]">
                {profile?.avatar_url ? (
                  <Image
                    className="object-cover grayscale"
                    src={profile.avatar_url}
                    alt={`${name} profile photo`}
                    fill
                    sizes="(max-width: 760px) 100vw, 50vw"
                    preload
                  />
                ) : (
                  <span
                    className="absolute inset-0 grid place-items-center bg-[linear-gradient(145deg,#e5eadf,#cbd9c5)] font-display text-[clamp(100px,18vw,220px)] leading-none text-[#5c6854]"
                    aria-hidden="true"
                  >
                    {name.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-col items-center justify-center bg-[#d3eeee] px-[22px] py-8 text-center min-[521px]:px-7 min-[521px]:py-[38px] min-[761px]:p-[clamp(28px,5vw,72px)]">
                <p className="section-label mb-4 text-[9px] tracking-[0.1em] text-[#596d68]">
                  Developer profile · @{login}
                </p>
                <h1 className="max-w-full font-display text-[clamp(45px,9vw,64px)] leading-[0.95] tracking-[-0.05em] text-balance min-[761px]:text-[clamp(48px,6.1vw,82px)]">
                  {name}
                </h1>
                <p className="mt-3 max-w-[460px] text-xs leading-[1.8] text-[#687066] min-[761px]:mt-[18px]">
                  {bio}
                </p>
                {profile?.location && (
                  <span className="mt-[13px] inline-flex items-center gap-1.5 text-[10px] text-[#7c8178]">
                    <MapPin size={14} aria-hidden="true" /> {profile.location}
                  </span>
                )}
                <div className="mt-[25px] flex flex-wrap justify-center gap-[9px] min-[761px]:mt-[26px]" aria-label={`${name} social profiles`}>
                  <a className={socialLinkClassName} href={`https://github.com/${encodeURIComponent(login)}`} target="_blank" rel="noopener noreferrer">
                    <SocialIcon name="github" size={16} /> GitHub <ExternalLink size={12} aria-hidden="true" />
                  </a>
                  {websiteUrl && (
                    <a className={socialLinkClassName} href={websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Globe2 size={16} aria-hidden="true" /> Website <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                  {twitterUrl && (
                    <a className={socialLinkClassName} href={twitterUrl} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name="x" size={16} />
                      X / Twitter <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                  {config.socialProfiles.linkedinUrl && (
                    <a className={socialLinkClassName} href={config.socialProfiles.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name="linkedin" size={16} />
                      LinkedIn <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                  {config.socialProfiles.instagramUrl && (
                    <a className={socialLinkClassName} href={config.socialProfiles.instagramUrl} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name="instagram" size={16} />
                      Instagram <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                  {config.socialProfiles.stackOverflowUrl && (
                    <a className={socialLinkClassName} href={config.socialProfiles.stackOverflowUrl} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name="stackoverflow" size={16} /> Stack Overflow <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                  {mediumUrl && (
                    <a className={socialLinkClassName} href={mediumUrl} target="_blank" rel="noopener noreferrer">
                      <SocialIcon name="medium" size={16} /> Medium <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                </div>
                {profile && (
                  <div className="mt-[22px] flex flex-wrap justify-center gap-x-[19px] gap-y-[11px] text-[10px] text-[#777c73]">
                    <span className="inline-flex items-center gap-1.5"><DevIcon name="git" size={15} decorative /> {profile.public_repos} public repositories</span>
                    <span className="inline-flex items-center gap-1.5"><Users size={15} aria-hidden="true" /> {profile.followers} followers</span>
                    <span className="inline-flex items-center gap-1.5"><Users size={15} aria-hidden="true" /> {profile.following} following</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="container py-[48px] pb-[82px] md:pt-16 md:pb-[120px]">
          <section className="py-5 pb-[54px] md:pt-7 md:pb-[70px]" aria-labelledby="developer-projects-title">
            <div className="mb-8 flex flex-col items-start gap-4 min-[761px]:flex-row min-[761px]:items-end min-[761px]:justify-between">
              <div>
                <p className="section-label mb-[14px] text-[#74796f]">On GitHub</p>
                <h2 id="developer-projects-title" className="font-display text-[clamp(32px,4vw,45px)] leading-[1.04] tracking-[-0.035em] text-balance">Projects and experiments.</h2>
              </div>
              <a href={reposUrl} target="_blank" rel="noreferrer" className="text-link shrink-0 min-[761px]:mb-[5px]">
                All repositories <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            {repositories.length ? (
              <div className="grid grid-cols-1 gap-[15px] min-[641px]:grid-cols-2 min-[901px]:grid-cols-3">
                {repositories.map((repository, index) => {
                  const icon = languageIcon(repository.language);
                  return (
                    <article className="group flex min-h-0 min-w-0 flex-col overflow-hidden border border-line bg-[#fbfaf7] min-[761px]:min-h-[360px]" key={repository.id}>
                      <div className="relative min-h-[170px] overflow-hidden bg-[#dfe5d9] min-[761px]:min-h-[150px]" aria-hidden="true">
                        <Image
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04]"
                          src={projectThumbnails[index % projectThumbnails.length]}
                          alt=""
                          fill
                          sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        />
                        <span className="absolute right-3 bottom-3 bg-[#f6f5f1e8] px-[9px] py-[7px] font-mono text-[8px] leading-none tracking-[0.08em] text-[#42483f] uppercase">Project · {String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col px-[22px] pt-5 pb-[18px]">
                        <div className="flex items-center justify-between text-[#858a80]">
                          {icon ? <DevIcon name={icon} size={18} decorative /> : <DevIcon name="git" size={18} decorative />}
                          <a className="grid size-7 place-items-center text-[#73786e]" href={repository.html_url} target="_blank" rel="noreferrer" aria-label={`Open ${repository.name} on GitHub`}>
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </a>
                        </div>
                        <h3 className="mt-[14px] break-words font-display text-[25px] leading-[1.12] tracking-[-0.02em]">
                          <a className="transition-colors hover:text-accent" href={repository.html_url} target="_blank" rel="noreferrer">{repository.name}</a>
                        </h3>
                        <p className="mt-2.5 text-[10px] leading-[1.75] text-[#777c73]">{repository.description || "An open-source project shared on GitHub."}</p>
                        <div className="mt-auto flex flex-wrap gap-[14px] pt-[18px] text-[9px] text-[#80857c]">
                          {repository.language && (
                            <span className="inline-flex items-center gap-1.5">
                              {icon ? <DevIcon name={icon} size={14} decorative /> : <i className="size-[7px] rounded-full bg-[#8f9d70]" />}
                              {repository.language}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5"><Star size={13} aria-hidden="true" /> {repository.stargazers_count}</span>
                          <span className="inline-flex items-center gap-1.5"><GitFork size={13} aria-hidden="true" /> {repository.forks_count}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="border border-line bg-[#fbfaf7] p-[27px] text-[11px] leading-[1.75] text-[#71766d]">
                <p>Public repositories couldn’t be loaded right now.</p>
                <a href={reposUrl} target="_blank" rel="noreferrer" className="text-link mt-3">Browse GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            )}
          </section>

          <section className="border-t border-line py-5 pb-[54px] md:pt-7 md:pb-[70px]" aria-labelledby="developer-activity-title">
            <div className="mb-8 flex flex-col items-start gap-4 min-[761px]:flex-row min-[761px]:items-end min-[761px]:justify-between">
              <div>
                <p className="section-label mb-[14px] text-[#74796f]">A year on the workbench</p>
                <h2 id="developer-activity-title" className="font-display text-[clamp(32px,4vw,45px)] leading-[1.04] tracking-[-0.035em] text-balance">Contribution calendar.</h2>
              </div>
              <a href={`https://github.com/${encodeURIComponent(login)}`} target="_blank" rel="noreferrer" className="text-link shrink-0 min-[761px]:mb-[5px]">
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
              <div className="max-w-[650px] border border-line bg-[#eeefe9] p-[30px] text-[11px] leading-[1.75] text-[#71766d]">
                <p className="section-label mb-3 text-[#788064]">Calendar connection</p>
                <h3 className="max-w-[500px] font-display text-[28px] leading-[1.15] text-[#343830]">Connect GitHub GraphQL to show the real activity calendar.</h3>
                <p className="mt-3">
                  Add a server-side <code className="bg-[#e3e6dd] px-[5px] py-px font-mono text-[0.9em] text-[#484e43]">GITHUB_TOKEN</code> to <code className="bg-[#e3e6dd] px-[5px] py-px font-mono text-[0.9em] text-[#484e43]">.env.local</code>. The profile and public repositories still load without it.
                </p>
              </div>
            )}
          </section>

          <section className="border-t border-line py-5 pb-[54px] md:pt-7 md:pb-[70px]" aria-labelledby="developer-writing-title">
            <div className="mb-8 flex flex-col items-start gap-4 min-[761px]:flex-row min-[761px]:items-end min-[761px]:justify-between">
              <div>
                <p className="section-label mb-[14px] text-[#74796f]">Notes and reading</p>
                <h2 id="developer-writing-title" className="font-display text-[clamp(32px,4vw,45px)] leading-[1.04] tracking-[-0.035em] text-balance">Writing from the work.</h2>
              </div>
            </div>

            {mediumUrl ? (
              <div>
                <div className="mb-[17px] flex flex-col items-start justify-between gap-3 min-[761px]:flex-row min-[761px]:items-center min-[761px]:gap-5">
                  <div className="flex items-center gap-[9px] text-[#777d72]"><Rss size={16} aria-hidden="true" /><h3 className="font-display text-2xl text-[#30342e]">Medium · RSS feed</h3></div>
                  <a href={mediumUrl} target="_blank" rel="noreferrer" className="text-link text-[10px]">
                    Follow on Medium <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
                {mediumArticles.length ? (
                  <div className="grid grid-cols-1 gap-[15px] min-[641px]:grid-cols-2 min-[901px]:grid-cols-3">
                    {mediumArticles.map((article) => (
                      <article className="flex min-h-0 min-w-0 flex-col border border-line bg-[#fbfaf7] p-[22px] min-[761px]:min-h-[210px]" key={article.link}>
                        <p className="section-label text-[8px] text-[#83887e]">Medium · {formattedDate(article.date)}</p>
                        <h4 className="mt-3 font-display text-[22px] leading-[1.12] tracking-[-0.018em]">
                          <a className="transition-colors hover:text-accent" href={article.link} target="_blank" rel="noreferrer">{article.title}</a>
                        </h4>
                        {article.excerpt && <p className="mt-2.5 text-[10px] leading-[1.75] text-[#777c73]">{article.excerpt}</p>}
                        <a href={article.link} target="_blank" rel="noreferrer" className="text-link mt-auto pt-5 text-[10px]">Read on Medium <ArrowUpRight size={14} aria-hidden="true" /></a>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="border border-line p-[22px] text-[11px] text-[#777c73]">The Medium feed is connected, but no recent stories are available.</p>
                )}
              </div>
            ) : (
              <div className="mb-[35px] flex flex-col items-start gap-3 border border-line bg-[#eeefe9] p-[22px] text-[11px] leading-[1.75] text-[#71766d] min-[761px]:flex-row min-[761px]:items-center min-[761px]:gap-[13px] min-[761px]:p-[27px]">
                <Rss size={17} aria-hidden="true" />
                <p className="max-w-[680px]"><strong className="text-[#363b33]">Medium RSS is ready to connect.</strong> Add this developer’s Medium handle to <code className="bg-[#e3e6dd] px-[5px] py-px font-mono text-[0.9em] text-[#484e43]">socialProfiles.mediumUsername</code> in <code className="bg-[#e3e6dd] px-[5px] py-px font-mono text-[0.9em] text-[#484e43]">data/developers.json</code>.</p>
              </div>
            )}

            <div className="mt-10">
              <div className="mb-[17px] flex flex-col items-start justify-between gap-3 min-[761px]:flex-row min-[761px]:items-center min-[761px]:gap-5">
                <div className="flex items-center gap-[9px] text-[#777d72]"><BookOpen size={16} aria-hidden="true" /><h3 className="font-display text-2xl text-[#30342e]">Dhidroid Journal</h3></div>
                <Link href="/journal" className="text-link">All notes <ArrowUpRight size={14} aria-hidden="true" /></Link>
              </div>
              {journalPosts.length ? (
                <div className="grid grid-cols-1 gap-[15px] min-[641px]:grid-cols-2 min-[901px]:grid-cols-3">
                  {journalPosts.slice(0, 3).map((post) => (
                    <article className="flex min-h-0 min-w-0 flex-col border border-line bg-[#fbfaf7] p-[22px] min-[761px]:min-h-[210px]" key={post.slug}>
                      <p className="section-label text-[8px] text-[#83887e]">{post.category} · {formattedDate(post.date)}</p>
                      <h4 className="mt-3 font-display text-[22px] leading-[1.12] tracking-[-0.018em]">
                        <Link className="transition-colors hover:text-accent" href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h4>
                      <p className="mt-2.5 text-[10px] leading-[1.75] text-[#777c73]">{post.description}</p>
                      <Link href={`/blog/${post.slug}`} className="text-link mt-auto pt-5 text-[10px]">Read the note <ArrowUpRight size={14} aria-hidden="true" /></Link>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="border border-line p-[22px] text-[11px] text-[#777c73]">New journal notes are on the way.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
