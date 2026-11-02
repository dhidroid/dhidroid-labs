import "server-only";

import Parser from "rss-parser";
import { cacheLife } from "next/cache";
import developerData from "@/data/developers.json";

export type DeveloperSocialConfig = {
  twitterUrl?: string | null;
  mediumUsername?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  stackOverflowUrl?: string | null;
};

export type DeveloperConfig = {
  slug: string;
  githubUsername: string;
  bio: string;
  socialProfiles: DeveloperSocialConfig;
};

export type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  twitter_username: string | null;
};

export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

export type ContributionDay = { date: string; count: number };

export type MediumArticle = {
  title: string;
  link: string;
  excerpt: string;
  date: string | null;
};

export type DeveloperSocialProfiles = Pick<
  DeveloperSocialConfig,
  "linkedinUrl" | "instagramUrl" | "stackOverflowUrl"
>;

type DeveloperDataEntry = {
  githubUsername: string;
  bio?: string;
  socialProfiles?: DeveloperSocialConfig;
};

function secureProfileUrl(value?: string | null) {
  if (!value?.trim()) return undefined;

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

const configuredDevelopers = (developerData.developers as DeveloperDataEntry[])
  .map((entry) => ({ ...entry, githubUsername: entry.githubUsername.trim() }))
  .filter((entry) => /^[a-z\d-]{1,39}$/i.test(entry.githubUsername));

export const developerProfiles: DeveloperConfig[] = configuredDevelopers.map((entry) => {
  const socialProfiles = entry.socialProfiles ?? {};
  const mediumUsername = socialProfiles.mediumUsername?.trim().replace(/^@/, "");

  return {
    slug: entry.githubUsername.toLowerCase(),
    githubUsername: entry.githubUsername,
    bio:
      entry.bio?.trim() ||
      "An independent developer building useful things, learning in the open, and leaving good foundations.",
    socialProfiles: {
      twitterUrl: secureProfileUrl(socialProfiles.twitterUrl),
      mediumUsername: mediumUsername || undefined,
      linkedinUrl: secureProfileUrl(socialProfiles.linkedinUrl),
      instagramUrl: secureProfileUrl(socialProfiles.instagramUrl),
      stackOverflowUrl: secureProfileUrl(socialProfiles.stackOverflowUrl),
    },
  };
});

export function getDeveloperConfig(slug: string) {
  return developerProfiles.find((profile) => profile.slug === slug) ?? null;
}

function githubHeaders(token?: string) {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getGitHubProfile(
  username: string,
  token?: string,
): Promise<GitHubProfile | null> {
  "use cache";
  cacheLife("hours");

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      { headers: githubHeaders(token) },
    );
    if (!response.ok) return null;
    return (await response.json()) as GitHubProfile;
  } catch {
    return null;
  }
}

export async function getGitHubSocialProfiles(
  username: string,
  token?: string,
): Promise<DeveloperSocialProfiles> {
  "use cache";
  cacheLife("hours");

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/social_accounts?per_page=100`,
      { headers: githubHeaders(token) },
    );
    if (!response.ok) return {};

    const accounts = (await response.json()) as { provider: string; url: string }[];
    const profiles: DeveloperSocialProfiles = {};
    for (const account of accounts) {
      try {
        const url = new URL(account.url);
        if (url.protocol !== "https:") continue;
        const host = url.hostname.toLowerCase();

        if (!profiles.linkedinUrl && (host === "linkedin.com" || host.endsWith(".linkedin.com"))) {
          profiles.linkedinUrl = url.toString();
        } else if (!profiles.instagramUrl && (host === "instagram.com" || host.endsWith(".instagram.com"))) {
          profiles.instagramUrl = url.toString();
        } else if (!profiles.stackOverflowUrl && (host === "stackoverflow.com" || host.endsWith(".stackoverflow.com"))) {
          profiles.stackOverflowUrl = url.toString();
        }
      } catch {
        // Skip malformed URLs in public profile metadata.
      }
    }
    return profiles;
  } catch {
    return {};
  }
}

export async function getGitHubRepositories(
  username: string,
  token?: string,
): Promise<GitHubRepository[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=updated&per_page=100`,
      { headers: githubHeaders(token) },
    );
    if (!response.ok) return [];
    const repositories = (await response.json()) as GitHubRepository[];
    return repositories
      .filter((repository) => !repository.fork && !repository.archived)
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          b.updated_at.localeCompare(a.updated_at),
      )
      .slice(0, 6);
  } catch {
    return [];
  }
}

export async function getGitHubContributionDays(
  username: string,
  token?: string,
): Promise<{ days: ContributionDay[]; total: number } | null> {
  "use cache";
  cacheLife("hours");
  if (!token) return null;

  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 364);

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        ...githubHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query DeveloperContributions($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays { date contributionCount }
                }
              }
            }
          }
        }`,
        variables: {
          login: username,
          from: start.toISOString(),
          to: end.toISOString(),
        },
      }),
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as {
      errors?: unknown[];
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              totalContributions?: number;
              weeks?: { contributionDays?: { date: string; contributionCount: number }[] }[];
            };
          };
        } | null;
      };
    };

    if (payload.errors?.length) return null;
    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    return {
      total: calendar.totalContributions ?? 0,
      days: (calendar.weeks ?? []).flatMap((week) =>
        (week.contributionDays ?? []).map((day) => ({
          date: day.date,
          count: day.contributionCount,
        })),
      ),
    };
  } catch {
    return null;
  }
}

function plainText(value: string, limit = 190) {
  const text = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

export async function getMediumArticles(
  username?: string,
): Promise<MediumArticle[]> {
  "use cache";
  cacheLife("hours");
  if (!username || !/^[a-zA-Z0-9._-]+$/.test(username)) return [];

  try {
    const response = await fetch(
      `https://medium.com/feed/@${encodeURIComponent(username)}`,
      { headers: { Accept: "application/rss+xml, application/xml, text/xml" } },
    );
    if (!response.ok) return [];

    const parser = new Parser({ customFields: { item: ["content:encoded"] } });
    const feed = await parser.parseString(await response.text());
    return feed.items.slice(0, 6).flatMap((item) => {
      if (!item.title || !item.link) return [];
      try {
        if (new URL(item.link).protocol !== "https:") return [];
      } catch {
        return [];
      }
      const rawContent =
        item.contentSnippet ||
        item.content ||
        String(item["content:encoded"] ?? "");
      const parsedDate = Date.parse(item.isoDate || item.pubDate || "");
      return [
        {
          title: plainText(item.title, 120),
          link: item.link,
          excerpt: plainText(rawContent),
          date: Number.isFinite(parsedDate)
            ? new Date(parsedDate).toISOString().slice(0, 10)
            : null,
        },
      ];
    });
  } catch {
    return [];
  }
}
