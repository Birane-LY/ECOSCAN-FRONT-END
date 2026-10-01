"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import LogoLockup from "@/app/components/brand/LogoLockup"
import { EmailTypeSelector } from "@/app/components/onboarding/EmailTypeSelector"
import { ProfileStep } from "@/app/components/onboarding/ProfileStep"
import { ContextStep } from "@/app/components/onboarding/ContextStep"
import { GoalsStep } from "@/app/components/onboarding/GoalsStep"
import { ConfirmationScreen } from "@/app/components/onboarding/ConfirmationScreen"
import { cn } from "@/lib/utils"

/**
 * Onboarding 2026 — Expérience d'immersion et de qualification guidée.
 *
 * La demande complète est transmise au backend et reste en attente
 * jusqu’à validation par l’équipe EcoScan.
 */

const TOTAL_STEPS = 6 // 0: Accueil, 1: Email & Identité, 2: Profil, 3: Activité, 4: Objectifs, 5: Synthèse & Envoi, 6: Confirmation

const STEP_LABELS = [
  "Introduction",
  "Votre email",
  "Votre structure",
  "Votre activité",
  "Vos priorités",
  "Validation",
]

/* ─── Progression 2026 élégante & non invasive ─── */
function SophisticatedProgress({ currentStep, totalSteps }) {
  const pct = Math.min(100, Math.round((currentStep / (totalSteps - 1)) * 100))

  return (
    <div className="w-full flex items-center justify-between gap-4 py-2" aria-label="Progression du questionnaire">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-bold text-cyan-data tracking-wider uppercase">
          Étape {Math.max(1, currentStep)}/{totalSteps - 1}
        </span>
        <span className="hidden sm:inline text-xs text-white/40">&middot;</span>
        <span className="hidden sm:inline text-xs text-white/80 font-medium">
          {STEP_LABELS[currentStep] || ""}
        </span>
      </div>

      <div className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: totalSteps - 1 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i + 1 === currentStep
                ? "w-8 bg-cyan-data shadow-[0_0_8px_rgba(0,180,216,0.6)]"
                : i + 1 < currentStep
                  ? "w-3.5 bg-royal"
                  : "w-2 bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Panneau Marque Asymétrique ─── */
function BrandAtmosphere({ currentStep }) {
  const INSIGHTS = [
    {
      eyebrow: "Comprendre votre énergie",
      title: "Des informations énergétiques plus faciles à lire.",
      desc: "EcoScan aide les organisations à structurer leurs données pour éclairer leurs décisions.",
    },
    {
      eyebrow: "Identification",
      title: "Commençons par votre identité professionnelle.",
      desc: "Ces coordonnées permettront à l’équipe EcoScan de donner suite à votre demande d’accès.",
    },
    {
      eyebrow: "Organisation",
      title: "Chaque organisation a son propre contexte.",
      desc: "Quelques repères aident à situer votre structure et la manière dont elle suit sa consommation.",
    },
    {
      eyebrow: "Vos informations disponibles",
      title: "Partons de ce que vous avez déjà.",
      desc: "Indiquez les sources disponibles afin de mieux comprendre les informations à organiser et analyser.",
    },
    {
      eyebrow: "Vos priorités",
      title: "Qu’aimeriez-vous mieux comprendre ?",
      desc: "Vos réponses situent les points d’attention et les décisions qui comptent pour votre organisation.",
    },
    {
      eyebrow: "Vérification",
      title: "Une dernière vérification avant l’envoi.",
      desc: "EcoScan est un prototype destiné à être confronté aux usages et enrichi progressivement.",
    },
  ]

  const insight = INSIGHTS[currentStep] || INSIGHTS[0]

  return (
    <div className="signup-brand-panel relative hidden flex-col justify-between overflow-hidden border-r border-white/10 p-12 text-white lg:flex">
      <Image
        src="/images/people/organization-leader.jpg"
        alt=""
        fill
        sizes="(max-width: 1024px) 0px, 480px"
        className="signup-brand-panel__image"
        priority
      />
      <div className="signup-brand-panel__shade" aria-hidden="true" />

      {/* Header */}
      <div className="relative z-10">
        <Link href="/" aria-label="Retour à l'accueil EcoScan">
          <LogoLockup variant="horizontal" theme="light" />
        </Link>
      </div>

      {/* Contenu dynamique par étape */}
      <div className="relative z-10 my-auto max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-cyan-data">
              {insight.eyebrow}
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white text-balance">
              {insight.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {insight.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 border-t border-white/15 pt-8">
          <p className="text-xs leading-relaxed text-white/70">
            Structurer les données, les analyser et suivre les actions engagées.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-xs text-white/40">
        <span>Afrique de l'Ouest &middot; Sénégal</span>
        <span className="font-mono">Prototype en évolution</span>
      </div>
    </div>
  )
}

/* ─── Step 0: Accueil immersif ─── */
function IntroView({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto my-auto"
    >
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-data font-bold">
        Qualification Préalable
      </span>
      <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-navy leading-tight text-balance">
        Essayez EcoScan pendant 14 jours.
      </h1>
      <p className="mt-5 text-slate leading-relaxed">
        Choisissez une formule, créez votre espace et vérifiez votre adresse e-mail : votre essai de 14 jours démarrera alors sur l’offre sélectionnée. Aucun paiement n’est demandé pour commencer.
      </p>

      <div className="mt-8 rounded-2xl border border-sky-border bg-sky-ui/40 p-5 space-y-3">
        {[
        "14 jours pour découvrir la formule choisie",
        "Votre offre reste liée à votre espace",
        "Aucun paiement au démarrage de l’essai",
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-navy">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-royal text-white text-[11px] font-bold">
              ✓
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-full bg-orange-cta px-8 py-4 text-sm font-bold text-white shadow-royal transition-all hover:bg-orange-deep hover:-translate-y-0.5"
        >
          Commençons
          <span>→</span>
        </button>
        <Link href="/" className="text-xs text-slate hover:text-navy hover:underline">
          Consulter le site public d'abord
        </Link>
      </div>
    </motion.div>
  )
}

/* ─── Step 1: Choix email et identité ─── */
function IdentityStepView({ data, onChange, errors }) {
  const [typeChosen, setTypeChosen] = useState(Boolean(data.emailType))

  const handleType = (t) => {
    onChange({ emailType: t })
    setTypeChosen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy">
          Quel email souhaitez-vous utiliser ?
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate">
          Sélectionnez l'usage principal de ce compte pour configurer les habilitations.
        </p>

        <div className="mt-4">
          <EmailTypeSelector
            value={data.emailType || ""}
            onChange={handleType}
            theme="light"
          />
        </div>
        {errors?.emailType && (
          <p className="mt-2 font-mono text-xs text-rust font-medium">{errors.emailType}</p>
        )}
      </div>

      <AnimatePresence>
        {typeChosen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 pt-4 border-t border-sky-border"
          >
            <div>
              <label htmlFor="email_connexion" className="block text-xs font-mono uppercase tracking-wider text-navy font-semibold">
                Votre adresse e-mail professionnelle
              </label>
              <input
                id="email_connexion"
                type="email"
                required
                autoComplete="email"
                value={data.email || ""}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder={
                  data.emailType === "entreprise"
                    ? "direction.generale@monentreprise.sn"
                    : data.emailType === "professionnel"
                      ? "prenom.nom@cabinet.sn"
                      : "contact@organisation.com"
                }
                className="mt-2 w-full rounded-xl border border-sky-border bg-white px-4 py-3.5 text-sm text-navy shadow-sm focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/20"
              />
              {errors?.email && (
                <p className="mt-2 font-mono text-xs text-rust font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="nom_admin" className="block text-xs font-mono uppercase tracking-wider text-navy font-semibold">
                Nom complet de l'administrateur
              </label>
              <input
                id="nom_admin"
                type="text"
                required
                autoComplete="name"
                value={data.nom || ""}
                onChange={(e) => onChange({ nom: e.target.value })}
                placeholder="ex. Fatou Sow ou Amadou Ba"
                className="mt-2 w-full rounded-xl border border-sky-border bg-white px-4 py-3.5 text-sm text-navy shadow-sm focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/20"
              />
              {errors?.nom && (
                <p className="mt-2 font-mono text-xs text-rust font-medium">{errors.nom}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Step 5: Synthèse récapitulative ─── */
function SummaryStepView({ data, selectedPlan }) {
  const profileNames = {
    pme: "PME & Site unique",
    entreprise: "Entreprise multi-sites",
    cabinet: "Cabinet de conseil",
    partenaire: "Partenaire / Institution",
  }
  const monthlyPrice = Number(selectedPlan?.prix_mensuel ?? selectedPlan?.price)
  const postTrialPrice = Number.isFinite(monthlyPrice)
    ? monthlyPrice === 0
      ? "Gratuit"
      : `${new Intl.NumberFormat("fr-FR").format(monthlyPrice)} ${selectedPlan?.devise || "XOF"} / mois`
    : "Sur devis"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy">
          Vérification avant la création de votre espace
        </h2>
        <p className="mt-1 text-sm text-slate">
          Après confirmation de votre adresse e-mail, l’essai de 14 jours démarrera sur cette formule.
        </p>
      </div>

      <div className="rounded-2xl border border-sky-border bg-white p-6 shadow-sm space-y-4">
        {[
          { label: "Formule choisie", val: selectedPlan?.nom || "—" },
          { label: "Tarif après l’essai", val: postTrialPrice },
          { label: "Administrateur", val: data.nom || "—" },
          { label: "Email de connexion", val: data.email || "—" },
          { label: "Organisation", val: data.organisation || "—" },
          { label: "Profil retenu", val: profileNames[data.profile] || "—" },
          { label: "Secteur", val: data.context?.sector || "—" },
          { label: "Localisation", val: data.context?.localisation || "—" },
          { label: "Établissements", val: data.context?.sites ? `${data.context.sites} site(s)` : "1 site" },
          { label: "Objectifs prioritaires", val: data.goals?.length ? `${data.goals.length} sélectionnés` : "—" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between border-b border-sky-border/50 pb-3 last:border-b-0 last:pb-0">
            <span className="font-mono text-xs text-slate uppercase">{item.label}</span>
            <span className="font-display text-sm font-semibold text-navy">{item.val}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-royal/20 bg-sky-ui/60 p-4 text-xs text-navy leading-relaxed">
        <span className="font-bold text-royal">Votre essai :</span> 14 jours d’accès à la formule choisie, sans paiement au démarrage. À la fin de l’essai, vous devrez souscrire pour continuer à utiliser EcoScan.
      </div>
    </div>
  )
}

/* ─── Main Onboarding Page ─── */
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [existingAccount, setExistingAccount] = useState(false)
  const [errors, setErrors] = useState({})
  const [planId, setPlanId] = useState("")
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [planLoading, setPlanLoading] = useState(true)
  const [planError, setPlanError] = useState("")

  const [data, setData] = useState({
    emailType: "",
    email: "",
    nom: "",
    profile: "",
    organisation: "",
    context: {
      sector: "",
      localisation: "",
      sites: "",
      availableSources: [],
      dataMaturity: "",
    },
    goals: [],
  })

  useEffect(() => {
    let cancelled = false
    const chosenPlanId = new URLSearchParams(window.location.search).get("plan")

    if (!chosenPlanId) {
      router.replace("/abonnement")
      return () => {
        cancelled = true
      }
    }

    setPlanId(chosenPlanId)
    fetch("/api/billing/plans", { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Les formules ne sont pas disponibles pour le moment.")
        const catalogue = await response.json()
        const plans = Array.isArray(catalogue) ? catalogue : catalogue?.results
        if (!Array.isArray(plans)) throw new Error("Le catalogue reçu est invalide.")
        const plan = plans.find((item) => String(item.id) === chosenPlanId && item.actif !== false)
        if (!plan) throw new Error("Cette formule n’est plus disponible. Choisissez une autre offre.")
        if (!cancelled) setSelectedPlan(plan)
      })
      .catch((error) => {
        if (!cancelled) setPlanError(error.message)
      })
      .finally(() => {
        if (!cancelled) setPlanLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [router])

  const patchData = useCallback((updates) => {
    setData((prev) => ({ ...prev, ...updates }))
    setErrors({})
  }, [])

  const patchContext = useCallback((updates) => {
    setData((prev) => ({ ...prev, context: { ...prev.context, ...updates } }))
    setErrors({})
  }, [])

  const nextStep = () => {
    setErrors({})
    setSubmitError("")
    setStep((s) => s + 1)
  }

  const prevStep = () => {
    setErrors({})
    setSubmitError("")
    setStep((s) => Math.max(0, s - 1))
  }

  const validateCurrent = () => {
    const errs = {}
    if (step === 1) {
      if (!data.emailType) errs.emailType = "Veuillez choisir un type d'email."
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errs.email = "Veuillez saisir une adresse e-mail valide."
      }
      if (!data.nom || data.nom.trim().length < 2) {
        errs.nom = "Veuillez renseigner votre nom complet."
      }
    } else if (step === 2) {
      if (!data.profile) errs.profile = "Veuillez sélectionner un profil d'organisation."
      if (!data.organisation || data.organisation.trim().length < 2) {
        errs.organisation = "Veuillez renseigner le nom de votre organisation."
      }
    } else if (step === 3) {
      if (!data.context.sector) errs.sector = "Veuillez sélectionner votre secteur d'activité."
      if (!data.context.localisation || data.context.localisation.trim().length < 2) {
        errs.localisation = "Veuillez indiquer la localisation de votre organisation."
      }
    } else if (step === 4) {
      if (!data.goals || data.goals.length === 0) {
        errs.goals = "Veuillez sélectionner au moins un objectif prioritaire."
      }
    }
    return errs
  }

  const handleNextClick = async () => {
    const errs = validateCurrent()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    if (step === 5) {
      await handleSubmit()
      return
    }

    nextStep()
  }

  const handleSubmit = async () => {
    setLoading(true)
    setSubmitError("")
    setExistingAccount(false)

    const payload = {
      nom_admin: data.nom.trim(),
      nom_organisation: data.organisation.trim(),
      email_connexion: data.email.trim().toLowerCase(),
      secteur: data.context.sector,
      localisation: data.context.localisation.trim(),
      details_demande: {
        profil: data.profile,
        nombre_sites: data.context.sites || "",
        sources: data.context.availableSources,
        maturite: data.context.dataMaturity,
        objectifs: data.goals,
        plan_id: planId,
      },
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const msg = String(body?.detail || body?.message || Object.values(body || {})
          .flat()
          .filter((value) => typeof value === "string")
          .join(" "))
        if (
          (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("existe")) &&
          (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("adresse") || msg.toLowerCase().includes("account"))
        ) {
          setExistingAccount(true)
          setSubmitError("Cette adresse e-mail est déjà associée à un compte EcoScan. Connectez-vous à cet espace pour choisir votre formule sans créer un nouveau compte.")
        } else {
          setSubmitError(msg || "Une erreur est survenue lors de l'enregistrement. Veuillez vérifier vos informations.")
        }
        return
      }

      setStep(6)
    } catch (error) {
      setSubmitError(error.message || "Impossible de contacter le serveur d'enregistrement. Vérifiez votre connexion.")
    } finally {
      setLoading(false)
    }
  }

  const isConfirmation = step === 6

  return (
    <div className="signup-page min-h-screen">
      <div className={`signup-page__layout min-h-screen ${isConfirmation ? "flex items-center justify-center p-6" : "grid grid-cols-1 lg:grid-cols-[480px_1fr]"}`}>
        {/* Panneau Marque Asymétrique */}
        {!isConfirmation && <BrandAtmosphere currentStep={step} />}

        {/* Panneau Formulaire Guidé */}
        <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 min-h-screen">
          {/* Header Mobile & Navigation */}
          {!isConfirmation && (
            <div className="space-y-4">
              <div className="space-y-4 lg:hidden">
                <div className="flex items-center justify-between">
                  <Link href="/" aria-label="EcoScan Accueil">
                    <LogoLockup variant="horizontal" theme="light" />
                  </Link>
                  <Link href="/connexion" className="text-xs font-mono text-royal">
                    Se connecter
                  </Link>
                </div>
                <div className="signup-mobile-photo">
                  <Image
                    src="/images/people/organization-leader.jpg"
                    alt="Un dirigeant souriant, engagé dans la compréhension de son organisation"
                    fill
                    sizes="(max-width: 700px) 100vw, 0px"
                    className="signup-mobile-photo__image"
                    priority
                  />
                  <div className="signup-mobile-photo__shade" aria-hidden="true" />
                  <p>Relier ce que l’on observe à ce que l’on décide.</p>
                </div>
              </div>

              {/* Barre de progression subtile */}
              {step > 0 && (
                <div className="bg-navy rounded-xl px-4 py-2 text-white shadow-sm">
                  <SophisticatedProgress currentStep={step} totalSteps={TOTAL_STEPS} />
                </div>
              )}
            </div>
          )}

          {/* Form Content Area */}
          <div className="signup-page__form-panel max-w-xl w-full mx-auto my-auto py-8">
            {isConfirmation ? (
              <ConfirmationScreen nom={data.nom} email={data.email} planName={selectedPlan?.nom} />
            ) : (
              <div>
                {planLoading && <p className="mb-5 text-sm text-slate" role="status">Vérification de la formule choisie…</p>}
                {planError && (
                  <div className="mb-5 rounded-xl border border-rust/30 bg-rust/5 p-4 text-sm text-rust" role="alert">
                    <p>{planError}</p>
                    <Link href="/abonnement" className="mt-2 inline-block font-semibold underline">Voir les formules disponibles</Link>
                  </div>
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {step === 0 && <IntroView onStart={nextStep} />}

                    {step === 1 && (
                      <IdentityStepView
                        data={{ emailType: data.emailType, email: data.email, nom: data.nom }}
                        onChange={patchData}
                        errors={errors}
                      />
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="font-display text-2xl font-bold text-navy">
                            Parlez-nous un peu de votre structure
                          </h2>
                          <p className="mt-1 text-sm text-slate">
                            Sélectionnez le format organisationnel qui correspond à votre exploitation.
                          </p>
                        </div>
                        <div>
                          <label htmlFor="organisation" className="block font-display text-base font-bold text-navy">
                            Nom de votre organisation
                          </label>
                          <input
                            id="organisation"
                            type="text"
                            required
                            maxLength={180}
                            value={data.organisation}
                            onChange={(event) => patchData({ organisation: event.target.value })}
                            aria-invalid={Boolean(errors.organisation)}
                            placeholder="Ex. Teranga Textiles"
                            className="mt-3 w-full rounded-xl border border-sky-border bg-white px-4 py-3.5 text-sm text-navy shadow-sm focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/20"
                          />
                          {errors.organisation && (
                            <p className="mt-2 font-mono text-xs text-rust font-medium" role="alert">{errors.organisation}</p>
                          )}
                        </div>
                        <ProfileStep
                          value={data.profile}
                          onChange={(p) => patchData({ profile: p })}
                          error={errors.profile}
                        />
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="font-display text-2xl font-bold text-navy">
                            Commençons par votre activité
                          </h2>
                          <p className="mt-1 text-sm text-slate">
                            Quelques informations pour mieux comprendre votre situation opérationnelle.
                          </p>
                        </div>
                        <ContextStep
                          data={{ ...data.context, profile: data.profile }}
                          onChange={patchContext}
                          errors={errors}
                        />
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="font-display text-2xl font-bold text-navy">
                            Qu'est-ce qui vous amène chez EcoScan ?
                          </h2>
                          <p className="mt-1 text-sm text-slate">
                            Vos priorités nous permettront de cibler les premiers tableaux de bord à générer.
                          </p>
                        </div>
                        <GoalsStep
                          value={data.goals}
                          onChange={(g) => patchData({ goals: g })}
                          error={errors.goals}
                        />
                      </div>
                    )}

                    {step === 5 && <SummaryStepView data={data} selectedPlan={selectedPlan} />}
                  </motion.div>
                </AnimatePresence>

                {submitError && (
                  <div className="mt-6 rounded-xl border border-rust/30 bg-rust/5 p-4 text-xs text-rust font-medium">
                    {submitError}
                    {existingAccount && (
                      <Link href="/connexion" className="mt-3 inline-block font-semibold text-navy underline underline-offset-4">
                        Me connecter à mon compte existant
                      </Link>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                {step > 0 && (
                  <div className="mt-10 pt-6 border-t border-sky-border flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="rounded-full border border-sky-border px-6 py-3 text-xs font-semibold text-navy transition-colors hover:bg-sky-ui"
                    >
                      ← Retour
                    </button>

                    <button
                      type="button"
                      onClick={handleNextClick}
                      disabled={loading || planLoading || !selectedPlan || Boolean(planError)}
                      className="inline-flex items-center gap-2 rounded-full bg-orange-cta px-8 py-3.5 text-xs font-bold text-white shadow-royal transition-all hover:bg-orange-deep disabled:opacity-50"
                    >
                      {loading ? (
                        "Transmission en cours..."
                      ) : step === 5 ? (
                        "Envoyer ma demande d'accès →"
                      ) : (
                        "Continuer →"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer note */}
          {!isConfirmation && (
            <div className="text-center text-xs text-slate/60 pt-6">
              Vos réponses servent à situer votre demande d’accès à EcoScan.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
