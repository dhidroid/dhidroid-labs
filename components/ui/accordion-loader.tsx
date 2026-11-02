import type { ComponentProps, CSSProperties } from "react";
import { cn } from "@/lib/utils";

const ACCORDION_LOADER_BLOCKS = ["█", "▓", "▒"] as const;

type AccordionLoaderProps = ComponentProps<"span"> & {
  blocks?: readonly string[];
  track?: string;
  trackLength?: number;
};

function AccordionLoader({
  className,
  blocks = ACCORDION_LOADER_BLOCKS,
  track = "░",
  trackLength = 16,
  style,
  ...props
}: AccordionLoaderProps) {
  const requestedColumns = Number.isFinite(trackLength)
    ? Math.floor(trackLength)
    : 16;
  const columns = Math.max(2, requestedColumns);
  const glyphs = ACCORDION_LOADER_BLOCKS.map(
    (defaultGlyph, index) => blocks[index] ?? defaultGlyph,
  );

  return (
    <span
      role="status"
      className={cn(
        "relative inline-flex h-[1em] w-[var(--loader-width)] items-center overflow-hidden font-mono text-xl leading-none text-current select-none",
        className,
      )}
      style={
        {
          "--loader-width": `${columns}ch`,
          "--loader-x": `${columns - 1}ch`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 whitespace-nowrap"
      >
        {track.repeat(columns)}
      </span>
      {glyphs.map((glyph, index) => (
        <span
          key={`${glyph}-${index}`}
          aria-hidden="true"
          className={cn(
            "accordion-loader__glyph pointer-events-none absolute top-0 left-0 flex h-full w-[1ch] items-center justify-center text-center",
            ["z-30", "z-20", "z-10"][index],
          )}
          style={{
            animationDelay: `calc(var(--delay, 0.04s) * ${index})`,
            backgroundColor:
              "var(--mask-color, var(--background, var(--paper, #f6f5f1)))",
          }}
        >
          {glyph}
        </span>
      ))}
      <span className="sr-only">Loading</span>
    </span>
  );
}

export { AccordionLoader };

export default AccordionLoader;
