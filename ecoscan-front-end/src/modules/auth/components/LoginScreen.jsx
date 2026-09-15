import React, { useState } from 'react'
import { ArrowUpRight, ChevronRight, Eye } from 'lucide-react'
import { APP_CONFIG } from '@/lib/config'

export function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('camille@nova-industries.fr')
  const [password, setPassword] = useState('ecoscan2024')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [forgot, setForgot] = useState(false)

  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="brand-row">
          <img className="ecoscan-logo" src={APP_CONFIG.logoUrl} alt="EcoScan" />
          <span>{APP_CONFIG.name}</span>
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
          <>
            <label>
              Email professionnel
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Mot de passe
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
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
            <button className="primary-button" onClick={() => onLogin('admin')}>
              Se connecter <ArrowUpRight size={15} />
            </button>

            <div className="auth-divider">
              <span>OU ESSAYER UN PROFIL DÉMO</span>
            </div>

            <div className="demo-accounts">
              <button onClick={() => onLogin('ops')}>
                <b>OD</b>
                <span>
                  Opérations<small>Accès quotidien</small>
                </span>
                <ChevronRight size={14} />
              </button>
              <button onClick={() => onLogin('viewer')}>
                <b>FN</b>
                <span>
                  Lecture seule<small>Consultation</small>
                </span>
                <ChevronRight size={14} />
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
