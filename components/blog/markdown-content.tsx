import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { createHeadingSlugger } from "@/lib/markdown";

function textContent(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number")
        return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return textContent(child.props.children);
      }
      return "";
    })
    .join("");
}

export function MarkdownContent({ content }: { content: string }) {
  const slug = createHeadingSlugger();
  const components: Components = {
    h1: ({ children }) => <h1 id={slug(textContent(children))}>{children}</h1>,
    h2: ({ children }) => <h2 id={slug(textContent(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={slug(textContent(children))}>{children}</h3>,
    h4: ({ children }) => <h4 id={slug(textContent(children))}>{children}</h4>,
    h5: ({ children }) => <h5 id={slug(textContent(children))}>{children}</h5>,
    h6: ({ children }) => <h6 id={slug(textContent(children))}>{children}</h6>,
    a: ({ href, children }) => <a href={href}>{children}</a>,
    table: ({ children }) => (
      <div className="markdown-table">
        <table>{children}</table>
      </div>
    ),
  };

  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
