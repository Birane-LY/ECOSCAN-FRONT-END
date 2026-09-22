import { Building2, CreditCard, Gauge, LifeBuoy, Server, TrendingUp, UserCog, Users } from 'lucide-react'

// Navigation de la console plateforme. Slices utilisés par AdminSidebar :
// 0-3 Plateforme, 3-6 Pilotage, 6+ Opérations. Les 2 dernières (invoices, reminders)
// sont ajoutées séparément sous "Revenus" dans la sidebar.
export const ADMIN_NAV_ITEMS = [
  ['dashboard', 'Tableau de bord', Gauge],
  ['analytics', 'Analytics', TrendingUp],
  ['organizations', 'Organisations', Building2],
  ['billing', 'Facturation', CreditCard],
  ['users', 'Utilisateurs', Users],
  ['team', 'Équipe EcoScan', UserCog],
  ['support', 'Support', LifeBuoy],
  ['system', 'Santé système', Server],
]

export const INITIAL_ORGS = [
  { id: 1, name: 'PME Dakar', sector: 'Boulangerie', email: 'contact@pmedakar.sn', plan: 'Enterprise', users: 14, status: 'Actif', due: '12 sept. 2026' },
  { id: 2, name: 'Sunu Foods', sector: 'Restauration', email: 'admin@sunufoods.sn', plan: 'Enterprise', users: 9, status: 'À valider', due: '18 sept. 2026' },
  { id: 3, name: 'Cabinet Conseil', sector: 'Services', email: 'hello@cabinetconseil.sn', plan: 'Pro', users: 4, status: 'Actif', due: '26 sept. 2026' },
  { id: 4, name: 'Atelier Nord', sector: 'BTP', email: 'contact@ateliernord.sn', plan: 'Pro', users: 6, status: 'Suspendu', due: '02 oct. 2026' },
]

export const INITIAL_PLANS = [
  { id: 1, name: 'Free', price: '0', seats: '5', trial: '—', active: 128, status: 'Actif' },
  { id: 2, name: 'Pro', price: '29 000', seats: '25', trial: '14 jours', active: 214, status: 'Actif' },
  { id: 3, name: 'Enterprise', price: '450 000', seats: 'Illimité', trial: 'Sur devis', active: 42, status: 'Actif' },
]

export const INITIAL_INVOICES = [
  { id: 'FAC-2026-0912', org: 'PME Dakar', amount: '450 000 FCFA', due: '12 sept. 2026', status: 'À encaisser', method: 'Virement' },
  { id: 'FAC-2026-0918', org: 'Sunu Foods', amount: '450 000 FCFA', due: '18 sept. 2026', status: 'En retard', method: 'Carte' },
  { id: 'FAC-2026-0926', org: 'Cabinet Conseil', amount: '29 000 FCFA', due: '26 sept. 2026', status: 'Payée', method: 'Virement' },
]
