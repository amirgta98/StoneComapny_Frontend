"use client";

import Image from "next/image";
import { useTheme } from "@/providers";

export type HeroMediaData = {
  type: "image" | "video";
  url: string;
} | null;

type HeroMediaProps = {
  media: HeroMediaData;
};

/**
 * Renders the Hero background media.
 *
 * - If media is an image → Next.js Image, object-cover, fills the Hero.
 * - If media is a video → autoplay/muted/loop/playsInline video, object-cover.
 * - If no media → flat primary-color background.
 */
export function HeroMedia({ media }: HeroMediaProps) {
  const { tokens } = useTheme();

  if (!media) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: tokens.primary }}
      />
    );
  }

  if (media.type === "video") {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        src={media.url}
      />
    );
  }

  return (
    <Image
      src={media.url}
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  );
}