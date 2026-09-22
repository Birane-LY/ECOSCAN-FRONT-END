'use client'

import React, { useRef, useState } from 'react'
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
  const inputRef = useRef(null)

  if (!open) return null

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setPhoto(null)
    setPreview(null)
    setChamps(null)
    setError(null)
  }

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
  const handleClose = () => {
    reset()
    onClose()
  }

  const detected = champs && Object.keys(champs).length > 0

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <section className="upload-modal mdl" role="dialog" aria-modal="true" aria-labelledby="capture-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-button mdl-close" aria-label="Fermer" onClick={handleClose}>
          <X size={18} />
        </button>

        {!photo ? (
          <>
            <span className="mdl-orb">
              <Camera size={26} />
            </span>
            <h2 id="capture-title">Photographiez votre compteur ou votre facture.</h2>
            <p>EcoScan lit les index et les montants : vous n’aurez qu’à vérifier avant de valider.</p>
            <button type="button" className="mdl-drop" onClick={() => inputRef.current?.click()}>
              <Camera size={22} />
              <strong>Ouvrir l’appareil photo</strong>
              <span>Compteur Woyofal ou facture Senelec</span>
            </button>
            <input ref={inputRef} type="file" accept="image/*" capture="environment" hidden onChange={handleCapture} />
          </>
        ) : (
          <>
            <img className="mdl-photo" src={preview} alt="Photo capturée" />

            {analyzing && (
              <p className="mdl-status" role="status">
                <Loader2 size={16} className="mdl-spin-icon" /> Lecture de l’image en cours…
              </p>
            )}

            {error && (
              <div className="mdl-warn" role="alert">
                <strong>
                  <AlertTriangle size={15} /> Analyse indisponible
                </strong>
                <span>{error}</span>
                <small>Vous pouvez saisir les valeurs manuellement dans le formulaire habituel.</small>
              </div>
            )}

            {!analyzing && !error && champs && !detected && (
              <p className="drawer-lead">Aucune donnée lisible sur cette photo. Reprenez-la ou saisissez les valeurs à la main.</p>
            )}

            {!analyzing && !error && detected && (
              <>
                <h3 className="mdl-sub">Champs détectés, à vérifier</h3>
                <dl className="mdl-fields">
                  {Object.entries(champs).map(([cle, valeur]) => (
                    <div key={cle}>
                      <dt>{cle.replace(/_/g, ' ')}</dt>
                      <dd>{String(valeur)}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            <div className="mdl-actions">
              <button type="button" className="secondary-button" onClick={reset}>
                Reprendre la photo
              </button>
              {detected && (
                <button type="button" className="primary-button" onClick={handleConfirm}>
                  <Check size={16} /> Utiliser ces valeurs
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
