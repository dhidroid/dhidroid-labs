import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="wordmark" aria-label="Dhidroid home">
      Dhidroid<span aria-hidden="true">✳</span>
    </Link>
  );
}
