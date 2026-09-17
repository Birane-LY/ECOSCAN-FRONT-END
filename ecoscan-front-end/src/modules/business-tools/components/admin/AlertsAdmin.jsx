import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { SettingToggle } from '@/components/ui'

export function AlertsAdmin({ alerts, setAlerts }) {
  const toggleAlert = (index) => {
    setAlerts((curr) =>
      curr.map((alert, i) => (i === index ? { ...alert, active: !alert.active } : alert))
    )
  }

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">SEUILS & ALERTES</p>
          <h2>Être prévenu avant que la facture ne surprenne.</h2>
        </div>
        <button className="primary-button">
          <Plus size={15} />Ajouter un seuil
        </button>
      </div>

      <div className="alerts-list">
        {alerts.map(({ name, value, active }, i) => (
          <div className="alert-row" key={name}>
            <div>
              <strong>{name}</strong>
              <span>Déclenchement à {value}</span>
            </div>
            <div className="alert-actions">
              <SettingToggle
                label=""
                checked={active}
                setChecked={() => toggleAlert(i)}
              />
              <button className="icon-button"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
