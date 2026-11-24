# Dhidroid Labs

Dhidroid Labs is a Next.js website for a mobile app and custom software engineering studio in Chennai, India.

The site presents the studio's services, selected work, labs, development process, insights, collaboration options, and contact information.

## Tech stack

- Next.js 15
- React 19
- TypeScript
- CSS
- Font Awesome
- Vitest and Testing Library
- Playwright

## Getting started

### Requirements

- Node.js 22.13 or later
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
```

The static site is generated in `out/`. To preview that build locally, run:

```bash
npm run start
```

To deploy it to Cloudflare Workers, configure
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, then run:

```bash
npm run deploy
```

### Tests

```bash
npm test
npm run test:e2e
```

End-to-end tests run against the local Next.js development server. GitHub Actions
runs both test suites and builds pull requests; pushes to `main` deploy after all
checks pass. Add the Cloudflare API token as a repository secret named
`CLOUDFLARE_API_TOKEN` and the account ID as the repository variable
`CLOUDFLARE_ACCOUNT_ID` to enable automated deployment.

## Project structure

- `app/page.tsx` - main landing page
- `app/[slug]/page.tsx` - dynamic pages for the site sections
- `app/data.ts` - content and card data for dynamic pages
- `app/chrome.tsx` - header and footer
- `app/layout.tsx` - root layout and page metadata
- `app/globals.css` - shared styles
- `app/dev.tsx` - technology icon component
- `app/icons.tsx` - interface icon component

## Available pages

- `/`
- `/about`
- `/services`
- `/work`
- `/labs`
- `/process`
- `/insights`
- `/collaborate`
- `/contact`
- `/privacy`
- `/terms`

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates an optimized static production build in `out/` |
| `npm run start` | Previews the built static site with Wrangler |
| `npm run deploy` | Deploys the static site to Cloudflare Workers |
| `npm test` | Runs component tests with Vitest and Testing Library |
| `npm run test:e2e` | Runs browser end-to-end tests with Playwright |

## Links

- [LinkedIn](https://linkedin.com/in/dhidroid-rndev)
- [Portfolio](https://dhidroid.vercel.app)
