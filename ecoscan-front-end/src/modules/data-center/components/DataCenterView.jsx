'use client'

import React from 'react'
import { ArrowUpRight, CloudUpload, Gauge } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusChip } from '@/components/ui/StatusChip'
import { DataHealthBanner } from '@/modules/data-center/components/DataHealthBanner'
import { FileSourceList } from '@/modules/data-center/components/FileSourceList'
import { useCompteur } from '@/modules/business-tools/hooks/useCompteur'
import { useDonneesEnergetiques } from '@/modules/business-tools/hooks/useDonneesEnergetiques'

// `statut_validation` renvoyé par DonneeEnergetiqueViewSet — mappé vers les
// mêmes libellés que StatusChip affiche ailleurs dans l'app.
const STATUT_LABELS = {
  EN_ATTENTE: 'En attente',
  VALIDE: 'Validé',
  REJETE: 'Rejeté',
}

export function DataCenterView({ files, filesLoading, filesError, openUpload, setDrawer }) {
  // Un relevé Woyofal (ou tout autre relevé manuel) est une DonneeEnergetique,
  // pas un FichierSource — il ne peut donc jamais apparaître dans la liste
  // "Fichiers importés" ci-dessous, qui interroge une ressource différente.
  // Cette section interroge la bonne ressource pour que ces relevés soient
  // réellement visibles ici, comme attendu.
  const { compteur } = useCompteur()
  const { donnees, loading: donneesLoading, error: donneesError } = useDonneesEnergetiques(compteur?.id)

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

        {donneesLoading && <p className="drawer-lead">Chargement…</p>}
        {donneesError && <p className="drawer-lead">Erreur : {donneesError}</p>}
        {!donneesLoading && !donneesError && donnees.length === 0 && (
          <p className="dec-empty">Aucun relevé manuel pour le moment. Vos saisies Woyofal apparaîtront ici.</p>
        )}
        {donnees.length > 0 && (
          <div className="dc-list">
            {donnees.map((d) => (
              <div className="dc-row" key={d.id}>
                <span className="dc-file-icon">
                  <Gauge size={18} />
                </span>
                <span className="dc-file-name">
                  <strong>{d.valeur} {d.unite}</strong>
                  <small>{d.source || 'Relevé manuel'}</small>
                </span>
                <StatusChip status={STATUT_LABELS[d.statut_validation] || d.statut_validation} />
                <span className="dc-file-time">
                  {d.periode_fin ? new Date(d.periode_fin).toLocaleString('fr-FR') : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}