import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { CONTEXTUAL_SUGGESTIONS } from '@/modules/assistant/hooks/useAssistant'

export function SuggestionsSidebar({ onSelectSuggestion }) {
  return (
    <aside className="as-side glass">
      <h3>Pistes à explorer</h3>
      <div className="as-side-list">
        {CONTEXTUAL_SUGGESTIONS.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => onSelectSuggestion(suggestion)}>
            <span>{suggestion}</span>
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
      <p className="as-note">Les réponses s’appuient sur les données enregistrées pour votre organisation.</p>
    </aside>
  )
}
