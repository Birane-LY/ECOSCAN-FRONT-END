'use client'

import React, { useState } from 'react'
import { Bell, Palette, ShieldCheck, User } from 'lucide-react'
import { PageHeader, ActionToast } from '@/components/ui'
import { ProfileSettings } from '@/modules/settings/components/ProfileSettings'
import { SecuritySettings } from '@/modules/settings/components/SecuritySettings'
import { NotificationSettings } from '@/modules/settings/components/NotificationSettings'
import { AppearanceSettings } from '@/modules/settings/components/AppearanceSettings'

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('profile')
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(''), 2500)
  }

  return (
    <div className="tab-surface settings-view">
      <PageHeader
        eyebrow="CONFIGURATION"
        title="Paramètres de l'espace de travail"
        subtitle="Gérez votre profil, vos préférences de sécurité et vos alertes personnalisées."
      />

      <div className="subnav-tabs">
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          <User size={15} />Profil
        </button>
        <button
          className={activeTab === 'security' ? 'active' : ''}
          onClick={() => setActiveTab('security')}
        >
          <ShieldCheck size={15} />Sécurité
        </button>
        <button
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={15} />Notifications
        </button>
        <button
          className={activeTab === 'appearance' ? 'active' : ''}
          onClick={() => setActiveTab('appearance')}
        >
          <Palette size={15} />Apparence
        </button>
      </div>

      <div className="settings-body">
        {activeTab === 'profile' && <ProfileSettings setSavedToast={showToast} />}
        {activeTab === 'security' && <SecuritySettings setSavedToast={showToast} />}
        {activeTab === 'notifications' && <NotificationSettings setSavedToast={showToast} />}
        {activeTab === 'appearance' && <AppearanceSettings setSavedToast={showToast} />}
      </div>

      {toastMessage && (
        <ActionToast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </div>
  )
}
