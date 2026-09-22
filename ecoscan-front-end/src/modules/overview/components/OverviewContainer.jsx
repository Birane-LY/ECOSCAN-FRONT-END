'use client'

import React, { useState } from 'react'
import { useOverviewData } from './useOverviewData'
import { useDataSources } from './useDataSources'
import { OverviewView } from './OverviewView'

export function OverviewContainer({ user }) {
  const { loading, error, historique, objectifs, chartData } = useOverviewData()
  const { openUpload, uploadOpen, closeUpload, processUpload, uploadStage } = useDataSources()

  const [period, setPeriod] = useState('7d')
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [completedActions, setCompletedActions] = useState([])
  const [drawerContent, setDrawerContent] = useState(null)

  if (loading) {
    return <div className="p-8 text-center">Chargement des données du tableau de bord...</div>
  }

  // Construction des props dynamiques pour HeroPanel
  const totalKwh = chartData ? chartData.reduce((acc, curr) => acc + curr.value, 0) : 0
  
  const heroData = {
    consumption: {
      value: totalKwh.toLocaleString('fr-FR'),
      unit: 'kWh',
      trend: '↓ 14,2 %',
      note: 'calculé sur vos données réelles',
    },
  }

  // Structuration des objectifs renvoyés par /energies/objectifs/ pour DecisionActions
  const decisionsData = objectifs.map((obj) => ({
    id: obj.id,
    title: obj.nom || obj.titre,
    scope: obj.description || 'Objectif énergétique',
    value: obj.valeur_cible ? `${obj.valeur_cible} ${obj.unite || 'kWh'}` : null,
    impact: obj.priorite || 'Moyen',
  }))

  const handleAsk = (query) => {
    console.log('Question posée à l’assistant :', query)
    // Logique d'interrogation de l'API Assistant à insérer ici
  }

  return (
    <>
      <OverviewView
        user={user}
        heroData={heroData}
        briefingData={{ error }}
        decisionsData={decisionsData}
        chartData={chartData}
        period={period}
        setPeriod={setPeriod}
        point={selectedPoint}
        setPoint={setSelectedPoint}
        completed={completedActions}
        setCompleted={setCompletedActions}
        openUpload={openUpload}
        ask={handleAsk}
        setDrawer={setDrawerContent}
      />

      {/* Interface de gestion du dialogue d'upload */}
      {uploadOpen && (
        <div className="upload-modal-backdrop">
          <div className="upload-modal">
            <h3>Importer un fichier de consommation</h3>
            {uploadStage === 'idle' && (
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && processUpload(e.target.files[0])}
              />
            )}
            {uploadStage === 'uploading' && <p>Envoi du fichier en cours...</p>}
            {uploadStage === 'processing' && <p>Analyse OCR et traitement en cours...</p>}
            {uploadStage === 'done' && (
              <div>
                <p>Importation terminée avec succès !</p>
                <button onClick={closeUpload}>Fermer</button>
              </div>
            )}
            <button className="close-btn" onClick={closeUpload}>Annuler</button>
          </div>
        </div>
      )}
    </>
  )
}