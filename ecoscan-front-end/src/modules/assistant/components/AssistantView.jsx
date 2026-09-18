'use client'

import React from 'react'
import { Zap } from 'lucide-react'
import { PageHeader } from '@/components/ui'
import { ASSISTANT_SUGGESTIONS } from '@/modules/assistant/hooks/useAssistant'
import { ChatBubble } from '@/modules/assistant/components/ChatBubble'
import { ChatInput } from '@/modules/assistant/components/ChatInput'
import { SuggestionsSidebar } from '@/modules/assistant/components/SuggestionsSidebar'

export function AssistantView({ messages, input, setInput, thinking, activeSuggestion, ask, sendPrompt, resetConversation }) {
  return (
    <>
      <PageHeader
        eyebrow="COPILOTE ÉNERGIE"
        title="Assistant IA"
        subtitle="Posez une question, obtenez une réponse fondée sur vos données."
        action={<span className="online-status"><i />En ligne maintenant</span>}
      />

      <section className="assistant-intro">
        <div>
          <p className="eyebrow">VOTRE COPILOTE DU JOUR</p>
          <h2>Interrogez vos données énergétiques</h2>
          <p>Posez une question — je réponds à partir de ce qui est réellement enregistré pour votre organisation.</p>
        </div>
      </section>

      <section className="assistant-workspace">
        <div className="conversation">
          <div className="conversation-head">
            <div className="ai-avatar"><Zap size={17} /></div>
            <div>
              <strong>EcoScan IA</strong>
              <span>Analyse vos données en contexte</span>
            </div>
            <span className="conversation-status"><i />Prêt</span>
            <button className="quiet-button" onClick={resetConversation}>Nouvelle conversation</button>
          </div>

          <div className="suggestion-row">
            {ASSISTANT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                className={activeSuggestion === suggestion ? 'selected' : ''}
                onClick={() => sendPrompt(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {thinking && (
            <div className="thinking-row">
              <span className="thinking-dots"><i /><i /><i /></span>
              Je consulte vos données…
            </div>
          )}

          <div className="conversation-body">
            {messages.map((m, i) => (
              <ChatBubble key={`${m.text}-${i}`} message={m} isAi={m.from === 'ai'} isFollowUp={i > 0} onActionClick={ask} />
            ))}
          </div>

          <ChatInput input={input} setInput={setInput} onSend={ask} />
        </div>

        <SuggestionsSidebar onSelectSuggestion={ask} />
      </section>
    </>
  )
}