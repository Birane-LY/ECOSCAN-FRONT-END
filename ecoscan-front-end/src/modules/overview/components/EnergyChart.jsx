import React from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

export function EnergyChart({
  // Métriques textuelles & KPIs
  kicker = "SIGNAL ÉNERGÉTIQUE",
  title = "Votre énergie, en mouvement",
  totalConsumption = "18 426",
  unit = "kWh",
  trend = "↓ 14,2%",
  trendLabel = "vs. période précédente",

  // Gestion des périodes
  period = "7d",
  setPeriod,
  periods = [
    { id: '7d', label: '7 jours' },
    { id: '30d', label: '30 jours' },
    { id: '90d', label: '90 jours' }
  ],

  // Bouton de comparaison
  isComparisonActive = true,
  onToggleComparison,

  // Données de la courbe
  data = [
    { label: 'Lun', value: 40, target: 50 },
    { label: 'Mar', value: 65, target: 55 },
    { label: 'Mer', value: 50, target: 52 },
    { label: 'Jeu', value: 85, target: 58 },
    { label: 'Ven', value: 75, target: 60 },
    { label: 'Sam', value: 42, target: 45 },
    { label: 'Dim', value: 30, target: 40 },
  ],

  // Point sélectionné & clic dynamique
  selectedPoint = {
    label: "Jeudi, 15:30",
    detail: "4830 kWh · pic d'intensité"
  },
  setSelectedPoint,

  // Métriques du pied de carte
  monthlyTarget = 72,
  ecoScore = { value: 84, max: 100, delta: "+6 pts ce mois" }
}) {
  return (
    <div className="w-full space-y-4">
      {/* En-tête externe de la section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{kicker}</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-200/60 p-1 rounded-xl">
            {periods.map((item) => (
              <button
                key={item.id}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  period === item.id 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => setPeriod?.(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button 
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all shadow-sm ${
              isComparisonActive
                ? 'bg-white border-slate-300 text-slate-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
            onClick={onToggleComparison}
          >
            Comparaison active
          </button>
        </div>
      </div>

      {/* Carte principale */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        {/* KPI supérieur & Légende */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
              CONSOMMATION TOTALE
            </span>
            <div className="flex items-baseline gap-2">
              <strong className="text-3xl font-extrabold text-slate-900">{totalConsumption}</strong>
              <span className="text-sm font-semibold text-slate-500">{unit}</span>
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-md">
                {trend}
              </span>
            </div>
            <span className="text-xs text-slate-400 mt-1 block">{trendLabel}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" /> Cette période
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Objectif
            </span>
          </div>
        </div>

        {/* Graphique interactif */}
        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
              onClick={(e) => {
                if (e && e.activePayload && e.activePayload.length) {
                  const point = e.activePayload[0].payload
                  setSelectedPoint?.({
                    label: `${point.label}, ${point.time || '15:30'}`,
                    detail: `${point.value} kWh · relevé télémesure`
                  })
                }
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                domain={[0, (dataMax) => Math.ceil(dataMax * 1.15)]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '8px', 
                  color: '#fff', 
                  border: 'none',
                  fontSize: '12px' 
                }} 
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0d9488"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pied de carte interactif */}
        <div className="pt-6 mt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Point sélectionné</span>
            <strong className="text-sm font-bold text-slate-900 block">{selectedPoint?.label || selectedPoint?.day}</strong>
            <span className="text-xs text-slate-500 block">{selectedPoint?.detail}</span>
          </div>

          <div className="space-y-0.5 md:border-x md:border-slate-100 md:px-6">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Objectif mensuel</span>
            <strong className="text-sm font-bold text-slate-900 block">{monthlyTarget}%</strong>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5">
              <div 
                className="h-full bg-teal-600 rounded-full transition-all duration-500" 
                style={{ width: `${monthlyTarget}%` }} 
              />
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Score EcoScan</span>
            <div className="flex items-baseline gap-1">
              <strong className="text-lg font-bold text-teal-600">{ecoScore.value}</strong>
              <span className="text-xs font-normal text-slate-400">/{ecoScore.max}</span>
            </div>
            <span className="text-xs font-medium text-emerald-600 block">{ecoScore.delta}</span>
          </div>
        </div>
      </div>
    </div>
  )
}