'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { AppShell } from '@/components/layout'
import { ADMIN_NAV_ITEMS } from './constants'
import { AdminSidebar } from './components/layout/AdminSidebar'
import { AdminTopbar } from './components/layout/AdminTopbar'
import { AdminChatDrawer } from './components/layout/AdminChatDrawer'
import { OrgModal } from './components/modals/OrgModal'
import { PlanModal } from './components/modals/PlanModal'
import { InvoiceModal } from './components/modals/InvoiceModal'
import { ReminderModal } from './components/modals/ReminderModal'
import { BillingView } from './components/views/BillingView'
import { InvoicesView } from './components/views/InvoicesView'
import { RemindersView } from './components/views/RemindersView'
import { AdminDashboardView } from './components/views/AdminDashboardView'
import { OrganizationsView } from './components/views/OrganizationsView'
import { SystemHealthView } from './components/views/SystemHealthView'
import { PlatformTableView } from './components/views/PlatformTableView'
import {apiClient} from '@/lib/apiClient'

const MODAL_TITLES = {
  org: (editing) => (editing ? 'Modifier l’organisation' : 'Créer une organisation'),
  plan: (editing) => (editing ? 'Modifier le plan' : 'Créer un plan'),
  invoice: (editing) => (editing ? 'Détail de facture' : 'Nouvelle facture'),
  reminder: () => 'Programmer une relance',
}

export function PlatformAdminView() {
  const router = useRouter()
  const [view, setView] = useState('dashboard')
  const [drawer, setDrawer] = useState(false)
  const [dark, setDark] = useState(false)
  const [toast, setToast] = useState('')

  // États dynamiques provenant du Backend
  const [userProfile, setUserProfile] = useState(null)
  const [orgs, setOrgs] = useState([])
  const [plans, setPlans] = useState([])
  const [invoices, setInvoices] = useState([])
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedOrg, setSelectedOrg] = useState(null)
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [chat, setChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const notify = (text) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2600)
  }

  // 1. Déconnexion 
const handleLogout = useCallback(() => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }
  setUserProfile(null)
  router.push('/') 
}, [router])

// 2. Chargement des données
const fetchAdminData = useCallback(async () => {
  setLoading(true)
  try {
    // Récupération du profil
    let profileData = null
    try {
      const res = await apiClient.get('/membres/me/')
      profileData = res.data
    } catch (err) {
      // On vérifie si c'est réellement une erreur d'authentification (401)
      if (err.response?.status === 401) {
        handleLogout()
        return
      }
      console.warn('Erreur lors de la récupération du profil :', err)
    }

    if (profileData) {
      setUserProfile(profileData)
    }

    // La pagination DRF ({ results: [...] }) est déjà dépliée par apiClient,
    // donc res.data est toujours le tableau attendu ici (ou [] en secours).
    const [orgsRes, invoicesRes, plansRes, usersRes] = await Promise.all([
      apiClient.get('/organisations/structures/').catch(() => ({ data: [] })),
      apiClient.get('/billing/invoices/').catch(() => ({ data: [] })),
      apiClient.get('/billing/plans/').catch(() => ({ data: [] })),
      apiClient.get('/membres/').catch(() => ({ data: [] })),
    ])
    setOrgs(Array.isArray(orgsRes?.data) ? orgsRes.data : [])
    setInvoices(Array.isArray(invoicesRes?.data) ? invoicesRes.data : [])
    setPlans(Array.isArray(plansRes?.data) ? plansRes.data : [])
    setUsersList(Array.isArray(usersRes?.data) ? usersRes.data : [])

  } catch (err) {
    notify('Erreur lors du chargement des données')
  } finally {
    setLoading(false)
  }
}, [handleLogout])

  useEffect(() => {
    fetchAdminData()
  }, [fetchAdminData])

  const select = (v) => {
    setView(v)
    setDrawer(false)
  }

  const allNavMap = [...ADMIN_NAV_ITEMS, ['invoices', 'Factures mensuelles'], ['reminders', 'Centre de relances']]
  const title = allNavMap.find((x) => x[0] === view)?.[1] || 'Vue globale'

  const sendChat = async () => {
    if (!message.trim()) return
    const q = message.trim()
    setMessages((m) => [...m, { sender: 'user', text: q }])
    setMessage('')

    try {
      const res = await apiClient.post('/analyses/ai-chat/', { prompt: q })
      setMessages((m) => [...m, { sender: 'ai', text: res.data.response || 'Action prise en compte.' }])
    } catch {
      setMessages((m) => [...m, { sender: 'ai', text: 'Impossible de contacter l’assistant pour le moment.' }])
    }
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
        <AdminSidebar
          drawer={drawer}
          setDrawer={setDrawer}
          view={view}
          select={select}
          userProfile={userProfile}
          onLogout={handleLogout}
        />

        <section className="adm-main">
          <AdminTopbar
            title={title}
            setDrawer={setDrawer}
            setChat={setChat}
            notify={notify}
            dark={dark}
            setDark={setDark}
            userProfile={userProfile}
          />

          <div className="adm-content">
            {loading ? (
              <div className="p-6 text-center">Chargement des données de la plateforme...</div>
            ) : (
              <>
                {view === 'dashboard' && <AdminDashboardView select={select} notify={notify} />}
                {view === 'analytics' && <AdminDashboardView select={select} notify={notify} analytics />}
                {view === 'organizations' && (
                  <OrganizationsView
                    orgs={orgs}
                    setOrgs={setOrgs}
                    selectOrg={setSelectedOrg}
                    selectedOrg={selectedOrg}
                    openModal={openModal}
                    notify={notify}
                  />
                )}
                {view === 'billing' && <BillingView plans={plans} setPlans={setPlans} openModal={openModal} notify={notify} />}
                {view === 'invoices' && <InvoicesView invoices={invoices} setInvoices={setInvoices} notify={notify} openModal={openModal} />}
                {view === 'reminders' && <RemindersView orgs={orgs} notify={notify} openModal={openModal} />}
                {view === 'users' && (
                  <PlatformTableView
                    title="Utilisateurs"
                    subtitle="Gérez les accès et les rôles des espaces clients."
                    columns={['Utilisateur', 'Organisation', 'Rôle', 'Dernière activité']}
                    rows={usersList.map((u) => `${u.nom || u.full_name || u.email} · ${u.org_name || '-'} · ${u.role || '-'} · ${u.last_active || '-'}`)}
                    notify={notify}
                  />
                )}
                {view === 'system' && <SystemHealthView notify={notify} />}
              </>
            )}
          </div>
        </section>

        {modal && (
          <div className="modal-backdrop" onClick={closeModal}>
            <section
              className="admin-modal form-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="adm-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="form-modal-head">
                <h2 id="adm-modal-title">{MODAL_TITLES[modal]?.(editing) || 'Action'}</h2>
                <button type="button" className="icon-button" onClick={closeModal} aria-label="Fermer">
                  <X size={18} />
                </button>
              </div>

              {modal === 'org' && (
                <OrgModal
                  initial={editing}
                  onSubmit={async (d) => {
                    try {
                      if (editing) {
                        const res = await apiClient.patch(`/organisations/structures/${editing.id}/`, d)
                        setOrgs(orgs.map((o) => (o.id === editing.id ? res.data : o)))
                      } else {
                        const res = await apiClient.post('/organisations/structures/', d)
                        setOrgs([...orgs, res.data])
                      }
                      notify('Organisation enregistrée')
                      closeModal()
                    } catch {
                      notify('Erreur lors de l’enregistrement')
                    }
                  }}
                />
              )}

              {modal === 'plan' && (
                <PlanModal
                  initial={editing}
                  onSubmit={async (d) => {
                    try {
                      if (editing) {
                        const res = await apiClient.patch(`/billing/plans/${editing.id}/`, d)
                        setPlans(plans.map((p) => (p.id === editing.id ? res.data : p)))
                      } else {
                        const res = await apiClient.post('/billing/plans/', d)
                        setPlans([...plans, res.data])
                      }
                      notify('Plan enregistré')
                      closeModal()
                    } catch (err) {
                      notify(err.message || 'Erreur lors de l’enregistrement du plan')
                    }
                  }}
                />
              )}

              {modal === 'invoice' && (
                <InvoiceModal invoice={editing} orgs={orgs} setInvoices={setInvoices} notify={notify} close={closeModal} />
              )}

              {modal === 'reminder' && (
                <ReminderModal orgs={orgs} notify={notify} close={closeModal} />
              )}
            </section>
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
          <div className="action-toast" role="status">
            <Check size={15} />
            <span>{toast}</span>
          </div>
        )}
      </div>
    </AppShell>
  )
}