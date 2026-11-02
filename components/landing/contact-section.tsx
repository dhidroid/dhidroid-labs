import Image from "next/image";
import { ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";
import { discordInviteUrl } from "@/lib/site-content";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-heading"
    >
      <Image
        src="/images/hero-landscape.jpg"
        fill
        sizes="100vw"
        alt=""
        className="contact-image"
      />
      <div className="contact-overlay" />
      <div className="paper-edge paper-edge-top" />
      <div className="container contact-inner">
        <p className="section-label">Pull up a chair</p>
        <h2 id="contact-heading">
          Small questions.
          <br />
          <em>Thoughtful conversations.</em>
          <br />
          Things we can build together.
        </h2>
        <p>
          An idea, an interesting problem, or something you’re learning.
          <br />
          There’s room for a conversation.
        </p>
        <div className="conversation-card">
          <span className="conversation-icon">
            <MessageCircle size={23} strokeWidth={1.5} />
          </span>
          <div>
            <p className="section-label">The Dhidroid community</p>
            <h3>What are you curious to build?</h3>
            <p>
              A place to exchange ideas, share what you’re working on,
              <br className="desktop-break" /> and figure things out together.
            </p>
          </div>
          <Sparkles
            className="conversation-sparkle"
            size={22}
            strokeWidth={1.3}
          />
        </div>
        {discordInviteUrl ? (
          <a
            className="button button-light"
            href={discordInviteUrl}
            target="_blank"
            rel="noreferrer"
          >
            Join our Discord <ArrowUpRight size={14} />
          </a>
        ) : (
          <>
            <button className="button button-light" disabled>
              Join our Discord <ArrowUpRight size={14} />
            </button>
            <span className="invite-status">Community invite coming soon</span>
          </>
        )}
      </div>
      <div className="paper-edge" />
    </section>
  );
}
