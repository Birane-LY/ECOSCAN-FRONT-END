import React from 'react'

export function GoalMetricCard({ name, value, amount }) {
  return (
    <article className="goal-card">
      <div>
        <span className="goal-bullet" />
        <strong>{name}</strong>
        <span className="goal-percent">{value}%</span>
      </div>
      <div className="goal-progress">
        <i style={{ width: `${value}%` }} />
      </div>
      <small>{amount} économisés · cible mensuelle</small>
    </article>
  )
}
