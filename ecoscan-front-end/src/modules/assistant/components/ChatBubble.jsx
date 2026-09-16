import React from 'react'

export function ChatBubble({ message, isAi, isFollowUp, onActionClick }) {
  return (
    <div className={`chat-bubble ${message.from}`}>
      {message.text}
      {isAi && isFollowUp && (
        <div className="chat-actions">
          <button onClick={() => onActionClick('Confirme cette action')}>
            Préparer la décision
          </button>
          <button onClick={() => onActionClick('Montre-moi les sources')}>
            Voir les sources
          </button>
        </div>
      )}
    </div>
  )
}
