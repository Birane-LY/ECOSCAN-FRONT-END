"use client"

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { LoginScreen } from '@/modules/auth/components/LoginScreen'
import { OverviewView } from '@/modules/overview/components/OverviewView'
import { useOverviewData } from '@/modules/overview/hooks/useOverviewData'
import { CaptureModal } from '@/components/layout/CaptureModal'
import { AnalysesView } from '@/modules/analyses/components/AnalysesView'
import { DataCenterView } from '@/modules/data-center/components/DataCenterView'
import { GoalsView } from '@/modules/goals/components/GoalsView'
import { AssistantView } from '@/modules/assistant/components/AssistantView'
import { useAssistant } from '@/modules/assistant/hooks/useAssistant'
import { useDataSources } from '@/modules/data-center/hooks/useDataSource'
import { useFileSources } from '@/modules/data-center/hooks/useFileSources'
import { UploadModal } from '@/modules/data-center/components/UploadModal'
import { BusinessToolsView } from '@/modules/business-tools/components/BusinessToolsView'
import { SettingsView } from '@/modules/settings/components/SettingsView'
import { useCommandPaletteShortcut } from '@/hooks/useCommandPaletteShortcut'
import { usePreferences } from '@/modules/settings/hooks/usePreferences'
import { OnboardingWizard } from '@/modules/onboarding/components/OnboardingWizard'
import {
  AppShell,
  Sidebar,
  Topbar,
  BottomNav,
  CommandPalette,
  NotificationsPopover,
  HelpModal,
  DetailDrawer,
} from '@/components/layout'
import { ActionToast } from '@/components/ui'

const VIEW_TITLES = {
  overview: 'Vue d’ensemble',
  analyses: 'Analyses',
  data: 'Données',
  goals: 'Objectifs',
  assistant: 'Assistant IA',
  features: 'Outils métier',
  settings: 'Paramètres',
}

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Nouvelle opportunité détectée',
    body: 'Le cycle froid de la Zone B peut être décalé.',
    unread: true,
  },
  {
    id: 2,
    title: 'Import terminé',
    body: 'consommation_novembre.csv est prêt à analyser.',
    unread: true,
  },
  {
    id: 3,
    title: 'Objectif mensuel atteint à 72%',
    body: 'Vous êtes en avance sur votre trajectoire.',
    unread: false,
  },
]

export default function MainPage() {
  const router = useRouter()
  const {
    authenticated, activeRole, currentProfile, isSuperAdmin,
    organisations, activeOrganisation, orgLoading, orgError,
    login, logout, switchOrganisation, switchRole, can,
  } = useAuth()

  const assistant = useAssistant()
  const { preferences, updatePreferences } = usePreferences()

  // --- Navigation & Layout ---
  const [view, setView] = useState('overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [drawer, setDrawer] = useState(null)

  // --- Thème (Synchronisation réactive) ---
  const [darkMode, setDarkMode] = useState(false)

  // Mettre à jour l'état local du thème à chaque fois que la préférence serveur/hook évolue
  useEffect(() => {
    if (preferences?.theme) {
      setDarkMode(preferences.theme === 'SOMBRE')
    }
  }, [preferences?.theme])

  // Bascule du thème compatible Topbar & API
  const handleToggleDarkMode = (newVal) => {
    const isDark = typeof newVal === 'function' ? newVal(darkMode) : newVal
    setDarkMode(isDark)
    if (updatePreferences) {
      updatePreferences({ theme: isDark ? 'SOMBRE' : 'CLAIR' })
    }
  }

  const go = useCallback((nextView) => {
    setView(nextView)
    setMobileNav(false)
  }, [])

  // --- Import de données ---
  const dataSource = useDataSources()
  const fileSources = useFileSources()
  const openUpload = dataSource.openUpload

  // --- Données de la vue d'ensemble ---
  const { loading: overviewLoading, error: overviewError, historique, objectifs } = useOverviewData()
  const [period, setPeriod] = useState('mois')
  const [point, setPoint] = useState(null)
  const [completed, setCompleted] = useState([])

  // --- Palette de commandes ---
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')
  useCommandPaletteShortcut(setPaletteOpen)

  // --- Notifications ---
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  )

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }
  const markOneRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    )
  }

  // --- Modales d'aide & Capture ---
  const [helpOpen, setHelpOpen] = useState(false)
  const [captureOpen, setCaptureOpen] = useState(false)

  // --- Toasts d'action ---
  const [actionToast, setActionToast] = useState(null)
  const announceAction = useCallback((message) => {
    setActionToast(message)
    window.clearTimeout(announceAction._t)
    announceAction._t = window.setTimeout(() => setActionToast(null), 3000)
  }, [])

  const handleCaptureConfirm = ({ kind, file }) => {
    announceAction(`${kind === 'invoice' ? 'Facture' : 'Consommation'} capturée : ${file.name}`)
  }

  // --- Assistant IA depuis la vue d'ensemble ---
  const handleAskWithNav = (question) => {
    if (question && assistant.sendMessage) {
      assistant.sendMessage(question)
    }
    go('assistant')
  }

  // Redirection SuperAdmin
  useEffect(() => {
    if (authenticated && isSuperAdmin) router.replace('/admin')
  }, [authenticated, isSuperAdmin, router])

  if (!authenticated) return <LoginScreen onLogin={login} />
  if (isSuperAdmin) return null

  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }



if (orgError || !activeOrganisation) {
  if (activeRole === 'ADMIN_ORGANISATION') {
    return <OnboardingWizard onComplete={() => window.location.reload()} />
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-lg font-bold mb-2">Aucune organisation associée</h1>
        <p className="text-sm text-slate-500 mb-4">
          Votre compte n'est pas encore rattaché à une organisation. Contactez l'administrateur qui vous a invité.
        </p>
        <button className="text-xs text-rose-600 underline" onClick={logout}>Se déconnecter</button>
      </div>
    </div>
  )
}

  // Rendu modulaire de la vue courante
  const renderView = () => {
    switch (view) {
      case 'overview':
        return (
          <OverviewView
            user={currentProfile}
            currentDate={new Date().toLocaleDateString('fr-FR', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            }).toUpperCase()}
            briefingData={{ historique, loading: overviewLoading, error: overviewError }}
            insightData={{ historique, objectifs, loading: overviewLoading }}
            decisionsData={objectifs}
            assistantData={{}}
            period={period} setPeriod={setPeriod}
            point={point} setPoint={setPoint}
            completed={completed} setCompleted={setCompleted}
            openUpload={openUpload} ask={handleAskWithNav} setDrawer={setDrawer}
          />
        )
      case 'analyses':
        return <AnalysesView setDrawer={setDrawer} />
      case 'data':
        return (
          <DataCenterView
            files={fileSources.files}
            filesLoading={fileSources.loading}
            filesError={fileSources.error}
            openUpload={openUpload}
            setDrawer={setDrawer}
          />
        )
      case 'goals':
        return <GoalsView />
      case 'assistant':
        return <AssistantView {...assistant} />
      case 'features':
        return <BusinessToolsView role={activeRole} setDrawer={setDrawer} />
      case 'settings':
        return <SettingsView preferences={preferences} updatePreferences={updatePreferences} />
      default:
        return null
    }
  }

  return (
    <AppShell darkMode={darkMode} onAction={announceAction}>
      <Sidebar
        mobileNav={mobileNav} setMobileNav={setMobileNav} view={view} go={go}
        openUpload={openUpload} activeRole={activeRole} currentProfile={currentProfile}
        organisations={organisations} activeOrganisation={activeOrganisation}
        onSwitchOrganisation={switchOrganisation} onLogout={logout} setDrawer={setDrawer}
      />

      <section className="main-column">
        <Topbar
          viewTitle={VIEW_TITLES[view] || 'Espace de travail'}
          setMobileNav={setMobileNav}
          setPaletteOpen={setPaletteOpen}
          darkMode={darkMode}
          setDarkMode={handleToggleDarkMode}
          unreadCount={unreadCount}
          setNotificationsOpen={setNotificationsOpen}
          setHelpOpen={setHelpOpen}
        />

        <div className="content-wrap">
          {renderView()}
        </div>

        <BottomNav view={view} go={go} onCapture={() => setCaptureOpen(true)} />
      </section>

      {/* Popovers & Modales */}
      <NotificationsPopover
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        markAllRead={markAllRead}
        markOneRead={markOneRead}
      />

      <CommandPalette
        open={paletteOpen}
        close={() => setPaletteOpen(false)}
        paletteQuery={paletteQuery}
        setPaletteQuery={setPaletteQuery}
        go={go}
      />

      <HelpModal
        open={helpOpen}
        close={() => setHelpOpen(false)}
        goAssistant={() => go('assistant')}
      />

      <DetailDrawer
        type={drawer}
        close={() => setDrawer(null)}
        complete={() => {
          setCompleted((c) => (c.includes(0) ? c : [...c, 0]))
          setDrawer(null)
        }}
      />

      {actionToast && (
        <ActionToast
          message={actionToast}
          onClose={() => setActionToast(null)}
        />
      )}

      <CaptureModal
        open={captureOpen}
        onClose={() => setCaptureOpen(false)}
        onConfirm={handleCaptureConfirm}
      />

      {dataSource.uploadOpen && (
        <UploadModal
          stage={dataSource.uploadStage}
          result={dataSource.result}
          fileRef={dataSource.fileRef}
          onProcess={dataSource.processUpload}
          onFinish={() => dataSource.finishUpload(() => fileSources.reload())}
          onClose={dataSource.closeUpload}
        />
      )}
    </AppShell>
  )
}