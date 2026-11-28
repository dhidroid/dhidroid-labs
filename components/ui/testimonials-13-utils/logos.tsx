export function CompanyLogo({ name, src }: { name: string; src?: string }) {
  return typeof src === "string" && src.startsWith("https://") ? (
    <img src={src} alt={name} loading="lazy" className="max-h-12 max-w-full object-contain" />
  ) : (
    <span className="text-center text-lg font-semibold tracking-tight text-muted-foreground">{name}</span>
  );
}
