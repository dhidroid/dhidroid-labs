import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CapabilitiesSection } from "@/components/landing/capabilities-section";
import { ClientsSection } from "@/components/landing/clients-section";
import { ContactSection } from "@/components/landing/contact-section";
import { HeroSection } from "@/components/landing/hero-section";
import { ProcessSection } from "@/components/landing/process-section";
import { ProjectShowcase } from "@/components/landing/project-showcase";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { getAllPosts } from "@/lib/blog";
import { getClients } from "@/lib/clients";
import { developerProfiles, getGitHubRepositories } from "@/lib/developers";

export async function LandingPage() {
  const primaryDeveloper = developerProfiles[0];
  const [posts, repositories] = await Promise.all([
    getAllPosts(),
    primaryDeveloper
      ? getGitHubRepositories(primaryDeveloper.githubUsername, process.env.GITHUB_TOKEN)
      : Promise.resolve([]),
  ]);
  const programmingLanguages = Array.from(
    new Set(
      repositories
        .map((repository) => repository.language)
        .filter((language): language is string => Boolean(language)),
    ),
  ).slice(0, 6);
  const clients = getClients();

  return (
    <>
      <SiteHeader overlay />
      <main id="main-content">
        <HeroSection />
        <ClientsSection clients={clients} />
        <CapabilitiesSection
          programmingLanguages={programmingLanguages}
          hasLiveRepositoryData={programmingLanguages.length > 0}
        />
        <ProjectShowcase />
        <ProcessSection />
        <section className="learning-section section-space">
          <div className="container">
            <div className="centered-heading">
              <p className="section-label">A practice, not a finish line</p>
              <h2 className="section-heading">
                Learn something. Build something. Leave a trail.
              </h2>
              <p>We make room for the work—and for the things it teaches us.</p>
            </div>
            <div className="learning-grid">
              {[
                [
                  "Ask a useful question",
                  "Begin with curiosity, and give the idea a clear direction.",
                ],
                [
                  "Make it real",
                  "Build just enough to put an assumption to the test.",
                ],
                [
                  "Stay close",
                  "Notice the details. Listen to what using it tells you.",
                ],
                [
                  "Share the learning",
                  "Write down the why, not just the what.",
                ],
              ].map(([title, text], i) => (
                <div key={title}>
                  <span className="section-label">0{i + 1} /</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <ContactSection />
        <section className="journal-section section-space">
          <div className="container">
            <div className="journal-heading">
              <div>
                <p className="section-label">The journal</p>
                <h2 className="section-heading">Notes from the workbench.</h2>
                <p>
                  On building useful things, asking better questions, and
                  learning along the way.
                </p>
              </div>
              <Link className="text-link" href="/journal">
                All notes <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="journal-grid">
              {posts.slice(0, 3).map((post) => (
                <article key={post.slug}>
                  <div className="section-label">
                    {post.category} <span> / {post.readTime}</span>
                  </div>
                  <h3>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.description}</p>
                  <Link className="text-link" href={`/blog/${post.slug}`}>
                    Read the note <ArrowUpRight size={13} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
