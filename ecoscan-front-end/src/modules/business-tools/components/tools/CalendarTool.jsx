'use client'

import React, { useState } from 'react'
import { CalendarCheck, ChevronDown, Download, Save } from 'lucide-react'

export function CalendarTool({ briefingTime, setBriefingTime, setDrawer }) {
  const [selectedDay, setSelectedDay] = useState(12)
  const [monthOffset, setMonthOffset] = useState(0)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [synced, setSynced] = useState(false)

  const month =
    monthOffset === 0 ? 'Septembre 2026' : monthOffset < 0 ? 'Août 2026' : 'Octobre 2026'
  const events = [12, 18, 25]

  return (
    <section className="calendar-tool">
      <div className="calendar-card">
        <div className="calendar-head">
          <button
            className="icon-button"
            aria-label="Mois précédent"
            onClick={() => setMonthOffset((v) => v - 1)}
          >
            <ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <strong>{month}</strong>
          <button
            className="icon-button"
            aria-label="Mois suivant"
            onClick={() => setMonthOffset((v) => v + 1)}
          >
            <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </div>

        <div className="calendar-week">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <span key={`${d}-${i}`}>{d}</span>
          ))}
        </div>

        <div className="calendar-days">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              className={`${selectedDay === day ? 'selected' : ''} ${events.includes(day) ? 'has-event' : ''}`}
              onClick={() => { setSelectedDay(day); setSaved(false) }}
            >
              {day}
              {events.includes(day) && <i />}
            </button>
          ))}
        </div>
      </div>

      <div className="briefing-editor">
        <p className="eyebrow">BRIEFING DU {selectedDay} SEPTEMBRE</p>
        <h2>{events.includes(selectedDay) ? 'Briefing énergie planifié.' : 'Planifiez un nouveau briefing.'}</h2>
        <p>Recevez votre synthèse opérationnelle au moment où votre équipe commence sa journée.</p>

        <label>
          Heure de réception
          <input
            type="time"
            value={briefingTime}
            onChange={(e) => { setBriefingTime(e.target.value); setEditing(true) }}
          />
        </label>

        <div className="briefing-actions">
          {editing || !events.includes(selectedDay) ? (
            <button className="primary-button" onClick={() => { setSaved(true); setEditing(false) }}>
              <Save size={15} />
              {saved ? 'Briefing enregistré' : 'Enregistrer le briefing'}
            </button>
          ) : (
            <button className="secondary-button" onClick={() => setEditing(true)}>
              Modifier l'horaire
            </button>
          )}

          <button className="quiet-button" onClick={() => setSynced(true)}>
            <CalendarCheck size={14} />
            {synced ? 'Calendrier connecté' : 'Synchroniser Google Calendar'}
          </button>

          <button className="quiet-button" onClick={() => setDrawer('briefing-export')}>
            <Download size={14} />Exporter en iCal
          </button>
        </div>

        <div className="briefing-status">
          <span className="status-chip ready">
            <i />
            {saved || synced
              ? 'Mis à jour à l\'instant'
              : `Prochaine session · demain à ${briefingTime}`}
          </span>
        </div>
      </div>
    </section>
  )
}
