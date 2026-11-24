export type DeveloperProfile = {
  slug: string;
  name: string;
  title: string;
  role: string;
  tagline: string;
  image: string;
  location: string;
  experienceYears: string;
  github: string;
  linkedin: string;
  portfolio: string;
  email: string;
  bio: string;
  about: string[];
  philosophy: string[];
  skills: { name: string; level: string; icon: string; desc: string }[];
  stack: string[];
  journey: { period: string; role: string; org: string; summary: string }[];
  featuredProjects: { slug: string; title: string; desc: string; stack: string[] }[];
  stats: { label: string; value: string }[];
};

export const developers: DeveloperProfile[] = [
  {
    slug: "dhineshkumar",
    name: "DhineshKumar Thirupathi",
    title: "Founder & Lead Software Engineer",
    role: "Full-Stack & Mobile Engineer",
    tagline: "React Native, TypeScript Web Platforms, APIs & Practical AI Automation",
    image: "/dev-dhinesh.svg",
    location: "Chennai, India (IST / UTC+5:30)",
    experienceYears: "5+ years",
    github: "dhidroid",
    linkedin: "https://linkedin.com/in/dhidroid-rndev",
    portfolio: "https://dhidroid.vercel.app",
    email: "dhidroid@gmail.com",
    bio: "Founder and engineer at Dhidroid Labs. Dedicated to designing and building reliable web platforms, cross-platform React Native apps, and practical AI workflow automations that solve genuine business problems.",
    about: [
      "I partner with founders, early-stage startups, and product teams to translate product requirements into clean, testable, and maintainable software.",
      "Rather than chasing transient trends, I focus on system reliability, type safety, crisp user interactions, and clear ownership handovers.",
      "Every project is approached with deliberate architecture: minimal complexity, automated verification pipelines, and transparent progress updates."
    ],
    philosophy: [
      "Clarity before code: Agree on real user constraints, scopes, and milestones before writing software.",
      "Ship working increments: Demonstrable software and verified tests over theoretical specifications.",
      "Leave zero lock-in: Document architecture decisions and structure code so your team can own it effortlessly."
    ],
    skills: [
      { name: "React Native & Mobile", level: "Advanced", icon: "mobile", desc: "Cross-platform iOS and Android apps with offline caching, native modules, and fluid gesture handling." },
      { name: "TypeScript & Next.js", level: "Advanced", icon: "code", desc: "Fast, accessible web applications, server components, and responsive design systems." },
      { name: "Node.js & Backend APIs", level: "Proficient", icon: "server", desc: "RESTful and GraphQL service contracts, authentication, database transactions, and middleware." },
      { name: "Applied AI & RAG", level: "Proficient", icon: "gears", desc: "Retrieval-augmented question answering, document indexing, Python FastAPI services, and sensible agentic workflows." },
      { name: "Cloud & DevOps", level: "Proficient", icon: "cloud", desc: "GitHub Actions CI/CD pipelines, Docker containerization, staging environments, and automated linting/testing." },
      { name: "Data & PostgreSQL", level: "Proficient", icon: "layers", desc: "Relational data modeling, query optimization, migrations, and local SQLite sync layers." }
    ],
    stack: ["react", "typescript", "nextjs", "nodejs", "python", "fastapi", "postgresql", "docker", "git", "github", "figma"],
    journey: [
      {
        period: "2024 – Present",
        role: "Founder & Lead Engineer",
        org: "Dhidroid Labs",
        summary: "Providing end-to-end product engineering, MVP discovery, and technical consultation for founders worldwide."
      },
      {
        period: "2022 – 2024",
        role: "Senior React Native Engineer",
        org: "Independent Consultant",
        summary: "Designed and shipped offline-first mobile apps, customer portals, and internal team utilities."
      },
      {
        period: "2020 – 2022",
        role: "Full-Stack Software Engineer",
        org: "Product Agency",
        summary: "Engineered scalable web dashboards, REST API endpoints, and integrated analytics workflows."
      }
    ],
    featuredProjects: [
      { slug: "expense-tracker", title: "Expense Tracker", desc: "Mobile-first, offline-aware view of daily spending built with React Native & SQLite.", stack: ["react", "typescript"] },
      { slug: "talent-matching", title: "Talent Matching Explorer", desc: "Explainable AI recruitment evaluation and candidate scoring.", stack: ["python"] },
      { slug: "knowledge-assistant", title: "Document Knowledge Assistant", desc: "Retrieval-augmented search across enterprise documentation with source citations.", stack: ["python"] },
      { slug: "workflow-automation", title: "Business Workflow Automation", desc: "Intake, routing, and verifiable status audits built with PostgreSQL.", stack: ["postgresql"] }
    ],
    stats: [
      { label: "Production Apps Shipped", value: "12+" },
      { label: "Core Stack", value: "React Native & TS" },
      { label: "Availability", value: "Open for Q1" },
      { label: "GitHub Commits", value: "1,200+ / yr" }
    ]
  }
];
