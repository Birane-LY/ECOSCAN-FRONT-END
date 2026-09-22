import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SettingToggle } from '@/components/ui/SettingToggle'

export function SecurityAdmin({ twoFactor, setTwoFactor, setDrawer }) {
  return (
    <>
      <div className="ad-head">
        <h2>Un espace de travail digne de confiance.</h2>
        <span className="chip chip-ok">Sécurité renforcée</span>
      </div>

      <div className="ad-list">
        <div className="ad-row">
          <div>
            <strong>Authentification à deux facteurs</strong>
            <small>Recommandée pour tous les administrateurs</small>
          </div>
          <SettingToggle label="" checked={twoFactor} setChecked={setTwoFactor} />
        </div>
        <div className="ad-row">
          <div>
            <strong>Sessions actives</strong>
            <small>MacBook Pro, Dakar, session actuelle</small>
          </div>
          <button className="quiet-button" onClick={() => setDrawer('sessions')}>
            Gérer les sessions <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="ad-row">
          <div>
            <strong>Mot de passe</strong>
            <small>Dernière modification il y a 42 jours</small>
          </div>
          <button className="secondary-button" onClick={() => setDrawer('password')}>
            Changer
          </button>
        </div>
      </div>
    </>
  )
}
