'use client'

import React, { useState } from 'react'
import { apiPost } from '@/lib/apiClient'
import { UploadModal } from '@/modules/data-center/components/UploadModal'
import { useDataSources } from '@/modules/data-center/useDataSources'
import { useOverviewData } from './useOverviewData'
import { OverviewView } from './OverviewView'

export function OverviewContainer({ user, setDrawer }) {
  const [period, setPeriod] = useState('7d')
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [completedActions, setCompletedActions] = useState([])

  const {
    loading, chartSeries, reload,
    heroData, briefingData, insightData, decisionsData, assistantData,
  } = useOverviewData(period)
  const upload = useDataSources()

  // Question posée depuis le tableau de bord : appelle réellement l'assistant.
  // La réponse est affichée par AssistantTeaser ; en cas d'erreur, on renvoie un message lisible.
  const handleAsk = async (question) => {
    try {
      const res = await apiPost('/analyses/assistant/interroger/', { question })
      return res.answer
    } catch (err) {
      return `Désolé, l’assistant est indisponible : ${err.message}`
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Chargement des données du tableau de bord…</div>
  }

  return (
    <>
      <OverviewView
        user={user}
        heroData={heroData}
        briefingData={briefingData}
        insightData={insightData}
        decisionsData={decisionsData}
        assistantData={assistantData}
        chartSeries={chartSeries}
        period={period}
        setPeriod={setPeriod}
        point={selectedPoint}
        setPoint={setSelectedPoint}
        completed={completedActions}
        setCompleted={setCompletedActions}
        openUpload={upload.openUpload}
        ask={handleAsk}
        setDrawer={setDrawer ?? (() => {})}
      />

      {upload.uploadOpen && (
        <UploadModal
          stage={upload.uploadStage}
          fileRef={upload.fileRef}
          onProcess={upload.processUpload}
          // L'analyse (anomalie, diagnostics) tourne en arrière-plan après l'import :
          // on recharge tout de suite, puis une seconde fois quand elle a eu le temps d'aboutir.
          onFinish={() => upload.finishUpload(() => { reload(); setTimeout(reload, 10000) })}
          onClose={upload.closeUpload}
          result={upload.result}
        />
      )}
    </>
  )
}
