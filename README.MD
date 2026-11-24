# Dhidroid Labs

Dhidroid Labs is a Next.js website for a mobile app and custom software engineering studio in Chennai, India.

The site presents the studio's services, selected work, labs, development process, insights, collaboration options, and contact information.

## Tech stack

- Next.js 15
- React 19
- TypeScript
- CSS
- Font Awesome

## Getting started

### Requirements

- Node.js 18.18 or later
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

The static site is generated in `out/`. To deploy it to Cloudflare Workers, run:

```bash
npm run deploy
```

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
| `npm run deploy` | Deploys the static site to Cloudflare Workers |

## Links

- [LinkedIn](https://linkedin.com/in/dhidroid-rndev)
- [Portfolio](https://dhidroid.vercel.app)
