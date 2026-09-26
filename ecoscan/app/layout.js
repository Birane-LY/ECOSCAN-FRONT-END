import { Outfit } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata = {
  title: "EcoScan — Donner une forme à l'énergie",
  description:
    "EcoScan relie consommation, coûts et activité pour transformer l'information énergétique dispersée en trajectoires claires et décisions financières actionnables. Pour les PME, entreprises et cabinets de conseil en Afrique de l'Ouest.",
}

export const viewport = {
  themeColor: "#081b26",
  colorScheme: "light",
}

/**
 * RootLayout — sets fonts, language and the base background on <html>.
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} bg-background`}
    >
      <body className="min-h-dvh bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
