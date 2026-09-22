import React from 'react'

export function ChatBubble({ message, isAi, isFollowUp, onActionClick }) {
  return (
    <div className={`as-msg ${isAi ? 'ai' : 'user'}`}>
      <div className="as-bubble">{message.text}</div>
      {isAi && isFollowUp && (
        <div className="as-msg-actions">
          <button type="button" onClick={() => onActionClick('Confirme cette action')}>
            Préparer la décision
          </button>
          <button type="button" onClick={() => onActionClick('Montre-moi les sources')}>
            Voir les sources
          </button>
        </div>
      )}
    </div>
  )
}
