'use client'

import React, { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { SettingToggle } from '@/components/ui/SettingToggle'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useSecurityConfig } from '@/modules/settings/hooks/useSecurityConfig'
import { PasswordChangeModal } from '@/modules/settings/components/PasswordChangeModal'

export function SecuritySettings({ preferences, updatePreferences, setSavedToast }) {
  const { activeRole } = useAuth()
  const { config, loading: configLoading, error: configError, updateConfig } = useSecurityConfig()
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const canEditOrgPolicy = activeRole === 'ADMIN_ORGANISATION'

  const handleTimeoutChange = async (val) => {
    try {
      await updatePreferences({ delai_inactivite_minutes: Number(val) })
      setSavedToast?.('Délai de session mis à jour')
    } catch (err) {
      setSavedToast?.(`Erreur : ${err.message}`)
    }
  }

  const handleToggle2FA = async () => {
    if (!canEditOrgPolicy) return
    try {
      await updateConfig({ deux_facteurs_obligatoire: !config.deux_facteurs_obligatoire })
      setSavedToast?.(config.deux_facteurs_obligatoire ? '2FA désactivée pour l’organisation' : '2FA activée pour l’organisation')
    } catch (err) {
      setSavedToast?.(`Erreur : ${err.message}`)
    }
  }

  if (!preferences || configLoading) return <p className="drawer-lead">Chargement…</p>
  if (configError || !config) return <p className="drawer-lead">Erreur : {configError || 'Configuration indisponible.'}</p>

  return (
    <GlassCard as="section" className="st-card">
      <header className="st-head">
        <h2>Sécurité du compte</h2>
        <p>L’authentification et le contrôle des sessions.</p>
      </header>

      <div className="st-rows">
        <div className="st-row">
          <div>
            <strong>Authentification à deux facteurs obligatoire</strong>
            <span>
              {canEditOrgPolicy
                ? 'Applique le 2FA à tous les membres de votre organisation.'
                : 'Politique définie par l’administrateur de votre organisation.'}
            </span>
          </div>
          <SettingToggle
            label=""
            checked={!!config.deux_facteurs_obligatoire}
            setChecked={handleToggle2FA}
            disabled={!canEditOrgPolicy}
          />
        </div>

        <div className="st-row">
          <div>
            <strong>Délai d’inactivité avant déconnexion</strong>
            <span>Durée après laquelle votre session est reverrouillée automatiquement.</span>
          </div>
          <select
            className="st-select"
            value={preferences.delai_inactivite_minutes}
            onChange={(e) => handleTimeoutChange(e.target.value)}
            aria-label="Délai d’inactivité"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 heure</option>
            <option value="120">2 heures</option>
          </select>
        </div>

        <div className="st-row">
          <div>
            <strong>Mot de passe</strong>
            <span>Modifiez votre mot de passe de connexion.</span>
          </div>
          <button className="secondary-button" type="button" onClick={() => setPasswordModalOpen(true)}>
            <KeyRound size={16} />
            Modifier
          </button>
        </div>
      </div>

      {passwordModalOpen && (
        <PasswordChangeModal
          onClose={() => setPasswordModalOpen(false)}
          onSuccess={() => setSavedToast?.('Mot de passe modifié avec succès')}
        />
      )}
    </GlassCard>
  )
}
