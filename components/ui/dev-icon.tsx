const devicons = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  react: "React",
  nextjs: "Next.js",
  nodejs: "Node.js",
  python: "Python",
  postgresql: "PostgreSQL",
  docker: "Docker",
  git: "Git",
  github: "GitHub",
  html5: "HTML",
  css3: "CSS",
  java: "Java",
  go: "Go",
  rust: "Rust",
  php: "PHP",
  ruby: "Ruby",
} as const;

export type DevIconName = keyof typeof devicons;

type DevIconProps = {
  name: DevIconName;
  size?: number;
  className?: string;
  decorative?: boolean;
};

/** A small, version-pinned SVG from the official Devicon CDN collection. */
export function DevIcon({
  name,
  size = 24,
  className,
  decorative = false,
}: DevIconProps) {
  return (
    // SVGs are served directly by Devicon; they do not need raster optimization.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/${name}/${name}-original.svg`}
      width={size}
      height={size}
      alt={decorative ? "" : devicons[name]}
      aria-hidden={decorative || undefined}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
