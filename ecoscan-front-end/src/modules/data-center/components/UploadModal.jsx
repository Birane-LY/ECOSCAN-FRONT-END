'use client'

import React, { useState } from 'react'
import { ArrowUpRight, Check, CloudUpload, FileSpreadsheet, Upload, X } from 'lucide-react'
import { TickProgress } from '@/components/instruments'

const STATUTS_ECHEC = ['ECHOUE', 'HORS_PERIMETRE', 'INCOHERENT']

export function UploadModal({ stage, fileRef, onProcess, onFinish, onClose, result }) {
  const [dragging, setDragging] = useState(false)
  const enEchec = result && STATUTS_ECHEC.includes(result.statut)
  const revueRequise = result?.statut === 'REVUE_REQUISE'

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) onProcess(file) // useDataSources accepte un fichier ou un événement
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="upload-modal mdl" role="dialog" aria-modal="true" aria-labelledby="upload-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-button mdl-close" aria-label="Fermer" onClick={onClose}>
          <X size={18} />
        </button>

        {stage === 0 ? (
          <>
            <span className="mdl-orb">
              <CloudUpload size={26} />
            </span>
            <h2 id="upload-title">Importer une source de données</h2>
            <p>Déposez un fichier de consommation pour lancer une nouvelle analyse.</p>
            <button
              type="button"
              className={`mdl-drop ${dragging ? 'over' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <Upload size={22} />
              <strong>Déposez votre fichier ici</strong>
              <span>CSV, XLSX ou JSON, 25 Mo maximum</span>
            </button>
            <input ref={fileRef} type="file" hidden accept=".csv,.xlsx,.json" onChange={onProcess} />
            <button type="button" className="secondary-button" onClick={() => fileRef.current?.click()}>
              <FileSpreadsheet size={16} />
              Choisir un fichier
            </button>
          </>
        ) : stage < 3 ? (
          <>
            <span className="mdl-orb busy">
              <CloudUpload size={26} />
            </span>
            <h2 id="upload-title">Lecture du fichier en cours</h2>
            <ol className="mdl-steps" aria-live="polite">
              <li className="done">
                <Check size={15} /> Fichier importé
              </li>
              <li className={stage > 1 ? 'done' : 'active'}>
                {stage > 1 ? <Check size={15} /> : <span className="mdl-spin" />} Lecture des données
              </li>
              <li>
                <span className="mdl-dot" /> Vérification de la qualité
              </li>
            </ol>
            <TickProgress value={stage === 1 ? 38 : 76} ticks={28} label="Avancement de l’import" />
          </>
        ) : enEchec ? (
          <>
            <span className="mdl-orb alert">
              <X size={26} />
            </span>
            <h2 id="upload-title">
              {result?.statut === 'HORS_PERIMETRE' ? 'Ce document ne semble pas énergétique.' : 'Impossible d’exploiter ce fichier.'}
            </h2>
            <p>{result?.ocr_erreur || 'Le document n’a pas pu être interprété correctement. Vérifiez le fichier et réessayez.'}</p>
            <button type="button" className="secondary-button" onClick={onClose}>
              Fermer
            </button>
          </>
        ) : (
          <>
            <span className="mdl-orb ok">
              <Check size={28} />
            </span>
            <h2 id="upload-title">{revueRequise ? 'Une vérification manuelle est recommandée.' : 'Le fichier est prêt.'}</h2>
            <p>
              {result?.nom_fichier && <>{result.nom_fichier}. </>}
              {result?.nombre_lignes != null
                ? `${result.nombre_lignes} ligne${result.nombre_lignes > 1 ? 's' : ''} interprétée${result.nombre_lignes > 1 ? 's' : ''}.`
                : 'Fichier interprété.'}
              {result?.score_qualite != null && ` Score qualité : ${result.score_qualite}/100.`}
              {result?.nombre_erreurs > 0 && ` ${result.nombre_erreurs} point${result.nombre_erreurs > 1 ? 's' : ''} à vérifier.`}
            </p>
            <button type="button" className="primary-button" onClick={onFinish}>
              Créer l’analyse <ArrowUpRight size={16} />
            </button>
          </>
        )}
      </section>
    </div>
  )
}
