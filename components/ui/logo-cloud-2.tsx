import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = ComponentProps<"div">;

const logos: Logo[] = [
  {
    src: "https://cdn.21st.dev/assets/mirror/bd/bdf5f3ae72bcfda892a686c03b7932985c694e9a9828643c980601bbc9e53cb4.svg",
    alt: "NVIDIA",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/31/319eeae853dd1af99d442b6c16b6c38dc52a66a719f8e502c65f85d26255cbd3.svg",
    alt: "Supabase",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/90/90f01a9537335666282ae5acc80bd4305f86d085a92d60904c3aa3ccc4414570.svg",
    alt: "GitHub",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/2b/2bcdd4124223e3bf8e66bc08ce0ac32a6cc42ffe3584bbecfd377847176a188d.svg",
    alt: "OpenAI",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/fc/fc7b090ebcfc468d24a1dc482b2db1fcbfd99ca14568552a30ce553d6dda7fcb.svg",
    alt: "Turso",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/96/96517bce3574d648280ff639d01d9889f354b488b3f826db5df746d730232a0c.svg",
    alt: "Clerk",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/e8/e8514b1206f79e1abdafcc1d2632393cc7cfbcbbe25426ac5143b17b184b56b8.svg",
    alt: "Claude AI",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/56/5624b7c243ac8d60e848fb5ea222ec932c1600df54a2762238b37498372fb0c8.svg",
    alt: "Vercel",
  },
];

export function LogoCloud({ className, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn("client-logo-cloud", className)}
      role="list"
      {...props}
    >
      <span
        className="client-logo-cloud__edge client-logo-cloud__edge--top"
        aria-hidden="true"
      />
      {logos.map((logo, index) => (
        <LogoCard
          key={logo.alt}
          logo={logo}
          className={cn(
            "client-logo-card",
            index === 0 && "client-logo-card--shaded",
            index === 2 && "client-logo-card--shaded",
            index === 5 && "client-logo-card--shaded",
            index === 7 && "client-logo-card--shaded",
          )}
        >
          {index === 0 && <PlusMarker className="client-logo-plus--right" />}
          {index === 2 && (
            <>
              <PlusMarker className="client-logo-plus--right" />
              <PlusMarker className="client-logo-plus--left client-logo-plus--desktop" />
            </>
          )}
          {index === 4 && (
            <PlusMarker className="client-logo-plus--right client-logo-plus--mobile" />
          )}
        </LogoCard>
      ))}
      <span
        className="client-logo-cloud__edge client-logo-cloud__edge--bottom"
        aria-hidden="true"
      />
    </div>
  );
}

type LogoCardProps = ComponentProps<"div"> & {
  logo: Logo;
  children?: ReactNode;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn("client-logo-card__inner", className)}
      role="listitem"
      {...props}
    >
      <div
        className="client-logo-card__image-wrap"
        style={{ width: logo.width ?? 160, height: logo.height ?? 28 }}
      >
        <Image
          src={logo.src}
          alt={logo.alt}
          fill
          sizes={`${logo.width ?? 160}px`}
          unoptimized
          className="client-logo-card__image"
        />
      </div>
      {children}
    </div>
  );
}

function PlusMarker({ className }: { className: string }) {
  return (
    <PlusIcon
      className={cn("client-logo-plus", className)}
      strokeWidth={1}
      aria-hidden="true"
    />
  );
}
