import Link from "next/link"
import LogoLockup from "@/app/components/brand/LogoLockup"

/**
 * Footer — identite institutionnelle SENELEC x EcoScan.
 * Fond navy, labels cyan-data, liens blancs.
 */

const columns = [
  {
    title: "Explorer",
    links: [
      { label: "Notre methode",        href: "/#methode" },
      { label: "Pour qui",             href: "/#pour-qui" },
      { label: "Le parcours EcoScan", href: "/#finance" },
      { label: "Preuve",               href: "/#preuve" },
    ],
  },
  {
    title: "Produit",
    links: [
      { label: "A propos",    href: "/a-propos" },
      { label: "Solution",    href: "/solution" },
      { label: "Abonnement",  href: "/abonnement" },
      { label: "Commencer",   href: "/abonnement" },
    ],
  },
  {
    title: "Parcours",
    links: [
      { label: "Parcours PME",          href: "/abonnement" },
      { label: "Parcours multi-sites",  href: "/abonnement" },
      { label: "Parcours cabinet",      href: "/abonnement" },
      { label: "Se connecter",          href: "/connexion" },
    ],
  },
]

export function Footer() {
  return (
    <footer style={{ background: "#081b26" }} className="text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <LogoLockup variant="footer" theme="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              EcoScan aide les organisations à structurer et analyser leurs informations énergétiques, puis à suivre les actions engagées.
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-white/30">
              Afrique de l Ouest — Senegal
            </p>
          </div>

          {/* Colonnes nav */}
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-cyan-data">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t pt-7 text-xs text-white/30 md:flex-row md:items-center" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p>&copy; {new Date().getFullYear()} EcoScan. Tous droits reserves.</p>
          <p className="font-mono uppercase tracking-[0.2em]">
            Diagnostic énergétique &middot; Aide à la décision
          </p>
        </div>
      </div>
    </footer>
  )
}
