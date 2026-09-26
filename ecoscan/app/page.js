import { redirect } from "next/navigation"
import Header from "@/app/components/navigation/Header"
import HeroVideoTeaser from "@/app/components/hero/HeroVideoTeaser"
import HeroStatement from "@/app/components/hero/HeroStatement"
import { AudienceSection } from "@/app/components/audiences/AudienceSection"
import { MethodeSection } from "@/app/components/method/MethodeSection"
import { FinancialTranslationSection } from "@/app/components/finance/FinancialTranslationSection"
import { ProofSection } from "@/app/components/proof/ProofSection"
import { CtaFinalSection } from "@/app/components/cta/CtaFinalSection"
import { Footer } from "@/app/components/footer/Footer"

/**
 * Home — the EcoScan public homepage.
 *
 * Structure (two acts)
 *   Act 1 — teaser: HeroVideoTeaser (full-screen video intro).
 *   Act 2 — understanding: HeroStatement → AudienceSection → MethodeSection
 *           → FinancialTranslationSection → ProofSection → CtaFinalSection
 *           → Footer.
 *   Header is fixed beneath the video intro.
 */
export default async function Home({ searchParams }) {
  const params = await searchParams
  const uid = params?.uid
  const token = params?.token

  if (uid && token) {
    const backofficeUrl = (
      process.env.NEXT_PUBLIC_BACKOFFICE_URL || "http://localhost:3001"
    ).replace(/\/$/, "")
    redirect(`${backofficeUrl}/?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`)
  }

  return (
    <>
      <Header revealAfter={-1} />
      <main>
        <HeroVideoTeaser />
        <HeroStatement />
        <AudienceSection />
        <MethodeSection />
        <FinancialTranslationSection />
        <ProofSection />
        <CtaFinalSection />
      </main>
      <Footer />
    </>
  )
}
