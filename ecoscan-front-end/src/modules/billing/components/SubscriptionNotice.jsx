'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, ArrowUpRight, Check, RefreshCw } from 'lucide-react'
import { apiGet, apiPost } from '@/lib/apiClient'

function formatPrice(value, currency = 'XOF') {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return 'Tarif sur demande'
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(amount)} ${currency === 'XOF' ? 'FCFA' : currency}`
}

export function SubscriptionNotice({ role, onAccessGranted }) {
  const [subscription, setSubscription] = useState(null)
  const [plans, setPlans] = useState([])
  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [periodicite, setPeriodicite] = useState('MENSUEL')
  const [loading, setLoading] = useState(true)
  const [plansLoading, setPlansLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [referenceNow, setReferenceNow] = useState(0)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await apiGet('/billing/abonnements/')
      const subscriptions = Array.isArray(result) ? result : result?.results
      if (!Array.isArray(subscriptions)) {
        throw new Error('La réponse des abonnements est invalide.')
      }
      const currentSubscription = subscriptions[0] || null
      setSubscription(currentSubscription)
      setReferenceNow(Date.now())
      if (!currentSubscription) {
        setPlansLoading(true)
        try {
          const availablePlans = await apiGet('/billing/plans/')
          if (!Array.isArray(availablePlans)) {
            throw new Error('La réponse des formules est invalide.')
          }
          setPlans(availablePlans.filter((plan) => plan.actif))
          setSelectedPlanId((currentId) =>
            availablePlans.some((plan) => plan.id === currentId && plan.actif)
              ? currentId
              : availablePlans.find((plan) => plan.actif)?.id || ''
          )
        } finally {
          setPlansLoading(false)
        }
      }
    } catch (loadError) {
      setError(loadError.message || 'Impossible de vérifier votre abonnement.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0)
    return () => window.clearTimeout(timer)
  }, [refresh])

  const startPayment = async () => {
    if (!subscription) return
    setSubmitting(true)
    setActionError('')
    try {
      const origin = window.location.origin
      const checkout = await apiPost(`/billing/abonnements/${subscription.id}/souscrire/`, {
        return_url: `${origin}/`,
        cancel_url: `${origin}/`,
      })
      if (!checkout.checkout_url) {
        throw new Error('Le paiement en ligne n’est pas disponible pour le moment. Contactez EcoScan.')
      }
      window.location.assign(checkout.checkout_url)
    } catch (paymentError) {
      setActionError(paymentError.message || 'Impossible de démarrer le paiement.')
    } finally {
      setSubmitting(false)
    }
  }

  const startTrial = async () => {
    if (!selectedPlanId) return
    setSubmitting(true)
    setActionError('')
    try {
      await apiPost('/billing/abonnements/essai/', { plan_id: selectedPlanId })
      await refresh()
      await onAccessGranted?.()
    } catch (trialError) {
      setActionError(trialError.message || 'Impossible de démarrer l’essai gratuit.')
    } finally {
      setSubmitting(false)
    }
  }

  const startPlanSubscription = async () => {
    if (!selectedPlanId) return
    setSubmitting(true)
    setActionError('')
    try {
      const origin = window.location.origin
      const checkout = await apiPost('/billing/abonnements/souscrire-plan/', {
        plan_id: selectedPlanId,
        periodicite,
        return_url: `${origin}/`,
        cancel_url: `${origin}/`,
      })
      if (!checkout.checkout_url) {
        throw new Error('Le paiement en ligne n’est pas disponible pour le moment. Contactez EcoScan.')
      }
      window.location.assign(checkout.checkout_url)
    } catch (paymentError) {
      setActionError(paymentError.message || 'Impossible de démarrer le paiement.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || (!error && subscription?.statut === 'ACTIVE')) return null

  const echeance = subscription?.statut === 'GRACE_PERIOD'
    ? subscription.fin_grace
    : subscription?.fin_periode
  const joursRestants = echeance
    ? Math.max(0, Math.ceil((new Date(echeance).getTime() - referenceNow) / 86400000))
    : 0
  const essai = subscription?.statut === 'TRIALING'
  const expired = subscription?.statut === 'EXPIRED' || (essai && joursRestants === 0)
  const statutSuspendu = ['SUSPENDED', 'CANCELED'].includes(subscription?.statut)
  const enGrace = ['GRACE_PERIOD', 'PAST_DUE'].includes(subscription?.statut)
  const peutSouscrire = role === 'ADMIN_ORGANISATION'
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId)
  const hasAnnualPrice = selectedPlan?.prix_annuel != null

  return (
    <aside className={`subscription-notice${expired || error || !subscription ? ' is-warning' : ''}`} role={error ? 'alert' : 'status'}>
      <div className="subscription-notice__icon" aria-hidden="true">
        <AlertCircle size={18} />
      </div>
      <div className="subscription-notice__content">
        <strong>
          {error
            ? 'Vérification de l’abonnement impossible'
            : !subscription
              ? 'Aucun essai ou abonnement actif'
              : expired
                ? 'Votre essai gratuit est terminé'
                : statutSuspendu
                  ? 'Votre accès est suspendu'
                  : enGrace
                    ? `Régularisez votre abonnement — ${joursRestants} jour${joursRestants > 1 ? 's' : ''} restant${joursRestants > 1 ? 's' : ''}`
                    : `Essai gratuit — ${joursRestants} jour${joursRestants > 1 ? 's' : ''} restant${joursRestants > 1 ? 's' : ''}`}
        </strong>
        <p>
          {error
            ? error
            : !subscription
              ? 'Connectez-vous avec votre compte existant : aucune nouvelle adresse e-mail ni inscription n’est nécessaire pour souscrire.'
              : (() => {
                  const date = new Date(echeance || subscription.fin_periode)
                  const formatted = Number.isNaN(date.getTime()) ? 'date non disponible' : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date)
                  return `${subscription.plan_nom || 'Votre formule'} · accès jusqu’au ${formatted}.`
                })()}
        </p>
      </div>
      {actionError && <p className="subscription-notice__error" role="alert">{actionError}</p>}
      {error ? (
        <div className="subscription-notice__actions">
          <button type="button" className="secondary-button" onClick={refresh} disabled={loading}>
            <RefreshCw size={15} /> Réessayer
          </button>
        </div>
      ) : !subscription && plans.length > 0 && peutSouscrire ? (
        <div className="subscription-options">
          <label className="subscription-options__field">
            <span>Formule</span>
            <select
              value={selectedPlanId}
              onChange={(event) => {
                setSelectedPlanId(event.target.value)
                setPeriodicite('MENSUEL')
              }}
              disabled={plansLoading || submitting}
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>{plan.nom}</option>
              ))}
            </select>
          </label>
          {selectedPlan && (
            <p className="subscription-options__price">
              {formatPrice(periodicite === 'ANNUEL' && hasAnnualPrice ? selectedPlan.prix_annuel : selectedPlan.prix_mensuel, selectedPlan.devise)}
              {periodicite === 'ANNUEL' && hasAnnualPrice ? ' / an' : ' / mois'}
            </p>
          )}
          {hasAnnualPrice && (
            <label className="subscription-options__field">
              <span>Périodicité</span>
              <select value={periodicite} onChange={(event) => setPeriodicite(event.target.value)} disabled={submitting}>
                <option value="MENSUEL">Mensuelle</option>
                <option value="ANNUEL">Annuelle</option>
              </select>
            </label>
          )}
          <div className="subscription-notice__actions">
            <button type="button" className="primary-button" onClick={startTrial} disabled={submitting || plansLoading || !selectedPlanId}>
              {submitting ? 'Préparation…' : 'Démarrer mon essai gratuit de 14 jours'}
              {!submitting && <Check size={15} />}
            </button>
            <button type="button" className="secondary-button" onClick={startPlanSubscription} disabled={submitting || plansLoading || !selectedPlanId}>
              Souscrire et payer
              {!submitting && <ArrowUpRight size={15} />}
            </button>
          </div>
        </div>
      ) : !subscription && peutSouscrire && !plansLoading ? (
        <div className="subscription-notice__actions">
          <p>Aucune formule n’est disponible pour le moment.</p>
          <button type="button" className="secondary-button" onClick={refresh}>Réessayer</button>
        </div>
      ) : (
        <div className="subscription-notice__actions">
          {subscription && peutSouscrire && (essai || expired || enGrace) ? (
            <button type="button" className="primary-button" onClick={startPayment} disabled={submitting}>
              {submitting ? 'Préparation…' : enGrace ? 'Régulariser l’abonnement' : 'Souscrire à cette formule'}
              {!submitting && <ArrowUpRight size={15} />}
            </button>
          ) : !peutSouscrire ? (
            <p>Demandez à l’administrateur de votre organisation de choisir une formule et de la souscrire.</p>
          ) : statutSuspendu ? (
            <a className="secondary-button" href="mailto:contact@ecoscan.sn">Contacter EcoScan</a>
          ) : null}
        </div>
      )}
      {plansLoading && !subscription && (
        <p className="subscription-options__loading" role="status">Chargement des formules…</p>
      )}
    </aside>
  )
}
