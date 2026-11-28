export function getNewsletterApiEndpoint(): string | undefined {
  const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_API_URL?.trim();

  // If an explicit override is provided, validate and use it.
  if (endpoint) {
    if (process.env.NODE_ENV !== "development") {
      try {
        const url = new URL(endpoint);
        if (url.protocol !== "https:" || url.pathname === "/") return undefined;
      } catch {
        return undefined;
      }
    }
    return endpoint;
  }

  // Fall back to the bundled API route — works in both dev and production
  // (Cloudflare Workers via @opennextjs/cloudflare serves Next.js API routes).
  return "/api/newsletter";
}
