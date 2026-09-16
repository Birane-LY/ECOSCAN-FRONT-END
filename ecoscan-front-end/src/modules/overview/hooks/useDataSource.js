// modules/data-center/useDataSources.js
import { useState, useRef } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export function useDataSources() {
  const [files, setFiles] = useState([])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadStage, setUploadStage] = useState('idle') // 'idle' | 'uploading' | 'processing' | 'done'
  const fileRef = useRef(null)

  const openUpload = () => setUploadOpen(true)
  const closeUpload = () => {
    setUploadOpen(false)
    setUploadStage('idle')
  }

  // Étape 1 (Gate 1): Enregistrement du fichier brut
  const processUpload = async (file) => {
    setUploadStage('uploading')
    const formData = new FormData()
    formData.append('fichier', file)

    const token = localStorage.getItem('access_token')

    try {
      const resGate1 = await fetch(`${API_BASE_URL}/energy/fichiers-sources/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!resGate1.ok) {
        const err = await resGate1.json()
        throw new Error(err.fichier?.[0] || 'Erreur lors de l’envoi du fichier.')
      }

      const fichierSource = await resGate1.json()
      
      // Étape 2 (Gate 2): Lancer l'OCR et la validation
      setUploadStage('processing')
      const resGate2 = await fetch(`${API_BASE_URL}/energy/imports/${fichierSource.id}/lancer/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const importResult = await resGate2.json()

      setFiles((prev) => [importResult, ...prev])
      setUploadStage('done')
    } catch (error) {
      console.error(error)
      setUploadStage('idle')
      alert(error.message)
    }
  }

  const finishUpload = (callback) => {
    closeUpload()
    if (callback) callback()
  }

  return {
    files,
    uploadOpen,
    uploadStage,
    fileRef,
    openUpload,
    closeUpload,
    processUpload,
    finishUpload,
  }
}