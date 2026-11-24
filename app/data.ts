import type { Step } from "./charts";

export type Card = { icon: string; title: string; body: string; stack?: string[]; href?: string };
export type Pg = { name: string; title: string; intro: string; cards?: Card[]; track?: Step[]; text?: [string, string][]; legal?: boolean };

const LI = "https://linkedin.com/in/dhidroid-rndev";
const IND = " Independent prototype, not a Dhidroid Labs client engagement.";

export const pages: Record<string, Pg> = {
  about: { name: "About", title: "Technology should make the important things easier.", intro: "Dhidroid Labs is an independent software engineering studio in Chennai, India, building thoughtful web and mobile products and practical AI automation. You work directly with the engineer shaping the technical decisions, with clear trade-offs, fewer handoffs and feedback grounded in your users’ needs.",
    cards: [
      { icon: "bulb", title: "Useful by design", body: "We solve the actual problem, not the loudest trend." },
      { icon: "compass", title: "Clarity before code", body: "We explain trade-offs and agree on priorities first." },
      { icon: "file", title: "Ownership matters", body: "We build for maintainability and handover." },
      { icon: "shield", title: "Responsible engineering", body: "Privacy, security and accessibility are part of the discussion from day one." },
      { icon: "pen", title: "Craft with restraint", body: "Good software does not need needless complexity." },
      { icon: "user", title: "The person behind the lab", body: "DhineshKumar Thirupathi, Founder and Software Engineer, focused on React Native, TypeScript, web platforms, APIs and applied AI.", href: LI },
    ] },
  services: { name: "Services", title: "Practical engineering for the product you need.", intro: "Every project has different constraints. We start with your users, systems and goals, then choose the services needed. You don’t need to commit to a large platform if a focused first release will do.",
    cards: [
      { icon: "code", title: "Web application development", body: "Dashboards, customer portals, internal tools and modern SaaS products.", stack: ["react", "typescript", "nextjs"] },
      { icon: "mobile", title: "Mobile application development", body: "Cross-platform Android and iOS products built with React Native.", stack: ["react", "typescript"] },
      { icon: "gears", title: "AI and workflow automation", body: "Searchable documents and repeatable tasks, without adding AI where simple rules work better.", stack: ["python"] },
      { icon: "rocket", title: "MVP and product discovery", body: "Move from idea to a small, testable product without an unnecessary feature list." },
      { icon: "server", title: "Backend, APIs and integrations", body: "The secure application logic and system connections behind a good interface.", stack: ["python", "postgresql"] },
      { icon: "cloud", title: "Cloud and DevOps", body: "Sensible delivery pipelines and operational visibility for your product.", stack: ["docker", "git"] },
      { icon: "chart", title: "Modernization and maintenance", body: "Improve an existing application without blindly rewriting everything." },
    ] },
  process: { name: "Process", title: "A clear process makes room for better work.", intro: "Whether you start from an idea or an existing system, each decision should be understandable and each milestone reviewable.",
    track: [
      { k: "1", t: "Listen and discover", l: ["Problem statement,", "assumptions, risks"] },
      { k: "2", t: "Define the first release", l: ["Scope, milestones,", "acceptance criteria"] },
      { k: "3", t: "Design and build", l: ["Working increments,", "documented decisions"] },
      { k: "4", t: "Test and launch", l: ["Test results,", "release notes"] },
      { k: "5", t: "Learn and improve", l: ["Follow-up backlog,", "documentation"] },
    ],
    cards: [
      { icon: "user", title: "One accountable contact", body: "One person owns the technical decisions and the communication." },
      { icon: "file", title: "Written scope", body: "Scope, change control, and source code and data ownership are agreed before work starts." },
      { icon: "calendar", title: "Regular reviews", body: "Progress is shown through working demonstrations, and issues are recorded." },
      { icon: "scale", title: "Standards as reference", body: "Requirements, architecture and quality checks borrow from IEEE and ISO references such as IEEE/ISO/IEC 29148 and ISO/IEC 25010. Dhidroid Labs holds no ISO certification." },
    ] },
  "engagement-models": { name: "Engagement models", title: "Choose a way of working that fits the problem.", intro: "Pick the starting point that matches where your product is today. Every engagement begins with a written scope.",
    track: [
      { k: "A", t: "Discovery and planning", l: ["For ideas without a brief", "Fixed-scope workshop or fee"] },
      { k: "B", t: "Focused product build", l: ["For a clear first release", "Fixed price, changes quoted"] },
      { k: "C", t: "Existing product improvement", l: ["Audits, fixes, migrations", "Time-and-materials or milestones"] },
    ],
    cards: [
      { icon: "bulb", title: "Not sure which fits?", body: "Describe the problem and we’ll recommend a practical starting point.", href: "/contact" },
    ] },
  lab: { name: "Lab", title: "A lab for things worth trying.", intro: "Not every useful idea starts as a polished product. The Lab is where we test new interactions, compare approaches and share lessons. Some ideas become products. Others become better questions.",
    cards: [
      { icon: "gears", title: "Rust UI framework", body: "In exploration: a React Native-style UI framework written in pure Rust for web, desktop and mobile." },
      { icon: "bulb", title: "Keyboard backlight sync", body: "In exploration: a Mac and Windows utility that moves laptop keyboard lighting with the music." },
      { icon: "flask", title: "Suggest a problem worth solving", body: "Have an idea worth prototyping? Send it over.", href: "/contact" },
    ] },
  developers: { name: "Developers", title: "Meet the developer behind the lab.", intro: "Dhidroid Labs is a one-person studio, so you work directly with the engineer who builds your product. Specialists join a project only when it needs them.",
    cards: [
      { icon: "user", title: "DhineshKumar Thirupathi", body: "Founder and Software Engineer. React Native, TypeScript, web platforms, APIs and applied AI. Based in Chennai.", stack: ["react", "typescript", "nextjs", "nodejs", "python", "postgresql"], href: LI },
      { icon: "handshake", title: "Specialist collaborators", body: "Designers, QA and domain experts join a project when it needs them, and are named with their permission." },
      { icon: "users", title: "Want to collaborate?", body: "Developer or designer interested in working on projects together? Get in touch.", href: "/contact" },
    ] },
  "tech-stack": { name: "Tech stack", title: "Tools chosen for the product, not the trend.", intro: "The strongest experience is in JavaScript and TypeScript, React, React Native, APIs and Python-based AI integrations. The final choice follows what the product needs and what your team can maintain.",
    cards: [
      { icon: "code", title: "Web frontend", body: "Accessible, fast interfaces for SaaS products and internal tools.", stack: ["react", "nextjs", "typescript", "javascript"] },
      { icon: "mobile", title: "Mobile", body: "Cross-platform Android and iOS apps from one codebase.", stack: ["react", "typescript"] },
      { icon: "server", title: "Backend and APIs", body: "Services and integrations with clear contracts.", stack: ["nodejs", "python", "fastapi", "dotnetcore", "csharp"] },
      { icon: "layers", title: "Data", body: "Relational data models that stay clear as the product grows.", stack: ["postgresql", "microsoftsqlserver:plain"] },
      { icon: "cloud", title: "Cloud and delivery", body: "Repeatable pipelines and environments.", stack: ["docker", "git", "github", "azure"] },
      { icon: "pen", title: "Design handoff", body: "Design files turned into accessible, consistent components.", stack: ["figma"] },
      { icon: "shield", title: "Quality", body: "Static checks, layered tests and accessibility reviews on every change.", href: "/engineering" },
    ] },
  faq: { name: "FAQ", title: "Good questions lead to better projects.", intro: "Short answers about fit, technology, pricing, ownership and support.",
    text: [
      ["What kinds of projects are a good fit?", "Focused web or mobile products, clear system integrations, internal business tools and targeted AI or automation pilots. Projects work best when there is a defined problem and a realistic budget."],
      ["How do I start?", "Send a short description of what you're building — a rough idea and a timeline is enough. We'll reply within one business day and suggest a practical next step."],
      ["How much does a typical project cost?", "Discovery workshops start at ₹25,000. MVP builds start from ₹1,50,000 depending on scope. Pricing is confirmed after a discovery conversation. See the Pricing page for details."],
      ["Do you work with early-stage founders?", "Yes, when there is a defined problem and a realistic budget for discovery or a first release. A lot of our work is helping founders validate ideas through focused MVPs."],
      ["Can you work with an existing development team?", "That can be considered for a clearly scoped feature or technical review. We're honest if the fit isn't right."],
      ["Do you sign NDAs?", "Confidentiality terms can be reviewed before you share sensitive material. Please avoid sending credentials or confidential datasets through a form."],
      ["What technologies do you use?", "The strongest experience is in JavaScript and TypeScript, React, React Native, APIs and Python-based AI integrations. The final choice follows the product's needs and what your team can maintain."],
      ["How is pricing decided?", "Scope, complexity, dependencies, timeline and support needs shape the estimate. All assumptions are explained before a contract is agreed."],
      ["Will you maintain the app after launch?", "Maintenance and support are offered only when agreed and available. The Growth Retainer engagement covers ongoing improvements."],
      ["Do you charge GST?", "GST is applicable as per Indian tax regulations and listed separately on invoices."],
      ["Can you guarantee a business outcome?", "No. We define measurable product goals and build toward them transparently."],
      ["Can you use an AI model with our documents?", "Possibly, after a review of permitted data, privacy, vendor terms, security requirements and human oversight. We don't recommend AI for decisions requiring judgement without a person in the loop."],
    ] },
  contact: { name: "Contact", title: "Tell us what you’re trying to solve.", intro: "You don’t need a polished specification. A short description of the problem, the people affected and what you hope to achieve is enough to begin.",
    cards: [
      { icon: "linkedin", title: "LinkedIn", body: "Send a message to start the conversation.", href: LI },
      { icon: "globe", title: "Portfolio", body: "See more background and projects.", href: "https://dhidroid.vercel.app" },
      { icon: "pin", title: "Where we work from", body: "Based in Chennai, India. Remote collaboration is possible." },
      { icon: "shield", title: "Before you write", body: "Please don’t send passwords, private customer records, financial identifiers or confidential source files." },
    ] },
  privacy: { name: "Privacy", title: "Privacy policy", intro: "Draft pending legal review. This summary describes the website’s current forms and optional analytics.", legal: true,
    text: [["What we collect", "Details you send directly through the contact or newsletter forms. When Firebase Analytics is configured, Google Analytics may also collect page views, session activity, and browser or device information. Form contents and email addresses are not sent to Analytics."], ["How we use it", "Form details are used to reply to you and manage newsletter subscriptions. Analytics helps us understand aggregate site usage and successful sign-ups or enquiries. We do not sell personal data."], ["Sharing", "Form processing and analytics use the providers described above, including Firebase and Google when analytics is enabled."], ["Your choices", "Analytics is disabled until the site’s public Firebase configuration is provided. You can manage data and advertising settings through Google’s available controls. Ask us about information submitted through the forms using the contact page."]] },
  terms: { name: "Terms", title: "Terms of service", intro: "Draft pending legal review. It is not legal advice.", legal: true,
    text: [["Services", "Work is agreed in a written statement of work for each project."], ["Payment and scope", "Fees, milestones and scope changes are set out in that written agreement."], ["Ownership", "Rights to delivered work are defined in the agreement before work begins."], ["Liability", "Liability is limited to the extent the law permits and as set out in the agreement."]] },
};

export const pipeline: Step[] = [
  { k: "1", t: "Pull request", l: ["Small branches,", "reviewed changes"] },
  { k: "2", t: "Static checks", l: ["Lint, format,", "type-check"] },
  { k: "3", t: "Tests", l: ["Unit and integration,", "every change"] },
  { k: "4", t: "Build", l: ["Reproducible", "build artefacts"] },
  { k: "5", t: "Preview", l: ["Preview deploy,", "end-to-end tests"] },
  { k: "6", t: "Release", l: ["Tagged release,", "monitored rollout"] },
];

export type Project = { slug: string; title: string; type: string; summary: string; problem: string; explored: string[]; stack: string[]; icon: string };
export const projects: Project[] = [
  { slug: "expense-tracker", title: "Expense Tracker", type: "Mobile app concept", icon: "mobile", stack: ["react", "typescript"], summary: "A mobile-first, offline-aware view of daily spending.", problem: "Logging spending is easiest at the moment it happens, which is usually on a phone with a patchy connection.", explored: ["Quick entry that keeps the common case to a few steps", "Local storage that syncs when a connection returns", "Clear categories and a predictable navigation pattern"] },
  { slug: "talent-matching", title: "Talent Matching Explorer", type: "AI-assisted review concept", icon: "users", stack: ["python"], summary: "Structured role-fit review with explainable AI assistance.", problem: "Reviewing many profiles against a role is slow, and unexplained scores are hard to trust.", explored: ["Criteria defined before candidates are reviewed", "An explanation shown next to every suggestion", "A person makes every final decision"] },
  { slug: "knowledge-assistant", title: "Document Knowledge Assistant", type: "Retrieval concept", icon: "book", stack: ["python"], summary: "Answers from your documents, with sources and access rules.", problem: "Teams lose time searching documents, and a confident answer without a source cannot be checked.", explored: ["Retrieval that finds the relevant passages first", "Source references shown with every answer", "Respecting who is allowed to see which documents"] },
  { slug: "workflow-automation", title: "Business Workflow Automation", type: "Workflow concept", icon: "gears", stack: ["postgresql"], summary: "Intake, routing and update history in one traceable process.", problem: "Requests arrive by email and chat, and nobody can see who owns what.", explored: ["A single intake form with required fields", "Routing rules that assign work automatically", "A history of every status change"] },
  { slug: "people-ops-ui", title: "People Operations UI", type: "Interface exploration", icon: "layers", stack: ["react", "typescript"], summary: "Clearer employee self-service, attendance and admin screens.", problem: "HR tools often hide common tasks behind dense menus.", explored: ["Self-service tasks reachable in one place", "Attendance views that read at a glance", "Admin screens that separate frequent and rare actions"] },
];

export type Post = { slug: string; title: string; excerpt: string; icon: string; body?: string[] };
export const posts: Post[] = [
  { slug: "mvp-questions", icon: "rocket", title: "Before Building an MVP: 7 Questions That Save Time Later", excerpt: "An MVP is a test, not a smaller version of the final product. Seven questions help decide what belongs in it.", body: [
    "An MVP is a test, not a smaller version of the final product. These seven questions help decide what belongs in it.",
    "1. Who is the first user, and what are they trying to get done? Name a specific person or role, not a market.",
    "2. What do they do today? The existing workaround, even a spreadsheet, shows what the product has to beat.",
    "3. What is the one outcome the first release must deliver? If you cannot say it in a sentence, the scope is too wide.",
    "4. What would you need to see to call it a success? Choose a measurable signal before building.",
    "5. Which assumptions carry the most risk? Test the riskiest ones first.",
    "6. What can be done by hand for now? Manual steps behind the scenes are fine at this stage.",
    "7. What happens after launch? Decide who fixes, who supports and who decides what comes next."] },
  { slug: "react-native-or-native", icon: "mobile", title: "React Native or Native Apps? A Product Decision Framework", excerpt: "Both can produce a good app. The decision is about your product and your team, not which technology is better.", body: [
    "Both choices can produce a good app. The decision is about your product and your team, not about which technology is better.",
    "Choose React Native when you need Android and iOS together, your screens are mostly forms, lists and content, and a small team has to move quickly. One codebase also keeps behaviour consistent across platforms.",
    "Choose fully native when the product depends on deep platform features such as advanced camera or audio work, heavy graphics, or very new operating system capabilities that cross-platform tools have not caught up with.",
    "Ask four questions: which platforms are needed at launch, which device features are essential, who will maintain the app, and how much performance headroom the experience really needs. If most answers point to shared screens and standard features, start with React Native and write native modules only where they matter."] },
  { slug: "automation-or-not", icon: "gears", title: "When a Workflow Needs Automation, and When It Doesn’t", excerpt: "Automate tasks that are frequent, rule-based and costly in time. Fix unclear processes first.", body: [
    "Automation is worth building when a task is frequent, follows clear rules and costs real time. It is a poor investment when the process itself is still unclear.",
    "Start by writing the manual process down. If two people describe it differently, fix the process first.",
    "Good candidates are repetitive hand-offs, copying data between systems, and routine status updates. Poor candidates are decisions that depend on judgement or on information that is rarely written down.",
    "When AI is involved, keep a person in the loop for anything that affects people or money, show where an answer came from, and measure mistakes before expanding the scope."] },
  { slug: "react-modernization-checklist", icon: "code", title: "A Practical Checklist Before Modernizing a React App", excerpt: "" },
  { slug: "trustworthy-knowledge-assistant", icon: "book", title: "What Makes an Internal Knowledge Assistant Trustworthy?", excerpt: "" },
  { slug: "small-business-dashboard", icon: "chart", title: "A Small Business Dashboard: What to Build First", excerpt: "" },
];

export type Client = { name: string; sample?: boolean };
export type Review = { quote: string; name: string; role: string; sample?: boolean };
// Add real, permission-cleared entries here. Entries marked sample appear in development only.
export const clients: Client[] = ["Client A", "Client B", "Client C", "Client D", "Client E", "Client F"].map((name) => ({ name, sample: true }));
export const reviews: Review[] = [1, 2, 3].map((n) => ({ quote: "Sample review text. Replace it with a real client quote used with their permission.", name: `Client name ${n}`, role: "Role, Company", sample: true }));
