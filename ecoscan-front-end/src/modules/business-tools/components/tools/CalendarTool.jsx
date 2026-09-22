'use client'

import React, { useMemo, useState } from 'react'
import { CalendarCheck, ChevronLeft, ChevronRight, Download, Save } from 'lucide-react'
import { GlassCard } from '@/components/instruments'

const WEEK = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const EVENTS = [12, 18, 25] // briefings planifiés (démonstration)

export function CalendarTool({ briefingTime, setBriefingTime, setDrawer }) {
  const today = new Date()
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [synced, setSynced] = useState(false)

  const cursor = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const monthLabel = cursor.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const monthName = cursor.toLocaleDateString('fr-FR', { month: 'long' })

  const cells = useMemo(() => {
    const first = (new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay() + 6) % 7 // lundi = 0
    const count = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
    return [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)]
  }, [cursor.getFullYear(), cursor.getMonth()]) // eslint-disable-line react-hooks/exhaustive-deps

  const isPlanned = EVENTS.includes(selectedDay)

  return (
    <div className="cal">
      <GlassCard as="section" className="cal-grid-card">
        <div className="cal-head">
          <button className="icon-button" aria-label="Mois précédent" onClick={() => setMonthOffset((v) => v - 1)}>
            <ChevronLeft size={17} />
          </button>
          <strong>{monthLabel}</strong>
          <button className="icon-button" aria-label="Mois suivant" onClick={() => setMonthOffset((v) => v + 1)}>
            <ChevronRight size={17} />
          </button>
        </div>

        <div className="cal-week" aria-hidden="true">
          {WEEK.map((d, i) => (
            <span key={`${d}-${i}`}>{d}</span>
          ))}
        </div>
        <div className="cal-days">
          {cells.map((day, i) =>
            day == null ? (
              <span key={`e-${i}`} />
            ) : (
              <button
                key={day}
                type="button"
                data-silent
                aria-pressed={selectedDay === day}
                className={`${selectedDay === day ? 'sel' : ''} ${EVENTS.includes(day) ? 'ev' : ''} ${monthOffset === 0 && day === today.getDate() ? 'today' : ''}`}
                onClick={() => {
                  setSelectedDay(day)
                  setSaved(false)
                }}
              >
                {day}
              </button>
            ),
          )}
        </div>
      </GlassCard>

      <GlassCard as="section" className="cal-editor">
        <h2>{isPlanned ? 'Briefing énergie planifié.' : 'Planifiez un nouveau briefing.'}</h2>
        <p>
          Le {selectedDay} {monthName}. Recevez votre synthèse au moment où votre équipe commence sa journée.
        </p>

        <label className="fld">
          Heure de réception
          <input
            type="time"
            value={briefingTime}
            onChange={(e) => {
              setBriefingTime(e.target.value)
              setEditing(true)
            }}
          />
        </label>

        <div className="cal-actions">
          {editing || !isPlanned ? (
            <button
              className="primary-button"
              onClick={() => {
                setSaved(true)
                setEditing(false)
              }}
            >
              <Save size={16} />
              {saved ? 'Briefing enregistré' : 'Enregistrer le briefing'}
            </button>
          ) : (
            <button className="secondary-button" onClick={() => setEditing(true)}>
              Modifier l’horaire
            </button>
          )}
          <button className="quiet-button" onClick={() => setSynced(true)}>
            <CalendarCheck size={15} />
            {synced ? 'Calendrier connecté' : 'Synchroniser Google Calendar'}
          </button>
          <button className="quiet-button" onClick={() => setDrawer('briefing-export')}>
            <Download size={15} />Exporter en iCal
          </button>
        </div>

        <span className="chip chip-ok cal-status">
          {saved || synced ? 'Mis à jour à l’instant' : `Prochaine session demain à ${briefingTime}`}
        </span>
      </GlassCard>
    </div>
  )
}
