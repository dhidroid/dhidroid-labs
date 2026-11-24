import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Header } from "./header";
import { Footer } from "./chrome";
import { PageLoader } from "./pageloader";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: "Dhidroid Labs | Web, Mobile & AI Product Engineering",
  description: "Dhidroid Labs builds thoughtful web apps, React Native mobile products and practical AI automation for founders and growing businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body id="top"><PageLoader /><Header />{children}<Footer /></body>
    </html>
  );
}
