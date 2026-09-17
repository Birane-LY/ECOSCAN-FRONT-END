'use client'

import React, { useState } from 'react'
import { CalendarCheck, DollarSign, FileSpreadsheet, Landmark, ShieldCheck, Zap } from 'lucide-react'
import { PageHeader } from '@/components/ui'
import { WoyofalTool } from './tools/WoyofalTool'
import { RoiTool } from './tools/RoiTool'
import { FundingTool } from './tools/FundingTool'
import { ReportsTool } from './tools/ReportsTool'
import { CalendarTool } from './tools/CalendarTool'
import { AdminComplianceTool } from './admin/AdminComplianceTool'

export function BusinessToolsView({ role, setDrawer }) {
  const [activeTab, setActiveTab] = useState('woyofal')
  const [briefingTime, setBriefingTime] = useState('08:30')
  const [template, setTemplate] = useState('accountant')
  const [period, setPeriod] = useState('month')

  return (
    <div className="tab-surface">
      <PageHeader
        eyebrow="OUTILS MÉTIER"
        title="Outils opérationnels pour piloter vos consommations"
        description="Configurez vos rituels de relève, simulez vos retours sur investissement et éditez vos livrables officiels."
      />

      <div className="tools-tabs">
        <button
          className={activeTab === 'woyofal' ? 'active' : ''}
          onClick={() => setActiveTab('woyofal')}
        >
          <Zap size={15} />Rituel Woyofal
        </button>
        <button
          className={activeTab === 'roi' ? 'active' : ''}
          onClick={() => setActiveTab('roi')}
        >
          <DollarSign size={15} />Calculateur ROI
        </button>
        <button
          className={activeTab === 'funding' ? 'active' : ''}
          onClick={() => setActiveTab('funding')}
        >
          <Landmark size={15} />Aides & Subventions
        </button>
        <button
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          <FileSpreadsheet size={15} />Rapports
        </button>
        <button
          className={activeTab === 'calendar' ? 'active' : ''}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarCheck size={15} />Briefings
        </button>
        <button
          className={activeTab === 'admin' ? 'active' : ''}
          onClick={() => setActiveTab('admin')}
        >
          <ShieldCheck size={15} />Admin & Conformité
        </button>
      </div>

      {activeTab === 'woyofal' && <WoyofalTool setDrawer={setDrawer} />}
      {activeTab === 'roi' && <RoiTool role={role} setDrawer={setDrawer} />}
      {activeTab === 'funding' && <FundingTool setDrawer={setDrawer} />}
      {activeTab === 'reports' && (
        <ReportsTool
          setDrawer={setDrawer}
          template={template}
          setTemplate={setTemplate}
          period={period}
          setPeriod={setPeriod}
        />
      )}
      {activeTab === 'calendar' && (
        <CalendarTool
          briefingTime={briefingTime}
          setBriefingTime={setBriefingTime}
          setDrawer={setDrawer}
        />
      )}
      {activeTab === 'admin' && <AdminComplianceTool setDrawer={setDrawer} />}
    </div>
  )
}
