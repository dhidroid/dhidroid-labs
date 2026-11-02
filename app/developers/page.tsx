import type { Metadata } from "next";
import { DeveloperDirectory } from "@/components/developers/developer-directory";
import { developerProfiles, getGitHubProfile } from "@/lib/developers";

export const metadata: Metadata = {
  title: "Meet our developers",
  description:
    "Meet the developers behind Dhidroid: explore public projects, social profiles, writing, and GitHub activity.",
};

export default async function DevelopersPage() {
  const token = process.env.GITHUB_TOKEN;
  const developers = await Promise.all(
    developerProfiles.map(async (config) => ({
      config,
      profile: await getGitHubProfile(config.githubUsername, token),
    })),
  );

  return <DeveloperDirectory developers={developers} />;
}
