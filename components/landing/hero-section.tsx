import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <Image
        src="/images/hero-landscape.jpg"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        alt=""
        className="hero-image"
      />
      <div className="hero-shade" />
      <div className="container hero-content">
        <p className="section-label hero-eyebrow">
        Independent minds. Shared curiosity.
        </p>
        <h1 id="hero-heading">
          A place for curious minds
          <br className="desktop-break" /> to build useful things.
        </h1>
        <p className="hero-description">
          A small, independent engineering practice.
          <br />
          Exploring ideas, making software, and learning in the open.
        </p>
        <div className="hero-actions">
          <Link href="/work" className="button button-light">
            Explore the work <ArrowUpRight size={15} />
          </Link>
          <Link className="hero-secondary" href="/about">
            Get to know Dhidroid <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      <div className="container hero-bottom">
        <span className="section-label">
          A little curiosity goes a long way.
        </span>
        <a href="#about" aria-label="Explore the practice below">
          <ArrowDown size={18} />
        </a>
      </div>
      <div className="paper-edge" />
    </section>
  );
}
