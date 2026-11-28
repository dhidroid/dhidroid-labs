// Devicon SVGs from devicon.dev via jsDelivr. "name:variant" picks a non-default variant.
export function Dev({ n, label }: { n: string; label?: string }) {
  const [name, v = "original"] = n.split(":");
  return <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${name}/${name}-${v}.svg`} alt={label ?? name} title={label ?? name} width={24} height={24} loading="lazy" />;
}
