'use client'

import React, { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { APP_CONFIG } from '@/lib/config'
import { useOnboarding } from '@/modules/onboarding/hooks/useOnboarding'

const STEP_LABELS = ['Votre organisation', 'Premier établissement', 'Premier compteur', 'Premier projet (optionnel)']

export function OnboardingWizard({ onComplete }) {
  const { step, saving, error, creerOrganisation, creerSite, creerCompteur, creerFicheProjet, passerEtape } =
    useOnboarding({ onComplete })

  return (
    <main className="auth-shell">
      <section className="auth-visual">
        <div className="brand-row">
          <img className="ecoscan-logo" src={APP_CONFIG?.logoUrl || '/logo.svg'} alt="EcoScan" />
          <span>{APP_CONFIG?.appName || 'EcoScan'}</span>
        </div>
        <p className="eyebrow">CONFIGURATION INITIALE</p>
        <h1>Quelques minutes pour tout préparer.</h1>
        <p>Votre organisation, votre premier site et votre premier compteur — la base sur laquelle EcoScan pourra commencer à analyser vos données.</p>
        <div className="auth-signal">
          <span>
            <strong>Étape {step}/4</strong>
            <small>{STEP_LABELS[step - 1]}</small>
          </span>
        </div>
      </section>

      <section className="auth-card">
        {error && (
          <div className="auth-error-banner" style={{ color: 'var(--copper)', marginBottom: 16, fontSize: 12 }}>
            {error}
          </div>
        )}

        {step === 1 && <EtapeOrganisation saving={saving} onSubmit={creerOrganisation} />}
        {step === 2 && <EtapeSite saving={saving} onSubmit={creerSite} />}
        {step === 3 && <EtapeCompteur saving={saving} onSubmit={creerCompteur} onSkip={passerEtape} />}
        {step === 4 && <EtapeFicheProjet saving={saving} onSubmit={creerFicheProjet} onSkip={passerEtape} />}
      </section>
    </main>
  )
}

function EtapeOrganisation({ saving, onSubmit }) {
  const [nom, setNom] = useState('')
  const [secteur, setSecteur] = useState('')
  const [localisation, setLocalisation] = useState('')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ nom, secteur, localisation }) }}>
      <p className="eyebrow">ÉTAPE 1 SUR 4</p>
      <h2>Votre organisation</h2>
      <p className="auth-muted">Le nom légal ou commercial de votre entreprise.</p>

      <label>
        Nom de l'organisation
        <input value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Ex. Teranga Textiles SARL" />
      </label>
      <label>
        Secteur d'activité
        <input value={secteur} onChange={(e) => setSecteur(e.target.value)} required placeholder="Ex. Textile, agroalimentaire, hôtellerie…" />
      </label>
      <label>
        Localisation
        <input value={localisation} onChange={(e) => setLocalisation(e.target.value)} required placeholder="Ex. Dakar, Sénégal" />
      </label>

      <button type="submit" className="primary-button" disabled={saving}>
        {saving ? 'Création…' : 'Continuer'} <ArrowUpRight size={15} />
      </button>
    </form>
  )
}

function EtapeSite({ saving, onSubmit }) {
  const [nom, setNom] = useState('')
  const [adresse, setAdresse] = useState('')
  const [pays, setPays] = useState('Sénégal')
  const [fuseauHoraire, setFuseauHoraire] = useState('Africa/Dakar')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ nom, adresse, pays, fuseau_horaire: fuseauHoraire }) }}>
      <p className="eyebrow">ÉTAPE 2 SUR 4</p>
      <h2>Votre premier établissement</h2>
      <p className="auth-muted">Un site physique où sont installés vos équipements — vous pourrez en ajouter d'autres plus tard.</p>

      <label>
        Nom du site
        <input value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Ex. Atelier principal" />
      </label>
      <label>
        Adresse
        <input value={adresse} onChange={(e) => setAdresse(e.target.value)} required placeholder="Ex. Zone industrielle, Rue 12" />
      </label>
      <label>
        Pays
        <input value={pays} onChange={(e) => setPays(e.target.value)} required />
      </label>
      <label>
        Fuseau horaire
        <input value={fuseauHoraire} onChange={(e) => setFuseauHoraire(e.target.value)} required />
      </label>

      <button type="submit" className="primary-button" disabled={saving}>
        {saving ? 'Création…' : 'Continuer'} <ArrowUpRight size={15} />
      </button>
    </form>
  )
}

function EtapeCompteur({ saving, onSubmit, onSkip }) {
  const [reference, setReference] = useState('')
  const [typeEnergie, setTypeEnergie] = useState('ELECTRICITE')
  const [unite, setUnite] = useState('kWh')
  const [statutSynchronisation, setStatutSynchronisation] = useState('MANUEL')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ reference, type_energie: typeEnergie, unite, statut_synchronisation: statutSynchronisation }) }}>
      <p className="eyebrow">ÉTAPE 3 SUR 4</p>
      <h2>Votre premier compteur</h2>
      <p className="auth-muted">La référence exacte inscrite sur votre compteur Senelec ou Woyofal.</p>

      <label>
        Référence du compteur
        <input value={reference} onChange={(e) => setReference(e.target.value)} required placeholder="Ex. SN-2024-00123" />
      </label>
      <label>
        Type d'énergie
        <select value={typeEnergie} onChange={(e) => setTypeEnergie(e.target.value)}>
          <option value="ELECTRICITE">Électricité</option>
          <option value="EAU">Eau</option>
          <option value="GAZ">Gaz</option>
        </select>
      </label>
      <label>
        Unité de mesure
        <input value={unite} onChange={(e) => setUnite(e.target.value)} required />
      </label>
      <label>
        Mode de relevé
        <select value={statutSynchronisation} onChange={(e) => setStatutSynchronisation(e.target.value)}>
          <option value="MANUEL">Saisie manuelle (Woyofal)</option>
          <option value="AUTOMATIQUE">Synchronisation automatique</option>
        </select>
      </label>

      <button type="submit" className="primary-button" disabled={saving}>
        {saving ? 'Création…' : 'Continuer'} <ArrowUpRight size={15} />
      </button>
      <button type="button" className="quiet-button" onClick={onSkip}>
        Ajouter un compteur plus tard
      </button>
    </form>
  )
}

function EtapeFicheProjet({ saving, onSubmit, onSkip }) {
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ nom, description }) }}>
      <p className="eyebrow">ÉTAPE 4 SUR 4 · OPTIONNELLE</p>
      <h2>Votre premier projet ou audit</h2>
      <p className="auth-muted">Nécessaire pour générer des objectifs, rapports et bilans financiers — vous pouvez le faire plus tard.</p>

      <label>
        Nom du projet
        <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex. Audit énergétique 2026" />
      </label>
      <label>
        Description
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optionnel" />
      </label>

      <button type="submit" className="primary-button" disabled={saving || !nom}>
        {saving ? 'Création…' : 'Terminer la configuration'} <ArrowUpRight size={15} />
      </button>
      <button type="button" className="quiet-button" onClick={onSkip}>
        Passer cette étape pour l'instant
      </button>
    </form>
  )
}