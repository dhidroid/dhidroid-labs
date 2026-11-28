import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/ui/testimonials-13-utils/logos";
import { Marquee } from "@/components/ui/testimonials-13-utils/marquee";
import { cn } from "@/lib/utils";
import styles from "./testimonials-13.module.css";

export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  avatar?: string;
  logo?: string;
  href?: string;
  sample?: boolean;
};

export default function Testimonials({ items }: { items: readonly Testimonial[] }) {
  if (!items.length) return null;
  const single = items.length === 1;
  const cards = items.map(({ id, name, role, company, quote, avatar, logo, href, sample }) => (
    <figure
      key={id}
      className={cn(
        "flex min-w-0 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm",
        styles.card,
        single ? "w-full" : styles.carouselCard,
      )}
    >
      <figcaption className="flex items-center gap-3 px-6 pt-6">
        <Avatar aria-hidden="true">
          {typeof avatar === "string" && avatar.startsWith("https://") && <AvatarImage className="object-cover" src={avatar} />}
          <AvatarFallback className="bg-primary text-lg font-medium text-primary-foreground">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 grow">
          <p className="font-medium">{name}</p>
          {role && <p className="text-sm text-muted-foreground">{role}</p>}
        </div>
        {href && /^\/projects\/[a-z0-9-]+$/i.test(href) && (
          <Button asChild size="icon" variant="ghost">
            <Link href={href} aria-label={"View the project for " + name}><ArrowUpRight aria-hidden="true" className="size-4" /></Link>
          </Button>
        )}
      </figcaption>
      <div className="px-6 pb-6">
        <Quote aria-hidden="true" className="mt-5 size-5 text-muted-foreground" />
        <blockquote className="mt-2 text-[17px]">{quote}</blockquote>
        {sample && <p className="mt-3 text-xs text-muted-foreground">Sample testimonial</p>}
      </div>
      {(company || typeof logo === "string") && (
        <div className="testimonial-company mt-auto flex min-h-20 items-center justify-center border-t border-border bg-muted/50 px-6 py-4">
          <CompanyLogo name={company ?? ""} src={logo} />
        </div>
      )}
    </figure>
  ));

  return (
    <section data-slot="testimonials" aria-labelledby="testimonials-heading" className="px-6 py-20">
      <h2 id="testimonials-heading" className="text-center text-4xl font-medium tracking-[-0.04em] md:text-[2.75rem]">
        What clients say
      </h2>
      <div className={cn("mx-auto mt-10", single ? "max-w-3xl" : "max-w-6xl rounded-2xl border border-border bg-muted p-3", !single && styles.carousel)}>
        {single ? <div role="group" aria-label="Client testimonials">{cards}</div> : <Marquee>{cards}</Marquee>}
      </div>
    </section>
  );
}
