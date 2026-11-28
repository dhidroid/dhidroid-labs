// Read frontmatter and Markdown bodies from the bundled content files.
type SourceContext = {
  (file: string): string;
  keys(): string[];
};

declare const require: { context: (path: string, recursive: boolean, pattern: RegExp) => SourceContext };

export type FrontMatter = {
  title: string;
  excerpt?: string;
  icon?: string;
  date?: string;
  readingTime?: number;
  type?: string;
  summary?: string;
  problem?: string;
  stack?: string[];
  status?: string;
  [key: string]: unknown;
};

export type MDXFile = { slug: string; fm: FrontMatter; content: string };

function parseFrontMatter(raw: string): { fm: FrontMatter; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { fm: {} as FrontMatter, body: raw };
  const fm: Record<string, unknown> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, k, v] = kv;
    if (v.startsWith("[")) {
      fm[k] = v.replace(/[\[\]"']/g, "").split(",").map((s) => s.trim()).filter(Boolean);
    } else {
      fm[k] = v.replace(/^["']|["']$/g, "");
    }
  }
  return { fm: fm as FrontMatter, body: m[2] };
}

function readFiles(context: SourceContext): MDXFile[] {
  return context.keys()
    .map((file) => {
      const slug = file.replace(/^\.\//, "").replace(/\.mdx?$/, "");
      const { fm, body } = parseFrontMatter(context(file));
      return { slug, fm, content: body };
    })
    .sort((a, b) => (b.fm.date ?? "").localeCompare(a.fm.date ?? ""));
}

// Bundle the existing articles and prototypes so Cloudflare can render them without filesystem access.
const files = {
  projects: readFiles(require.context("../content/projects", false, /\.mdx?$/)),
  blog: readFiles(require.context("../content/blog", false, /\.mdx?$/)),
};

export function getMDXFiles(dir: keyof typeof files): MDXFile[] {
  return files[dir];
}
