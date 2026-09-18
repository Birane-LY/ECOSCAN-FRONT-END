import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { CONTEXTUAL_SUGGESTIONS } from '@/modules/assistant/hooks/useAssistant'

export function SuggestionsSidebar({ onSelectSuggestion }) {
  return (
    <aside className="assistant-context">
      <p className="eyebrow">SUGGESTIONS CONTEXTUELLES</p>
      {CONTEXTUAL_SUGGESTIONS.map((suggestion) => (
        <button key={suggestion} onClick={() => onSelectSuggestion(suggestion)}>
          {suggestion}<ArrowUpRight size={14} />
        </button>
      ))}
    </aside>
  )
}