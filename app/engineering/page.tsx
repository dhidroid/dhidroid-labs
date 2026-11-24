import type { Metadata } from "next";
import Link from "next/link";
import { FolderTree, Pyramid, Track, VModel, type FNode } from "../charts";
import { pipeline } from "../data";

export const metadata: Metadata = {
  title: "Engineering practice | Dhidroid Labs",
  description: "A reference delivery setup: GitHub Actions workflows, layered testing, a V-model system engineering flow and a clear repository structure.",
};

const workflow = `name: ci
on:
  pull_request:
  push:
    branches: [main]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage
      - run: npm run build
  e2e:
    needs: verify
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
`;

const layers: [string, string][] = [
  ["Exploratory review", "By hand, before each release"],
  ["End-to-end and accessibility", "Preview deploys and the main branch"],
  ["Integration and API contracts", "Every pull request"],
  ["Unit tests", "Every pull request"],
  ["Static analysis", "Every commit"],
];

const repo: FNode = { name: "product/", children: [
  { name: "apps/", children: [{ name: "mobile/", note: "React Native app" }, { name: "web/", note: "Next.js app" }] },
  { name: "services/", children: [{ name: "api/", note: "Backend service and API contracts" }] },
  { name: "packages/", children: [{ name: "ui/", note: "Shared design system components" }, { name: "config/", note: "Shared TypeScript, lint and test settings" }] },
  { name: "docs/", children: [{ name: "adr/", note: "Architecture decision records" }, { name: "requirements/", note: "Scope and acceptance criteria" }] },
  { name: "infra/", note: "Environments and deployment setup" },
  { name: ".github/", children: [{ name: "workflows/", children: [{ name: "ci.yml", note: "Lint, test and build on every pull request" }, { name: "release.yml", note: "Tagged releases and deploys" }] }] },
  { name: "README.md", note: "How to run, test and release" },
] };

function Blk({ h, p, children }: { h: string; p: string; children: React.ReactNode }) {
  return <section className="blk"><h2>{h}</h2><p>{p}</p>{children}</section>;
}

export default function Engineering() {
  return (
    <main className="sub">
      <header className="sh"><h1>Engineering that holds up as the product grows.</h1><p>A reference delivery setup we adapt to each project: automated checks on every change, layered testing and a repository layout a new developer can read in minutes. Tools and depth are scoped per engagement.</p></header>

      <Blk h="Delivery pipeline" p="Every change follows the same automated path before it reaches users. The steps stay the same whether the product is a React Native app, a Next.js site or an API.">
        <div className="chart scroll"><Track items={pipeline} label="Delivery pipeline: pull request, static checks, tests, build, preview, release" /></div>
        <pre className="code" tabIndex={0}><code>{workflow}</code></pre>
        <p className="cap2">Example .github/workflows/ci.yml for a Node-based project.</p>
      </Blk>

      <Blk h="Testing in layers" p="Fast, cheap checks run most often. Slower, broader checks run where they add the most confidence.">
        <div className="chart scroll"><Pyramid items={layers} label="Testing layers from exploratory review at the top to static analysis at the base" /></div>
      </Blk>

      <Blk h="System engineering flow" p="Each design decision on the left is checked by a test level on the right. The IEEE and ISO references mark where the standards inform the work. This is practice aligned with them, not certification.">
        <div className="chart scroll"><VModel label="V-model pairing requirements with acceptance tests, architecture with system tests, and module design with unit tests" /></div>
      </Blk>

      <Blk h="Repository structure" p="A predictable layout, so the app, the shared code, the decisions and the pipeline are easy to find.">
        <div className="chart scroll"><FolderTree data={repo} label="Reference repository folder structure" /></div>
      </Blk>

      <div className="wrap"><div className="band"><div><h3>Want this setup for your product?</h3><p>Tell us the stack and the stage, and we’ll scope what fits.</p></div><Link className="btn ink" href="/contact">Start a project</Link></div></div>
    </main>
  );
}
