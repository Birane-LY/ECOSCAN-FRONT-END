import './globals.css'
import './rebrand.css'

export const metadata = {
  title: 'EcoScan — Pilotage énergétique',
  description: 'Comprenez votre consommation, décidez, économisez.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Doto:wght@400;700&family=Outfit:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
