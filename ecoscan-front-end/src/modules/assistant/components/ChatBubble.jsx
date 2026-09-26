import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Le backend répond en Markdown (tableaux, gras, listes) : sans rendu, l'utilisateur
// voyait les « ** » et les « |---| » bruts.
// Dépendances : npm i react-markdown remark-gfm

export function ChatBubble({ message, isAi }) {
  const sources = Array.isArray(message.sources) ? message.sources : []

  return (
    <div className={`as-msg ${isAi ? 'ai' : 'user'}`}>
      <div className="as-bubble">
        {isAi ? (
          <div className="as-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
          </div>
        ) : (
          message.text
        )}
      </div>
      {isAi && sources.length > 0 && (
        <div className="as-msg-actions" aria-label="Sources utilisées">
          {sources.map((s, i) => (
            <span className="chip" key={s.id ?? i}>
              {s.metadata?.titre || s.source}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
