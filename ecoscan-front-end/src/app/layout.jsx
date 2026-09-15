
import './globals.css'

export const metadata = {
  title: 'EcoScan — Pilotage énergétique',
  description: 'Le back-office qui transforme la contrainte énergétique en plaisir de décision.',
  generator: 'EcoScan',
}

export const viewport = {
  colorScheme: 'light',
  themeColor: '#f6f8f4',
  userScalable: true,
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="bg-background">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
