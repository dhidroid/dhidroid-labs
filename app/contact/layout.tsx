import type { ReactNode } from "react";
import { pageMetadata } from "../../lib/seo";

export function generateMetadata() {
  return pageMetadata("/contact", {
    title: "Contact | Dhidroid Labs",
    description: "Tell us what you’re trying to solve. Send a project brief or book a discovery call with Dhidroid Labs.",
  });
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
