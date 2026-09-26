"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import LogoLockup from "@/app/components/brand/LogoLockup"
import { cn } from "@/lib/utils"

/**
 * Header — navigation institutionnelle SENELEC x EcoScan.
 *
 * Visuel : barre compacte en verre sombre, adaptee aux pages de la vitrine.
 * Hierarchy CTA : [Nav links] [Se connecter —ghost] [Commencer —orange]
 * Comportement : slide-down spring apres 90vh de scroll (preserve).
 */

const NAV_LINKS = [
  { label: "Notre methode", href: "/#methode" },
  { label: "A propos",      href: "/a-propos" },
  { label: "Solution",      href: "/solution" },
  { label: "Abonnement",   href: "/abonnement" },
]

export default function Header({ revealAfter }) {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const threshold =
      typeof revealAfter === "number"
        ? revealAfter
        : Math.round(window.innerHeight * 0.9)
    const onScroll = () => setVisible(window.scrollY > threshold)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [revealAfter])

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -72, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="site-header fixed inset-x-0 top-0 z-50"
        >
          <div className="site-header__inner mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 md:px-8">

            {/* Logo */}
            <Link href="/" aria-label="EcoScan — accueil" className="shrink-0">
              <LogoLockup variant="horizontal" theme="light" />
            </Link>

            {/* Nav principale — desktop */}
            <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="site-header__link rounded-md px-3 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions — desktop */}
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/connexion"
                className="site-header__login text-[13px] font-medium underline-offset-4 transition-colors hover:underline"
              >
                Se connecter
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1.5 rounded-full bg-orange-cta px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-orange-deep hover:shadow-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-cta"
              >
                Commencer
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* Burger — mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="site-header__menu inline-flex h-9 w-9 items-center justify-center rounded-lg lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span className={cn(
                  "absolute inset-x-0 top-0 h-0.5 rounded-full bg-current transition-all duration-200",
                  menuOpen && "top-1.5 rotate-45"
                )} />
                <span className={cn(
                  "absolute inset-x-0 top-1.5 h-0.5 rounded-full bg-current transition-opacity duration-200",
                  menuOpen ? "opacity-0" : "opacity-100"
                )} />
                <span className={cn(
                  "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-current transition-all duration-200",
                  menuOpen && "bottom-1.5 -rotate-45"
                )} />
              </span>
            </button>
          </div>

          {/* Menu mobile */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                id="mobile-menu"
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="site-header__mobile overflow-hidden lg:hidden"
              >
                <nav aria-label="Navigation mobile" className="flex flex-col gap-0.5 p-3">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="site-header__link rounded-lg px-4 py-3 text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-2 flex flex-col gap-2 border-t border-sky-border/40 pt-2">
                    <Link
                      href="/connexion"
                      onClick={() => setMenuOpen(false)}
                      className="site-header__link rounded-lg px-4 py-3 text-center text-sm font-medium"
                    >
                      Se connecter a mon espace
                    </Link>
                    <Link
                      href="/onboarding"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg bg-orange-cta px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      Commencer avec EcoScan
                    </Link>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
