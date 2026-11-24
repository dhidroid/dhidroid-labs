import type { Metadata } from "next";
import { CustomNewsletter } from "../custom-newsletter";

export const metadata: Metadata = {
  title: "Custom Newsletter Composer | Dhidroid Labs",
  description:
    "Compose, preview, and dispatch custom newsletters using the Dhidroid Labs email template.",
};

export default function CustomNewsletterPage() {
  return (
    <main className="sub">
      <header className="sh">
        <h1>Custom newsletter.</h1>
        <p>
          Compose, preview, and dispatch custom newsletter issues using the official{" "}
          <code>public/newsletter-template.html</code> email template.
        </p>
      </header>
      <CustomNewsletter />
    </main>
  );
}
