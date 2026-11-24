import Link from "next/link";

export default function NotFound() {
  return (
    <main className="sub">
      <header className="sh"><h1>This page does not exist</h1><p>The link may be old or mistyped. Head back to the home page or see what Dhidroid Labs builds.</p></header>
      <div className="row" style={{ marginTop: 32 }}><Link className="btn ink" href="/">Go to home</Link><Link className="btn ink" href="/services">View services</Link></div>
    </main>
  );
}
