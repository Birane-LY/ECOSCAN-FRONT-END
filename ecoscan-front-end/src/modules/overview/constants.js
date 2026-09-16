export const CHART_SERIES = [61, 74, 68, 82, 79, 55, 48]

export const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export const DAYS_LONG = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
]

export const SEED_DECISIONS = [
  {
    title: 'Décaler le cycle froid',
    scope: 'Équipement · Zone B',
    impact: '-12%',
    value: '1 240 kWh',
    tagColor: 'lime',
  },
  {
    title: 'Optimiser les veilles',
    scope: 'Bureaux · 18 appareils',
    impact: '-8%',
    value: '820 kWh',
    tagColor: 'copper',
  },
  {
    title: 'Partager le rapport',
    scope: 'Comité de direction',
    impact: 'Nouveau',
    value: '12 min',
    tagColor: 'blue',
  },
]

export const DASHBOARD_WIDGETS = [
  { id: 'briefing', label: 'Briefing du jour' },
  { id: 'chart', label: 'Signal énergétique' },
  { id: 'actions', label: 'Actions prioritaires' },
  { id: 'insight', label: 'Insight IA' },
]
