'use client'

import React, { useState } from 'react'
import {ArrowUpRight, ChevronRight, Eye, AlertCircle } from 'lucide-react'
import { APP_CONFIG } from '@/lib/config'

export function LoginScreen({ onLogin, onLoginDemo }) {
  const [email, setEmail] = useState('camille@nova-industries.fr')
  const [password, setPassword] = useState('ecoscan2024')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [forgot, setForgot] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (forgot) return

    setLoading(true)
    setErrorMessage(null)

    const result = await onLogin(email, password)
    setLoading(false)

    if (!result?.success) {
      setErrorMessage(result?.error || 'Échec de la connexion au serveur.')
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="brand-row">
          <img className="ecoscan-logo" src={APP_CONFIG?.logoUrl || '/logo.svg'} alt="EcoScan" />
          <span>{APP_CONFIG?.name || 'EcoScan'}</span>
        </div>
        <p className="eyebrow">PILOTAGE ÉNERGÉTIQUE</p>
        <h1>Décidez avec une longueur d’avance.</h1>
        <p>Un espace de travail calme pour transformer chaque donnée en action.</p>
      </section>

      <section className="auth-card">
        <p className="eyebrow">ESPACE SÉCURISÉ</p>
        <h2>{forgot ? 'Réinitialiser votre accès' : 'Bon retour parmi nous.'}</h2>
        <p className="auth-muted">
          {forgot
            ? 'Saisissez votre email pour recevoir un lien de récupération.'
            : 'Connectez-vous à votre espace Nova Industries.'}
        </p>

        {errorMessage && (
          <div className="auth-error-banner" style={{ color: 'red', marginBottom: '1rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {forgot ? (
          <>
            <label>
              Email professionnel
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button className="primary-button" onClick={() => setForgot(false)}>
              Envoyer le lien
            </button>
            <button className="quiet-button" onClick={() => setForgot(false)}>
              Retour à la connexion
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Email professionnel
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Mot de passe
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label="Afficher le mot de passe"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <Eye size={16} />
                </button>
              </div>
            </label>
            <label className="remember-row">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />{' '}
              Rester connecté{' '}
              <button type="button" onClick={() => setForgot(true)}>
                Mot de passe oublié ?
              </button>
            </label>
            
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'} <ArrowUpRight size={15} />
            </button>

            <div className="auth-divider">
              <span>OU ESSAYER UN PROFIL DÉMO</span>
            </div>

            <div className="demo-accounts">
              <button type="button" onClick={() => onLoginDemo ? onLoginDemo('ops') : onLogin('ops')}>
                <b>OD</b>
                <span>
                  Opérations<small>Accès quotidien</small>
                </span>
                <ChevronRight size={14} />
              </button>
              <button type="button" onClick={() => onLoginDemo ? onLoginDemo('viewer') : onLogin('viewer')}>
                <b>FN</b>
                <span>
                  Lecture seule<small>Consultation</small>
                </span>
                <ChevronRight size={14} />
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  )
}