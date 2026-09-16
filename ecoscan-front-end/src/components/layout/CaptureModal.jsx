'use client'

import React, { useState } from 'react'
import { Camera, Check, ReceiptText, X, Zap } from 'lucide-react'

export function CaptureModal({ open, onClose, onConfirm }) {
  const [captureKind, setCaptureKind] = useState('consumption')
  const [captureFile, setCaptureFile] = useState(null)

  if (!open) return null

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (file) setCaptureFile(file)
  }

  const handleClose = () => {
    setCaptureFile(null)
    onClose?.()
  }

  const handleConfirm = () => {
    if (!captureFile) return
    onConfirm?.({ kind: captureKind, file: captureFile })
    setCaptureFile(null)
    onClose?.()
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <section
        className="capture-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="capture-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" aria-label="Fermer" onClick={handleClose}>
          <X />
        </button>

        <div className="capture-modal-icon">
          <Camera size={24} />
        </div>
        <p className="eyebrow">CAPTURE MOBILE</p>
        <h2 id="capture-title">Qu&apos;est-ce que vous souhaitez capturer ?</h2>
        <p className="lead">Utilisez la caméra de votre téléphone ou choisissez une image depuis votre appareil.</p>

        <div className="capture-choice-grid">
          <button
            type="button"
            className={captureKind === 'consumption' ? 'selected' : ''}
            onClick={() => setCaptureKind('consumption')}
          >
            <Zap size={18} />
            <strong>Consommation</strong>
            <small>Relevé compteur ou Woyofal</small>
          </button>
          <button
            type="button"
            className={captureKind === 'invoice' ? 'selected' : ''}
            onClick={() => setCaptureKind('invoice')}
          >
            <ReceiptText size={18} />
            <strong>Facture</strong>
            <small>Photo ou justificatif énergie</small>
          </button>
        </div>

        <label className="capture-dropzone">
          <Camera size={20} />
          <strong>{captureFile ? captureFile.name : 'Ouvrir la caméra'}</strong>
          <small>{captureFile ? 'Image prête à valider' : 'JPEG, PNG ou PDF · caméra arrière'}</small>
          <input type="file" accept="image/*,.pdf" capture="environment" onChange={handleFile} />
        </label>

        <div className="capture-actions">
          <button type="button" className="secondary-button" onClick={handleClose}>
            Annuler
          </button>
          <button
            type="button"
            className="primary-button"
            disabled={!captureFile}
            onClick={handleConfirm}
          >
            Valider la capture <Check size={15} />
          </button>
        </div>
      </section>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(8, 15, 34, 0.55);
          backdrop-filter: blur(4px);
          z-index: 60;
        }

        .capture-modal {
          position: relative;
          width: min(420px, 100%);
          max-height: 90vh;
          overflow-y: auto;

          /* --- glassmorphism --- */
          background: rgba(255, 255, 255, 0.62);
          border: 1px solid rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow:
            0 24px 60px rgba(15, 23, 42, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);

          color: #0f172a;
          border-radius: 22px;
          padding: 28px 24px 24px;
        }

        :global(.theme-dark) .capture-modal {
          background: rgba(17, 24, 39, 0.55);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          color: #f1f5f9;
        }

        .modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255, 255, 255, 0.5);
          color: inherit;
          cursor: pointer;
        }

        :global(.theme-dark) .modal-close {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .capture-modal-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(37, 99, 235, 0.14);
          color: #2563eb;
          margin-bottom: 14px;
          backdrop-filter: blur(6px);
        }

        :global(.theme-dark) .capture-modal-icon {
          background: rgba(59, 130, 246, 0.22);
          color: #60a5fa;
        }

        .eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #475569;
          margin: 0 0 8px;
        }

        :global(.theme-dark) .eyebrow {
          color: #94a3b8;
        }

        h2 {
          font-size: 19px;
          font-weight: 700;
          margin: 0 0 8px;
          line-height: 1.3;
        }

        .lead {
          font-size: 14px;
          color: #475569;
          margin: 0 0 20px;
          line-height: 1.5;
        }

        :global(.theme-dark) .lead {
          color: #94a3b8;
        }

        .capture-choice-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }

        .capture-choice-grid button {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(6px);
          color: inherit;
          text-align: left;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        :global(.theme-dark) .capture-choice-grid button {
          border-color: rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
        }

        .capture-choice-grid button strong {
          font-size: 13.5px;
        }

        .capture-choice-grid button small {
          font-size: 12px;
          color: #475569;
        }

        :global(.theme-dark) .capture-choice-grid button small {
          color: #94a3b8;
        }

        .capture-choice-grid button.selected {
          border-color: #2563eb;
          background: rgba(37, 99, 235, 0.12);
        }

        :global(.theme-dark) .capture-choice-grid button.selected {
          background: rgba(59, 130, 246, 0.18);
        }

        .capture-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;
          padding: 22px 16px;
          border: 1.5px dashed rgba(15, 23, 42, 0.18);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(6px);
          cursor: pointer;
          margin-bottom: 20px;
          color: inherit;
        }

        :global(.theme-dark) .capture-dropzone {
          border-color: rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.03);
        }

        .capture-dropzone input {
          display: none;
        }

        .capture-dropzone small {
          color: #475569;
          font-size: 12px;
        }

        :global(.theme-dark) .capture-dropzone small {
          color: #94a3b8;
        }

        .capture-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .primary-button,
        .secondary-button {
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .primary-button {
          border: none;
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
        }

        .primary-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .secondary-button {
          border: 1px solid rgba(15, 23, 42, 0.12);
          background: rgba(255, 255, 255, 0.4);
          color: inherit;
          backdrop-filter: blur(6px);
        }

        :global(.theme-dark) .secondary-button {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  )
}