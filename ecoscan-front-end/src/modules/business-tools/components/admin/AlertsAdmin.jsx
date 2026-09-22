'use client'

import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { SettingToggle } from '@/components/ui/SettingToggle'

export function AlertsAdmin({ alerts, setAlerts }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [value, setValue] = useState('')

  const toggleAlert = (index) =>
    setAlerts((curr) => curr.map((a, i) => (i === index ? { ...a, active: !a.active } : a)))
  const removeAlert = (index) => setAlerts((curr) => curr.filter((_, i) => i !== index))

  const addAlert = (e) => {
    e.preventDefault()
    if (!name.trim() || !value.trim()) return
    setAlerts((curr) => [...curr, { name: name.trim(), value: value.trim(), active: true }])
    setName('')
    setValue('')
    setAdding(false)
  }

  return (
    <>
      <div className="ad-head">
        <h2>Être prévenu avant que la facture ne surprenne.</h2>
        <button className="primary-button" onClick={() => setAdding((v) => !v)}>
          <Plus size={16} />Ajouter un seuil
        </button>
      </div>

      {adding && (
        <form className="ad-invite" onSubmit={addAlert}>
          <div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de l’alerte" aria-label="Nom de l’alerte" required />
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Seuil, ex. 800 kWh" aria-label="Seuil de déclenchement" required />
            <button className="primary-button" type="submit">Ajouter</button>
          </div>
        </form>
      )}

      <div className="ad-list">
        {alerts.map(({ name: n, value: v, active }, i) => (
          <div className="ad-row" key={`${n}-${i}`}>
            <div>
              <strong>{n}</strong>
              <small>Déclenchement à {v}</small>
            </div>
            <SettingToggle label="" checked={active} setChecked={() => toggleAlert(i)} />
            <button className="icon-button" aria-label={`Supprimer l’alerte ${n}`} onClick={() => removeAlert(i)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {alerts.length === 0 && <p className="drawer-lead">Aucun seuil défini. Ajoutez-en un pour être prévenu à temps.</p>}
      </div>
    </>
  )
}
