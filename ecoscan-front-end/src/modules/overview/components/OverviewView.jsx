'use client'

import React, { useState } from 'react'
import { WelcomeRow } from './WelcomeRow'
import { DashboardCustomizer } from './DashboardCustomizer'
import { HeroPanel } from './HeroPanel'
import { BriefingCard } from './BriefingCard'
import { InsightCard } from './InsightCard'
import { EnergyChart } from './EnergyChart'
import { DecisionActions } from './DecisionActions'
import { AssistantTeaser } from './AssistantTeaser'

export function OverviewView({
  user,
  currentDate,
  heroData,
  briefingData,
  insightData,
  decisionsData,
  assistantData,
  chartSeries,
  loading=false,
  period,
  setPeriod,
  point,
  setPoint,
  completed,
  setCompleted,
  openUpload,
  ask,
  setDrawer,
}) {
  const [editMode, setEditMode] = useState(false)
  const [widgets, setWidgets] = useState(['briefing', 'chart', 'actions', 'insight'])

  const toggleWidget = (id) =>
    setWidgets((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  const toggleCompleted = (index) =>
    setCompleted((cur) => (cur.includes(index) ? cur.filter((x) => x !== index) : [...cur, index]))

  const showPair = widgets.includes('briefing') || widgets.includes('insight')

  return (
    <div className="ov">
      <WelcomeRow
        userName={user?.name || user?.firstName || user?.email?.split('@')[0]}
        currentDate={currentDate}
        editMode={editMode}
        onToggleEditMode={() => setEditMode((v) => !v)}
        onOpenUpload={openUpload}
      />

      {editMode && (
        <DashboardCustomizer
          widgets={widgets}
          onToggleWidget={toggleWidget}
          onSave={() => setEditMode(false)}
        />
      )}

      {/* Rendu dynamique du panneau Hero */}
      <HeroPanel selectedPoint={point} {...heroData} />

      {showPair && (
        <div className="ov-pair">
          {widgets.includes('briefing') && <BriefingCard {...briefingData} />}
          {widgets.includes('insight') && <InsightCard {...insightData} onExplore={ask} />}
        </div>
      )}

      {widgets.includes('chart') && (
        <EnergyChart
          period={period}
          setPeriod={setPeriod}
          setSelectedPoint={setPoint}
          data={chartSeries}
          loading={loading}
        />
  )}

      {widgets.includes('actions') && (
        <div className="ov-lower">
          <DecisionActions
            decisions={decisionsData}
            completed={completed}
            onToggleCompleted={toggleCompleted}
            onOpenDrawer={setDrawer}
          />
          <AssistantTeaser {...assistantData} onAsk={ask} />
        </div>
      )}
    </div>
  )
}