"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  label: string;
  className?: string;
  scrollOnOverflow?: boolean;
};

export function Marquee({ children, label, className, scrollOnOverflow = false }: MarqueeProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const container = viewport.current;
    const items = track.current;
    if (!scrollOnOverflow || !container || !items) return;

    const measure = () => {
      setOverflowing(items.getBoundingClientRect().width > container.getBoundingClientRect().width);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(items);
    return () => observer.disconnect();
  }, [scrollOnOverflow]);

  const scrolling = overflowing && Children.count(children) > 1;

  return (
    <div
      ref={viewport}
      className={["mq", scrollOnOverflow && "mq-fit", className].filter(Boolean).join(" ")}
      role="group"
      aria-label={label}
      data-scrolling={scrollOnOverflow && scrolling ? true : undefined}
      tabIndex={scrollOnOverflow && overflowing ? 0 : undefined}
    >
      <div ref={track} className="mq-t">{children}</div>
      {(!scrollOnOverflow || scrolling) && <div className="mq-t" aria-hidden="true" inert>{children}</div>}
    </div>
  );
}
