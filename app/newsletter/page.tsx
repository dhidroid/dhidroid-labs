import { Ico } from "../icons";
import { Subscribe } from "../subscribe";
import { pageMetadata } from "../../lib/seo";

export function generateMetadata() {
  return pageMetadata("/newsletter", {
    title: "Newsletter | Dhidroid Labs",
    description: "Practical notes on building mobile and enterprise software, and experiments from the lab.",
  });
}

const gets = [
  ["pen", "Practical engineering notes", "Decision frameworks and checklists you can use on your own product."],
  ["flask", "Experiments from the lab", "What we tried, what worked and what did not."],
  ["bulb", "One useful idea per issue", "A short, concrete takeaway you can apply the same day."],
];

export default function Newsletter() {
  return (
    <main className="sub">
      <header className="sh"><h1>Notes from the lab.</h1><p>An occasional email on building mobile and enterprise software. No spam, and you can unsubscribe at any time.</p></header>
      <div className="nlbox"><Subscribe id="page-email" large confirmFromUrl /><p>By subscribing you agree to receive emails from Dhidroid Labs. We use your email only to send the newsletter.</p></div>
      <div className="cards">{gets.map(([i, t, b]) => <div className="c" key={t}><span className="ic"><Ico n={i} /></span><h3>{t}</h3><p>{b}</p></div>)}</div>
      <p className="cap2" style={{ marginTop: 32 }}>Curious how it looks? <a href="/newsletter-template.html">Preview the email template</a> · <a href="/newsletter/custom">Compose custom newsletter</a>.</p>
    </main>
  );
}
