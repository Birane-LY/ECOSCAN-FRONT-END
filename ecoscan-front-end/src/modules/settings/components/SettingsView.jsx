'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bell, Palette, ShieldCheck, User } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import {ActionToast} from '@/components/ui/ActionToast'
import { ProfileSettings } from '@/modules/settings/components/ProfileSettings'
import { SecuritySettings } from '@/modules/settings/components/SecuritySettings'
import { NotificationSettings } from '@/modules/settings/components/NotificationSettings'
import { AppearanceSettings } from '@/modules/settings/components/AppearanceSettings'

const TABS = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'security', label: 'Sécurité', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Apparence', icon: Palette },
]

export function SettingsView({ preferences, updatePreferences }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [toastMessage, setToastMessage] = useState('')
  const timer = useRef(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const showToast = (msg) => {
    setToastMessage(msg)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToastMessage(''), 2500)
  }

  return (
    <div className="st">
      <PageHeader
        title="Paramètres"
        subtitle="Gérez votre profil, votre sécurité, vos alertes et l’apparence de votre espace."
      />

      <div className="subnav-tabs" role="tablist" aria-label="Sections des paramètres">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={activeTab === id ? 'active' : ''}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="st-body">
        {activeTab === 'profile' && <ProfileSettings setSavedToast={showToast} />}
        {activeTab === 'security' && <SecuritySettings preferences={preferences} updatePreferences={updatePreferences} setSavedToast={showToast} />}
        {activeTab === 'notifications' && <NotificationSettings preferences={preferences} updatePreferences={updatePreferences} setSavedToast={showToast} />}
        {activeTab === 'appearance' && <AppearanceSettings preferences={preferences} updatePreferences={updatePreferences} setSavedToast={showToast} />}
      </div>

      {toastMessage && <ActionToast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  )
}
