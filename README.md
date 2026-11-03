# DhiDroid Labs

A responsive landing page for DhiDroid Labs, built with Next.js, React, TypeScript, and Tailwind CSS v4.

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project structure

```text
app/
  globals.css                   Tailwind import and global theme
  layout.tsx                    Root layout, fonts, and metadata
  page.tsx                      Home route
components/
  landing/
    brand.tsx                   Reusable wordmark and brand mark
    capabilities-section.tsx    Services section
    contact-section.tsx         Contact call to action
    hero-section.tsx            Main landing page introduction
    landing-page.tsx             Page composition
    process-section.tsx         Studio approach section
    site-footer.tsx              Site footer
    site-header.tsx              Responsive navigation
lib/
  site-content.ts               Navigation, service, and process copy
public/                          Static assets
next.config.ts                  Next.js and Tailwind Turbopack configuration
package.json                    Dependencies and project scripts
LICENSE.md                      MIT license
```

## Styling

Tailwind CSS v4 is imported from `app/globals.css`. The `@tailwindcss/turbopack` loader is configured in `next.config.ts` for the Next.js Turbopack pipeline. Design tokens are defined with Tailwind's CSS-first `@theme` syntax in the global stylesheet.

## Updating site content

Edit `lib/site-content.ts` to change navigation and the Discord invitation. Landing-page copy lives with each section component; journal content lives in `content/blog/*.md`.

## Available scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the local development server |
| `npm run build` | Create a production build          |
| `npm run start` | Serve the production build         |
| `npm run lint`  | Run ESLint                         |

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

## Figma landing page and journal

The landing page follows the supplied Dhidroid Production page reference: Instrument Serif display text, Inter body text, JetBrains Mono labels, paper backgrounds, blue accents, project explorations, and a community invitation. The Figma connector reached the account's Starter-plan call limit before detailed screen context could be returned. The page was implemented from the available overview and visible text; exact copy and asset parity still need comparison against the full design. Photography is intentionally sourced from Unsplash as requested.

### Developer profiles

The `/developers` directory and `/developers/[github-login]` profile pages use `data/developers.json` as their server-side configuration. Add one object per developer with a public `githubUsername`, optional `bio`, and `socialProfiles` values. Social profile URLs must use HTTPS; `mediumUsername` is the Medium handle used to read that author's public RSS feed. Keep this JSON outside `public/` so it is loaded by the server rather than served as a raw static asset. Public profile details and repositories load without a token. Set a server-only `GITHUB_TOKEN` in `.env.local` to enable the full-year contribution calendar through GitHub GraphQL. For private contribution counts, the token needs the optional `read:user` scope and the GitHub profile must share private contribution totals.

Example profile entry:

```json
{
  "developers": [
    {
      "githubUsername": "your-github-login",
      "bio": "A short developer bio.",
      "socialProfiles": {
        "twitterUrl": "https://x.com/your-handle",
        "mediumUsername": "your-medium-handle",
        "linkedinUrl": "https://www.linkedin.com/in/your-profile",
        "instagramUrl": "https://www.instagram.com/your-profile",
        "stackOverflowUrl": "https://stackoverflow.com/users/your-id/your-profile"
      }
    }
  ]
}
```

Medium stories use Medium's public RSS feeds; no paid RSS service or API key is needed. Twitter falls back to the public X username on the GitHub profile. LinkedIn, Instagram, and Stack Overflow can fall back to links in each GitHub user's public social accounts when no JSON override is set. `GITHUB_TOKEN` remains in `.env.local` because it is a secret.

The MageCDN social icon URLs are used for GitHub, X/Twitter, Medium, LinkedIn, Instagram, and Stack Overflow in the profile page. The icon assets are embedded as SVG images from MageCDN.

- The live Discord invitation is configured in `lib/site-content.ts`.
- Public client stories live in `data/clients.json`, outside `public/`. Add a client only after the name, relationship, and summary are approved for public use; links must use HTTPS. The same JSON records feed the landing page and `/clients`.
- `/work` reads public repositories from the configured GitHub profile. Repository details refresh on a five-minute cache interval; the landing page derives its programming-language icons from that same feed and falls back to a small set of areas the lab explores when GitHub is unavailable.
- Main landing sections are in `components/landing/`.
- Add journal articles as `content/blog/<slug>.md`; frontmatter fields and starter-content details are documented in `content/README.md`.
- The journal index at `/blog` supports category filtering. Articles have permanent URLs, table-of-contents links, metadata, related reading, and missing-article handling.
- Programming icons use the typed `DevIcon` component in `components/ui/dev-icon.tsx` and a pinned Devicon CDN release. Interface icons use Lucide React.
- Locally hosted Unsplash photographs and source attribution are in `public/images/`.
- Markdown reads and the footer's current year use explicit Next.js cache boundaries for this project's Cache Components configuration.

## Routes

- `/` — landing page and recent journal notes
- `/work` — public GitHub repositories and exploratory project directions
- `/clients` — approved client stories from `data/clients.json`
- `/developers` and `/developers/[github-login]` — configured developer profiles and public GitHub data
- `/practice`, `/about`, and `/contact` — how the lab works, its background, and contact invitation
- `/journal` and `/blog/[slug]` — journal index and articles (`/blog` remains an alias)
- Unmatched routes use the branded site-wide not-found page.

Client records use this shape (the values below are placeholders, not published clients):

```json
{
  "clients": [
    {
      "slug": "approved-client",
      "name": "Approved client name",
      "collaboration": "Product engineering",
      "summary": "A short description approved for public use.",
      "websiteUrl": "https://example.com"
    }
  ]
}
```

There is no newsletter or email collection service. The conversation action opens the supplied Discord invitation.

Set `NEXT_PUBLIC_SITE_URL` to the production origin for social preview URLs. Vercel's production domain is used automatically when available; local development defaults to `http://localhost:3000`. Copy `.env.example` to `.env.local` when configuring a different origin.
