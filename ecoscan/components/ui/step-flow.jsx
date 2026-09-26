"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * StepFlow — a process navigator with a sliding highlight and paired image.
 *
 * Responsibility
 *   Renders an ordered list of steps. The active step carries a sliding
 *   highlight (shared layout animation) and drives a large companion image
 *   that cross-fades on change. Selection happens on hover AND click/focus,
 *   so it reads like moving through a diagnosis folder rather than a plain
 *   timeline.
 *
 * Props
 *   @param {{serial:string,title:string,description:string,image:string}[]} steps
 *   @param {string} [highlightColor="rgb(45 90 70)"] Background of the moving highlight.
 *   @param {string} [className]
 *
 * Behavior
 *   `activeIndex` state is set by pointer enter, click, and keyboard focus.
 *   The highlight uses framer-motion `layoutId` to glide between rows. The
 *   image panel uses AnimatePresence for a wipe/fade between step images.
 *   `aria-live` announces the current step for screen readers.
 *
 * Dependencies
 *   framer-motion, next/image, cn.
 *
 * Fallback
 *   With reduced motion, the highlight and image transitions are instant
 *   (no slide/fade); all interaction and content remain fully available.
 */
export function StepFlow({
  steps = [],
  highlightColor = "rgb(45 90 70)",
  className,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduce = useReducedMotion()
  const active = steps[activeIndex]

  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12",
        className,
      )}
    >
      {/* Step list */}
      <ol className="order-2 flex flex-col lg:order-1">
        {steps.map((step, i) => {
          const isActive = i === activeIndex
          return (
            <li key={step.serial} className="relative">
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                aria-pressed={isActive}
                aria-label={`Étape ${step.serial} : ${step.title}`}
                className="relative z-10 flex w-full items-start gap-5 rounded-xl px-5 py-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
              >
                {isActive && (
                  <motion.span
                    layoutId="stepflow-highlight"
                    className="absolute inset-0 -z-10 rounded-xl"
                    style={{ backgroundColor: highlightColor }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 320, damping: 34 }
                    }
                  />
                )}
                <span
                  className={cn(
                    "font-mono text-sm tabular-nums transition-colors",
                    isActive ? "text-lime" : "text-slate",
                  )}
                >
                  {step.serial}
                </span>
                <span className="flex-1">
                  <span
                    className={cn(
                      "block font-display text-xl font-semibold transition-colors",
                      isActive ? "text-cream" : "text-charcoal",
                    )}
                  >
                    {step.title}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-sm leading-relaxed transition-colors",
                      isActive ? "text-cream/80" : "text-slate",
                    )}
                  >
                    {step.description}
                  </span>
                </span>
              </button>
              {i < steps.length - 1 && (
                <span className="pointer-events-none absolute bottom-0 left-[2.35rem] h-px w-[calc(100%-3rem)] bg-border" />
              )}
            </li>
          )
        })}
      </ol>

      {/* Companion image */}
      <div className="order-1 lg:order-2">
        <div className="sticky top-24">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-stone">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active?.image}
                initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1 }}
                transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={active?.image || "/placeholder.svg"}
                  alt={active?.title || "Étape de la méthode"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 512px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* corner annotation */}
            <div className="absolute left-5 top-5 font-mono text-xs uppercase tracking-[0.2em] text-cream/90">
              {active?.serial} / {String(steps.length).padStart(2, "0")}
            </div>
            <div className="absolute bottom-5 left-5 right-5">
              <p className="font-display text-2xl font-semibold text-cream text-balance">
                {active?.title}
              </p>
            </div>
          </div>

          {/* step dots */}
          <div className="mt-5 flex items-center gap-2" aria-hidden="true">
            {steps.map((s, i) => (
              <span
                key={s.serial}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === activeIndex ? "w-8 bg-forest" : "w-1.5 bg-border",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Étape {active?.serial} sur {steps.length} : {active?.title}.{" "}
        {active?.description}
      </p>
    </div>
  )
}
