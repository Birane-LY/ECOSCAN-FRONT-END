'use client'

import React, { useState } from 'react'
import { WelcomeRow } from './WelcomeRow'
import { DashboardCustomizer } from './DashboardCustomizer'
import { BriefingCard } from './BriefingCard'
import { InsightCard } from './InsightCard'
import { EnergyChart } from './EnergyChart'
import { DecisionActions } from './DecisionActions'
import { AssistantTeaser } from './AssistantTeaser'

export function OverviewView({
  // Données de l'utilisateur authentifié
  user,
  currentDate,
  briefingData,
  insightData,
  decisionsData,
  assistantData,
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

  const handleToggleWidget = (id) => {
    setWidgets((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    )
  }

  const handleToggleCompleted = (index) => {
    setCompleted((current) =>
      current.includes(index) ? current.filter((x) => x !== index) : [...current, index]
    )
  }

  return (
    <>
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
          onToggleWidget={handleToggleWidget}
          onSave={() => setEditMode(false)}
        />
      )}

      <section className="flex flex-col gap-6 w-full mb-8">
        {widgets.includes('briefing') && <BriefingCard {...briefingData} />}
        {widgets.includes('insight') && <InsightCard {...insightData} onExplore={ask} />}
      </section>

      {widgets.includes('chart') && (
        <EnergyChart
          period={period}
          setPeriod={setPeriod}
          selectedPoint={point}
          setSelectedPoint={setPoint}
        />
      )}

      {widgets.includes('actions') && (
        <section className="lower-grid">
          <DecisionActions
            decisions={decisionsData}
            completed={completed}
            onToggleCompleted={handleToggleCompleted}
            onOpenDrawer={setDrawer}
          />
          <AssistantTeaser {...assistantData} onAsk={ask} />
        </section>
      )}
    </>
  )
}