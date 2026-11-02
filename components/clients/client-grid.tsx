import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Client } from "@/lib/clients";

export function ClientGrid({ clients }: { clients: Client[] }) {
  if (!clients.length) return null;

  return (
    <div className="client-grid" role="list">
      {clients.map((client, index) => (
        <article className="client-card" key={client.slug} role="listitem">
          <p className="section-label">
            {client.collaboration} <span> / {String(index + 1).padStart(2, "0")}</span>
          </p>
          <h3>{client.name}</h3>
          <p className="client-card__summary">{client.summary}</p>
          {client.websiteUrl && (
            <Link
              className="text-link"
              href={client.websiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Visit {client.name} <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
