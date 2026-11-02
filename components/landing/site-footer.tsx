import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowUpRight, Code2, ArrowUp } from "lucide-react";
import { Brand } from "@/components/landing/brand";

export async function SiteFooter() {
  "use cache";
  cacheLife("days");
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-intro">
          <p className="footer-heading">
            Independent engineering.
            <br />
            <em>Shared in the open.</em>
          </p>
          <Brand />
        </div>
        <div className="footer-links">
          <p className="section-label">Explore</p>
          <Link href="/work">The work</Link>
          <Link href="/clients">Our clients</Link>
          <Link href="/developers">Meet the developers</Link>
          <Link href="/practice">Our practice</Link>
          <Link href="/journal">The journal</Link>
          <Link href="/about">About Dhidroid</Link>
        </div>
        <div className="footer-links">
          <p className="section-label">Elsewhere</p>
          <a
            href="https://github.com/dhidroid"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Code2 size={13} />
          </a>
          <Link href="/contact">
            Start a conversation <ArrowUpRight size={13} />
          </Link>
          <Link href="/journal">
            Notes from the workbench <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Dhidroid Labs</p>
        <p>Made with care. Always a work in progress.</p>
        <a href="#top" aria-label="Back to top">
          Back to top <ArrowUp size={13} />
        </a>
      </div>
      <div className="footer-grass" aria-hidden="true" />
    </footer>
  );
}
