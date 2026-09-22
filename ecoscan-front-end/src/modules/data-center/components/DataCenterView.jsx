'use client'

import React from 'react'
import { ArrowUpRight, CloudUpload } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataHealthBanner } from '@/modules/data-center/components/DataHealthBanner'
import { FileSourceList } from '@/modules/data-center/components/FileSourceList'

export function DataCenterView({ files, filesLoading, filesError, openUpload, setDrawer }) {
  return (
    <div className="dc">
      <PageHeader
        title="Vos données, au bon endroit."
        subtitle="Une source fiable pour chaque décision énergétique."
        action={
          <button className="primary-button" onClick={openUpload}>
            <CloudUpload size={17} />
            Importer une source
          </button>
        }
      />

      <DataHealthBanner files={files} />

      <section className="dc-section glass">
        <div className="panel-top">
          <h2>Fichiers importés</h2>
          <button className="quiet-button" onClick={() => setDrawer('manage-sources')}>
            Gérer les sources <ArrowUpRight size={15} />
          </button>
        </div>

        {filesLoading && <p className="drawer-lead">Chargement…</p>}
        {filesError && <p className="drawer-lead">Erreur : {filesError}</p>}
        {!filesLoading && !filesError && files.length === 0 && (
          <p className="dec-empty">Aucun fichier importé. Déposez un relevé ou une facture pour lancer une première analyse.</p>
        )}
        <FileSourceList files={files} onSelectFile={(id) => setDrawer(`import-${id}`)} />
      </section>
    </div>
  )
}
