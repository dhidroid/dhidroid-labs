import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ArticleNotFound() {
  return (
    <div className="journal-container journal-not-found">
      <p className="section-label">Dhidroid Journal</p>
      <h1 className="section-heading">This note is missing.</h1>
      <p>The article may have moved, or the link may be incomplete.</p>
      <Link href="/journal" className="text-link">
        <ArrowLeft size={15} aria-hidden="true" /> Back to the journal
      </Link>
    </div>
  );
}
