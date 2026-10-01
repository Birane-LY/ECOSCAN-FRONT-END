"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/app/components/navigation/Header"
import { Footer } from "@/app/components/footer/Footer"
import { CtaFinalSection } from "@/app/components/cta/CtaFinalSection"

function isAvailablePlan(plan) {
  const status = String(plan.status || "").trim().toLocaleLowerCase("fr")
  return !status || ["actif", "active", "published", "publié", "publie"].includes(status)
}

function formatPlanPrice(price, currency = "XOF") {
  if (price === null || price === undefined || String(price).trim() === "") {
    return { value: "Sur devis", period: "" }
  }

  const value = String(price).trim()
  const numericValue = Number(value.replace(/\s/g, "").replace(",", "."))

  if (Number.isFinite(numericValue)) {
    if (numericValue === 0) return { value: "Gratuit", period: "" }
    return {
      value: `${new Intl.NumberFormat("fr-FR").format(numericValue)} ${currency === "XOF" ? "FCFA" : currency}`,
      period: "/ mois",
    }
  }

  return { value, period: "" }
}

const FAQS = [
  {
    q: "Comment fonctionne l’essai gratuit ?",
    a: "Chaque formule commence par un essai gratuit de 14 jours après l’activation de votre adresse e-mail. Aucun paiement n’est demandé pour démarrer. Vous pourrez souscrire à une offre payante depuis votre espace.",
  },
  {
    q: "Comment sont définis les tarifs affichés ?",
    a: "Les tarifs et conditions affichés correspondent aux formules actives configurées par l’équipe EcoScan dans son espace d’administration. Contactez-nous pour toute question sur le périmètre d’une formule.",
  },
  {
    q: "EcoScan nécessite-t-il d'installer des capteurs matériels lourds dès le départ ?",
    a: "Non. Notre démarche repose d'abord sur l'intelligence des données existantes (factures SENELEC, relevés existants, journaux de charge). Cette étape permet de dégager des économies nettes avant même d'envisager une instrumentation additionnelle si elle s'avère rentable.",
  },
  {
    q: "Comment mes données énergétiques sont-elles sécurisées ?",
    a: "Vos données de facturation et d'exploitation restent strictement confidentielles et ne sont jamais partagées à des tiers sans votre consentement explicite. Elles servent exclusivement à calculer vos indicateurs et vos trajectoires d'optimisation.",
  },
  {
    q: "Quelle est la durée d'engagement pour le suivi régulier ?",
    a: "La mission de cadrage initial est ponctuelle sans engagement. Les contrats de suivi de performance s'établissent généralement sur 12 mois pour observer la cyclicité saisonnière complète (période chaude, variations d'exploitation).",
  },
]

export default function AbonnementPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [plans, setPlans] = useState([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [plansError, setPlansError] = useState("")
  const [reloadPlans, setReloadPlans] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadPlans() {
      setPlansLoading(true)
      setPlansError("")

      try {
        const response = await fetch("/api/billing/plans", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Chargement des abonnements impossible (${response.status})`)
        }

        const data = await response.json()
        const results = Array.isArray(data) ? data : data?.results
        if (!Array.isArray(results)) {
          throw new Error("La réponse des abonnements n’a pas le format attendu")
        }

        if (!cancelled) {
          setPlans(results.filter((plan) => plan && isAvailablePlan(plan)))
        }
      } catch (error) {
        console.error("Erreur lors du chargement des abonnements EcoScan :", error)
        if (!cancelled) {
          setPlansError("Les abonnements ne peuvent pas être chargés pour le moment.")
        }
      } finally {
        if (!cancelled) setPlansLoading(false)
      }
    }

    loadPlans()
    return () => {
      cancelled = true
    }
  }, [reloadPlans])

  return (
    <>
      <Header revealAfter={0} />

      {/* ── HERO ── */}
      <section className="relative isolate flex min-h-[58vh] items-center overflow-hidden py-28 text-white">
        <Image
          src="/images/hero/subscriptions-hero.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-[#081b26]/65"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center w-full">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-cyan-data">
            Abonnements EcoScan
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold text-white text-balance max-w-4xl mx-auto">
            Des formules adaptées à votre organisation.
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto text-pretty">
            Retrouvez les offres actuellement proposées par EcoScan. Les formules et leurs conditions sont mises à jour par notre équipe.
          </p>

          {/* Transparence Note */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-sky-border/30 bg-white/10 px-5 py-2 text-xs font-mono text-sky-mid">
            <span className="h-2 w-2 rounded-full bg-cyan-data" />
            Offres publiées par l’équipe EcoScan
          </div>
        </div>
      </section>

      {/* ── CARTES DE TARIFS ── */}
      <section className="bg-sky-ui/50 py-20 border-b border-sky-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plansLoading ? (
              <p className="col-span-full py-12 text-center text-slate" role="status">
                Chargement des abonnements…
              </p>
            ) : plansError ? (
              <div className="col-span-full py-12 text-center" role="alert">
                <p className="text-slate">{plansError}</p>
                <button
                  type="button"
                  onClick={() => setReloadPlans((count) => count + 1)}
                  className="mt-4 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Réessayer
                </button>
              </div>
            ) : plans.length === 0 ? (
              <p className="col-span-full py-12 text-center text-slate">
                Aucune formule n’est actuellement disponible. Revenez bientôt ou contactez notre équipe.
              </p>
            ) : (
              plans.map((plan) => {
                const currency = plan.devise || "XOF"
                const price = formatPlanPrice(plan.prix_mensuel ?? plan.price, currency)
                const annualPrice = plan.prix_annuel == null
                  ? null
                  : formatPlanPrice(plan.prix_annuel, currency)
                const hasSeatLimit =
                  (plan.limites && Object.prototype.hasOwnProperty.call(plan.limites, "utilisateurs")) ||
                  (plan.limites && Object.prototype.hasOwnProperty.call(plan.limites, "sieges")) ||
                  plan.seats !== undefined ||
                  plan.user_limit !== undefined ||
                  plan.limite_utilisateurs !== undefined
                const seats =
                  plan.limites?.utilisateurs ??
                  plan.limites?.sieges ??
                  plan.seats ??
                  plan.user_limit ??
                  plan.limite_utilisateurs
                const featureValues = plan.fonctionnalites && typeof plan.fonctionnalites === "object"
                  ? Object.entries(plan.fonctionnalites)
                    .filter(([name, enabled]) => name !== "avantages" && enabled)
                    .map(([name, value]) =>
                      typeof value === "string"
                        ? value
                        : ({
                          analytics_avances: "Analytics avancés",
                          support_prioritaire: "Support prioritaire",
                        }[name] || name.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase()))
                    )
                  : []
                const features = [
                  ...(Array.isArray(plan.fonctionnalites?.avantages) ? plan.fonctionnalites.avantages : []),
                  ...(Array.isArray(plan.features) ? plan.features : featureValues),
                ].filter((feature) => typeof feature === "string" && feature.trim())
                const monthlyNumeric = Number(plan.prix_mensuel ?? plan.price)
                const annualNumeric = Number(plan.prix_annuel)
                const annualSavings = annualPrice && monthlyNumeric > 0 && annualNumeric > 0
                  ? Math.round((1 - annualNumeric / (monthlyNumeric * 12)) * 100)
                  : null

                return (
                  <article
                    key={plan.id}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/80 shadow-[0_20px_60px_rgba(8,27,38,0.09)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(8,27,38,0.15)]"
                  >
                    <div className="h-1.5 bg-gradient-to-r from-[#081b26] via-[#176174] to-[#62c9bd]" />
                    <div className="flex flex-1 flex-col p-7 sm:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#397d83]">
                            {plan.audience || plan.target || "Formule EcoScan"}
                          </p>
                          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#081b26]">
                            {plan.nom || plan.name || "Abonnement EcoScan"}
                          </h3>
                        </div>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d9ece9] bg-[#eff8f6] text-[#176174]">
                          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>

                      <p className="mt-4 min-h-[3rem] text-sm leading-relaxed text-[#53656b]">
                        {plan.description || "Une formule EcoScan pour structurer vos données énergétiques et éclairer vos décisions."}
                      </p>

                      <div className="mt-5 rounded-xl border border-[#b8e4d7] bg-[#eff8f6] px-4 py-3 text-sm text-[#176174]">
                        <strong>14 jours d’essai gratuit</strong>
                        <span className="mt-1 block text-xs text-[#53656b]">Sans paiement au démarrage · formule conservée pendant l’inscription</span>
                      </div>

                      <div className="mt-6 rounded-2xl border border-white/70 bg-gradient-to-br from-[#081b26] to-[#123d49] p-5 text-white shadow-inner">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                          Tarif mensuel
                        </p>
                        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                          <span className="font-display text-3xl font-bold tracking-tight">{price.value}</span>
                          {price.period && <span className="text-xs text-white/65">{price.period}</span>}
                        </div>
                        {annualPrice && (
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-3 text-xs">
                            <span className="text-white/70">Ou {annualPrice.value} / an</span>
                            {annualSavings > 0 && (
                              <span className="rounded-full bg-[#c7f2e4]/15 px-2.5 py-1 font-semibold text-[#c7f2e4]">
                                −{annualSavings}% à l’année
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {hasSeatLimit && (
                        <div className="mt-5 flex items-center gap-2 text-sm text-[#334b53]">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#397d83]" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m16 0v-2a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>
                            {seats == null ? "Utilisateurs illimités" : `${seats} utilisateur${Number(seats) > 1 ? "s" : ""}`}
                          </span>
                        </div>
                      )}

                      <div className="mt-6 border-t border-[#e5eeec] pt-5">
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#53656b]">
                          Inclus dans cette formule
                        </p>
                        {features.length > 0 ? (
                          <ul className="mt-4 space-y-3">
                            {features.map((feature, index) => (
                              <li key={`${plan.id}-feature-${index}`} className="flex items-start gap-3 text-sm leading-relaxed text-[#334b53]">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e9f5f1] text-[#176174]">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-3 text-sm text-[#718187]">
                            Les détails de cette formule vous seront précisés lors de votre demande.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto px-7 pb-7 sm:px-8 sm:pb-8">
                      <Link
                        href={`/onboarding?plan=${encodeURIComponent(plan.id)}`}
                        className="group/button flex w-full items-center justify-center gap-2 rounded-xl bg-[#081b26] px-5 py-3.5 text-center text-sm font-semibold text-white shadow-[0_8px_20px_rgba(8,27,38,0.16)] transition hover:bg-[#123d49] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176174]"
                      >
                        Commencer l’essai avec cette formule
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" aria-hidden="true">
                          <path d="M7 17 17 7M7 7h10v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-sky-ui/40 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-cyan-data">Questions Fréquentes</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-navy">Tout ce que vous devez savoir</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} className="rounded-2xl border border-sky-border bg-white overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-bold text-navy text-base pr-4">{faq.q}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-ui text-royal font-bold text-lg">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate leading-relaxed border-t border-sky-border/40 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <CtaFinalSection />
      <Footer />
    </>
  )
}
