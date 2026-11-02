import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { ClientGrid } from "@/components/clients/client-grid";
import { getClients } from "@/lib/clients";

export const metadata: Metadata = {
  title: "Our clients",
  description:
    "Thoughtful client work, shared with permission and care.",
};

export default function ClientsPage() {
  const clients = getClients();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="clients-page">
        <header className="clients-page__hero">
          <div className="container">
            <p className="section-label">Working together · Shared with care</p>
            <h1>Good work grows together.</h1>
            <p>
              Dhidroid Labs is a small, independent engineering practice. We
              share client names and project details only when our collaborators
              are comfortable making them public.
            </p>
          </div>
        </header>
        <section className="clients-page__logos" aria-labelledby="clients-page-title">
          <div className="container">
            <div className="clients-page__section-heading">
              <div>
                <p className="section-label">Selected collaborations</p>
                <h2 id="clients-page-title">Work we can share.</h2>
              </div>
              <p>
                Each entry comes from the private client list in our project
                data. We publish it only when the work and attribution are
                approved for sharing.
              </p>
            </div>
            {clients.length ? (
              <ClientGrid clients={clients} />
            ) : (
              <div className="clients-empty">
                <p className="section-label">A practice in progress</p>
                <h3>Every collaboration starts with a useful question.</h3>
                <p>
                  There are no public client stories here yet. Bring an idea,
                  an early sketch, or a problem you’re trying to understand.
                </p>
                <Link className="button button-dark" href="/contact">
                  Start a conversation <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
