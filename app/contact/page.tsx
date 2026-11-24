"use client";
import type { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";
import { Ico } from "../icons";

// Cal.com element-click embed — loaded once on the client
import Script from "next/script";

const methods = [
  ["calendar", "30-minute discovery call", "Pick a time that works for you and we'll talk through your idea, goals and next steps."],
  ["pen", "Project enquiry", "Prefer writing? Use the form below to describe what you're building."],
  ["bulb", "Quick question", "Not ready for a full brief? Send a note and we'll reply within one business day."],
];

export default function Contact() {
  const endpoint =
    process.env.NEXT_PUBLIC_NEWSLETTER_API_URL ||
    (process.env.NODE_ENV !== "test" ? "/api/newsletter" : undefined);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const f = e.currentTarget;
    const data = new FormData(f);
    const name = (data.get("name") as string)?.trim() || "";
    const email = (data.get("email") as string)?.trim() || "";
    const budget = (data.get("budget") as string) || "Prefer not to say";
    const message = (data.get("message") as string)?.trim() || "";

    let sentViaApi = false;

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "project_brief",
            name,
            email,
            budget,
            message,
          }),
        });
        if (response.ok) {
          sentViaApi = true;
        }
      } catch {
        // Fall back to mailto below
      }
    }

    if (sentViaApi) {
      setSent(true);
      setLoading(false);
    } else {
      // Fallback: open mailto link directly addressed to studio email
      const subject = encodeURIComponent(`Project brief from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\n${message}`
      );
      window.location.href = `mailto:dhinesh4668@gmail.com?subject=${subject}&body=${body}`;
      setTimeout(() => {
        setSent(true);
        setLoading(false);
      }, 400);
    }
  }

  return (
    <>
      {/* Cal.com embed script */}
      <Script id="cal-embed" strategy="afterInteractive">{`
        (function(C,A,L){let p=function(a,ar){a.q.push(ar)};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true}if(ar[0]===L){const api=function(){p(api,arguments)};const namespace=ar[1];api.q=api.q||[];if(typeof namespace==="string"){cal.ns[namespace]=cal.ns[namespace]||api;p(cal.ns[namespace],ar);p(cal,["initNamespace",namespace])}else p(cal,ar);return}p(cal,ar)};})(window,"https://app.cal.com/embed/embed.js","init");
        Cal("init","30min",{origin:"https://app.cal.com"});
        Cal.config=Cal.config||{};
        Cal.config.forwardQueryParams=true;
        Cal.ns["30min"]("ui",{"hideEventTypeDetails":false,"layout":"month_view"});
      `}</Script>

      <main className="sub" id="top">
        {/* Page header */}
        <header className="sh">
          <h1>Let's build something useful.</h1>
          <p>Tell us what you're trying to solve. We'll help you find the clearest path forward — whether that's a discovery call, a small prototype or a full engagement.</p>
        </header>

        {/* Ways to connect */}
        <div className="cards" style={{ marginTop: 48 }}>
          {methods.map(([icon, title, body]) => (
            <div key={title} className="c">
              <span className="ic"><Ico n={icon} /></span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>

        {/* Two-column layout: form + booking */}
        <div className="cnt-grid">

          {/* ── Contact form ── */}
          <section className="cnt-form">
            <h2 className="cnt-h">Send a project brief</h2>
            {sent ? (
              <div className="cnt-sent">
                <span className="cnt-sent-ico">✓</span>
                <h3>Message sent.</h3>
                <p>We'll reply within one business day. In the meantime, feel free to book a discovery call.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="cf">
                <div className="cf-row">
                  <label className="cf-label">
                    Your name
                    <input name="name" type="text" required placeholder="Alex Johnson" autoComplete="name" />
                  </label>
                  <label className="cf-label">
                    Email address
                    <input name="email" type="email" required placeholder="alex@company.com" autoComplete="email" />
                  </label>
                </div>
                <label className="cf-label">
                  Approximate budget
                  <select name="budget">
                    <option value="">Prefer not to say</option>
                    <option value="under-50k">Under ₹50,000</option>
                    <option value="50k-2l">₹50,000 – ₹2,00,000</option>
                    <option value="2l-5l">₹2,00,000 – ₹5,00,000</option>
                    <option value="5l-15l">₹5,00,000 – ₹15,00,000</option>
                    <option value="15l-plus">₹15,00,000+</option>
                    <option value="retainer">Ongoing retainer</option>
                  </select>
                </label>
                <label className="cf-label">
                  Tell us about your project
                  <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder="Describe what you're trying to build, the problem it solves, and any constraints or timelines we should know about."
                  />
                </label>
                <button className="btn ink cf-submit" type="submit" disabled={loading}>
                  {loading ? "Opening mail…" : "Send enquiry"}
                </button>
                <p className="cf-note">We respond within one business day. Your details are never shared.</p>
              </form>
            )}
          </section>

          {/* ── Book a call ── */}
          <section className="cnt-book">
            <h2 className="cnt-h">Book a 30-minute call</h2>
            <p className="cnt-book-p">Jump on a free discovery call. We'll listen to what you're building, ask a few useful questions, and tell you honestly whether and how we can help.</p>
            <button
              className="btn ink cnt-cal-btn"
              data-cal-link="dhidroid/30min"
              data-cal-namespace="30min"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{marginRight:8}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Book a free 30-min call
            </button>
            <ul className="cnt-perks">
              <li><span className="cnt-perk-dot" />No commitment required</li>
              <li><span className="cnt-perk-dot" />Runs on video or voice</li>
              <li><span className="cnt-perk-dot" />Based in Chennai (IST), flexible hours</li>
            </ul>
          </section>
        </div>

        {/* FAQ strip */}
        <div className="cnt-faq">
          <h2 className="cnt-h" style={{ textAlign: "left" }}>Common questions</h2>
          <div className="cnt-qs">
            {[
              ["How quickly do you reply?", "Within one business day for enquiries. Discovery calls can usually be booked within the week."],
              ["Do I need a detailed brief?", "No. A rough description of the problem you're solving and your timeline is enough to start."],
              ["Do you work with early-stage startups?", "Yes. A lot of our work is helping founders validate ideas through focused MVPs and prototypes."],
              ["What if my project is outside your stack?", "Tell us anyway. We'll be honest if it's not the right fit or point you to the right direction."],
            ].map(([q, a]) => (
              <details key={q as string}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
