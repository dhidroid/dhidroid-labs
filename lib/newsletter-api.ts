export function getNewsletterApiEndpoint(): string | undefined {
  const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_API_URL?.trim();

  if (!endpoint) {
    return process.env.NODE_ENV === "development" ? "/api/newsletter" : undefined;
  }

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
