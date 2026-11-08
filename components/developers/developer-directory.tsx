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

export function DeveloperDirectory({
  developers,
}: {
  developers: DeveloperDirectoryEntry[];
}) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="overflow-hidden bg-paper text-ink">
        <header className="relative overflow-hidden border-b border-line bg-[radial-gradient(circle_at_86%_25%,#e5eade_0,#e5eade00_26rem),#f6f5f1]">
          <div className="container relative py-[77px] pb-[78px] md:pt-[clamp(88px,12vw,142px)] md:pb-[104px]">
            <p className="section-label mb-[21px] text-[#74796f]">
              People behind the practice
            </p>
            <h1 className="max-w-[820px] font-display text-[clamp(56px,8vw,100px)] leading-[0.95] tracking-[-0.05em] text-balance sm:text-[clamp(62px,8vw,100px)]">
              Meet our developers.
            </h1>
            <p className="mt-6 max-w-[520px] text-sm leading-[1.85] text-[#686e64]">
              Curious people, useful projects, and the ideas we’re learning
              from along the way.
            </p>
            <span className="mt-[37px] inline-block border-t border-[#cfd4c8] pt-3 font-mono text-[9px] leading-[1.6] tracking-[0.06em] text-[#777d72] uppercase">
              A small team · Open by nature
            </span>
          </div>
        </header>

        <section
          className="container py-[65px] pb-[78px] md:pt-[92px] md:pb-[116px]"
          aria-labelledby="developers-list-title"
        >
          <div className="mb-[42px] flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-[35px]">
            <div>
              <p className="section-label mb-[14px] text-[#74796f]">The people</p>
              <h2
                id="developers-list-title"
                className="max-w-[650px] font-display text-[clamp(35px,4.1vw,51px)] leading-[1.04] tracking-[-0.035em] text-balance"
              >
                Good work starts with good questions.
              </h2>
            </div>
            <p className="max-w-[320px] text-xs leading-[1.8] text-[#777c73] md:pb-1">
              Profiles, projects, and writing gathered from the places we share
              our work.
            </p>
          </div>

          {developers.length ? (
            <div className="overflow-hidden border border-line bg-white">
              {developers.map(({ config, profile }) => {
                const name = profile?.name?.trim() || config.githubUsername;

                return (
                  <article
                    className="grid min-h-[350px] min-w-0 grid-cols-1 border-b border-line last:border-b-0 sm:grid-cols-2 md:min-h-[clamp(330px,40vw,520px)]"
                    key={config.slug}
                  >
                    <Link
                      className="group relative block aspect-[1.4] min-w-0 overflow-hidden bg-[#e3e7dc] sm:aspect-auto sm:min-h-[280px]"
                      href={`/developers/${config.slug}`}
                      aria-label={`View ${name}'s profile`}
                    >
                      {profile?.avatar_url ? (
                        <Image
                          className="object-cover grayscale transition duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.035] group-hover:grayscale-0"
                          src={profile.avatar_url}
                          alt={`${name} profile photo`}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      ) : (
                        <span
                          className="absolute inset-0 grid place-items-center bg-[linear-gradient(145deg,#e5eadf,#cbd9c5)] font-display text-[clamp(60px,10vw,130px)] text-[#5c6854]"
                          aria-hidden="true"
                        >
                          {name.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </Link>

                    <div className="flex min-h-[270px] min-w-0 flex-col items-center justify-center bg-[#d3eeee] px-[22px] py-[27px] text-center sm:min-h-0 sm:px-[clamp(22px,4vw,54px)] sm:py-[clamp(22px,4vw,54px)]">
                      <p className="section-label mb-3 text-[8px] tracking-[0.09em] text-[#858a80]">
                        Developer · @{config.githubUsername}
                      </p>
                      <h3 className="font-display text-[clamp(23px,2.6vw,35px)] leading-[1.1] tracking-[-0.025em]">
                        <Link
                          className="transition-colors hover:text-accent"
                          href={`/developers/${config.slug}`}
                        >
                          {name}
                        </Link>
                      </h3>
                      <p className="mt-[13px] max-w-[390px] text-[10px] leading-[1.8] text-[#72776e]">
                        {profile?.bio || config.bio}
                      </p>
                      {profile && (
                        <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[9px] text-[#81867d]">
                          <span className="inline-flex items-center gap-1.5">
                            <DevIcon name="git" size={14} decorative />
                            {profile.public_repos} public repos
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Users size={14} aria-hidden="true" />
                            {profile.followers} followers
                          </span>
                        </div>
                      )}
                      <Link
                        className="text-link mt-[21px] text-[11px]"
                        href={`/developers/${config.slug}`}
                      >
                        View profile <ArrowUpRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="py-10 text-xs leading-[1.8] text-[#777c73]">
              Developer profiles will appear here soon.
            </p>
          )}
        </section>

        <section className="border-t border-line bg-[#eceee7] py-[62px]">
          <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-8">
            <div>
              <p className="section-label mb-[14px] text-[#74796f]">
                Build in the open
              </p>
              <h2 className="max-w-[650px] font-display text-[clamp(35px,4.1vw,51px)] leading-[1.04] tracking-[-0.035em] text-balance">
                Interested in working together?
              </h2>
            </div>
            <Link href="/contact" className="button button-dark shrink-0">
              Start a conversation <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
