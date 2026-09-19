"use client";

import { motion } from "motion/react";
import { useTheme } from "@/providers";
import { splitCompanyName, splitSloganWithAccent } from "./utils";

type HeroContentProps = {
  companyName: string;
  slogan: string;
};

/**
 * Renders the Hero text content.
 *
 * - Company name: last word receives the accent color.
 * - Slogan: second-to-last word receives the accent color.
 * - Handles empty, single-word, Persian, English and mixed text safely.
 */
export function HeroContent({ companyName, slogan }: HeroContentProps) {
  const { tokens } = useTheme();
  const accentColor = tokens.accent;
  const textColor = tokens.primaryForeground;
  const { remaining, last } = splitCompanyName(companyName);
  const sloganTokens = splitSloganWithAccent(slogan);

  return (
    <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center sm:gap-8">
      {/* Company name */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-5xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-6xl"
        style={{ color: textColor }}
      >
        {remaining.length > 0 && (
          <>
            {remaining.join(" ")}{" "}
          </>
        )}
        {last && (
          <span style={{ color: accentColor }}>{last}</span>
        )}
      </motion.h1>

      {/* Slogan */}
      {sloganTokens.length > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="max-w-2xl  leading-relaxed text-2xl  md:text-3xl font-bold "
          style={{ color: textColor }}
        >
          {sloganTokens.map(({ word, accent }, index) => (
            <span key={`${word}-${index}`} style={accent ? { color: accentColor } : undefined}>
              {word}
              {index < sloganTokens.length - 1 ? " " : ""}
            </span>
          ))}
        </motion.p>
      )}
    </div>
  );
}