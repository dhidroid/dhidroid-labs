// Lightweight MDX/Markdown reader — parses frontmatter + markdown body from content/*.mdx files.
// No external parser needed; uses a hand-rolled regex pass that covers headings, bold,
// paragraphs, tables, horizontal rules, inline code and fenced code blocks.
import fs from "fs";
import path from "path";

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

export type MDXFile = { slug: string; fm: FrontMatter; content: string; html: string };

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

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlineMarkdown(s: string): string {
  return escHtml(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(md: string): string {
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inCode = false, codeLang = "", codeBuf: string[] = [];
  let inTable = false, tableRows: string[][] = [];
  let pBuf: string[] = [];

  function flushP() {
    if (pBuf.length) { out.push(`<p>${pBuf.map(inlineMarkdown).join(" ")}</p>`); pBuf = []; }
  }
  function flushTable() {
    if (!tableRows.length) return;
    const [head, , ...body] = tableRows;
    out.push("<div class=\"mdx-table-wrap\"><table>");
    out.push("<thead><tr>" + head.map((c) => `<th>${inlineMarkdown(c)}</th>`).join("") + "</tr></thead>");
    if (body.length) out.push("<tbody>" + body.map((r) => "<tr>" + r.map((c) => `<td>${inlineMarkdown(c)}</td>`).join("") + "</tr>").join("") + "</tbody>");
    out.push("</table></div>");
    tableRows = []; inTable = false;
  }

  for (const raw of lines) {
    // Fenced code block
    if (!inCode && raw.startsWith("```")) {
      flushP(); codeLang = raw.slice(3).trim(); inCode = true; codeBuf = []; continue;
    }
    if (inCode) {
      if (raw.startsWith("```")) {
        out.push(`<pre class="code" tabIndex="0"><code class="language-${codeLang}">${codeBuf.map(escHtml).join("\n")}</code></pre>`);
        inCode = false;
      } else { codeBuf.push(raw); }
      continue;
    }
    // HR
    if (/^---+$/.test(raw.trim())) { flushP(); flushTable(); out.push("<hr />"); continue; }
    // Table row
    if (raw.includes("|") && raw.trim().startsWith("|")) {
      flushP(); inTable = true;
      tableRows.push(raw.trim().slice(1, -1).split("|").map((c) => c.trim()));
      continue;
    }
    if (inTable) flushTable();
    // Headings
    const hm = raw.match(/^(#{1,4})\s+(.*)/);
    if (hm) { flushP(); const lvl = hm[1].length; const id = hm[2].toLowerCase().replace(/[^\w]+/g, "-"); out.push(`<h${lvl} id="${id}">${inlineMarkdown(hm[2])}</h${lvl}>`); continue; }
    // Blank line
    if (!raw.trim()) { flushP(); continue; }
    // Unordered list item
    if (/^[-*]\s/.test(raw)) { flushP(); out.push(`<li>${inlineMarkdown(raw.slice(2))}</li>`); continue; }
    // Ordered list item
    if (/^\d+\.\s/.test(raw)) { flushP(); out.push(`<li>${inlineMarkdown(raw.replace(/^\d+\.\s/, ""))}</li>`); continue; }
    // Paragraph accumulation
    pBuf.push(raw);
  }
  flushP(); if (inTable) flushTable();

  // Wrap adjacent <li> in <ul>
  const joined = out.join("\n");
  return joined.replace(/(<li>[\s\S]*?<\/li>(\n|$))+/g, (m) => `<ul>${m}</ul>`);
}

export function getMDXFiles(dir: string): MDXFile[] {
  const base = path.join(process.cwd(), "content", dir);
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.(mdx|md)$/, "");
      const raw = fs.readFileSync(path.join(base, f), "utf8");
      const { fm, body } = parseFrontMatter(raw);
      const html = markdownToHtml(body);
      return { slug, fm, content: body, html };
    })
    .sort((a, b) => (b.fm.date ?? "").localeCompare(a.fm.date ?? ""));
}

export function getMDXFile(dir: string, slug: string): MDXFile | null {
  const all = getMDXFiles(dir);
  return all.find((f) => f.slug === slug) ?? null;
}
