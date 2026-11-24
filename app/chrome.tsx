import Link from "next/link";
import { Subscribe } from "./subscribe";


const cols: [string, [string, string][]][] = [
  ["Studio", [["About", "about"], ["Developers", "developers"], ["Process", "process"], ["Lab", "lab"]]],
  ["Work", [["Projects", "projects"], ["Tech stack", "tech-stack"], ["Engineering", "engineering"], ["Blog", "blog"]]],
  ["Services", [["Services", "services"], ["Pricing", "pricing"], ["Engagement models", "engagement-models"], ["FAQ", "faq"], ["Newsletter", "newsletter"]]],
];

export function Footer() {
  return (
    <footer className="ft2">
      <div className="ft2-top">
        <div className="ft2-grid">
          {cols.map(([h, links]) => <div key={h}><h4>{h}</h4>{links.map(([t, s]) => <Link key={s} href={`/${s}`}>{t}</Link>)}</div>)}
          <div><h4>Follow us</h4><a href="https://linkedin.com/in/dhidroid-rndev">LinkedIn</a><a href="https://dhidroid.vercel.app">Portfolio</a></div>
          <div><h4>Get in touch</h4><p>Based in Chennai, India</p><Link href="/contact">Project enquiries</Link><Link href="/contact">General enquiries</Link></div>
          <div className="nl"><h4>Stay informed</h4><p>Notes on building mobile and enterprise software.</p><Subscribe id="footer-email" /></div>
        </div>
        {/* [LEGAL REVIEW] Add the verified legal name, registered office, CIN, phone, email and grievance contact here before launch. */}
        <div className="ft2-legal">
          <span>© 2026 Dhidroid Labs</span>
          <span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="#top">Back to top</a></span>
        </div>
      </div>
      <div className="ft2-mark" aria-hidden="true">Dhidroid <i>Labs</i></div>
    </footer>
  );
}
