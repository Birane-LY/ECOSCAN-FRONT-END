import React from 'react'
import { Check, Plus, Save } from 'lucide-react'
import { GlassCard } from '@/components/instruments'
import { DASHBOARD_WIDGETS } from '../constants'

export function DashboardCustomizer({ widgets, onToggleWidget, onSave }) {
  return (
    <GlassCard as="section" className="customizer">
      <div>
        <strong>Organisez votre tableau de bord</strong>
        <span className="hint">Affichez ou masquez les modules selon votre journée.</span>
      </div>
      <div className="customizer-chips">
        {DASHBOARD_WIDGETS.map(({ id, label }) => {
          const on = widgets.includes(id)
          return (
            <button key={id} type="button" className={on ? 'on' : ''} aria-pressed={on} onClick={() => onToggleWidget(id)}>
              {on ? <Check size={15} /> : <Plus size={15} />}
              {label}
            </button>
          )
        })}
      </div>
      <button className="secondary-button" onClick={onSave}>
        <Save size={15} /> Enregistrer la disposition
      </button>
    </GlassCard>
  )
}
