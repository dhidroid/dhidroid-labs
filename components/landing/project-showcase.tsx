import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Terminal,
  Workflow,
  NotebookPen,
  Sprout,
} from "lucide-react";

const projects = [
  {
    id: "tracekit",
    name: "Tracekit",
    tag: "PROTOTYPE CONCEPT · TYPESCRIPT / NODE.JS",
    title: (
      <>
        Make the invisible
        <br />
        parts of a system visible.
      </>
    ),
    description:
      "An exploration of turning local development events into a readable trace. Follow a request across boundaries without losing the story of what happened.",
    question: "Can a compact local trace explain a request end to end?",
    icon: Workflow,
    detail:
      "Tracekit explores an event model that keeps request boundaries explicit: one request ID, ordered events, useful timings, and enough context to see where an assumption breaks. The next experiment is to follow a failed request across storage and application layers.",
    note: "Illustrative event sequence · not a measured benchmark",
  },
  {
    id: "fieldnotes",
    name: "Fieldnotes",
    tag: "PROTOTYPE CONCEPT · REACT / SQLITE",
    title: (
      <>
        Keep the reasoning
        <br />
        next to the work.
      </>
    ),
    description:
      "An exploration of a local-first engineering notebook. Capture decisions, alternatives, and the context that shaped them beside the work—not scattered across tools.",
    question: "Can a decision stay useful after its original context fades?",
    icon: NotebookPen,
    detail:
      "Fieldnotes starts with a simple local decision record: the context, the alternatives, the trade-off, and what to test next. The first version focuses on offline reading and writing, with synchronization treated as a separate problem.",
    note: "A decision record, before it becomes a distant memory.",
  },
  {
    id: "seedwork",
    name: "Seedwork",
    tag: "CONCEPT · NODE.JS / TESTING",
    title: (
      <>
        Start small.
        <br />
        Leave good foundations.
      </>
    ),
    description:
      "A developer-workflow concept for tiny, maintainable tools. Explicit configuration, useful tests, and a first-run guide before another abstraction.",
    question: "What’s the smallest foundation that is still useful?",
    icon: Sprout,
    detail:
      "Seedwork is a proposed checklist for small tools: a clean install, explicit configuration, a tested core, helpful errors, and a README that follows the actual first-run experience. The experiment is to use the checklist on a tiny real project.",
    note: "A proposed workflow, not a release.",
  },
];

function ProjectPreview({ kind }: { kind: string }) {
  if (kind === "tracekit")
    return (
      <div className="project-preview trace-preview">
        <div className="preview-toolbar">
          <span>tracekit / request_042</span>
          <span className="preview-badge">CONCEPT PREVIEW</span>
        </div>
        <div className="trace-path">
          <span>request</span>
          <i />
          <span>handler</span>
          <i />
          <span>storage</span>
        </div>
        <div className="trace-events">
          {[
            ["00 ms", "request.received", "GET /api/notes"],
            ["03 ms", "handler.started", "notes.list"],
            ["08 ms", "storage.read", "local.sqlite"],
            ["12 ms", "response.sent", "200 application/json"],
          ].map((row) => (
            <div key={row[1]}>
              <span>{row[0]}</span>
              <b />
              <span>{row[1]}</span>
              <span>{row[2]}</span>
            </div>
          ))}
        </div>
        <p className="preview-footnote">
          Illustrative event sequence · not a measured benchmark
        </p>
      </div>
    );
  if (kind === "fieldnotes")
    return (
      <div className="project-preview notes-preview">
        <div className="preview-toolbar">
          <span>fieldnotes / decisions</span>
          <span className="preview-badge">CONCEPT PREVIEW</span>
        </div>
        <div className="note-paper">
          <p className="section-label">Decision record / draft</p>
          <h4>Keep the first version local</h4>
          <p>
            Context → Notes should work offline.
            <br />
            Trade-off → Sync is a separate problem.
            <br />
            Next test → Recover an interrupted write.
          </p>
        </div>
        <div className="ruled-signature" aria-hidden="true">
          F
        </div>
      </div>
    );
  return (
    <div className="project-preview seed-preview">
      <div className="preview-toolbar">
        <span>seedwork / checks</span>
        <span className="preview-badge">CONCEPT PREVIEW</span>
      </div>
      <p className="terminal-command">
        <Terminal size={16} />  
      </p>
      <ul>
        {[
          "Configuration is explicit",
          "Core behavior has a test",
          "Errors explain the next step",
          "README follows a clean install",
        ].map((text) => (
          <li key={text}>
            <Check size={14} />
            {text}
          </li>
        ))}
      </ul>
      <p className="preview-footnote">A proposed workflow, not a release.</p>
      <div className="ruled-signature" aria-hidden="true">
        S
      </div>
    </div>
  );
}

export function ProjectShowcase() {
  return (
    <section id="work" className="work-section section-space">
      <div className="container">
        <div className="section-intro">
          <p className="section-label">On the workbench</p>
          <h2 className="section-heading">
            Keep the curiosity.
            <br />
            <span>Give it something practical to do.</span>
          </h2>
          <p>
            Small tools, open questions, and ideas taking shape.
            <br />A few directions we’re exploring, one useful step at a time.
          </p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article id={project.id} className="project" key={project.id}>
              <div className="project-heading">
                <h3>
                  <project.icon size={16} strokeWidth={1.4} />
                  {project.name}
                </h3>
                <p className="section-label">{project.tag}</p>
              </div>
              <div
                className={`project-body ${project.id === "fieldnotes" ? "project-reverse" : ""}`}
              >
                <div className="project-copy">
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  <div className="project-question">
                    <span className="section-label">A question to test</span>
                    <p>{project.question}</p>
                  </div>
                  <details className="project-details">
                    <summary className="text-link">
                      Explore the {project.name} direction{" "}
                      <ChevronDown size={14} />
                    </summary>
                    <p>{project.detail}</p>
                    <Link
                      className="text-link"
                      href="/blog/build-the-smallest-thing-that-teaches-you-something"
                    >
                      Read about our approach <ArrowUpRight size={14} />
                    </Link>
                  </details>
                </div>
                <ProjectPreview kind={project.id} />
              </div>
            </article>
          ))}
        </div>
        <p className="work-disclaimer">
          These are exploratory project directions, not shipped products.
          Interfaces and examples describe ideas to test, not verified outcomes.
        </p>
      </div>
    </section>
  );
}
