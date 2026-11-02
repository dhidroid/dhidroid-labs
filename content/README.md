# Journal content

Articles live in `blog/*.md`. Each file name becomes its `/blog/[slug]` URL.

The three initial article titles were taken from the Figma journal. Their article bodies and descriptions are original starter copy for this implementation, because the complete source article copy was not available. Review or replace that copy before publishing it as the studio's editorial work.

Use this frontmatter for each article:

```yaml
---
title: "An article title"
description: "A short summary for the journal index and search previews."
category: "Engineering"
date: "2026-11-02"
readTime: "5 min read"
image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=85"
imageAlt: "Sunlight passing through a forest canopy"
featured: false
---
```

`title`, `description`, `category`, `date`, `image`, and `imageAlt` are required. `readTime` is calculated from the word count when omitted. Set `featured: true` to choose the featured article. Articles are ordered by date, newest first. Use lowercase file names separated by hyphens.

Write the body in Markdown. Headings automatically receive stable section links, and GitHub-flavored tables, task lists, fenced code blocks, and ordinary links are supported. Raw HTML is not executed.

## Standalone pages

The editorial copy for the standalone **Our practice**, **About Dhidroid**, and **The work** pages lives in `pages/*.mdx`. Their route files provide the page title, description, and layout; the MDX files provide the page body. GitHub-flavored Markdown is enabled for these pages.

The routes are `/practice`, `/about`, and `/work`. The journal index is `/journal`; it lists the Markdown articles above, whose individual URLs remain `/blog/<slug>`. The contact page is `/contact`.
