import "server-only";
import clientData from "@/data/clients.json";

export type Client = {
  slug: string;
  name: string;
  collaboration: string;
  summary: string;
  websiteUrl?: string;
};

type ClientRecord = {
  slug?: unknown;
  name?: unknown;
  collaboration?: unknown;
  summary?: unknown;
  websiteUrl?: unknown;
};

function httpsUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Returns only complete, public client stories configured in the private JSON source. */
export function getClients(): Client[] {
  const records = (clientData as { clients?: ClientRecord[] }).clients ?? [];

  return records.flatMap((record) => {
    const { slug, name, collaboration, summary } = record;
    if (
      typeof slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
      typeof name !== "string" ||
      !name.trim() ||
      typeof collaboration !== "string" ||
      !collaboration.trim() ||
      typeof summary !== "string" ||
      !summary.trim()
    ) {
      return [];
    }

    const websiteUrl = httpsUrl(record.websiteUrl);
    return [
      {
        slug,
        name: name.trim(),
        collaboration: collaboration.trim(),
        summary: summary.trim(),
        ...(websiteUrl ? { websiteUrl } : {}),
      },
    ];
  });
}
