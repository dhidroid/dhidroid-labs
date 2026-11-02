import {
  ArrowUpRight,
  ArrowRight,
  Compass,
  Hammer,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export function ProcessSection() {
  return (
    <section id="practice" className="practice-section section-space">
      <div className="container">
        <div className="practice-top">
          <div>
            <p className="section-label">The practice behind the work</p>
            <h2 className="section-heading">
              Less, but more software.
              <br />
              <em>Built with care and understanding.</em>
            </h2>
          </div>
          <p>
            We like small teams, clear thinking, and software that earns its
            place. Our approach is simple: understand enough to begin, make
            something real, and learn from what happens.
          </p>
        </div>
        <div className="practice-grid">
          {[
            {
              icon: Compass,
              title: "Find the useful question",
              text: "Get close to the problem. Listen, map the constraints, and decide what would be worth learning.",
            },
            {
              icon: Hammer,
              title: "Build the smallest honest version",
              text: "Turn the idea into something you can use. Keep the scope focused and the important decisions visible.",
            },
            {
              icon: BookOpen,
              title: "Learn, then leave a trail",
              text: "Test the assumptions, share what changed, and leave the next person something useful to work with.",
            },
          ].map((step, i) => (
            <div key={step.title}>
              <div className="practice-number">
                <span>0{i + 1}</span>
                <step.icon size={20} strokeWidth={1.4} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
        <Link className="text-link" href="/journal">
          More notes on how we work <ArrowUpRight size={14} />
        </Link>
        <div className="practice-callout">
          <span>Have an interesting problem?</span>
          <Link href="/contact">
            You do not need a big, polished brief to begin.{" "}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
