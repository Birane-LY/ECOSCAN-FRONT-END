import {
  Activity,
  BarChart3,
  Building2,
  CircleDollarSign,
  Headphones,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from 'lucide-react'

export const ADMIN_NAV_ITEMS = [
  ['dashboard', 'Vue globale', LayoutDashboard],
  ['organizations', 'Organisations', Building2],
  ['users', 'Utilisateurs', Users],
  ['analytics', 'Analytics', BarChart3],
  ['support', 'Support', Headphones],
  ['billing', 'Billing & plans', CircleDollarSign],
  ['system', 'Système', Activity],
  ['team', 'Équipe EcoScan', ShieldCheck],
]

export const INITIAL_ORGS = [
  {
    id: 1,
    name: 'PME Dakar',
    sector: 'Industrie',
    plan: 'Enterprise',
    users: 42,
    status: 'À valider',
    email: 'admin@pmedakar.sn',
    due: '12 sept. 2026',
  },
  {
    id: 2,
    name: 'Cabinet Conseil',
    sector: 'Services',
    plan: 'Pro',
    users: 18,
    status: 'Actif',
    email: 'hello@cabinet.sn',
    due: '26 sept. 2026',
  },
  {
    id: 3,
    name: 'Atelier Nord',
    sector: 'Retail',
    plan: 'Pro',
    users: 9,
    status: 'Actif',
    email: 'admin@atelier.sn',
    due: '03 oct. 2026',
  },
  {
    id: 4,
    name: 'Sunu Foods',
    sector: 'Agroalimentaire',
    plan: 'Enterprise',
    users: 63,
    status: 'Essai',
    email: 'it@sunufoods.sn',
    due: '18 sept. 2026',
  },
]

export const INITIAL_PLANS = [
  { id: 1, name: 'Free', price: '0', seats: '5', active: 109, status: 'Actif', trial: '14 jours' },
  { id: 2, name: 'Pro', price: '29 000', seats: '25', active: 286, status: 'Actif', trial: '14 jours' },
  { id: 3, name: 'Enterprise', price: '450 000', seats: 'Illimité', active: 92, status: 'Actif', trial: '30 jours' },
]

export const INITIAL_INVOICES = [
  {
    id: 'INV-2026-0912',
    org: 'PME Dakar',
    amount: '450 000 FCFA',
    due: '12 sept.',
    status: 'À relancer',
    method: 'Virement',
  },
  {
    id: 'INV-2026-0908',
    org: 'Cabinet Conseil',
    amount: '29 000 FCFA',
    due: '26 sept.',
    status: 'Payée',
    method: 'Carte',
  },
  {
    id: 'INV-2026-0903',
    org: 'Sunu Foods',
    amount: '450 000 FCFA',
    due: '18 sept.',
    status: 'Échec paiement',
    method: 'Carte',
  },
]
