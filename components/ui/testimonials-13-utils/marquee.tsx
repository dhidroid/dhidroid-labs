import type { ReactNode } from "react";
import { Marquee as SharedMarquee } from "@/app/marquee";

export function Marquee({ children }: { children: ReactNode }) {
  return <SharedMarquee label="Client testimonials" className="testimonials-marquee" scrollOnOverflow>{children}</SharedMarquee>;
}
