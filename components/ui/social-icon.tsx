type SocialIconName =
  | "github"
  | "instagram"
  | "linkedin"
  | "medium"
  | "stackoverflow"
  | "twitter"
  | "x";

type SocialIconProps = {
  name: SocialIconName;
  size?: number;
  className?: string;
};

const socialIconFiles: Record<SocialIconName, string> = {
  github: "tc-github.svg",
  instagram: "tc-instagram.svg",
  linkedin: "tc-linkedin.svg",
  medium: "tc-medium.svg",
  stackoverflow: "tc-stackoverflow.svg",
  twitter: "tc-twitter.svg",
  x: "tc-x.svg",
};

const socialIconsBaseUrl = "https://s.magecdn.com/social";

export function SocialIcon({ name, size = 16, className }: SocialIconProps) {
  // MageCDN serves these SVGs as image assets; Next Image optimization is unnecessary here.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${socialIconsBaseUrl}/${socialIconFiles[name]}`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={className}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}
