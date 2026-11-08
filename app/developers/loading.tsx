import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function DevelopersLoading() {
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="grid min-h-[clamp(480px,64svh,760px)] place-items-center overflow-hidden border-b border-line bg-[radial-gradient(circle_at_86%_25%,#e5eade_0,#e5eade00_26rem),#f6f5f1] text-ink"
        aria-busy="true"
      >
        <div className="container py-[clamp(76px,10vw,124px)]">
          <p className="section-label text-[#74796f]">
            People behind the practice
          </p>
          <div
            className="mt-[38px] mb-[17px] flex items-center gap-3 text-[#5f6b60]"
            role="status"
            aria-label="Loading developer profiles"
          >
            <span className="size-2 animate-pulse rounded-full bg-current" aria-hidden="true" />
            <span className="section-label text-[9px] text-[#74796f]">
              Gathering profiles
            </span>
          </div>
          <h1 className="max-w-[700px] font-display text-[clamp(46px,7vw,82px)] leading-[0.98] tracking-[-0.045em] text-balance">
            Good work is
            <br />
            <em className="font-normal text-[#697268]">on its way.</em>
          </h1>
          <p className="mt-[22px] max-w-[440px] text-xs leading-[1.8] text-[#686e64]">
            Gathering projects, writing, and social profiles from the workbench.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
