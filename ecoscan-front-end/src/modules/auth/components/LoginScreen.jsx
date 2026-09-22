'use client'

import React, { useState } from 'react'
import { AlertCircle, ArrowUpRight, Eye, EyeOff } from 'lucide-react'
import { DotGlobe } from '@/components/instruments'
import { APP_CONFIG } from '@/lib/config'

// Pré-remplissage facultatif pour la démonstration : définissez NEXT_PUBLIC_DEMO_EMAIL / NEXT_PUBLIC_DEMO_PASSWORD
// dans .env.local. En production, laissez-les vides.
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? ''
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? ''

export function LoginScreen({ onLogin, onLoginDemo }) {
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [showPassword, setShowPassword] = useState(false)
  const [forgot, setForgot] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    const result = await onLogin(email, password)
    setLoading(false)
    if (!result?.success) setErrorMessage(result?.error || 'Échec de la connexion au serveur.')
  }

  return (
    <main className="eco-shell lg" data-theme="night">
      <div className="eco-backdrop" aria-hidden="true" />
      <div className="lg-globe">
        <DotGlobe />
      </div>

      <section className="lg-panel">
        <div className="lg-brand">
          {APP_CONFIG?.logoUrl && <img src={APP_CONFIG.logoUrl} alt="" />}
          <span>{APP_CONFIG?.name || 'EcoScan'}</span>
        </div>

        <div className="lg-spacer" aria-hidden="true" />

        <div className="lg-copy">
          <h1>Décidez avec une longueur d’avance.</h1>
          <p>Un espace de travail calme pour transformer chaque donnée en action.</p>
        </div>

        <div className="lg-card glass">
          <h2>{forgot ? 'Accès oublié' : 'Bon retour parmi nous.'}</h2>
          <p className="lg-sub">
            {forgot
              ? 'La réinitialisation en libre-service n’est pas encore disponible. Contactez l’administrateur de votre organisation pour recevoir un nouvel accès.'
              : 'Connectez-vous à votre espace de pilotage énergétique.'}
          </p>

          {errorMessage && (
            <div className="lg-error" role="alert">
              <AlertCircle size={17} />
              <span>{errorMessage}</span>
            </div>
          )}

          {forgot ? (
            <button type="button" className="secondary-button lg-full" onClick={() => setForgot(false)}>
              Retour à la connexion
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="lg-form">
              <label className="fld">
                Email professionnel
                <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label className="fld">
                Mot de passe
                <span className="fld-unit">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="lg-eye"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>

              <button type="submit" className="primary-button lg-full" disabled={loading}>
                {loading ? 'Connexion en cours…' : 'Se connecter'} <ArrowUpRight size={16} />
              </button>
              <button type="button" className="quiet-button lg-forgot" onClick={() => setForgot(true)}>
                Mot de passe oublié ?
              </button>

              {onLoginDemo && (
                <div className="lg-demo">
                  <span>Ou essayer un profil de démonstration</span>
                  <div>
                    <button type="button" className="secondary-button" onClick={() => onLoginDemo('ops')}>
                      Opérations
                    </button>
                    <button type="button" className="secondary-button" onClick={() => onLoginDemo('viewer')}>
                      Lecture seule
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
