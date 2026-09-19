import React from 'react'

export function AdminHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="admin-page-heading">
      <div>
        <small>{eyebrow}</small>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  )
}
