import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page is not on the Dhidroid Labs workbench.",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="not-found-page">
        <div className="container">
          <p className="section-label">404 · Off the workbench</p>
          <h1>Looks like we lost the thread.</h1>
          <p className="not-found-page__message">
            This page isn’t here. Head back to the workbench, or explore the
            notes and ideas that are taking shape.
          </p>
          <div className="not-found-page__actions">
            <Link href="/" className="button button-dark">
              <ArrowLeft size={14} aria-hidden="true" /> Back to the start
            </Link>
            <Link href="/work" className="text-link">
              Explore the work <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
