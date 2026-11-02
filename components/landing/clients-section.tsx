import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ClientGrid } from "@/components/clients/client-grid";
import type { Client } from "@/lib/clients";

export function ClientsSection({ clients }: { clients: Client[] }) {
  return (
    <section className="clients-section section-space" aria-labelledby="clients-title">
      <div className="container">
        <div className="clients-section__heading">
          <div>
            <p className="section-label">Working together</p>
            <h2 id="clients-title" className="section-heading">
              Good work grows through trust.
            </h2>
            <p>
              We share client work only with permission. Each public story
              reflects a real collaboration and the care behind it.
            </p>
          </div>
          <Link className="text-link" href="/clients">
            {clients.length ? "See the collaborations" : "How we collaborate"}{" "}
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
        {clients.length ? (
          <ClientGrid clients={clients.slice(0, 4)} />
        ) : (
          <div className="clients-home-note">
            <span className="section-label">Open to thoughtful work</span>
            <p>
              A clear problem is enough to begin. We can find the next step
              together.
            </p>
            <Link href="/contact" className="text-link">
              Tell us what you’re exploring <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
