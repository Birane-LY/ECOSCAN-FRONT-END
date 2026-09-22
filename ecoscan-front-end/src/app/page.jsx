"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { LoginScreen } from "@/modules/auth/components/LoginScreen";
import { OverviewView } from "@/modules/overview/components/OverviewView";
import { useOverviewData } from "@/modules/overview/hooks/useOverviewData";
import { CaptureModal } from "@/components/layout/CaptureModal";
import { AnalysesView } from "@/modules/analyses/components/AnalysesView";
import { DataCenterView } from "@/modules/data-center/components/DataCenterView";
import { GoalsView } from "@/modules/goals/components/GoalsView";
import { AssistantView } from "@/modules/assistant/components/AssistantView";
import { useAssistant } from "@/modules/assistant/hooks/useAssistant";
import { useDataSources } from "@/modules/data-center/hooks/useDataSource";
import { useFileSources } from "@/modules/data-center/hooks/useFileSources";
import { UploadModal } from "@/modules/data-center/components/UploadModal";
import { BusinessToolsView } from "@/modules/business-tools/components/BusinessToolsView";
import { SettingsView } from "@/modules/settings/components/SettingsView";
import { useCommandPaletteShortcut } from "@/hooks/useCommandPaletteShortcut";
import { usePreferences } from "@/modules/settings/hooks/usePreferences";
import { OnboardingWizard } from "@/modules/onboarding/components/OnboardingWizard";
import { MemoryView } from "@/modules/memory/components/MemoryView";

import {
  AppShell,
  TopNav,
  BottomNav,
  CommandPalette,
  NotificationsPopover,
  HelpModal,
  DetailDrawer,
} from "@/components/layout";
import { ActionToast } from "@/components/ui/ActionToast";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Nouvelle opportunité détectée",
    body: "Le cycle froid de la Zone B peut être décalé.",
    unread: true,
  },
  {
    id: 2,
    title: "Import terminé",
    body: "consommation_novembre.csv est prêt à analyser.",
    unread: true,
  },
  {
    id: 3,
    title: "Objectif mensuel atteint à 72 %",
    body: "Vous êtes en avance sur votre trajectoire.",
    unread: false,
  },
];

export default function MainPage() {
  const router = useRouter();
  const {
    authenticated,
    activeRole,
    currentProfile,
    isSuperAdmin,
    organisations,
    activeOrganisation,
    orgLoading,
    orgError,
    login,
    logout,
    switchOrganisation,
  } = useAuth();

  const assistant = useAssistant();
  const { preferences, updatePreferences } = usePreferences();

  // --- Navigation & mise en page ---
  const [view, setView] = useState("overview");
  const [drawer, setDrawer] = useState(null);

  // --- Thème (Lumière / Nuit), synchronisé avec les préférences ---
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (preferences?.theme) {
      setDarkMode(preferences.theme === "SOMBRE");
    }
  }, [preferences?.theme]);

  const handleToggleDarkMode = (newVal) => {
    const isDark = typeof newVal === "function" ? newVal(darkMode) : newVal;
    setDarkMode(isDark);
    if (updatePreferences) {
      updatePreferences({ theme: isDark ? "SOMBRE" : "CLAIR" }).catch(() => {});
    }
  };

  const go = useCallback((nextView) => {
    setView(nextView);
    window.scrollTo({ top: 0 });
  }, []);

  // --- Import de données ---
  const dataSource = useDataSources();
  const fileSources = useFileSources();
  const openUpload = dataSource.openUpload;

  // --- Données de la vue d'ensemble ---
  const [period, setPeriod] = useState("7d");
  const [point, setPoint] = useState(null);
  const [completed, setCompleted] = useState([]);
  const {
    loading: overviewLoading,
    error: overviewError,
    chartSeries,
    heroData,
    briefingData,
    insightData,
    decisionsData,
  } = useOverviewData(period);

  // --- Palette de commandes ---
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  useCommandPaletteShortcut(setPaletteOpen);

  // --- Notifications ---
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markOneRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  // --- Modales d'aide & capture ---
  const [helpOpen, setHelpOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);

  // --- Toasts d'action ---
  const [actionToast, setActionToast] = useState(null);
  const toastTimer = useRef(null);
  const announceAction = useCallback((message) => {
    setActionToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setActionToast(null), 3000);
  }, []);

  const [pendingCapture, setPendingCapture] = useState(null);

  const handleCaptureConfirm = ({ champs }) => {
    setPendingCapture(champs);
    go("features");
    announceAction("Champs détectés : vérifiez-les dans le formulaire Woyofal");
  };

  // --- Assistant depuis la vue d'ensemble ---
  // useAssistant expose `ask` (et non `sendMessage`) : c'est ce qui envoie réellement la question.
  const handleAskWithNav = (question) => {
    if (question) assistant.ask?.(question);
    go("assistant");
  };

  // Redirection SuperAdmin
  useEffect(() => {
    if (authenticated && isSuperAdmin) router.replace("/admin");
  }, [authenticated, isSuperAdmin, router]);

  if (!authenticated) return <LoginScreen onLogin={login} />;
  if (isSuperAdmin) return null;

  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // if (orgError || !activeOrganisation) {
  //   if (activeRole === "ADMIN_ORGANISATION") {
  //     return <OnboardingWizard onComplete={() => window.location.reload()} />;
  //   }
  //   return (
  //     <div className="min-h-screen flex items-center justify-center p-6 text-center">
  //       <div>
  //         <h1 className="text-lg font-bold mb-2">Aucune organisation associée</h1>
  //         <p className="text-sm text-slate-500 mb-4">
  //           Votre compte n'est pas encore rattaché à une organisation. Contactez
  //           l'administrateur qui vous a invité.
  //         </p>
  //         <button className="text-xs text-rose-600 underline" onClick={logout}>
  //           Se déconnecter
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  const renderView = () => {
    switch (view) {
      case "overview":
        return (
          <OverviewView
            user={currentProfile}
            currentDate={new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            heroData={heroData}
            briefingData={briefingData}
            insightData={insightData}
            decisionsData={decisionsData}
            assistantData={{
              assistantName: "Assistant EcoScan",
              subtitle: "Répond à partir de vos données Django",
            }}
            chartSeries={chartSeries}
            period={period}
            setPeriod={setPeriod}
            point={point}
            setPoint={setPoint}
            completed={completed}
            setCompleted={setCompleted}
            openUpload={openUpload}
            ask={handleAskWithNav}
            setDrawer={setDrawer}
          />
        );
      case "analyses":
        return <AnalysesView setDrawer={setDrawer} />;
      case "data":
        return (
          <DataCenterView
            files={fileSources.files}
            filesLoading={fileSources.loading}
            filesError={fileSources.error}
            openUpload={openUpload}
            setDrawer={setDrawer}
          />
        );
      case "goals":
        return <GoalsView />;
      case "assistant":
        return <AssistantView {...assistant} />;
      case "features":
        return (
          <BusinessToolsView
            role={activeRole}
            setDrawer={setDrawer}
            pendingCapture={pendingCapture}
            onCaptureConsumed={() => setPendingCapture(null)}
          />
        );
      case "settings":
        return (
          <SettingsView
            preferences={preferences}
            updatePreferences={updatePreferences}
          />
        );
      case "memory":
        return <MemoryView onAsk={handleAskWithNav} />;
      default:
        return null;
    }
  };

  return (
    <AppShell
      darkMode={darkMode}
      accent={preferences?.accent}
      density={preferences?.densite}
      onAction={announceAction}
    >
      <TopNav
        view={view}
        go={go}
        openUpload={openUpload}
        currentProfile={currentProfile}
        organisations={organisations}
        activeOrganisation={activeOrganisation}
        onSwitchOrganisation={switchOrganisation}
        onLogout={logout}
        darkMode={darkMode}
        setDarkMode={handleToggleDarkMode}
        unreadCount={unreadCount}
        setNotificationsOpen={setNotificationsOpen}
        setPaletteOpen={setPaletteOpen}
        setHelpOpen={setHelpOpen}
      />

      <div className="eco-main">{renderView()}</div>

      <BottomNav view={view} go={go} onCapture={() => setCaptureOpen(true)} />

      {/* Popovers & modales */}
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
        goAssistant={() => go("assistant")}
      />

      <DetailDrawer
        type={drawer}
        close={() => setDrawer(null)}
        complete={() => {
          setCompleted((c) => (c.includes(0) ? c : [...c, 0]));
          setDrawer(null);
        }}
      />

      {actionToast && (
        <ActionToast message={actionToast} onClose={() => setActionToast(null)} />
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
  );
}
