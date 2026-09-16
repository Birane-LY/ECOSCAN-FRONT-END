'use client'

import React from 'react'
import { ArrowUpRight, CloudUpload, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui'
import { DataHealthBanner } from '@/modules/data-center/components/DataHealthBanner'
import { FileSourceList } from '@/modules/data-center/components/FileSourceList'
import { UploadModal } from '@/modules/data-center/components/UploadModal'
import { useDataSources } from '@/modules/data-center/hooks/useDataSource'
import { useFileSources } from '@/modules/data-center/hooks/useFileSources'

export function DataCenterView({ setDrawer }) {
  const { files: liveFiles, reload } = useFileSources()
  const {
    uploadOpen, uploadStage, fileRef,
    openUpload, closeUpload, processUpload, finishUpload,
  } = useDataSources()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) processUpload(file)
  }

  const handleFinish = () => {
    finishUpload(() => reload()) // recharge la vraie liste après l'import
  }

  return (
    <>
      <PageHeader
        eyebrow="CENTRE DE DONNÉES"
        title="Vos données, au bon endroit."
        subtitle="Une source fiable pour chaque décision énergétique."
        action={
          <button className="primary-button" onClick={openUpload}>
            <CloudUpload size={17} />
            Importer une source
          </button>
        }
      />

      <DataHealthBanner />

      <section className="data-section">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">SOURCES RÉCENTES</p>
            <h2>Fichiers importés</h2>
          </div>
          <button className="quiet-button">
            Gérer les sources <ArrowUpRight size={14} />
          </button>
        </div>

        <FileSourceList files={liveFiles} onSelectFile={(id) => setDrawer(`import-${id}`)} />
      </section>

      <section className="drop-banner" onClick={openUpload}>
        <CloudUpload size={20} />
        <div>
          <strong>Ajoutez une nouvelle source</strong>
          <span>CSV, XLSX ou JSON · déposez vos fichiers ici</span>
        </div>
        <Plus size={18} />
      </section>

      {uploadOpen && (
        <UploadModal
          stage={uploadStage}
          fileRef={fileRef}
          onProcess={handleFileChange}
          onFinish={handleFinish}
          onClose={closeUpload}
        />
      )}
    </>
  )
}