'use client'

import React, { useState } from 'react'
import { AlertTriangle, Camera, Check, Loader2, X } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

async function envoyerImage(file) {
  const token = localStorage.getItem('access_token')
  const formData = new FormData()
  formData.append('image', file)
  const res = await fetch(`${API_BASE_URL}/energies/capture-image/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Erreur ${res.status}`)
  }
  return res.json()
}

export function CaptureModal({ open, onClose, onConfirm }) {
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [champs, setChamps] = useState(null)
  const [error, setError] = useState(null)

  if (!open) return null

  const reset = () => { setPhoto(null); setPreview(null); setChamps(null); setError(null) }

  const handleCapture = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
    setAnalyzing(true)
    setError(null)
    try {
      const resultat = await envoyerImage(file)
      setChamps(resultat.champs)
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleConfirm = () => {
    onConfirm?.({ champs, photo })
    reset()
    onClose()
  }

  const handleClose = () => { reset(); onClose() }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <section className="upload-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Fermer" onClick={handleClose}><X /></button>

        {!photo ? (
          <>
            <div className="upload-icon"><Camera size={28} /></div>
            <p className="eyebrow">CAPTURE RAPIDE</p>
            <h2>Photographiez votre compteur ou votre facture.</h2>
            <p>EcoScan lit automatiquement les index et montants — vous n'aurez qu'à vérifier avant de valider.</p>
            <button className="drop-zone" onClick={() => document.getElementById('capture-input').click()}>
              <Camera size={21} />
              <strong>Ouvrir l'appareil photo</strong>
              <span>Compteur Woyofal ou facture Senelec</span>
            </button>
            <input
              id="capture-input"
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={handleCapture}
            />
          </>
        ) : (
          <>
            <img src={preview} alt="Capture" style={{ width: '100%', borderRadius: 12, marginBottom: 16, maxHeight: 220, objectFit: 'cover' }} />

            {analyzing && (
              <div className="process-steps">
                <span className="active"><Loader2 size={13} className="spin" />Lecture de l'image en cours…</span>
              </div>
            )}

            {error && (
              <div className="drawer-section" style={{ color: 'var(--copper)' }}>
                <p className="eyebrow"><AlertTriangle size={12} style={{ marginRight: 4 }} />ANALYSE INDISPONIBLE</p>
                <p>{error}</p>
                <p style={{ fontSize: 10 }}>Vous pouvez saisir les valeurs manuellement dans le formulaire habituel.</p>
              </div>
            )}

            {!analyzing && !error && champs && Object.keys(champs).length === 0 && (
              <p className="drawer-lead">Aucune donnée lisible sur cette photo — reprenez-la ou saisissez manuellement.</p>
            )}

            {!analyzing && !error && champs && Object.keys(champs).length > 0 && (
              <>
                <p className="eyebrow">CHAMPS DÉTECTÉS — À VÉRIFIER</p>
                <div className="drawer-metrics" style={{ flexWrap: 'wrap' }}>
                  {Object.entries(champs).map(([cle, valeur]) => (
                    <div key={cle}><span>{cle.replace(/_/g, ' ')}</span><strong>{String(valeur)}</strong></div>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="secondary-button" onClick={() => { setPhoto(null); setPreview(null); setChamps(null); setError(null) }}>
                Reprendre la photo
              </button>
              {champs && Object.keys(champs).length > 0 && (
                <button className="primary-button" onClick={handleConfirm}>
                  <Check size={15} />Utiliser ces valeurs
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}