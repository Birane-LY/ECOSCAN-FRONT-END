'use client'

import React from 'react'
import { ArrowUpRight, CloudUpload, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui'
import { DataHealthBanner } from '@/modules/data-center/components/DataHealthBanner'
import { FileSourceList } from '@/modules/data-center/components/FileSourceList'


export function DataCenterView({ files, filesLoading, filesError, openUpload, setDrawer }) {
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

      <DataHealthBanner files={files} />

      <section className="data-section">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">SOURCES RÉCENTES</p>
            <h2>Fichiers importés</h2>
          </div>
          <button className="quiet-button" onClick={() => setDrawer('manage-sources')}>
            Gérer les sources <ArrowUpRight size={14} />
          </button>
        </div>

        {filesLoading && <p className="drawer-lead">Chargement…</p>}
        {filesError && <p className="drawer-lead">Erreur : {filesError}</p>}
        {!filesLoading && !filesError && files.length === 0 && (
          <p className="drawer-lead">Aucun fichier importé pour le moment.</p>
        )}
        <FileSourceList files={files} onSelectFile={(id) => setDrawer(`import-${id}`)} />
      </section>
    </>
  )
}