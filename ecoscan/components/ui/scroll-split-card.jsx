"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
} from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * ScrollSplitCard — a scroll-driven card that splits open to reveal panels.
 *
 * Responsibility
 *   As the user scrolls, an image "cover" splits into a
 *   top and bottom half that slide apart as the user scrolls. Behind it,
 *   a set of audience panels is revealed and staggers into place. This
 *   dramatizes the idea of a closed surface opening to show structure.
 *
 * Props
 *   @param {string} imageSrc  Cover image (real photo, not decoration).
 *   @param {{title:string,description:string,bgColor:string,textColor:string,imageSrc:string,imageAlt:string}[]} cards
 *          The panels revealed once the cover splits (3 recommended).
 *   @param {string} [className]
 *
 * Behavior
 *   Uses framer-motion `useScroll` bound to the track. Progress 0→0.5
 *   splits the cover; 0.5→1 reveals and staggers the panels. A discrete
 *   progress bar communicates position. The track is tall enough that the
 *   normal page scroll resumes once the sequence completes.
 *
 * Dependencies
 *   framer-motion, next/image, cn.
 *
 * Fallback
 *   With `prefers-reduced-motion`, renders a static, readable stack of the
 *   cover image plus all panels — no sticky stage, no transforms.
 */
export function ScrollSplitCard({
  imageSrc,
  imageAlt,
  cards = [],
  className,
}) {
  const trackRef = useRef(null)
  const reduce = useReducedMotion()
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 767px)")
    const updateCompact = () => setIsCompact(compactQuery.matches)
    updateCompact()
    compactQuery.addEventListener("change", updateCompact)
    return () => compactQuery.removeEventListener("change", updateCompact)
  }, [])

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  })

  const revealProgress = useMotionValue(0)

  useEffect(() => {
    let isComplete = false
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (isComplete) return
      if (progress >= 0.88) {
        isComplete = true
        revealProgress.set(1)
        return
      }
      revealProgress.set(progress)
    })
    return unsubscribe
  }, [revealProgress, scrollYProgress])

  const topY = useTransform(revealProgress, [0, 0.5], ["0%", "-102%"])
  const bottomY = useTransform(revealProgress, [0, 0.5], ["0%", "102%"])
  const coverShadow = useTransform(revealProgress, [0, 0.5], [0.35, 0])
  const coverBoxShadow = useTransform(
    coverShadow,
    (shadow) => `0 40px 80px -20px rgba(43,45,48,${shadow})`,
  )
  const barScale = revealProgress
  const hintOpacity = useTransform(revealProgress, [0, 0.12], [1, 0])

  if (reduce || isCompact) {
    return (
      <div className={cn("mx-auto w-full max-w-none px-6 py-12", className)}>
        <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="90vw"
            className="object-contain"
          />
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <li
              key={card.title}
              className="flex flex-col gap-4 rounded-xl p-5"
              style={{ backgroundColor: card.bgColor, color: card.textColor }}
            >
              <AudienceCardContent card={card} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div ref={trackRef} className={cn("relative h-[220svh] w-full", className)}>
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden px-4">
        {/* progress bar */}
        <div className="absolute left-1/2 top-8 h-[3px] w-40 -translate-x-1/2 overflow-hidden rounded-full bg-charcoal/10">
          <motion.div
            className="h-full origin-left bg-forest"
            style={{ scaleX: barScale }}
          />
        </div>

        <div
          className="relative"
          style={{
            width: "min(calc(100vw - 48px), 178svh)",
            aspectRatio: "2.15 / 1",
          }}
        >
          {/* Revealed panels (behind the cover) */}
          <div className="audience-panels absolute inset-0 grid grid-cols-1 gap-3 md:grid-cols-3">
            {cards.map((card, i) => {
              const start = 0.5 + i * 0.12
              return (
                <Panel
                  key={card.title}
                  card={card}
                  progress={revealProgress}
                  start={start}
                  index={i}
                  total={cards.length}
                />
              )
            })}
          </div>

          {/* Cover: image split into two halves */}
          <motion.div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
            style={{ boxShadow: coverBoxShadow }}
          >
            <motion.div
              className="absolute inset-x-0 top-0 h-1/2 overflow-hidden"
              style={{ y: topY }}
            >
              <div className="relative h-[100%] w-full">
                <div className="absolute inset-0 h-[200%]">
                  <Image
                    src={imageSrc || "/placeholder.svg"}
                    alt={imageAlt}
                    fill
                    priority
                    className="object-contain"
                    sizes="90vw"
                    style={{ objectPosition: "center top" }}
                  />
                </div>
                <div className="absolute inset-0 bg-charcoal/10" />
                <div className="absolute bottom-4 left-4 font-mono text-xs uppercase tracking-[0.2em] text-cream/90">
                  Pour qui
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden"
              style={{ y: bottomY }}
            >
              <div className="relative h-[100%] w-full">
                <div className="absolute inset-x-0 bottom-0 h-[200%]">
                  <Image
                    src={imageSrc || "/placeholder.svg"}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-contain"
                    sizes="90vw"
                    style={{ objectPosition: "center bottom" }}
                  />
                </div>
                <div className="absolute inset-0 bg-charcoal/20" />
                <motion.div
                  className="absolute right-4 top-4 font-mono text-xs uppercase tracking-[0.2em] text-lime"
                  style={{ opacity: hintOpacity }}
                >
                  Défilez pour ouvrir ↓
                </motion.div>
              </div>
            </motion.div>

            {/* seam highlight */}
            <motion.div
              className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
              style={{
                opacity: hintOpacity,
                backgroundColor: "rgba(255, 255, 255, 0.72)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/**
 * Panel — a single revealed audience card.
 * @param {{card:object, progress:import("framer-motion").MotionValue<number>, start:number, index:number, total:number}} props
 */
function Panel({ card, progress, start }) {
  const opacity = useTransform(progress, [start, start + 0.12], [0, 1])
  const y = useTransform(progress, [start, start + 0.12], [40, 0])
  return (
    <motion.div
      style={{ opacity, y, backgroundColor: card.bgColor, color: card.textColor }}
      className="flex flex-col gap-4 rounded-2xl p-5"
    >
      <AudienceCardContent card={card} />
    </motion.div>
  )
}

function AudienceCardContent({ card }) {
  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/15 bg-navy/10">
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 767px) 90vw, 30vw"
          className="object-contain"
        />
      </div>
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">
          Espace EcoScan
        </span>
        <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-balance">
          {card.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed opacity-90 text-pretty">
          {card.description}
        </p>
      </div>
    </>
  )
}
