"use client";

import * as React from "react";

export type ContributionDay = { date: string; count: number };
type View = "2d" | "3d";
type Cell = ContributionDay & { level: number; week: number; day: number };
export type PaletteName = "github" | "halloween" | "ocean" | "ember" | "grape" | "mono";
export type PaletteInput = PaletteName | string[] | { light: string[]; dark: string[] };

const palettes: Record<PaletteName, string[]> = {
  github: ["#d7e5cb", "#a9c58e", "#78a05f", "#3f7335"],
  halloween: ["#ffee4a", "#ffc501", "#fe9600", "#b33c00"],
  ocean: ["#b8e3f5", "#6ec3eb", "#2a8fd1", "#0b4f8a"],
  ember: ["#fde2c4", "#fbad6e", "#f06b3a", "#b3261e"],
  grape: ["#e4d4fb", "#b794f4", "#805ad5", "#44337a"],
  mono: ["#d4d4d4", "#a3a3a3", "#525252", "#171717"],
};

export interface ContributionSkylineProps {
  /** One entry per day in YYYY-MM-DD format. Repeated dates are combined. */
  data?: ContributionDay[];
  /** Last day shown. Defaults to the latest date in data, or today. */
  endDate?: string | Date;
  view?: View;
  defaultView?: View;
  onViewChange?: (view: View) => void;
  palette?: PaletteInput;
  title?: React.ReactNode;
  unit?: string;
  unitPlural?: string;
  heightScale?: number;
  duration?: number;
  orbit?: boolean;
  weekStart?: 0 | 1;
  showStats?: boolean;
  showLegend?: boolean;
  showToggle?: boolean;
  footer?: React.ReactNode;
  locale?: string;
  seed?: number;
  onCellClick?: (day: ContributionDay) => void;
  className?: string;
}

const DAY_MS = 86_400_000;
const toKey = (time: number) => new Date(time).toISOString().slice(0, 10);

function dayMs(value: string | Date): number {
  if (value instanceof Date) {
    return Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (match) return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function createSampleData(end: number, seed: number): ContributionDay[] {
  let state = seed >>> 0;
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };

  return Array.from({ length: 365 }, (_, index) => {
    const time = end - (364 - index) * DAY_MS;
    const weekday = new Date(time).getUTCDay();
    const chance = weekday === 0 || weekday === 6 ? 0.25 : 0.58;
    const count = random() < chance ? 1 + Math.floor(random() * 8) : 0;
    return { date: toKey(time), count };
  });
}

function buildCells(
  data: ContributionDay[],
  end: number,
  weekStart: 0 | 1,
): { cells: Cell[]; weeks: Cell[][] } {
  const counts = new Map<string, number>();
  for (const item of data) {
    const date = dayMs(item.date);
    const count = Number(item.count);
    if (!Number.isFinite(date) || !Number.isFinite(count) || count <= 0) continue;
    const key = toKey(date);
    counts.set(key, (counts.get(key) ?? 0) + count);
  }

  const firstDay = end - 364 * DAY_MS;
  const start = firstDay - ((new Date(firstDay).getUTCDay() - weekStart + 7) % 7) * DAY_MS;
  const cells: Cell[] = [];
  for (let time = start; time <= end; time += DAY_MS) {
    const index = Math.round((time - start) / DAY_MS);
    const date = toKey(time);
    cells.push({
      date,
      count: counts.get(date) ?? 0,
      level: 0,
      week: Math.floor(index / 7),
      day: index % 7,
    });
  }

  const activeCounts = cells.map((cell) => cell.count).filter((count) => count > 0).sort((a, b) => a - b);
  const busy = activeCounts.length
    ? activeCounts[Math.floor(0.95 * (activeCounts.length - 1))]
    : 0;
  for (const cell of cells) {
    cell.level = cell.count <= 0 ? 0 : busy <= 0 ? 4 : 1 + Math.min(3, Math.floor((cell.count / busy) * 4));
  }

  const lastCell = cells[cells.length - 1];
  const weekCount = lastCell ? lastCell.week + 1 : 0;
  const weeks = Array.from({ length: weekCount }, () => [] as Cell[]);
  for (const cell of cells) weeks[cell.week].push(cell);
  return { cells, weeks };
}

export default function ContributionSkyline({
  data,
  endDate,
  view: controlledView,
  defaultView = "2d",
  onViewChange,
  palette = "github",
  title,
  unit = "contribution",
  unitPlural = `${unit}s`,
  heightScale = 1,
  duration = 500,
  orbit = true,
  weekStart = 0,
  showStats = true,
  showLegend = true,
  showToggle = true,
  footer,
  locale = "en-US",
  seed = 7,
  onCellClick,
  className = "",
}: ContributionSkylineProps) {
  const { cells, weeks } = React.useMemo(() => {
    const latest = data?.reduce((max, item) => Math.max(max, dayMs(item.date)), 0) ?? 0;
    const end = endDate
      ? dayMs(endDate)
      : latest || dayMs(new Date());
    return buildCells(data ?? createSampleData(end, seed), end, weekStart);
  }, [data, endDate, seed, weekStart]);

  const [innerView, setInnerView] = React.useState<View>(defaultView);
  const [focusedCell, setFocusedCell] = React.useState(-1);
  const [legendLevel, setLegendLevel] = React.useState(-1);
  const [rotation, setRotation] = React.useState({ x: 54, z: -12 });
  const gridRef = React.useRef<HTMLDivElement>(null);
  const dragStart = React.useRef<{ x: number; y: number; rotationX: number; rotationZ: number } | null>(null);
  const view = controlledView ?? innerView;

  const setView = (nextView: View) => {
    if (controlledView === undefined) setInnerView(nextView);
    onViewChange?.(nextView);
  };

  const total = cells.reduce((sum, cell) => sum + cell.count, 0);
  const busiest = cells.reduce<Cell | null>(
    (best, cell) => (cell.count > (best?.count ?? 0) ? cell : best),
    null,
  );
  let longestStreak = 0;
  let currentStreak = 0;
  for (const cell of cells) {
    currentStreak = cell.count > 0 ? currentStreak + 1 : 0;
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  const numberFormat = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const dateFormat = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", timeZone: "UTC" }),
    [locale],
  );
  const weekdayNames = weekStart === 1
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = weeks.map((week, index) => {
    const date = week[0]?.date;
    if (!date) return "";
    const month = new Date(dayMs(date)).getUTCMonth();
    const previousMonth = index > 0 && weeks[index - 1][0]
      ? new Date(dayMs(weeks[index - 1][0].date)).getUTCMonth()
      : -1;
    return month !== previousMonth
      ? new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(dayMs(date))
      : "";
  });

  const focusAt = (index: number) => {
    const next = Math.max(0, Math.min(cells.length - 1, index));
    setFocusedCell(next);
    gridRef.current
      ?.querySelectorAll<HTMLButtonElement>("[data-contribution-cell]")
      .item(next)
      ?.focus();
  };

  const handleCellKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = {
      ArrowLeft: -7,
      ArrowRight: 7,
      ArrowUp: -1,
      ArrowDown: 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      focusAt(index + moves[event.key]);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAt(cells.length - 1);
    }
  };

  const noun = total === 1 ? unit : unitPlural;
  const colorLevels = Array.isArray(palette)
    ? palette
    : typeof palette === "object"
      ? palette.light
      : palettes[palette];
  const paletteStyle = {
    "--contribution-0": "#e9ece5",
    "--contribution-1": colorLevels[0] ?? palettes.github[0],
    "--contribution-2": colorLevels[1] ?? palettes.github[1],
    "--contribution-3": colorLevels[2] ?? palettes.github[2],
    "--contribution-4": colorLevels[3] ?? palettes.github[3],
    "--transition-duration": `${Math.max(0, duration)}ms`,
    "--skyline-height-scale": Math.max(0.25, heightScale),
  } as React.CSSProperties;

  const cellClassName =
    "h-3 w-full rounded-[2px] border-0 p-0 shadow-[inset_0_0_0_1px_#0000000b] transition-[opacity,transform,box-shadow] duration-[350ms] hover:z-[1] hover:scale-[1.2] focus-visible:z-[1] focus-visible:scale-[1.2] focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2";

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!orbit || view !== "3d" || (event.pointerType === "mouse" && event.button !== 0)) return;
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      rotationX: rotation.x,
      rotationZ: rotation.z,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start || !orbit || view !== "3d") return;
    setRotation({
      x: Math.max(22, Math.min(72, start.rotationX + (start.y - event.clientY) * 0.18)),
      z: Math.max(-38, Math.min(24, start.rotationZ + (event.clientX - start.x) * 0.16)),
    });
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section
      className={`border border-line bg-[#fbfaf7] p-4 text-ink sm:p-[22px] ${className}`}
      style={paletteStyle}
      aria-label="GitHub contribution activity"
    >
      <header className="flex flex-col items-start justify-between gap-[18px] min-[901px]:flex-row min-[901px]:items-center">
        <div>
          <p className="section-label mb-[9px] text-[8px] text-[#81867c]">GitHub activity</p>
          <h3 className="text-[13px] leading-[1.5]">
            {title ?? <><strong className="tabular-nums">{numberFormat.format(total)}</strong> {noun} in the last year</>}
          </h3>
        </div>
        {showToggle && (
          <div className="inline-flex shrink-0 gap-[3px] border border-line bg-[#f2f1ec] p-[3px]" role="group" aria-label="Calendar view">
            <button className="min-h-[29px] border-0 bg-transparent px-[9px] text-[9px] text-[#777c73] transition-colors aria-[pressed=true]:bg-[#30332d] aria-[pressed=true]:text-white" type="button" aria-pressed={view === "2d"} onClick={() => setView("2d")}>
              Grid
            </button>
            <button className="min-h-[29px] border-0 bg-transparent px-[9px] text-[9px] text-[#777c73] transition-colors aria-[pressed=true]:bg-[#30332d] aria-[pressed=true]:text-white" type="button" aria-pressed={view === "3d"} onClick={() => setView("3d")}>
              Skyline
            </button>
          </div>
        )}
      </header>

      {showStats && (
        <div className="mt-[18px] grid grid-cols-3 gap-2 border-t border-[#e5e5dd] pt-5 pb-[17px] min-[520px]:gap-[15px]" aria-label="Contribution summary">
          <div className="grid gap-[5px]"><span className="text-[9px] text-[#81867c]">Total</span><strong className="text-[13px] tabular-nums text-[#3c5e34]">{numberFormat.format(total)}</strong></div>
          <div className="grid gap-[5px]"><span className="text-[9px] text-[#81867c]">Busiest day</span><strong className="text-[13px] tabular-nums text-[#3c5e34]">{busiest?.count ? dateFormat.format(dayMs(busiest.date)) : "—"}</strong></div>
          <div className="grid gap-[5px]"><span className="text-[9px] text-[#81867c]">Longest run</span><strong className="text-[13px] tabular-nums text-[#3c5e34]">{longestStreak} days</strong></div>
        </div>
      )}

      <div className="overflow-x-auto border-y border-[#e5e5dd] py-[15px] pb-4">
        <div className="min-w-[720px]">
          <div
            className="mb-[7px] grid min-h-[17px] items-end text-[8px] text-[#82877e]"
            style={{ gridTemplateColumns: `34px repeat(${weeks.length}, minmax(10px, 1fr))` }}
            aria-hidden="true"
          >
            <span />
            {months.map((month, index) => <span key={index}>{month}</span>)}
          </div>
          <div className="grid grid-cols-[34px_minmax(0,1fr)] gap-[3px]">
            <div className="grid grid-rows-[repeat(7,12px)] gap-[3px] text-[7px] leading-3 text-[#81867c]" aria-hidden="true">
              {weekdayNames.map((day, index) => (
                <span key={day} className={index % 2 === 0 ? "" : "invisible"}>{day}</span>
              ))}
            </div>
            <div
              ref={gridRef}
              className={`flex min-h-[102px] origin-[center_30%] items-start justify-between gap-[3px] transition-[transform,padding] duration-[var(--transition-duration)] ease-[cubic-bezier(0.2,0.7,0.2,1)] ${view === "3d" ? "cursor-grab touch-pan-y px-5 pt-3 pb-[30px] active:cursor-grabbing [--skyline-scale:0.91] max-[760px]:[--skyline-scale:0.82]" : ""}`}
              role="group"
              aria-label="Daily contributions for the last year"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onDoubleClick={() => setRotation({ x: 54, z: -12 })}
              style={{
                "--orbit-x": `${rotation.x}deg`,
                "--orbit-z": `${rotation.z}deg`,
                transform: view === "3d"
                  ? "perspective(900px) rotateX(var(--orbit-x, 54deg)) rotateZ(var(--orbit-z, -12deg)) scale(var(--skyline-scale))"
                  : "none",
              } as React.CSSProperties}
            >
              {weeks.map((week, weekIndex) => (
                <div className="grid min-w-0 flex-[1_1_0] grid-rows-[repeat(7,12px)] gap-[3px] [transform-style:preserve-3d]" key={weekIndex} role="group" aria-label={`Week starting ${week[0]?.date}`}>
                  {week.map((cell) => {
                    const index = cells.indexOf(cell);
                    const label = cell.count
                      ? `${numberFormat.format(cell.count)} ${cell.count === 1 ? unit : unitPlural} on ${dateFormat.format(dayMs(cell.date))}`
                      : `No ${unitPlural} on ${dateFormat.format(dayMs(cell.date))}`;
                    const dimmed = legendLevel >= 0 && cell.level !== legendLevel;
                    const rise = `${cell.level * 2}px`;
                    return (
                      <button
                        key={cell.date}
                        type="button"
                        data-contribution-cell
                        data-level={cell.level}
                        aria-label={label}
                        title={label}
                        tabIndex={focusedCell === index || (focusedCell < 0 && index === cells.length - 1) ? 0 : -1}
                        className={`${cellClassName} ${dimmed ? "opacity-[0.22]" : ""}`}
                        style={{
                          backgroundColor: `var(--contribution-${cell.level})`,
                          "--rise": rise,
                          transform: view === "3d"
                            ? "translateZ(calc(var(--rise) * var(--skyline-height-scale, 1))) translateY(calc(var(--rise) * -0.35))"
                            : undefined,
                          boxShadow: view === "3d"
                            ? "0 calc(var(--rise) * var(--skyline-height-scale, 1)) 0 #263c24, 0 0 0 1px #0000000b"
                            : undefined,
                        } as React.CSSProperties}
                        onFocus={() => setFocusedCell(index)}
                        onKeyDown={(event) => handleCellKeyDown(event, index)}
                        onClick={() => onCellClick?.({ date: cell.date, count: cell.count })}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-[18px] pt-[15px] text-[8px] text-[#81867c]">
        <span>
          {footer ?? (view === "3d" && orbit
            ? "Drag to orbit · double-click to reset · use arrow keys to explore"
            : "Focus a day for details · use arrow keys to explore")}
        </span>
        {showLegend && (
          <div className="inline-flex items-center gap-1" onMouseLeave={() => setLegendLevel(-1)}>
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <button
                key={level}
                type="button"
                data-level={level}
                className="size-[11px] rounded-[2px] border-0 p-0 shadow-[inset_0_0_0_1px_#0000000b] transition-[opacity,transform,box-shadow] duration-[350ms] aria-[pressed=true]:outline aria-[pressed=true]:outline-1 aria-[pressed=true]:outline-ink aria-[pressed=true]:outline-offset-2"
                aria-label={`Highlight ${["no", "light", "moderate", "heavy", "very heavy"][level]} activity days`}
                aria-pressed={legendLevel === level}
                style={{ backgroundColor: `var(--contribution-${level})` }}
                onMouseEnter={() => setLegendLevel(level)}
                onFocus={() => setLegendLevel(level)}
                onBlur={() => setLegendLevel(-1)}
                onClick={() => setLegendLevel((current) => current === level ? -1 : level)}
              />
            ))}
            <span>More</span>
          </div>
        )}
      </footer>
    </section>
  );
}
