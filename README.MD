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
| `npm run firebase:deploy -- --project <PROJECT_ID>` | Deploys the newsletter function and Firestore rules |
| `npm run firebase:emulate` | Starts the local Firebase Functions and Firestore emulators |
| `npm run newsletter:send -- --test <email>` | Dispatches a test custom newsletter via CLI |
| `npm run newsletter:send -- --broadcast` | Dispatches a custom newsletter broadcast to confirmed subscribers |

## Newsletter backend & Custom Newsletter

Newsletter signups use a Firebase HTTPS Function and Cloud Firestore. New
addresses are stored as pending and receive a one-time Gmail confirmation link;
the record becomes confirmed when the link is opened. Firebase Admin accesses
Firestore server-side, while Firestore rules block direct client access.

### Custom Newsletter Composer & Mail Sending

The studio provides a custom newsletter composition and dispatch system:
- **Interactive Composer (`/newsletter/custom`)**: Allows drafting custom issues, editing metadata, featured articles, lab notes, and tips with a real-time live preview (desktop & mobile) rendered using `public/newsletter-template.html`.
- **Backend Dispatch (`action: "send_newsletter"`)**: The backend function loads `public/newsletter-template.html`, replaces merge tags (subject, issue number, article, lab items, tips, etc.), generates HTML and plain-text versions, and sends emails via Nodemailer with Gmail SMTP.
- **Delivery Targets**: Supports sending a single test email (for review) or broadcasting to all confirmed subscribers in Firestore.
- **CLI Dispatch**: Run `npm run newsletter:send -- --test <email>` or `npm run newsletter:send -- --broadcast`.

1. Enable Cloud Firestore in the Firebase project.
2. Set the Gmail sender to use a Google App Password (not the account password).
   Set the Firebase Function secret without putting it in source control:

   ```bash
   npx --yes firebase-tools functions:secrets:set SMTP_PASS --project <PROJECT_ID>
   ```

3. Deploy the Function and Firestore rules:

   ```bash
   npm run firebase:deploy -- --project <PROJECT_ID>
   ```

   Copy `functions/.env.example` to `functions/.env.<PROJECT_ID>` and set
   `SITE_ORIGIN` (the exact public site origin), `SMTP_USER`, and `MAIL_FROM`.
   Gmail defaults are `smtp.gmail.com`, port `465`, with TLS enabled. Firebase
   loads the project-specific parameter file; do not commit it.
4. Set `NEXT_PUBLIC_NEWSLETTER_API_URL` in the local `.env` and as a GitHub
   Actions repository variable to the deployed function URL
   (`https://<REGION>-<PROJECT_ID>.cloudfunctions.net/newsletterSignup`).
   This value is embedded into the static site at build time.

The root `.env` is not automatically loaded by Firebase Functions. Copy its
non-secret SMTP settings into the project parameter file, and set `SMTP_PASS`
using the Firebase secret command above. Never put the Gmail app password in a
`NEXT_PUBLIC_` variable.

For local emulators, use `http://localhost:3000` as `SITE_ORIGIN`, and provide
`SMTP_PASS` in `functions/.secret.local`. The project-specific environment and
secret files are ignored by Git.

## Links

- [LinkedIn](https://linkedin.com/in/dhidroid-rndev)
- [Portfolio](https://dhidroid.vercel.app)
