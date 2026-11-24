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

Copy `.env.example` to `.env` and add your local Firebase web-app values if you
want Analytics enabled during development.

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

Cloudflare's Git integration publishes the site when changes are pushed to
`main`. GitHub Actions does not deploy the site; it runs tests and builds on
`main`, `production`, and pull requests.

The Cloudflare deployment is a static export: `/api/newsletter` is available
only in local Next.js development and is not deployed to Cloudflare. Set
`NEXT_PUBLIC_NEWSLETTER_API_URL` in the Cloudflare build environment to the
HTTPS Firebase `newsletterSignup` function URL. Do not set it to the site
origin or a relative `/api/...` path.

### Tests

```bash
npm test
npm run test:e2e
```

End-to-end tests run against the local Next.js development server. GitHub Actions
runs both test suites and builds changes to `main`, `production`, and pull
requests. Set the following repository variables under **Settings → Secrets and
variables → Actions → Variables** so the build can use the Firebase web app and
newsletter endpoint:

- `NEXT_PUBLIC_NEWSLETTER_API_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Firebase web configuration is public client configuration, not a server
credential. Analytics is disabled until the required Firebase variables are
configured. Firebase Analytics automatically reports page views and sessions;
the site also records successful newsletter sign-ups and contact enquiries as
conversion events. Use Firebase Console to inspect real-time reports and define
audiences from those events. Analytics events never include form contents or
email addresses.

## Project structure

- `app/page.tsx` - main landing page
- `app/[slug]/page.tsx` - dynamic pages for the site sections
- `app/data.ts` - content and card data for dynamic pages
- `app/chrome.tsx` - header and footer
- `app/layout.tsx` - root layout and page metadata
- `app/site-analytics.tsx` - optional Firebase Analytics initialization
- `lib/firebase-analytics.ts` - analytics events for form conversions
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
| `npm test` | Runs component tests with Vitest and Testing Library |
| `npm run test:e2e` | Runs browser end-to-end tests with Playwright |
| `npm run firebase:deploy -- --project <PROJECT_ID>` | Deploys the newsletter and SMTP notification functions, Firestore rules, and Realtime Database rules |
| `npm run firebase:emulate` | Starts the Functions, Firestore, and Realtime Database emulators |
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

3. Deploy the functions and database rules:

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

### SMTP audit

Realtime Database stores each SMTP attempt under `smtpAudit/<auditId>`, including
the action, source, UTC timestamps, and SMTP outcome. SMTP acceptance means the
mail server accepted the message for delivery. Records and audit emails omit
recipients, subjects, message bodies, and credentials. The rules deny client
access to the audit database.

The local Next.js API and direct SMTP scripts write the record and send a summary
to `SMTP_AUDIT_TO`. Set `FIREBASE_DATABASE_URL` and authenticate Firebase Admin via
Application Default Credentials. A service-account key can be configured using the
server-only `GOOGLE_APPLICATION_CREDENTIALS` path. Keep the key file out of source
control. Set a private `ADMIN_KEY` to enable newsletter test sends and broadcasts.

For the Firebase-hosted newsletter function, `notifySmtpAudit` sends the summary
on record creation and logs its own SMTP outcome on the same record. Firebase
deployment requires the Blaze plan and the existing `SMTP_PASS` secret. Deploy the
trigger in the same region as Realtime Database.

### Firebase Analytics

Configure the `NEXT_PUBLIC_FIREBASE_*` values from your Firebase web app in the
local `.env` and as GitHub Actions repository variables. Set up Google Analytics
for the Firebase project and provide its Measurement ID. When configured, the
browser SDK collects its standard page-view and session analytics, plus
`sign_up` and `generate_lead` events after successful form submissions. Events
contain only the event name and a generic method; they do not include
identifying form fields. Firebase Realtime Database remains reserved for
server-side SMTP audit records. Create and manage Analytics audiences in
Firebase Console; the repository does not create audience definitions or an
analytics dashboard.

## Links

- [LinkedIn](https://linkedin.com/in/dhidroid-rndev)
- [Portfolio](https://dhidroid.vercel.app)
