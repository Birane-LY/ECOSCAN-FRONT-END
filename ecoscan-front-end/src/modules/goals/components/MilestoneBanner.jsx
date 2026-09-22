import React from 'react'
import { Zap } from 'lucide-react'
import { GlassCard } from '@/components/instruments'

const JALON = 80

export function MilestoneBanner({ goal = 0 }) {
  const unlocked = goal >= JALON
  const reste = Math.max(0, JALON - goal)

  return (
    <GlassCard className="gl-milestone">
      <span className="gl-milestone-icon">
        <Zap size={19} />
      </span>
      <div>
        <strong>Prochain jalon : {JALON} % de l’objectif</strong>
        <span>
          {unlocked
            ? 'Jalon atteint : votre équipe débloque le badge Élan collectif.'
            : `Encore ${reste} point${reste > 1 ? 's' : ''} pour débloquer le badge Élan collectif.`}
        </span>
      </div>
      <span className={`chip ${unlocked ? 'chip-lime' : ''}`}>{unlocked ? 'Débloqué' : 'Bientôt'}</span>
    </GlassCard>
  )
}
