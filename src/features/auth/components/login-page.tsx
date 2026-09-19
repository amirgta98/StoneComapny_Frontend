"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { ArrowRight, Gem } from "lucide-react";

import { CINEMATIC_EASE } from "@/lib/motion";
import { LoginForm } from "./login-form";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: CINEMATIC_EASE } },
};

/**
 * Full-screen auth page — stone-texture backdrop with a subtle slow gradient,
 * a slim brand header with a home link, and a frosted glass card hosting the
 * unified login/OTP form. All entrances are motion-driven (reduced-motion safe).
 */
export function LoginPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-stone-950 text-foreground">
      {/* Backdrop: stone photography */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/test_images/stones/test_8.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      {/* Slow subtle gradient drift */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        animate={
          reduceMotion
            ? undefined
            : {
                background: [
                  "linear-gradient(160deg, rgba(15,13,12,0.82) 0%, rgba(66,55,43,0.55) 50%, rgba(15,13,12,0.85) 100%)",
                  "linear-gradient(160deg, rgba(15,13,12,0.85) 0%, rgba(72,58,44,0.45) 55%, rgba(18,15,12,0.9) 100%)",
                  "linear-gradient(160deg, rgba(15,13,12,0.82) 0%, rgba(66,55,43,0.55) 50%, rgba(15,13,12,0.85) 100%)",
                ],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Slim brand header */}
      <header className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
            <Gem className="size-5 text-amber-100" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">سنگ</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
          بازگشت به فروشگاه
        </Link>
      </header>

      {/* Card */}
      <motion.main
        variants={reduceMotion ? undefined : containerVariants}
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "show"}
        className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-16 pt-6 sm:px-6"
      >
        <motion.div
          variants={reduceMotion ? undefined : itemVariants}
          className="rounded-2xl border border-white/10 bg-card/85 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
        >
          <LoginForm />
        </motion.div>

        <motion.p
          variants={reduceMotion ? undefined : itemVariants}
          className="mt-6 text-center text-xs leading-relaxed text-white/60"
        >
          با ورود به سایت، <span className="text-white/85">قوانین و حریم خصوصی</span> را
          می‌پذیرید.
        </motion.p>
      </motion.main>
    </div>
  );
}