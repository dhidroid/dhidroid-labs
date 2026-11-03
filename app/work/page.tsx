import type { Metadata } from "next";
import WorkContent from "@/content/pages/work.mdx";
import { EditorialPage } from "@/components/site/editorial-page";
import { GitHubProjects } from "@/components/work/github-projects";
import { developerProfiles, getGitHubRepositories } from "@/lib/developers";

export const metadata: Metadata = {
  title: "The work",
  description:
    "Explore public GitHub projects and early directions taking shape on the Dhidroid workbench.",
};

export default async function WorkPage() {
  const primaryDeveloper = developerProfiles[0];
  const repositories = primaryDeveloper
    ? await getGitHubRepositories(
        primaryDeveloper.githubUsername,
        process.env.GITHUB_TOKEN,
      )
    : [];

  return (
    <EditorialPage
      eyebrow="The work · On the workbench"
      title="Ideas with something practical to do."
      description="Small tools, open questions, and a few directions we’re exploring one useful step at a time."
      asideLabel="Current directions"
      asideText="Public projects and early explorations are shared with their context and open questions."
      asideHref="/journal"
      asideLinkLabel="Read the field notes"
    >
      <>
        <GitHubProjects
          username={primaryDeveloper?.githubUsername}
          repositories={repositories}
        />
        <WorkContent />
      </>
    </EditorialPage>
  );
}
