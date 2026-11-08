import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DeveloperDetail } from "@/components/developers/developer-detail";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { getAllPosts } from "@/lib/blog";
import {
  developerProfiles,
  getDeveloperConfig,
  getGitHubContributionDays,
  getGitHubProfile,
  getGitHubRepositories,
  getGitHubSocialProfiles,
  getMediumArticles,
} from "@/lib/developers";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return developerProfiles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = getDeveloperConfig(slug);
  if (!config) notFound();

  const profile = await getGitHubProfile(config.githubUsername, process.env.GITHUB_TOKEN);
  const name = profile?.name?.trim() || config.githubUsername;
  return {
    title: `${name} · Developer profile`,
    description: profile?.bio || config.bio,
  };
}

export default function DeveloperPage({ params }: Props) {
  return (
    <Suspense fallback={<DeveloperProfileLoading />}>
      <DeveloperProfile params={params} />
    </Suspense>
  );
}

function DeveloperProfileLoading() {
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="grid min-h-[clamp(480px,64svh,760px)] place-items-center overflow-hidden border-b border-line bg-[radial-gradient(circle_at_86%_25%,#e5eade_0,#e5eade00_26rem),#f6f5f1] text-ink"
        aria-busy="true"
      >
        <div className="container py-[clamp(76px,10vw,124px)]">
          <p className="section-label text-[#74796f]">Developer profile</p>
          <h1 className="mt-5 max-w-[700px] font-display text-[clamp(46px,7vw,82px)] leading-[0.98] tracking-[-0.045em] text-balance">
            Opening the profile…
          </h1>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function DeveloperProfile({ params }: Props) {
  const { slug } = await params;
  const config = getDeveloperConfig(slug);
  if (!config) notFound();

  const token = process.env.GITHUB_TOKEN;
  const [profile, repositories, contributions, mediumArticles, journalPosts, socialProfiles] =
    await Promise.all([
      getGitHubProfile(config.githubUsername, token),
      getGitHubRepositories(config.githubUsername, token),
      getGitHubContributionDays(config.githubUsername, token),
      config.socialProfiles.mediumUsername
        ? getMediumArticles(config.socialProfiles.mediumUsername)
        : Promise.resolve([]),
      getAllPosts(),
      getGitHubSocialProfiles(config.githubUsername, token),
    ]);

  const profileConfig = {
    ...config,
    socialProfiles: {
      ...config.socialProfiles,
      linkedinUrl: config.socialProfiles.linkedinUrl ?? socialProfiles.linkedinUrl,
      instagramUrl: config.socialProfiles.instagramUrl ?? socialProfiles.instagramUrl,
      stackOverflowUrl:
        config.socialProfiles.stackOverflowUrl ?? socialProfiles.stackOverflowUrl,
    },
  };

  return (
    <DeveloperDetail
      config={profileConfig}
      profile={profile}
      repositories={repositories}
      contributions={contributions}
      mediumArticles={mediumArticles}
      journalPosts={journalPosts}
    />
  );
}
