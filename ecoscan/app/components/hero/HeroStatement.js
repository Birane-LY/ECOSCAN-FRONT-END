import Image from "next/image"
import Link from "next/link"

export default function HeroStatement() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <Image
        src="/images/people/energy-manager.jpg"
        alt="Une professionnelle souriante, au cœur de la démarche EcoScan"
        fill
        priority
        sizes="100vw"
        className="home-hero__image"
      />
      <div className="home-hero__shade" aria-hidden="true" />

      <div className="home-hero__content">
        <p className="home-hero__eyebrow">
          Diagnostic de la performance énergétique
        </p>
        <h1 id="home-hero-title">
          Mieux comprendre l’énergie pour mieux décider.
        </h1>
        <p className="home-hero__description">
          EcoScan aide les organisations à structurer leurs informations
          énergétiques, à en faire émerger des points d’attention et à suivre
          les actions engagées.
        </p>
        <div className="home-hero__actions">
          <Link href="/solution" className="home-hero__primary">
            Découvrir la démarche
            <span aria-hidden="true">↗</span>
          </Link>
          <a href="#pour-qui" className="home-hero__secondary">
            À qui s’adresse EcoScan ?
          </a>
        </div>
      </div>

    </section>
  )
}
