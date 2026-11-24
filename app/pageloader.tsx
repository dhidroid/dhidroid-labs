"use client";
import { useEffect, useState } from "react";

export function PageLoader() {
  const [out, setOut] = useState(false);
  useEffect(() => {
    // Fade out after a short delay so the loader doesn't flicker on fast loads
    const t = setTimeout(() => setOut(true), 350);
    return () => clearTimeout(t);
  }, []);
  if (out) return null;
  return (
    <div className={`ldr-overlay${out ? " ldr-out" : ""}`} aria-label="Loading" role="status">
      <div className="ldr-logo">Dhidroid <i>Labs</i></div>
      <div className="ldr-bar"><div className="ldr-bar-fill" /></div>
    </div>
  );
}
