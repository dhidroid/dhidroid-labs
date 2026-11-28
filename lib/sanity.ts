import { connection } from "next/server";

const projectId = process.env.SANITY_PROJECT_ID?.trim() || "pjmjgioq";
const dataset = process.env.SANITY_DATASET?.trim() || "production";
const api = `https://${projectId}.api.sanity.io/v2025-02-19/data`;

export const sanityLiveUrl = `${api}/live/events/${encodeURIComponent(dataset)}`;

export async function queryPublished<T>(query: string, params: Record<string, string> = {}): Promise<T | null> {
  await connection();
  const url = new URL(`${api}/query/${encodeURIComponent(dataset)}`);
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(`$${name}`, JSON.stringify(value));
  }

  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { result } = await response.json() as { result: T };
    return result ?? null;
  } catch (error) {
    console.warn("Published Sanity content could not be loaded.", error instanceof Error ? error.message : error);
    return null;
  }
}
