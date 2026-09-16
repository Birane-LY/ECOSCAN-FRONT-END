'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

export function AssistantGlobalWidget({ 
  assistantName = "ECOSCAN ",
  onOpenChat 
}) {
  const router = useRouter()

  const handleOpen = () => {
    if (onOpenChat) {
      onOpenChat()
    } else {
      router.push('/assistant')
    }
  }

  return (
    <button
      onClick={handleOpen}
      aria-label={`Ouvrir ${assistantName}`}
      /* Reprise exacte du style actif de la barre latérale (fond émeraude clair + bordure fine) */
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-3.5 py-2.5 bg-[#eaf5ef] text-[#1b4332] border border-[#d2e9dc] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-95 group"
    >
      {/* Icône Sparkles alignée sur la charte */}
      <Sparkles size={16} className="text-[#1b4332] shrink-0" />
      
      {/* Nom du menu */}
      <span className="text-xs font-semibold tracking-wide">
        {assistantName}
      </span>

     
    </button>
  )
}