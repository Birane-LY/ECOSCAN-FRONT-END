"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * BentoGridShowcase — a slot-based, staggered 3-column bento grid.
 *
 * Responsibility
 *   Arranges six distinct content slots into an asymmetric 3-row layout and
 *   animates them in with a staggered entrance when scrolled into view.
 *   Faithfully preserves the reference component's slot API and grid math.
 *
 * Props (each slot is arbitrary ReactNode content)
 *   @param {React.ReactNode} integrations      Top-left (data sources).
 *   @param {React.ReactNode} featureTags       Top-right (what we look for).
 *   @param {React.ReactNode} mainFeature       Tall middle column (3 rows).
 *   @param {React.ReactNode} secondaryFeature  Row 2 left.
 *   @param {React.ReactNode} statistic         Right column (spans 2 rows).
 *   @param {React.ReactNode} journey           Row 3 left.
 *   @param {string} [className]
 *
 * Behavior
 *   Container variant staggers child slots; each slot springs up from y:20.
 *   Uses `whileInView` so the stagger fires on scroll, once.
 *
 * Dependencies
 *   framer-motion, cn.
 *
 * Fallback
 *   Reduced-motion users still receive the full grid; motion collapses to
 *   an instant appear via framer-motion's own reduced-motion handling.
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
}

export const BentoGridShowcase = ({
  integrations,
  featureTags,
  mainFeature,
  secondaryFeature,
  statistic,
  journey,
  className,
}) => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={cn(
        "grid w-full grid-cols-1 gap-5 md:grid-cols-3",
        "md:grid-rows-3",
        "auto-rows-[minmax(200px,auto)]",
        className,
      )}
    >
      {/* Slot 1: Integrations (row 1, col 1) */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {integrations}
      </motion.div>

      {/* Slot 2: Main Feature (col 2) — spans 3 rows */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-3">
        {mainFeature}
      </motion.div>

      {/* Slot 3: Feature Tags (row 1, col 3) */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {featureTags}
      </motion.div>

      {/* Slot 4: Secondary Feature (row 2, col 1) */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {secondaryFeature}
      </motion.div>

      {/* Slot 5: Statistic (col 3) — spans 2 rows */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2">
        {statistic}
      </motion.div>

      {/* Slot 6: Journey (row 3, col 1) */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {journey}
      </motion.div>
    </motion.section>
  )
}
