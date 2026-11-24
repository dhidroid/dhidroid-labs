import Link from "next/link";

export function Cta({ h = "Have a real-world problem in mind?", p = "Let’s explore whether a small, carefully designed solution could help." }: { h?: string; p?: string }) {
  return <div className="wrap"><div className="band"><div><h3>{h}</h3><p>{p}</p></div><Link className="btn ink" href="/contact">Start a project</Link></div></div>;
}
