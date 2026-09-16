'use client'

import React from 'react'
import { ArrowUpRight, Check, CloudUpload, FileSpreadsheet, Sparkles, Upload, X } from 'lucide-react'

export function UploadModal({ stage, fileRef, onProcess, onFinish, onClose }) {
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
            <button className="secondary-button" onClick={onProcess}>
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
        ) : (
          <>
            <div className="complete-icon">
              <Check size={30} />
            </div>
            <p className="eyebrow">ANALYSE PRÊTE</p>
            <h2 id="upload-title">Vos insights sont prêts.</h2>
            <p>1 284 lignes interprétées. 3 opportunités d’action détectées.</p>
            <button className="primary-button modal-action" onClick={onFinish}>
              Créer l’analyse <ArrowUpRight size={16} />
            </button>
          </>
        )}
      </section>
    </div>
  )
}
