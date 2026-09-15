'use client'

import React from 'react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { LoginScreen } from '@/modules/auth/components/LoginScreen'
import { ProfileSwitchDrawer } from '@/modules/auth/components/ProfileSwitchDrawer'

export default function MainPage() {
  const { authenticated, activeRole, currentProfile, login, loginDemo, logout, switchRole } = useAuth()
  const [showProfileDrawer, setShowProfileDrawer] = React.useState(false)

  // 1. Si l'utilisateur n'est pas authentifié, on affiche uniquement l'écran de connexion
  if (!authenticated) {
    return <LoginScreen onLogin={login} onLoginDemo={loginDemo} />
  }

  // 2. Vue temporaire une fois connecté (en attendant le reste des modules)
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Bienvenue, {currentProfile?.name || 'Utilisateur'}</h1>
          <p>Email : {currentProfile?.email}</p>
          <p>Rôle actif : <strong>{currentProfile?.label || activeRole}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setShowProfileDrawer(true)}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Changer de profil
          </button>
          <button 
            onClick={logout}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Se déconnecter
          </button>
        </div>
      </header>

      <section style={{ padding: '1.5rem', border: '1px dashed #ccc', borderRadius: '8px', background: '#f9f9f9' }}>
        <h2>Authentification réussie 🎉</h2>
        <p>Le token JWT et la session utilisateur sont opérationnels.</p>
      </section>

      {showProfileDrawer && (
        <ProfileSwitchDrawer
          activeRole={activeRole}
          onSelectRole={(role) => {
            switchRole(role)
            setShowProfileDrawer(false)
          }}
          onClose={() => setShowProfileDrawer(false)}
        />
      )}
    </main>
  )
}