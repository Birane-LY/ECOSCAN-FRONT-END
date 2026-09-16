import React from 'react'
import { MessageSquareText, Sparkles } from 'lucide-react'

export function AssistantTeaser({ 
  assistantName = "EcoScan IA",
  subtitle = "Votre copilote énergie",
  message = "“Le prochain gain est à portée de main.”",
  timeAgo = "il y a 2 min",
  suggestions = ['Où est mon plus gros levier ?', 'Résume ma semaine'],
  onAsk 
}) {
  return (
    <aside className="assistant-card">
      <div className="assistant-heading">
        <div className="ai-avatar">
          <Sparkles size={16} />
        </div>
        <div>
          <strong>{assistantName}</strong>
          <span>
            {subtitle} <i />
          </span>
        </div>
      </div>
      <div className="assistant-message">
        <p>{message}</p>
        <span>Analyse de vos données · {timeAgo}</span>
      </div>
      <div className="suggestions">
        {suggestions.map((text, idx) => (
          <button key={idx} onClick={() => onAsk(text)}>
            {text}
          </button>
        ))}
      </div>
      <button
        className="assistant-cta"
        onClick={() => onAsk('Je veux explorer mes données')}
      >
        Continuer la conversation <MessageSquareText size={15} />
      </button>
    </aside>
  )
}