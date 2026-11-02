"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "@/components/landing/brand";
import { navigation } from "@/lib/site-content";

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  return (
    <header
      id="top"
      className={`site-header ${overlay ? "header-overlay" : ""}`}
    >
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={
                item.href === pathname ||
                (item.href === "/journal" && pathname.startsWith("/blog")) ||
                (item.href === "/developers" && pathname.startsWith("/developers/"))
                  ? "page"
                  : undefined
              }
            >
              {item.label}
            </Link>
          ))}
          <Link className="button button-small button-dark" href="/contact">
            Let’s talk <ArrowUpRight size={13} />
          </Link>
        </nav>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
              <ArrowUpRight size={16} />
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}>
            Let’s talk <ArrowUpRight size={16} />
          </Link>
        </nav>
      )}
    </header>
  );
}
