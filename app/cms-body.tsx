import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { isValidElement, type ReactNode } from "react";
import type { ContentImage, RichText } from "../lib/published-content";
import { projectTechnologies } from "../lib/project-technologies";
import { siteUrl } from "../lib/site-url";
import { Dev } from "./dev";

export function CmsImage({ image, className = "cms-image", eager = false }: { image?: ContentImage; className?: string; eager?: boolean }) {
  if (!image?.url?.startsWith("https://cdn.sanity.io/images/")) return null;
  const url = new URL(image.url);
  url.searchParams.set("w", String(Math.min(image.width || 1200, 1200)));
  url.searchParams.set("auto", "format");
  return <img className={className} src={url.href} alt={image.alt ?? ""} width={image.width || undefined} height={image.height || undefined} loading={eager ? "eager" : "lazy"} />;
}

function headingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(headingText).join("");
  return isValidElement<{ children?: ReactNode }>(children) ? headingText(children.props.children) : "";
}

type Heading = "h2" | "h3" | "h4" | "h5" | "h6";

function ContentHeading({ as: Tag, id, children }: { as: Heading; id?: string; children?: ReactNode }) {
  const technologies = projectTechnologies(undefined, [headingText(children)]).filter(({ icon }) => Boolean(icon));
  return (
    <Tag id={id} className={technologies.length ? "content-tech-heading" : undefined}>
      {children}
      {technologies.length > 0 && (
        <span className="content-tech-icons" aria-hidden="true">
          {technologies.map(({ name, icon }) => icon && <Dev key={name} n={icon} label={name} />)}
        </span>
      )}
    </Tag>
  );
}

function ContentLink({ href, children }: { href?: string; children?: ReactNode }) {
  if (!href) return <>{children}</>;
  try {
    const url = new URL(href, siteUrl);
    if (url.origin === siteUrl && /^\/projects\/[a-z0-9-]+\/?$/i.test(url.pathname)) {
      return <Link href={url.pathname + url.search + url.hash}>{children}</Link>;
    }
    if (["https:", "http:", "mailto:"].includes(url.protocol)) return <a href={href}>{children}</a>;
  } catch {
    return <>{children}</>;
  }
  return <>{children}</>;
}

const markdownComponents: Components = {
  h1: ({ id, children }) => <ContentHeading as="h2" id={id}>{children}</ContentHeading>,
  h2: ({ id, children }) => <ContentHeading as="h2" id={id}>{children}</ContentHeading>,
  h3: ({ id, children }) => <ContentHeading as="h3" id={id}>{children}</ContentHeading>,
  h4: ({ id, children }) => <ContentHeading as="h4" id={id}>{children}</ContentHeading>,
  h5: ({ id, children }) => <ContentHeading as="h5" id={id}>{children}</ContentHeading>,
  h6: ({ id, children }) => <ContentHeading as="h6" id={id}>{children}</ContentHeading>,
  a: ({ href, children }) => <ContentLink href={href}>{children}</ContentLink>,
  img: ({ src, alt }) => src ? <img className="cms-image" src={src} alt={alt ?? ""} loading="lazy" /> : null,
  pre: ({ children }) => <pre className="code" tabIndex={0}>{children}</pre>,
  table: ({ children }) => <div className="mdx-table-wrap"><table>{children}</table></div>,
};

export function MarkdownBody({ value }: { value: string }) {
  return <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={markdownComponents} skipHtml>{value}</Markdown>;
}

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => <ContentHeading as="h2">{children}</ContentHeading>,
    h2: ({ children }) => <ContentHeading as="h2">{children}</ContentHeading>,
    h3: ({ children }) => <ContentHeading as="h3">{children}</ContentHeading>,
    h4: ({ children }) => <ContentHeading as="h4">{children}</ContentHeading>,
  },
  marks: { link: ({ value, children }) => <ContentLink href={value?.href}>{children}</ContentLink> },
  types: {
    image: ({ value }) => <CmsImage image={value} />,
    code: ({ value }) => <pre className="code" tabIndex={0}><code>{value.code}</code></pre>,
  },
};

export function CmsBody({ value }: { value: RichText }) {
  return <PortableText value={value} components={components} />;
}
