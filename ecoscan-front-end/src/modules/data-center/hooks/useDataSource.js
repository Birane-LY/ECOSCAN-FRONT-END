'use client'

import { useState, useRef, useCallback } from 'react'
import { SEED_FILES } from '../constants'

export function useDataSources() {
  const [files, setFiles] = useState(SEED_FILES)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadStage, setUploadStage] = useState(0)
  const fileRef = useRef(null)

  const openUpload = useCallback(() => {
    setUploadOpen(true)
    setUploadStage(0)
  }, [])

  const closeUpload = useCallback(() => {
    setUploadOpen(false)
    setUploadStage(0)
  }, [])

  const processUpload = useCallback(() => {
    setUploadStage(1)
    window.setTimeout(() => setUploadStage(2), 700)
    window.setTimeout(() => setUploadStage(3), 1600)
  }, [])

  const finishUpload = useCallback((onFinished) => {
    setFiles((current) => [
      {
        name: 'nouvelle_source_energie.csv',
        kind: 'CSV',
        rows: '1 284',
        status: 'Synchronisé',
        time: 'À l’instant',
      },
      ...current,
    ])
    setUploadOpen(false)
    setUploadStage(0)
    if (onFinished) onFinished()
  }, [])

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
