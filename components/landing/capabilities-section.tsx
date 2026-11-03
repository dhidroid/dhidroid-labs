import { ArrowUpRight, Braces, Lightbulb, PenTool } from "lucide-react";
import Link from "next/link";
import { DevIcon, type DevIconName } from "@/components/ui/dev-icon";

const languageIcons: Partial<Record<string, DevIconName>> = {
  TypeScript: "typescript",
  JavaScript: "javascript",
  React: "react",
  "Next.js": "nextjs",
  "Node.js": "nodejs",
  Python: "python",
  Java: "java",
  Go: "go",
  Rust: "rust",
  PHP: "php",
  Ruby: "ruby",
};

const fallbackLanguages = ["TypeScript", "React", "Next.js", "Node.js"];

export function CapabilitiesSection({
  programmingLanguages,
  hasLiveRepositoryData,
}: {
  programmingLanguages: string[];
  hasLiveRepositoryData: boolean;
}) {
  const languages = programmingLanguages.length
    ? programmingLanguages
    : fallbackLanguages;

  return (
    <section id="about" className="intro-section section-space">
      <div className="container">
        <div className="intro-heading">
          <p className="section-label">Curiosity, put into practice</p>
          <h2 className="section-heading">
            Dhidroid is an independent engineering practice.
            <br />
            <span>A workshop for ideas worth understanding.</span>
          </h2>
        </div>
        <div className="intro-grid">
          <div
            className="stack-illustration"
            role="group"
            aria-label={
              hasLiveRepositoryData
                ? `Programming languages in public GitHub projects: ${languages.join(", ")}`
                : `Programming languages Dhidroid explores: ${languages.join(", ")}`
            }
          >
            <span className="section-label">
              {hasLiveRepositoryData
                ? "Languages in current public work"
                : "A few tools we explore"}
            </span>
            <div className="stack-icons" role="list" aria-label="Programming languages">
              {languages.map((language) => {
                const icon = languageIcons[language];
                return (
                  <span className="stack-icon" role="listitem" key={language}>
                    {icon ? (
                      <DevIcon name={icon} size={30} />
                    ) : (
                      <span className="stack-icon-fallback" aria-label={language}>
                        <Braces size={25} strokeWidth={1.4} aria-hidden="true" />
                        <span className="sr-only">{language}</span>
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <div className="stack-caption">
              <span className="tiny-dot" />
              {hasLiveRepositoryData
                ? "Public GitHub data · refreshed every few minutes"
                : "Choose the tool that fits the question"}
            </div>
          </div>
          <div className="intro-note">
            <p className="section-label">A little about us</p>
            <h3>
              Care and curiosity.
              <br />
              Applied to software.
            </h3>
            <p>
              We’re interested in how things work—and how they could work
              better. We turn questions into small experiments, thoughtful
              interfaces, and useful tools.
            </p>
            <Link href="/practice" className="text-link">
              Meet the practice <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
        <div className="principle-grid">
          <div>
            <Lightbulb size={18} strokeWidth={1.4} />
            <h3>Start with a question.</h3>
            <p>
              Good work begins with understanding the problem, before reaching
              for a solution.
            </p>
          </div>
          <div>
            <PenTool size={18} strokeWidth={1.4} />
            <h3>Make it tangible.</h3>
            <p>
              A small, working thing can teach us more than a beautifully
              polished assumption.
            </p>
          </div>
          <div>
            <Braces size={18} strokeWidth={1.4} />
            <h3>Leave good foundations.</h3>
            <p>
              Clear code, considered decisions, and things that are easier for
              the next person to build on.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
