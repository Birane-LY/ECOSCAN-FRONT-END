"use client"

import React, { useEffect, useMemo, useState } from 'react'
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

import {
  AppShell,
  Sidebar,
  Topbar,
  BottomNav,
  CommandPalette,
  NotificationsPopover,
  HelpModal,
  DetailDrawer,
} from '@/components/layout' // Ajustez le chemin selon votre structure d'export index.js

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

  // --- Navigation / layout ---
  const [view, setView] = useState('overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [drawer, setDrawer] = useState(null) // null | 'profile-switch' | ...autres types de DetailDrawer

  const go = (nextView) => {
    setView(nextView)
    setMobileNav(false)
  }

  // --- Import de données (flux réel) ---
  const dataSource = useDataSources()
  const fileSources = useFileSources()

  const handleFinishUpload = () => {
    dataSource.finishUpload(() => fileSources.reload())
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) dataSource.processUpload(file)
  }

  // openUpload devient LE point d'entrée unique, partagé partout (sidebar, overview, data center)
  const openUpload = dataSource.openUpload

  // --- Données réelles de la vue d'ensemble ---
  const { loading: overviewLoading, error: overviewError, historique, objectifs } = useOverviewData()
  const [period, setPeriod] = useState('mois')
  const [point, setPoint] = useState(null)
  const [completed, setCompleted] = useState([])

  // --- Palette de commandes ---
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')

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

  // --- Aide ---
  const [helpOpen, setHelpOpen] = useState(false)

  // --- Capture mobile (caméra) ---
  const [captureOpen, setCaptureOpen] = useState(false)
  const handleCaptureConfirm = ({ kind, file }) => {
    announceAction(`${kind === 'invoice' ? 'Facture' : 'Consommation'} capturée : ${file.name}`)
  }

  // --- Toast d'action ---
  const [actionToast, setActionToast] = useState(null)
  const announceAction = (message) => {
    setActionToast(message)
    // auto-dismiss après quelques secondes
    window.clearTimeout(announceAction._t)
    announceAction._t = window.setTimeout(() => setActionToast(null), 3000)
  }

  // --- Assistant IA depuis la vue d'ensemble ---
  const handleAskWithNav = (question) => {
    go('assistant')
    // TODO: transmettre `question` à la vue Assistant (contexte partagé, store, etc.)
  }

  useEffect(() => {
    if (authenticated && isSuperAdmin) router.replace('/admin')
  }, [authenticated, isSuperAdmin, router])

  if (!authenticated) return <LoginScreen onLogin={login} />
  if (isSuperAdmin) return null // redirection vers /admin en cours

  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (orgError || !activeOrganisation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-lg font-bold mb-2">Aucune organisation associée</h1>
          <p className="text-sm text-slate-500 mb-4">
            {orgError || "Votre compte n'est rattaché à aucune organisation pour le moment."}
          </p>
          <button className="text-xs text-rose-600 underline" onClick={logout}>Se déconnecter</button>
        </div>
      </div>
    )
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
          setDarkMode={setDarkMode}
          unreadCount={unreadCount}
          setNotificationsOpen={setNotificationsOpen}
          setHelpOpen={setHelpOpen}
        />

        <div className="content-wrap">
          {view === 'overview' && (
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
          )}

          {view === 'analyses' && (
            <AnalysesView setDrawer={setDrawer} />
          )}

          {view === 'data' && (
            <DataCenterView
              files={fileSources.files}
              filesLoading={fileSources.loading}
              filesError={fileSources.error}
              openUpload={openUpload}
              setDrawer={setDrawer}
            />
          )}

          {view === 'goals' && <GoalsView />}

          {view === 'assistant' && <AssistantView {...assistant} />}
        </div>

        <BottomNav view={view} go={go} onCapture={() => setCaptureOpen(true)} />
      </section>

      {/* Popovers & Modales */}
      <NotificationsPopover
        open={notificationsOpen}
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

      {/* Drawer générique (hors upload, désormais géré par UploadModal) */}
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