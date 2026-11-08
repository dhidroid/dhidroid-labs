import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { DevIcon, type DevIconName } from "@/components/ui/dev-icon";
import type { GitHubRepository } from "@/lib/developers";

const languageIcons: Partial<Record<string, DevIconName>> = {
  TypeScript: "typescript",
  JavaScript: "javascript",
  Python: "python",
  Java: "java",
  Go: "go",
  Rust: "rust",
  PHP: "php",
  Ruby: "ruby",
};

function updatedDate(value: string) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(timestamp));
}

export function GitHubProjects({
  username,
  repositories,
  loading = false,
}: {
  username?: string;
  repositories: GitHubRepository[];
  loading?: boolean;
}) {
  const profileUrl = username ? `https://github.com/${encodeURIComponent(username)}` : "https://github.com";

  return (
    <section
      className="github-work"
      aria-labelledby="github-work-title"
      aria-busy={loading}
    >
      <div className="github-work__heading">
        <p className="section-label">Public work · GitHub</p>
        <h2 id="github-work-title">Projects in the open.</h2>
        <p>
          Public repository details come from GitHub and refresh every few
          minutes. These projects reflect an independent developer’s work; they
          are not presented as client case studies.
        </p>
      </div>

      {loading ? (
        <div className="github-work__empty" role="status" aria-live="polite">
          Loading public repositories…
        </div>
      ) : repositories.length ? (
        <div className="github-work__grid">
          {repositories.map((repository) => {
            const date = updatedDate(repository.updated_at);
            const icon = repository.language
              ? languageIcons[repository.language]
              : undefined;

            return (
              <article className="github-work__card" key={repository.id}>
                <div className="github-work__card-heading">
                  <p className="section-label">
                    {repository.language || "Open source"}
                  </p>
                  {icon && <DevIcon name={icon} size={18} decorative />}
                </div>
                <h3>
                  <a href={repository.html_url} target="_blank" rel="noreferrer">
                    {repository.name} <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </h3>
                <p className="github-work__description">
                  {repository.description ||
                    "A public repository shared from the workbench."}
                </p>
                <div className="github-work__meta">
                  <span><Star size={13} aria-hidden="true" /> {repository.stargazers_count}</span>
                  <span><GitFork size={13} aria-hidden="true" /> {repository.forks_count}</span>
                  {date && (
                    <time dateTime={repository.updated_at}>Updated {date}</time>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="github-work__empty">
          <p>
            There are no public repositories to show right now, or GitHub is
            temporarily unavailable. The workbench notes below describe current
            ideas and experiments.
          </p>
        </div>
      )}

      <a className="text-link github-work__profile-link" href={profileUrl} target="_blank" rel="noreferrer">
        Browse the GitHub profile <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </section>
  );
}
