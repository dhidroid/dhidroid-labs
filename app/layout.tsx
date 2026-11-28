import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./tailwind.css";
import { Header } from "./header";
import { Footer } from "./chrome";
import { PageLoader } from "./pageloader";
import { SiteAnalytics } from "./site-analytics";
import { LiveContent } from "./live-content";
import { siteUrl } from "../lib/site-url";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dhidroid Labs | Web, Mobile & AI Product Engineering",
    template: "%s | Dhidroid Labs",
  },
  description:
    "Dhidroid Labs is an independent product engineering studio in Chennai, India. We build thoughtful web apps, React Native mobile products and practical AI automation for founders and growing businesses.",
  keywords: [
    "web development",
    "mobile app development",
    "React Native",
    "Next.js",
    "AI automation",
    "product engineering",
    "MVP development",
    "software studio",
    "Chennai",
    "India",
    "TypeScript",
    "full-stack development",
  ],
  authors: [{ name: "Dhidroid Labs", url: siteUrl }],
  creator: "Dhidroid Labs",
  publisher: "Dhidroid Labs",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    siteName: "Dhidroid Labs",
    title: "Dhidroid Labs | Web, Mobile & AI Product Engineering",
    description:
      "Independent product engineering studio building web apps, React Native mobile products and AI automation for founders and growing businesses.",
    url: siteUrl,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhidroid Labs | Web, Mobile & AI Product Engineering",
    description:
      "Independent product engineering studio building web apps, React Native mobile products and AI automation for founders and growing businesses.",
    creator: "@dhidroid",
  },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body id="top"><LiveContent /><SiteAnalytics /><PageLoader /><Header />{children}<Footer /></body>
    </html>
  );
}
