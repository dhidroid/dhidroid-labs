"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { motion } from "motion/react";
import type { AboutMapMarker } from "@/lib/about-content";

const markerVariants = {
  idle: { scale: 0, opacity: 0, rotateX: 0, rotate: 0, y: 0 },
  active: { y: [-20, 0, 4, 0], scale: [0.75, 1], opacity: [0, 1] },
};

function Marker({
  src,
  top,
  offset,
  delay,
}: {
  src: AboutMapMarker["src"];
  top: AboutMapMarker["top"];
  offset: AboutMapMarker["offset"];
  delay: AboutMapMarker["delay"];
}) {
  return (
    <motion.div
      variants={markerVariants}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
      style={{ "--offset": `${offset}px`, top } as CSSProperties}
      className="about-map__marker"
    >
      <svg
        fill="none"
        viewBox="0 0 38 38"
        className="absolute size-full"
        aria-hidden="true"
      >
        <path
          d="M29.607 5.193c5.858 5.857 5.858 15.355 0 21.213l-9.9 9.9-.707.706-.708-.708-9.899-9.898c-5.857-5.858-5.857-15.356 0-21.213 5.858-5.858 15.356-5.858 21.214 0Z"
          className="fill-black/5"
        />
        <path
          d="m28.9 25.698-9.9 9.9-9.9-9.9C3.634 20.232 3.634 11.367 9.1 5.9 14.569.432 23.433.432 28.9 5.9c5.467 5.468 5.467 14.332 0 19.8Z"
          className="fill-white"
        />
      </svg>
      <Image
        alt=""
        src={src}
        width={24}
        height={24}
        sizes="24px"
        className="about-map__avatar"
      />
    </motion.div>
  );
}

export function Map({
  background,
  markers,
}: {
  background: string;
  markers: AboutMapMarker[];
}) {
  return (
    <motion.div
      initial="idle"
      whileInView="active"
      whileHover="active"
      viewport={{ once: true, amount: 0.35 }}
      variants={{ idle: {}, active: {} }}
      aria-hidden="true"
      className="about-map"
    >
      <div
        className="about-map__surface"
        style={{ backgroundImage: `url("${background}")` }}
      />
      <div className="about-map__markers">
        {markers.map((marker) => (
          <Marker key={marker.src} {...marker} />
        ))}
      </div>
      <div className="about-map__wash" />
    </motion.div>
  );
}

export default Map;
