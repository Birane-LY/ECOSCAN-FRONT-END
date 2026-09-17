import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SettingToggle } from '@/components/ui'

export function SecurityAdmin({ twoFactor, setTwoFactor, setDrawer }) {
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">ACCÈS & SÉCURITÉ</p>
          <h2>Un espace de travail digne de confiance.</h2>
        </div>
        <span className="status-chip ready">Sécurité renforcée</span>
      </div>

      <div className="security-list">
        <div>
          <span>
            <strong>Authentification à deux facteurs</strong>
            <small>Recommandée pour tous les administrateurs</small>
          </span>
          <SettingToggle
            label=""
            checked={twoFactor}
            setChecked={setTwoFactor}
          />
        </div>
        <div>
          <span>
            <strong>Sessions actives</strong>
            <small>MacBook Pro · Dakar · Session actuelle</small>
          </span>
          <button className="quiet-button" onClick={() => setDrawer('sessions')}>
            Gérer les sessions <ArrowUpRight size={14} />
          </button>
        </div>
        <div>
          <span>
            <strong>Mot de passe</strong>
            <small>Dernière modification il y a 42 jours</small>
          </span>
          <button className="secondary-button" onClick={() => setDrawer('password')}>
            Changer
          </button>
        </div>
      </div>
    </>
  )
}
