import React from 'react'

export function SettingToggle({ label, detail, checked, setChecked, disabled = false }) {
  return (
    <label className="setting-toggle">
      <span>
        <strong>{label}</strong>
        {detail && <small>{detail}</small>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <i />
    </label>
  )
}
