"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * CinematicCardDeck — a scroll-linked 3D stack of cards.
 *
 * Responsibility
 *   Presents cards as a physical deck seen in perspective. Scrolling the
 *   surrounding section advances the deck: the front card flies up and out
 *   while the next rises to the top, with depth, parallax imagery, ambient
 *   accent glow and progress dots.
 *
 * Props
 *   @param {{title:string,description:string,tag:string,cardColor:string,accentColor:string,imageUrl:string}[]} cards
 *   @param {"subtle"|"cinematic"} [intensity="cinematic"] Motion magnitude.
 *   @param {number} [sectionHeight=360] Sticky stage height in px.
 *   @param {number} [cardWidth=520]  Card width in px (capped to viewport).
 *   @param {number} [cardHeight=360] Card height in px.
 *   @param {string} [className]
 *
 * Behavior
 *   `useScroll` tracks the tall wrapper; progress maps to a floating active
 *   index. Each card computes y/scale/rotateX/opacity from its distance to
 *   the active index. `useMotionValueEvent` mirrors the rounded index into
 *   state for progress dots and `aria-live`.
 *
 * Dependencies
 *   framer-motion, next/image, cn.
 *
 * Fallback
 *   With reduced motion, renders an accessible static column of the same
 *   cards (image + tag + text), no sticky stage or transforms.
 */
export function CinematicCardDeck({
  cards = [],
  intensity = "cinematic",
  sectionHeight = 360,
  cardWidth = 520,
  cardHeight = 360,
  className,
}) {
  const wrapperRef = useRef(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const n = cards.length

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.round(v * (n - 1))
    setActive((prev) => (prev === idx ? prev : Math.max(0, Math.min(n - 1, idx))))
  })

  if (reduce) {
    return (
      <div className={cn("mx-auto flex w-full max-w-2xl flex-col gap-6", className)}>
        {cards.map((card) => (
          <StaticCard key={card.title} card={card} height={cardHeight} />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={wrapperRef}
      className={cn("relative w-full", className)}
      style={{ height: `${(n + 1) * 90}vh` }}
    >
      <div
        className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden"
        style={{ perspective: 1400 }}
      >
        <div
          className="relative w-full"
          style={{ height: sectionHeight, maxWidth: cardWidth }}
        >
          {cards.map((card, i) => (
            <DeckCard
              key={card.title}
              card={card}
              index={i}
              total={n}
              progress={scrollYProgress}
              intensity={intensity}
              width={cardWidth}
              height={cardHeight}
            />
          ))}
        </div>

        {/* progress dots */}
        <div
          className="mt-10 flex items-center gap-2.5"
          role="tablist"
          aria-label="Progression des cartes"
        >
          {cards.map((card, i) => (
            <span
              key={card.title}
              role="tab"
              aria-selected={i === active}
              aria-label={card.tag}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === active ? "w-8" : "w-2 bg-charcoal/20",
              )}
              style={i === active ? { backgroundColor: card.accentColor } : undefined}
            />
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          Carte {active + 1} sur {n} : {cards[active]?.title}.{" "}
          {cards[active]?.description}
        </p>
      </div>
    </div>
  )
}

/**
 * DeckCard — one perspective card whose transform tracks scroll progress.
 * @param {{card:object,index:number,total:number,progress:import("framer-motion").MotionValue<number>,intensity:string,width:number,height:number}} props
 */
function DeckCard({ card, index, total, progress, intensity, width, height }) {
  const strong = intensity === "cinematic"
  const flyUp = strong ? 140 : 90
  const peek = strong ? 26 : 16
  const rot = strong ? 8 : 4

  // distance from the (floating) active index: 0 = front card
  const dist = (v) => v * (total - 1) - index

  const y = useTransform(progress, (v) => {
    const d = dist(v)
    if (d > 0) return -d * flyUp // already passed → fly up
    return Math.max(d, -3) * -peek // stacked below, peeking down
  })
  const scale = useTransform(progress, (v) => {
    const d = dist(v)
    const behind = Math.max(0, -d)
    return Math.max(0.82, 1 - behind * 0.05)
  })
  const rotateX = useTransform(progress, (v) => {
    const d = dist(v)
    return d > 0 ? Math.min(d, 1) * rot : 0
  })
  const opacity = useTransform(progress, (v) => {
    const d = dist(v)
    if (d > 0.85) return 0 // passed and gone
    const behind = Math.max(0, -d)
    return behind > 3.2 ? 0 : 1
  })
  const zIndex = useTransform(progress, (v) => {
    const d = dist(v)
    return Math.round(1000 - Math.abs(d) * 10)
  })
  const imageY = useTransform(progress, (v) => {
    const d = dist(v)
    return Math.max(-1, Math.min(1, d)) * 24
  })

  return (
    <motion.article
      style={{
        y,
        scale,
        rotateX,
        opacity,
        zIndex,
        width: "100%",
        maxWidth: width,
        height,
        backgroundColor: card.cardColor,
        transformStyle: "preserve-3d",
      }}
      className="absolute inset-x-0 mx-auto overflow-hidden rounded-2xl shadow-2xl"
    >
      {/* parallax image */}
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <div className="absolute inset-0 scale-110">
          <Image
            src={card.imageUrl || "/placeholder.svg"}
            alt=""
            aria-hidden="true"
            fill
            className="object-cover opacity-40"
            sizes="(max-width: 640px) 100vw, 520px"
          />
        </div>
      </motion.div>

      {/* ambient accent glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
        style={{ backgroundColor: card.accentColor, opacity: 0.25 }}
      />

      <div className="relative flex h-full flex-col justify-between p-7">
        <span
          className="w-fit rounded-full px-3 py-1 font-mono text-xs uppercase tracking-[0.15em]"
          style={{ backgroundColor: card.accentColor, color: card.cardColor }}
        >
          {card.tag}
        </span>
        <div>
          <h3 className="font-display text-2xl font-semibold text-cream text-balance">
            {card.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/80 text-pretty">
            {card.description}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

/**
 * StaticCard — reduced-motion / fallback presentation of a deck card.
 * @param {{card:object,height:number}} props
 */
function StaticCard({ card, height }) {
  return (
    <article
      className="relative overflow-hidden rounded-2xl shadow-lg"
      style={{ backgroundColor: card.cardColor, minHeight: height }}
    >
      <div className="absolute inset-0">
        <Image
          src={card.imageUrl || "/placeholder.svg"}
          alt=""
          aria-hidden="true"
          fill
          className="object-cover opacity-30"
          sizes="(max-width: 640px) 100vw, 640px"
        />
      </div>
      <div className="relative flex h-full flex-col justify-between gap-8 p-7">
        <span
          className="w-fit rounded-full px-3 py-1 font-mono text-xs uppercase tracking-[0.15em]"
          style={{ backgroundColor: card.accentColor, color: card.cardColor }}
        >
          {card.tag}
        </span>
        <div>
          <h3 className="font-display text-2xl font-semibold text-cream text-balance">
            {card.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-cream/80 text-pretty">
            {card.description}
          </p>
        </div>
      </div>
    </article>
  )
}
