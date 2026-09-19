"use client";

import { Check, MapPin, Truck, FileCheck, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutStep } from "../types";

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
  className?: string;
}

interface StepItem {
  key: CheckoutStep;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  stepNumber: number;
}

const STEPS: StepItem[] = [
  {
    key: "address",
    title: "آدرس تحویل",
    description: "انتخاب یا افزودن محل پروژه",
    icon: MapPin,
    stepNumber: 1,
  },
  {
    key: "shipping",
    title: "روش ارسال",
    description: "باربری اختصاصی یا عمومی سنگ",
    icon: Truck,
    stepNumber: 2,
  },
  {
    key: "review",
    title: "بررسی سفارش",
    description: "تایید متراژ، اقلام و تخفیف",
    icon: FileCheck,
    stepNumber: 3,
  },
  {
    key: "payment",
    title: "پرداخت نهایی",
    description: "درگاه بانکی شاپرک یا حواله",
    icon: CreditCard,
    stepNumber: 4,
  },
];

const STEP_ORDER: CheckoutStep[] = ["address", "shipping", "review", "payment"];

export function CheckoutStepper({
  currentStep,
  onStepClick,
  className,
}: CheckoutStepperProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className={cn("w-full bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-xs", className)}>
      <nav aria-label="مراحل تکمیل خرید" className="relative">
        <ol className="grid grid-cols-4 gap-2 sm:gap-4">
          {STEPS.map((step, index) => {
            const isPassed = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isClickable = isPassed && onStepClick;
            const Icon = step.icon;

            return (
              <li
                key={step.key}
                className={cn(
                  "relative flex flex-col items-center text-center",
                  isClickable ? "cursor-pointer group" : "cursor-default"
                )}
                onClick={() => {
                  if (isClickable) {
                    onStepClick(step.key);
                  }
                }}
              >
                {/* Connecting Line between steps (except last) */}
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-4 sm:top-5 end-[-50%] start-[50%] h-[2px] -z-0 transition-colors duration-300",
                      index < currentIndex
                        ? "bg-primary"
                        : "bg-border/80"
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Step Circle / Badge */}
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-all duration-200 text-xs sm:text-sm font-bold",
                    isPassed &&
                      "border-primary bg-primary text-primary-foreground shadow-xs group-hover:brightness-105",
                    isCurrent &&
                      "border-primary bg-background text-primary shadow-xs ring-4 ring-primary/10",
                    !isPassed &&
                      !isCurrent &&
                      "border-border bg-muted/40 text-muted-foreground"
                  )}
                >
                  {isPassed ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" aria-hidden="true" />
                  ) : (
                    <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" aria-hidden="true" />
                  )}
                </div>

                {/* Step Titles */}
                <div className="mt-2.5 space-y-0.5 max-w-full">
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-semibold transition-colors",
                      isCurrent && "text-primary font-bold",
                      isPassed && "text-foreground group-hover:text-primary",
                      !isPassed && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="hidden md:block text-[11px] text-muted-foreground line-clamp-1">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
