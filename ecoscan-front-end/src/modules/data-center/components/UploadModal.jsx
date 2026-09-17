'use client'

import React from 'react'
import { ArrowUpRight, Check, CloudUpload, FileSpreadsheet, Sparkles, Upload, X } from 'lucide-react'

const STATUTS_ECHEC = ['ECHOUE', 'HORS_PERIMETRE', 'INCOHERENT']

export function UploadModal({ stage, fileRef, onProcess, onFinish, onClose, result }) {
  const enEchec = result && STATUTS_ECHEC.includes(result.statut)
  const revueRequise = result?.statut === 'REVUE_REQUISE'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="upload-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" aria-label="Fermer" onClick={onClose}>
          <X />
        </button>

        {stage === 0 ? (
          <>
            <div className="upload-icon">
              <CloudUpload size={28} />
            </div>
            <p className="eyebrow">NOUVELLE SOURCE</p>
            <h2 id="upload-title">Faites parler vos données.</h2>
            <p>Déposez un fichier de consommation pour lancer une nouvelle analyse.</p>
            <button className="drop-zone" onClick={() => fileRef.current?.click()}>
              <Upload size={21} />
              <strong>Déposer votre fichier ici</strong>
              <span>CSV, XLSX ou JSON · 25 Mo maximum</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              hidden
              accept=".csv,.xlsx,.json"
              onChange={onProcess}
            />
            <button className="secondary-button" onClick={() => fileRef.current?.click()}>
              <FileSpreadsheet size={16} />
              Choisir un fichier
            </button>
          </>
        ) : stage < 3 ? (
          <>
            <div className="processing-icon">
              <Sparkles size={25} />
            </div>
            <p className="eyebrow">ANALYSE EN COURS</p>
            <h2 id="upload-title">On met de l’ordre dans vos données.</h2>
            <div className="process-steps">
              <span className="complete">
                <Check size={13} />
                Fichier importé
              </span>
              <span className={stage > 1 ? 'complete' : 'active'}>
                {stage > 1 ? <Check size={13} /> : <span className="spinner" />}
                Lecture des données
              </span>
              <span>
                <Sparkles size={13} />
                Détection des leviers
              </span>
            </div>
            <div className="upload-progress">
              <i style={{ width: `${stage === 1 ? 38 : 76}%` }} />
            </div>
          </>
        ) : enEchec ? (
          <>
            <div className="processing-icon">
              <X size={25} />
            </div>
            <p className="eyebrow">ANALYSE INTERROMPUE</p>
            <h2 id="upload-title">
              {result?.statut === 'HORS_PERIMETRE'
                ? "Ce document ne semble pas énergétique."
                : "Impossible d’exploiter ce fichier."}
            </h2>
            <p>
              {result?.ocr_erreur || "Le document n'a pas pu être interprété correctement. Vérifiez le fichier et réessayez."}
            </p>
            <button className="secondary-button modal-action" onClick={onClose}>
              Fermer
            </button>
          </>
        ) : (
          <>
            <div className="complete-icon">
              <Check size={30} />
            </div>
            <p className="eyebrow">{revueRequise ? 'REVUE REQUISE' : 'ANALYSE PRÊTE'}</p>
            <h2 id="upload-title">
              {revueRequise ? 'Une vérification manuelle est recommandée.' : 'Vos insights sont prêts.'}
            </h2>
            <p>
              {result?.nom_fichier && <>{result.nom_fichier} · </>}
              {result?.nombre_lignes != null
                ? `${result.nombre_lignes} ligne${result.nombre_lignes > 1 ? 's' : ''} interprétée${result.nombre_lignes > 1 ? 's' : ''}.`
                : 'Fichier interprété.'}
              {result?.score_qualite != null && ` Score qualité : ${result.score_qualite}/100.`}
              {result?.nombre_erreurs > 0 && ` ${result.nombre_erreurs} point${result.nombre_erreurs > 1 ? 's' : ''} à vérifier.`}
            </p>
            <button className="primary-button modal-action" onClick={onFinish}>
              Créer l’analyse <ArrowUpRight size={16} />
            </button>
          </>
        )}
      </section>
    </div>
  )
}