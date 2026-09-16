import React from 'react'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { CONTEXTUAL_SUGGESTIONS } from '@/modules/assistant/hooks/useAssistant'

export function SuggestionsSidebar({ onSelectSuggestion }) {
  return (
    <aside className="assistant-context">
      <p className="eyebrow">SUGGESTIONS CONTEXTUELLES</p>
      {CONTEXTUAL_SUGGESTIONS.map((suggestion) => (
        <button key={suggestion} onClick={() => onSelectSuggestion(suggestion)}>
          <Sparkles size={14} />{suggestion}<ArrowUpRight size={14} />
        </button>
      ))}
    </aside>
  )
}