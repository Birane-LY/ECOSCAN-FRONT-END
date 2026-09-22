"use client";

import React, { useState } from "react";
import { CalendarCheck, DollarSign, FileSpreadsheet, Landmark, ShieldCheck, Zap } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { WoyofalTool } from "./tools/WoyofalTool";
import { RoiTool } from "./tools/RoiTool";
import { FundingTool } from "./tools/FundingTool";
import { ReportsTool } from "./tools/ReportsTool";
import { CalendarTool } from "./tools/CalendarTool";
import { AdminComplianceTool } from "./admin/AdminComplianceTool";

const TABS = [
  { id: "woyofal", label: "Rituel Woyofal", icon: Zap },
  { id: "roi", label: "Calculateur ROI", icon: DollarSign },
  { id: "funding", label: "Aides et subventions", icon: Landmark },
  { id: "reports", label: "Rapports", icon: FileSpreadsheet },
  { id: "calendar", label: "Briefings", icon: CalendarCheck },
  { id: "admin", label: "Admin et conformité", icon: ShieldCheck, adminOnly: true },
];

export function BusinessToolsView({ role, setDrawer, pendingCapture, onCaptureConsumed }) {
  const [activeTab, setActiveTab] = useState("woyofal");
  const [briefingTime, setBriefingTime] = useState("08:30");
  const [template, setTemplate] = useState("accountant");
  const [period, setPeriod] = useState("month");

  // Vérification stricte : Seul l'Admin d'Organisation voit et accède à la section Admin
  const isOrgAdmin = role === "ADMIN_ORGANISATION";

  // Filtrage des onglets selon le rôle de l'utilisateur
  const visibleTabs = TABS.filter((tab) => !tab.adminOnly || isOrgAdmin);

  return (
    <div className="bt">
      <PageHeader
        title="Outils opérationnels pour piloter vos consommations"
        subtitle="Relevez vos compteurs, simulez vos investissements et éditez vos livrables officiels."
      />

      <div className="tools-tabs" role="tablist" aria-label="Outils métier">
        {visibleTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={activeTab === id ? "active" : ""}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "woyofal" && (
        <WoyofalTool setDrawer={setDrawer} pendingCapture={pendingCapture} onCaptureConsumed={onCaptureConsumed} />
      )}
      {activeTab === "roi" && <RoiTool role={role} setDrawer={setDrawer} />}
      {activeTab === "funding" && <FundingTool setDrawer={setDrawer} />}
      {activeTab === "reports" && (
        <ReportsTool setDrawer={setDrawer} template={template} setTemplate={setTemplate} period={period} setPeriod={setPeriod} />
      )}
      {activeTab === "calendar" && (
        <CalendarTool briefingTime={briefingTime} setBriefingTime={setBriefingTime} setDrawer={setDrawer} />
      )}
      {activeTab === "admin" && isOrgAdmin && (
        <AdminComplianceTool currentUser={{ role }} setDrawer={setDrawer} />
      )}
    </div>
  );
}