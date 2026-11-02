export type MarkdownHeading = {
  id: string;
  text: string;
  level: number;
};

/** Use the same slugger for the article contents and rendered heading anchors. */
export function createHeadingSlugger() {
  const occurrences = new Map<string, number>();

  return (text: string) => {
    const base =
      text
        .normalize("NFKD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-") || "section";
    const count = occurrences.get(base) ?? 0;
    occurrences.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

function plainHeading(text: string) {
  return text
    .replace(/!?\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

export function getMarkdownHeadings(content: string): MarkdownHeading[] {
  const slug = createHeadingSlugger();
  const headings: MarkdownHeading[] = [];
  let fence: string | null = null;

  for (const line of content.split(/\r?\n/)) {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (fence === null) fence = marker[1][0];
      else if (fence === marker[1][0]) fence = null;
      continue;
    }
    if (fence !== null) continue;

    const match = line.match(/^\s{0,3}(#{1,6})\s+(.+)$/);
    if (!match) continue;
    const text = plainHeading(match[2]);
    headings.push({ id: slug(text), text, level: match[1].length });
  }

  return headings;
}
