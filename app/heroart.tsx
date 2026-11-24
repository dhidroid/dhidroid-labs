"use client";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

// Original generative artwork: stippled, grainy colour fields (x, y, rx, ry as fractions, colour).
const blobs: [number, number, number, number, string][] = [
  [0.04, 0.86, 0.26, 0.2, "#3b5bdb"], [0.18, 0.8, 0.16, 0.14, "#1f6f5c"], [0.1, 0.97, 0.24, 0.12, "#e9437a"],
  [0.46, 1.0, 0.3, 0.14, "#f4c20d"], [0.7, 0.93, 0.22, 0.2, "#ff5a47"], [0.96, 0.6, 0.2, 0.34, "#ff7a5c"],
  [0.9, 0.28, 0.14, 0.22, "#f59bb4"], [1.0, 0.08, 0.16, 0.2, "#3b5bdb"], [0.97, 0.8, 0.12, 0.2, "#f4c20d"], [0.06, 0.02, 0.14, 0.14, "#9db7ff"],
];

export function HeroArt() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d")!;
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), w = c.clientWidth, h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rnd = d3.randomLcg(7);
      for (let i = 0, n = Math.min(w * h * 0.55, 800000); i < n; i++) {
        const x = rnd() * w, y = rnd() * h;
        let sum = 0, best = 0, pick = 0;
        blobs.forEach(([bx, by, rx, ry], k) => {
          const dx = (x / w - bx) / rx, dy = (y / h - by) / ry, v = Math.exp(-1.6 * (dx * dx + dy * dy)), s = v * rnd();
          sum += v;
          if (s > best) { best = s; pick = k; }
        });
        if (rnd() < Math.min(1, sum) ** 1.3) { ctx.fillStyle = blobs[pick][4]; ctx.fillRect(x, y, 1.5, 1.5); }
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);
  return <canvas ref={ref} aria-hidden="true" />;
}
