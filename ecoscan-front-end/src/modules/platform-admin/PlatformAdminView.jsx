'use client'

import React, { useState } from 'react'
import { Check, X } from 'lucide-react'
import { AppShell } from '@/components/layout'
import { INITIAL_ORGS, INITIAL_PLANS, INITIAL_INVOICES, ADMIN_NAV_ITEMS } from './constants'
import { AdminSidebar } from './components/layout/AdminSidebar'
import { AdminTopbar } from './components/layout/AdminTopbar'
import { AdminChatDrawer } from './components/layout/AdminChatDrawer'
import { OrgModal } from './components/modals/OrgModal'
import { PlanModal } from './components/modals/PlanModal'
import { ReminderModal } from './components/modals/ReminderModal'
import { InvoiceModal } from './components/modals/InvoiceModal'
import { AdminDashboardView } from './components/views/AdminDashboardView'
import { OrganizationsView } from './components/views/OrganizationsView'
import { BillingView } from './components/views/BillingView'
import { InvoicesView } from './components/views/InvoicesView'
import { RemindersView } from './components/views/RemindersView'
import { SystemHealthView } from './components/views/SystemHealthView'
import { PlatformTableView } from './components/views/PlatformTableView'

const MODAL_TITLES = {
  org: (editing) => (editing ? 'Modifier l’organisation' : 'Créer une organisation'),
  plan: (editing) => (editing ? 'Modifier le plan' : 'Créer un plan'),
  invoice: () => 'Détail de facture',
  reminder: () => 'Programmer une relance',
}

export function PlatformAdminView() {
  const [view, setView] = useState('dashboard')
  const [drawer, setDrawer] = useState(false)
  const [dark, setDark] = useState(false)
  const [toast, setToast] = useState('')
  const [orgs, setOrgs] = useState(INITIAL_ORGS)
  const [plans, setPlans] = useState(INITIAL_PLANS)
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [chat, setChat] = useState(false)
  const [messages, setMessages] = useState(['Bonjour Camille. Je peux vous aider avec les organisations, la facturation ou les relances.'])
  const [message, setMessage] = useState('')

  const notify = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2600)
  }
  const select = (v) => {
    setView(v)
    setDrawer(false)
  }
  const allNavMap = [...ADMIN_NAV_ITEMS, ['invoices', 'Factures mensuelles'], ['reminders', 'Centre de relances']]
  const title = allNavMap.find((x) => x[0] === view)?.[1] || 'Vue globale'

  const sendChat = () => {
    if (!message.trim()) return
    const q = message.trim()
    setMessages((m) => [...m, q, 'Je vérifie cela dans la console. Pour les opérations sensibles, ouvrez la vue concernée afin de confirmer l’action.'])
    setMessage('')
  }
  const openModal = (m, e = null) => {
    setEditing(e)
    setModal(m)
  }
  const closeModal = () => {
    setModal(null)
    setEditing(null)
  }

  return (
    <AppShell darkMode={dark}>
      <div className="adm">
        <AdminSidebar drawer={drawer} setDrawer={setDrawer} view={view} select={select} />

        <section className="adm-main">
          <AdminTopbar title={title} setDrawer={setDrawer} setChat={setChat} notify={notify} dark={dark} setDark={setDark} />

          <div className="adm-content">
            {view === 'dashboard' && <AdminDashboardView select={select} notify={notify} />}
            {view === 'analytics' && <AdminDashboardView select={select} notify={notify} analytics />}
            {view === 'organizations' && (
              <OrganizationsView orgs={orgs} setOrgs={setOrgs} selectOrg={setSelectedOrg} selectedOrg={selectedOrg} openModal={openModal} notify={notify} />
            )}
            {view === 'billing' && <BillingView plans={plans} setPlans={setPlans} openModal={openModal} notify={notify} />}
            {view === 'invoices' && <InvoicesView invoices={invoices} setInvoices={setInvoices} notify={notify} openModal={openModal} />}
            {view === 'reminders' && <RemindersView orgs={orgs} notify={notify} openModal={openModal} />}
            {view === 'users' && (
              <PlatformTableView
                title="Utilisateurs"
                subtitle="Gérez les accès et les rôles des espaces clients."
                columns={['Utilisateur', 'Organisation', 'Rôle', 'Dernière activité']}
                rows={['Awa Diop · PME Dakar · Admin · Aujourd’hui', 'Moussa Fall · Sunu Foods · Éditeur · Hier', 'Ndeye Kane · Cabinet Conseil · Lecteur · 03 sept.']}
                notify={notify}
              />
            )}
            {view === 'support' && (
              <PlatformTableView
                title="Support"
                subtitle="Suivez les demandes et priorités de vos organisations."
                columns={['Ticket', 'Organisation', 'Priorité', 'Statut']}
                rows={['#2841 · PME Dakar · Urgente · Ouvert', '#2838 · Atelier Nord · Haute · En cours', '#2829 · Sunu Foods · Normale · Résolu']}
                notify={notify}
              />
            )}
            {view === 'system' && <SystemHealthView notify={notify} />}
            {view === 'team' && (
              <PlatformTableView
                title="Équipe EcoScan"
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
            <section className="admin-modal form-modal" role="dialog" aria-modal="true" aria-labelledby="adm-modal-title" onClick={(e) => e.stopPropagation()}>
              <div className="form-modal-head">
                <h2 id="adm-modal-title">{MODAL_TITLES[modal]?.(editing) || 'Action'}</h2>
                <button type="button" className="icon-button" onClick={closeModal} aria-label="Fermer">
                  <X size={18} />
                </button>
              </div>

              {modal === 'org' && (
                <OrgModal
                  initial={editing}
                  onSubmit={(d) => {
                    if (editing) setOrgs(orgs.map((o) => (o.id === editing.id ? { ...o, ...d } : o)))
                    else setOrgs([...orgs, { ...d, id: Date.now(), users: 1, status: 'À valider' }])
                    closeModal()
                    notify('Organisation enregistrée')
                  }}
                />
              )}
              {modal === 'plan' && (
                <PlanModal
                  initial={editing}
                  onSubmit={(d) => {
                    if (editing) setPlans(plans.map((p) => (p.id === editing.id ? { ...p, ...d } : p)))
                    else setPlans([...plans, { ...d, id: Date.now(), active: 0, status: 'Actif' }])
                    closeModal()
                    notify('Plan enregistré')
                  }}
                />
              )}
              {modal === 'invoice' && <InvoiceModal invoice={editing} setInvoices={setInvoices} notify={notify} close={closeModal} />}
              {modal === 'reminder' && <ReminderModal orgs={orgs} notify={notify} close={closeModal} />}
            </section>
          </div>
        )}

        {chat && <AdminChatDrawer messages={messages} message={message} setMessage={setMessage} send={sendChat} close={() => setChat(false)} clear={() => setMessages([])} />}

        {toast && (
          <div className="action-toast" role="status">
            <Check size={15} />
            <span>{toast}</span>
          </div>
        )}
      </div>
    </AppShell>
  )
}
