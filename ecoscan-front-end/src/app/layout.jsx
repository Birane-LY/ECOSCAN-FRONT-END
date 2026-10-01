import './globals.css'
import './rebrand.css'

export const metadata = {
  title: 'EcoScan — Pilotage énergétique',
  description: 'Comprenez votre consommation, décidez, économisez.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
