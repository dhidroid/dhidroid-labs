import { describe, expect, it } from "vitest";
import { projectTechnologies } from "./project-technologies";

describe("projectTechnologies", () => {
  it("combines the published Stock Management System stack and technology groups without duplicates", () => {
    const description = [
      "Technologies Used",
      "Frontend: React, TypeScript, HTML5, CSS3",
      "Backend: ASP.NET Core (.NET), REST APIs, Entity Framework Core",
      "Database: Microsoft SQL Server",
      "Tools: Git, Visual Studio, Visual Studio Code, Postman",
      "Tech Stack: React • TypeScript • ASP.NET Core (.NET) • SQL Server • Entity Framework Core • REST APIs • Git",
    ].join("\n\n");

    expect(projectTechnologies(null, [description])).toEqual([
      expect.objectContaining({ name: "React", icon: "react" }),
      expect.objectContaining({ name: "TypeScript", icon: "typescript" }),
      expect.objectContaining({ name: "ASP.NET Core (.NET)", icon: "dotnetcore" }),
      expect.objectContaining({ name: "Microsoft SQL Server", icon: "microsoftsqlserver:plain" }),
      expect.objectContaining({ name: "Entity Framework Core", fallbackIcon: "layers" }),
      expect.objectContaining({ name: "REST APIs", fallbackIcon: "code" }),
      expect.objectContaining({ name: "Git", icon: "git" }),
      expect.objectContaining({ name: "HTML5", icon: "html5" }),
      expect.objectContaining({ name: "CSS3", icon: "css3" }),
      expect.objectContaining({ name: "Visual Studio", icon: "visualstudio" }),
      expect.objectContaining({ name: "Visual Studio Code", icon: "vscode" }),
      expect.objectContaining({ name: "Postman", icon: "postman" }),
    ]);
  });

  it("prefers a structured stack and retains unknown explicit labels", () => {
    const stack = projectTechnologies(["react", "ReactJS", "Internal SDK"], ["Tech Stack: Python"]);
    expect(stack.map(({ name }) => name)).toEqual(["React", "Internal SDK"]);
  });

  it("keeps distinct technology names when inferring from prose", () => {
    const stack = projectTechnologies(undefined, ["Built using React Native, Visual Studio Code, and Node.js. GitHub hosts the source."]);
    expect(stack.map(({ name }) => name)).toEqual(["React Native", "Visual Studio Code", "Node.js", "GitHub"]);
  });
});
