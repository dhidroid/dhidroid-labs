import { AccordionLoader } from "@/components/ui/accordion-loader";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function DevelopersLoading() {
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="developers-page developer-loading"
        aria-busy="true"
      >
        <div className="container developer-loading__inner">
          <p className="section-label">People behind the practice</p>
          <div className="developer-loading__indicator">
            <AccordionLoader
              aria-label="Loading developer profiles"
              className="developer-loading__loader"
              trackLength={18}
            />
            <span className="section-label">Gathering profiles</span>
          </div>
          <h1>
            Good work is
            <br />
            <em>on its way.</em>
          </h1>
          <p className="developer-loading__message">
            Gathering projects, writing, and social profiles from the workbench.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
