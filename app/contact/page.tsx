import type { Metadata } from "next";
import { ContactSection } from "@/components/landing/contact-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export const metadata: Metadata = {
  title: "Start a conversation",
  description:
    "Bring an idea, an interesting problem, or something you’re learning. There’s room for a conversation at Dhidroid.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="contact-route-main">
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
