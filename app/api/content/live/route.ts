import { sanityLiveUrl } from "../../../../lib/sanity";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const headers = new Headers({ Accept: "text/event-stream" });
  const lastEventId = request.headers.get("last-event-id");
  if (lastEventId && lastEventId.length <= 256) headers.set("last-event-id", lastEventId);

  try {
    const upstream = await fetch(sanityLiveUrl, { headers, signal: request.signal, cache: "no-store" });
    if (upstream.ok && upstream.body && upstream.headers.get("content-type")?.startsWith("text/event-stream")) {
      return new Response(upstream.body, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-store, no-transform" } });
    }
    await upstream.body?.cancel();
  } catch {
    // Retry through EventSource when the upstream connection cannot be established.
  }

  return new Response("retry: 30000\n\n", { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-store" } });
}
