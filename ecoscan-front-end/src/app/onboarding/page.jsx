'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingWizard } from '@/modules/onboarding/components/OnboardingWizard'

export default function OnboardingPage() {
  const router = useRouter()

  const handleComplete = () => {
    router.push('/')
  }

  return <OnboardingWizard onComplete={handleComplete} />
}
