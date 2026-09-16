import React from 'react'
import { Check, Plus, Save } from 'lucide-react'
import { DASHBOARD_WIDGETS } from '../constants'

export function DashboardCustomizer({ widgets, onToggleWidget, onSave }) {
  return (
    <section className="dashboard-editor">
      <div>
        <p className="eyebrow">MODE PERSONNALISATION</p>
        <strong>Organisez votre cockpit.</strong>
        <span>Réordonnez les modules ou masquez ce qui ne vous sert pas aujourd’hui.</span>
      </div>
      <div className="editor-widgets">
        {DASHBOARD_WIDGETS.map(({ id, label }) => {
          const isSelected = widgets.includes(id)
          return (
            <button
              key={id}
              className={isSelected ? 'selected' : ''}
              onClick={() => onToggleWidget(id)}
            >
              <span>{isSelected ? <Check size={13} /> : <Plus size={13} />}</span>
              {label}
            </button>
          )
        })}
      </div>
      <button className="quiet-button" onClick={onSave}>
        Sauvegarder la disposition <Save size={14} />
      </button>
    </section>
  )
}
