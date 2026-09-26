'use client'

import React from 'react'
import { ArrowUpRight, CloudUpload, Gauge } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataHealthBanner } from '@/modules/data-center/components/DataHealthBanner'
import { FileSourceList } from '@/modules/data-center/components/FileSourceList'
import { useReleves } from '@/modules/data-center/hooks/useReleves'

export function DataCenterView({ files, filesLoading, filesError, openUpload, setDrawer }) {
  // Les soldes et recharges Woyofal ne sont pas des FichierSource (liste ci-dessus)
  // ni des index de compteur : ils sont lus directement à la source.
  const { entrees, loading: relevesLoading, error: relevesError } = useReleves()

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

      <section className="dc-section glass">
        <div className="panel-top">
          <h2>Relevés manuels récents</h2>
          <button className="quiet-button" onClick={() => setDrawer('woyofal')}>
            Saisir un relevé <ArrowUpRight size={15} />
          </button>
        </div>

        {relevesLoading && <p className="drawer-lead">Chargement…</p>}
        {relevesError && <p className="drawer-lead">Erreur : {relevesError}</p>}
        {!relevesLoading && !relevesError && entrees.length === 0 && (
          <p className="dec-empty">
            Aucun relevé manuel pour le moment. Saisissez vos index par créneau, ou le solde de votre compteur Woyofal chaque jour : c’est ce qui
            permet à EcoScan de mesurer votre consommation et de repérer une dérive.
          </p>
        )}
        {entrees.length > 0 && (
          <div className="dc-list">
            {entrees.map((e) => (
              <div className="dc-row" key={e.id}>
                <span className="dc-file-icon">
                  <Gauge size={18} />
                </span>
                <span className="dc-file-name">
                  <strong>{e.titre}</strong>
                  <small>{e.detail}</small>
                </span>
                {e.statut && <StatusChip status={e.statut} />}
                <span className="dc-file-time">{e.date ? new Date(e.date).toLocaleString('fr-FR') : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
