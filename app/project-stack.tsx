import type { ProjectTechnology } from "../lib/project-technologies";
import { Dev } from "./dev";
import { Ico } from "./icons";

export function ProjectStack({ technologies }: { technologies: ProjectTechnology[] }) {
  if (!technologies.length) return null;
  return (
    <ul className="stk project-stack" aria-label="Technologies used" role="list">
      {technologies.map(({ name, icon, fallbackIcon }) => (
        <li key={name}>
          {icon ? <Dev n={icon} label={name} /> : (
            <span className="project-tech-label"><Ico n={fallbackIcon ?? "code"} />{name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
