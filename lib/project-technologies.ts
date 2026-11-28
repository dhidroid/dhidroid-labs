export type ProjectTechnology = { name: string; icon?: string; fallbackIcon?: string };

const technologies: (ProjectTechnology & { aliases?: string[] })[] = [
  { name: "React", icon: "react", aliases: ["React.js", "ReactJS"] },
  { name: "React Native", icon: "react", aliases: ["reactnative"] },
  { name: "TypeScript", icon: "typescript" },
  { name: "JavaScript", icon: "javascript" },
  { name: "HTML5", icon: "html5", aliases: ["HTML", "HTML 5"] },
  { name: "CSS3", icon: "css3", aliases: ["CSS", "CSS 3"] },
  { name: "ASP.NET Core (.NET)", icon: "dotnetcore", aliases: ["ASP.NET Core", "ASP.NET", ".NET Core", ".NET", "dotnetcore"] },
  { name: ".NET Framework", icon: "dot-net", aliases: ["dot-net"] },
  { name: "C#", icon: "csharp", aliases: ["csharp"] },
  { name: "Entity Framework Core", fallbackIcon: "layers", aliases: ["Entity Framework", "EF Core"] },
  { name: "REST APIs", fallbackIcon: "code", aliases: ["REST API", "RESTful APIs", "RESTful API"] },
  { name: "Microsoft SQL Server", icon: "microsoftsqlserver:plain", aliases: ["SQL Server", "MSSQL", "microsoftsqlserver", "microsoftsqlserver:plain"] },
  { name: "Visual Studio Code", icon: "vscode", aliases: ["VS Code", "vscode"] },
  { name: "Visual Studio", icon: "visualstudio", aliases: ["visualstudio"] },
  { name: "Postman", icon: "postman" },
  { name: "GitHub", icon: "github" },
  { name: "Git", icon: "git" },
  { name: "Next.js", icon: "nextjs", aliases: ["NextJS"] },
  { name: "Node.js", icon: "nodejs", aliases: ["NodeJS"] },
  { name: "Express", icon: "express", aliases: ["Express.js", "ExpressJS"] },
  { name: "PostgreSQL", icon: "postgresql", aliases: ["Postgres"] },
  { name: "MongoDB", icon: "mongodb" },
  { name: "SQLite", icon: "sqlite" },
  { name: "MySQL", icon: "mysql" },
  { name: "Redis", icon: "redis" },
  { name: "Docker", icon: "docker", aliases: ["Docker Compose"] },
  { name: "Firebase", icon: "firebase" },
  { name: "Tailwind CSS", icon: "tailwindcss", aliases: ["TailwindCSS", "Tailwind"] },
  { name: "Python", icon: "python" },
  { name: "FastAPI", icon: "fastapi" },
  { name: "Go", icon: "go", aliases: ["Golang", "using Go", "with Go"] },
  { name: "Kotlin", icon: "kotlin" },
  { name: "Java", icon: "java" },
  { name: "Swift", icon: "swift" },
  { name: "Dart", icon: "dart" },
  { name: "Flutter", icon: "flutter" },
  { name: "Rust", icon: "rust" },
  { name: "C++", icon: "cplusplus" },
  { name: "PHP", icon: "php" },
  { name: "Ruby", icon: "ruby" },
  { name: "Bash", icon: "bash" },
  { name: "Linux", icon: "linux" },
  { name: "JSON", icon: "json" },
  { name: "YAML", icon: "yaml" },
  { name: "Android", icon: "android" },
  { name: "Expo" },
  { name: "n8n" },
  { name: "Shopify" },
  { name: "Gemini" },
];

const byAlias = new Map(technologies.flatMap(({ name, icon, fallbackIcon, aliases = [] }) => {
  const technology: ProjectTechnology = { name, icon, fallbackIcon };
  return [name, ...aliases].map((alias) => [alias.toLowerCase(), technology] as const);
}));

const proseAliases = [...byAlias.keys()]
  .filter((alias) => alias !== "go")
  .sort((a, b) => b.length - a.length)
  .map((alias) => alias.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&"));
const knownTechnologies = new RegExp("(?<![\\w.])(?:" + proseAliases.join("|") + ")(?![\\w])", "gi");
const heading = /^(?:tech stack|technology stack|technologies used)(?:\s+\([^)]+\))?(?::\s*(.*))?$/i;
const category = /^(?:front[- ]?end|back[- ]?end|database|tools|devops|frameworks?|languages?)\s*:\s*(.+)$/i;

function splitTechnologies(text: string) {
  return text.split(/[,•;|\n]|\s+\/\s+/).map((value) => value.trim()).filter(Boolean);
}

function namedTechnologies(text: string): string[] {
  return [...text.matchAll(knownTechnologies)].map(([name]) => name);
}

function technologiesFromText(texts: (string | undefined)[]) {
  const summaries: string[] = [];
  const sections: string[] = [];
  for (const text of texts) {
    let inSection = false;
    for (const raw of text?.split(/\r?\n/) ?? []) {
      const line = raw.trim().replace(/^(?:#{1,6}|[-*])\s+/, "").replace(/\*\*|__/g, "");
      if (!line) continue;
      const labeled = line.match(heading);
      if (labeled) {
        inSection = true;
        if (labeled[1]) summaries.push(...splitTechnologies(labeled[1]));
      } else if (inSection) {
        const group = line.match(category);
        const listed = namedTechnologies(line);
        if (group) sections.push(...splitTechnologies(group[1]));
        else if (/^[-*•]\s+/.test(raw.trim()) && listed.length) sections.push(...listed);
        else inSection = false;
      }
    }
  }
  return summaries.length || sections.length ? [...summaries, ...sections] : texts.flatMap((text) => text ? namedTechnologies(text) : []);
}

export function projectTechnologies(stack: unknown, texts: (string | undefined)[] = []): ProjectTechnology[] {
  const fields = Array.isArray(stack) ? stack : [stack];
  const explicit = fields.flatMap((field) => typeof field === "string" ? splitTechnologies(field) : []);
  const unique = new Map<string, ProjectTechnology>();
  for (const label of explicit.length ? explicit : technologiesFromText(texts)) {
    const technology = byAlias.get(label.toLowerCase()) ?? { name: label };
    unique.set(technology.name.toLowerCase(), technology);
  }
  return [...unique.values()];
}
