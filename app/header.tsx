"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [["Services", "services"], ["Projects", "projects"], ["Pricing", "pricing"], ["Engineering", "engineering"], ["Developers", "developers"], ["Blog", "blog"], ["About", "about"]];

/** Sticky header: glass background after a little scroll, hides on scroll down, returns on scroll up. */
export function Header() {
  const path = usePathname();
  const [on, setOn] = useState(false);
  const [off, setOff] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const f = () => { const y = window.scrollY; setOn(y > 12); setOff(y > last && y > 160); last = y; };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`hd${on ? " on" : ""}${off ? " off" : ""}`}>
      <div className="hd-in">
        <Link className="logo" href="/">Dhidroid <i>Labs</i></Link>
        <nav className="glass pill" aria-label="Primary">
          {nav.map(([t, s]) => <Link key={s} href={`/${s}`} aria-current={path.startsWith(`/${s}`) ? "page" : undefined}>{t}</Link>)}
        </nav>
        <Link className="btn paper" href="/contact">Let’s talk</Link>
      </div>
    </header>
  );
}
