'use client'

import React, { useState } from 'react'
import { Check, X } from 'lucide-react'
import {
  INITIAL_PLANS,
  INITIAL_INVOICES,
  ADMIN_NAV_ITEMS,
} from '../constants'
import { useOrganisations } from '@/modules/platform-admin/hooks/useOrganisations'
import { AdminSidebar } from '@/modules/platform-admin/components/layout/AdminSidebar'
import { AdminTopbar } from '@/modules/platform-admin/components/layout/AdminTopbar'
import { AdminChatDrawer } from '@/modules/platform-admin/components/layout/AdminChatDrawer'
import { OrgModal } from '@/modules/platform-admin/components/modals/OrgModal'
import { PlanModal } from '@/modules/platform-admin/components/modals/PlanModal'
import { ReminderModal } from '@/modules/platform-admin/components/modals/ReminderModal'
import { InvoiceModal } from '@/modules/platform-admin/components/modals/InvoiceModal'
import { AdminDashboardView } from '@/modules/platform-admin/components/views/AdminDashboardView'
import { OrganizationsView } from '@/modules/platform-admin/components/views/OrganizationsView'
import { BillingView } from '@/modules/platform-admin/components/views/BillingView'
import { InvoicesView } from '@/modules/platform-admin/components/views/InvoicesView'
import { RemindersView } from '@/modules/platform-admin/components/views/RemindersView'
import { SystemHealthView } from '@/modules/platform-admin/components/views/SystemHealthView'
import { PlatformTableView } from '@/modules/platform-admin/components/views/PlatformTableView'

export function PlatformAdminView() {
  const [view, setView] = useState('dashboard')
  const [drawer, setDrawer] = useState(false)
  const [toast, setToast] = useState('')
  const {
    organisations,
    loading: orgsLoading,
    error: orgsError,
    creer: creerOrganisation,
    modifierInfos: modifierOrganisation,
    activer: activerOrganisation,
    suspendre: suspendreOrganisation,
  } = useOrganisations()
  const [plans, setPlans] = useState(INITIAL_PLANS)
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [modalSubmitting, setModalSubmitting] = useState(false)
  const [modalError, setModalError] = useState(null)
  const [chat, setChat] = useState(false)
  const [messages, setMessages] = useState([
    'Bonjour Camille. Je peux vous aider avec les organisations, la facturation ou les relances.',
  ])
  const [message, setMessage] = useState('')

  const notify = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2600)
  }

  const select = (v) => {
    setView(v)
    setDrawer(false)
  }

  const allNavMap = [
    ...ADMIN_NAV_ITEMS,
    ['invoices', 'Factures mensuelles'],
    ['reminders', 'Centre de relances'],
  ]
  const title = allNavMap.find((x) => x[0] === view)?.[1] || 'Vue globale'

  const sendChat = () => {
    if (!message.trim()) return
    const q = message.trim()
    setMessages((m) => [
      ...m,
      q,
      'Je vérifie cela dans la console. Pour les opérations sensibles, ouvrez la vue concernée afin de confirmer l’action.',
    ])
    setMessage('')
  }

  const openModal = (m, e = null) => {
    setEditing(e)
    setModal(m)
    setModalError(null)
  }

  const closeModal = () => {
    setModal(null)
    setEditing(null)
    setModalError(null)
  }

  const handleOrgSubmit = async (d) => {
    setModalSubmitting(true)
    setModalError(null)
    try {
      if (editing) {
        await modifierOrganisation(editing.id, d)
        notify('Organisation mise à jour')
      } else {
        await creerOrganisation(d)
        notify('Organisation créée')
      }
      closeModal()
    } catch (err) {
      setModalError(err.message)
    } finally {
      setModalSubmitting(false)
    }
  }

  return (
    <main className="admin-shell">
      <AdminSidebar
        drawer={drawer}
        setDrawer={setDrawer}
        view={view}
        select={select}
      />

      <section className="admin-main">
        <AdminTopbar
          title={title}
          setDrawer={setDrawer}
          setChat={setChat}
          notify={notify}
        />

        <div className="admin-content">
          {view === 'dashboard' && (
            <AdminDashboardView select={select} notify={notify} />
          )}
          {view === 'analytics' && (
            <AdminDashboardView select={select} notify={notify} analytics />
          )}
          {view === 'organizations' && (
            <OrganizationsView
              organisations={organisations}
              loading={orgsLoading}
              error={orgsError}
              activer={activerOrganisation}
              suspendre={suspendreOrganisation}
              selectOrg={setSelectedOrg}
              selectedOrg={selectedOrg}
              openModal={openModal}
              notify={notify}
            />
          )}
          {view === 'billing' && (
            <BillingView
              plans={plans}
              setPlans={setPlans}
              openModal={openModal}
              notify={notify}
            />
          )}
          {view === 'invoices' && (
            <InvoicesView
              invoices={invoices}
              setInvoices={setInvoices}
              notify={notify}
              openModal={openModal}
            />
          )}
          {view === 'reminders' && (
            <RemindersView
              orgs={organisations}
              notify={notify}
              openModal={openModal}
            />
          )}
          {view === 'users' && (
            <PlatformTableView
              title="Utilisateurs"
              eyebrow="IDENTITY OPERATIONS"
              subtitle="Gérez les accès et les rôles des espaces clients."
              columns={['Utilisateur', 'Organisation', 'Rôle', 'Dernière activité']}
              rows={[
                'Awa Diop · PME Dakar · Admin · Aujourd’hui',
                'Moussa Fall · Sunu Foods · Éditeur · Hier',
                'Ndeye Kane · Cabinet Conseil · Lecteur · 03 sept.',
              ]}
              notify={notify}
            />
          )}
          {view === 'support' && (
            <PlatformTableView
              title="Support"
              eyebrow="CUSTOMER OPERATIONS"
              subtitle="Suivez les demandes et priorités de vos organisations."
              columns={['Ticket', 'Organisation', 'Priorité', 'Statut']}
              rows={[
                '#2841 · PME Dakar · Urgente · Ouvert',
                '#2838 · Atelier Nord · Haute · En cours',
                '#2829 · Sunu Foods · Normale · Résolu',
              ]}
              notify={notify}
            />
          )}
          {view === 'system' && <SystemHealthView notify={notify} />}
          {view === 'team' && (
            <PlatformTableView
              title="Équipe EcoScan"
              eyebrow="ACCESS CONTROL"
              subtitle="Gérez les membres qui administrent la plateforme."
              columns={['Membre', 'Rôle', 'Accès', 'Statut']}
              rows={[
                'Camille Martin · Super Admin · Toutes les zones · Actif',
                'Ousmane Diop · Support · Organisations, tickets · Actif',
                'Fatou Ndiaye · Finance · Billing, factures · Actif',
              ]}
              notify={notify}
            />
          )}
        </div>
      </section>

      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <small className="eyebrow">WORKFLOW OPÉRATIONNEL</small>
                <h2>
                  {modal === 'org'
                    ? editing
                      ? 'Modifier l’organisation'
                      : 'Créer une organisation'
                    : modal === 'plan'
                    ? editing
                      ? 'Modifier le plan'
                      : 'Créer un plan'
                    : modal === 'invoice'
                    ? 'Détail de facture'
                    : 'Programmer une relance'}
                </h2>
              </div>
              <button className="icon-button" onClick={closeModal} aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
            {modal === 'org' && (
              <OrgModal
                initial={editing}
                submitting={modalSubmitting}
                error={modalError}
                onSubmit={handleOrgSubmit}
              />
            )}
            {modal === 'plan' && (
              <PlanModal
                initial={editing}
                onSubmit={(d) => {
                  if (editing) {
                    setPlans(plans.map((p) => (p.id === editing.id ? { ...p, ...d } : p)))
                  } else {
                    setPlans([
                      ...plans,
                      { ...d, id: Date.now(), active: 0, status: 'Actif' },
                    ])
                  }
                  closeModal()
                  notify('Plan enregistré')
                }}
              />
            )}
            {modal === 'invoice' && (
              <InvoiceModal
                invoice={editing}
                setInvoices={setInvoices}
                notify={notify}
                close={closeModal}
              />
            )}
            {modal === 'reminder' && (
              <ReminderModal
                orgs={organisations}
                notify={notify}
                close={closeModal}
              />
            )}
          </div>
        </div>
      )}

      {chat && (
        <AdminChatDrawer
          messages={messages}
          message={message}
          setMessage={setMessage}
          send={sendChat}
          close={() => setChat(false)}
          clear={() => setMessages([])}
        />
      )}

      {toast && (
        <div className="admin-toast">
          <Check size={14} />
          {toast}
        </div>
      )}
    </main>
  )
}