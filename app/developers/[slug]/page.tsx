import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeveloperDetail } from "@/components/developers/developer-detail";
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

export default async function DeveloperPage({ params }: Props) {
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
