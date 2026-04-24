import type { Metadata } from 'next'
import {
  Italiana,
  Cormorant_Garamond,
  Tenor_Sans,
  Cormorant_Infant,
} from 'next/font/google'
import './globals.css'

const italiana = Italiana({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-italiana',
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const tenorSans = Tenor_Sans({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-tenor',
  display: 'swap',
})

const cormorantInfant = Cormorant_Infant({
  weight: ['300', '400'],
  style: ['italic'],
  subsets: ['latin'],
  variable: '--font-cormorant-infant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sean & Faazieqa · 26.09.2026',
  description:
    'Join us as we celebrate our wedding on 26 September 2026 in Bandar Seri Begawan, Brunei.',
  openGraph: {
    title: 'Sean & Faazieqa · 26.09.2026',
    description:
      'Join us as we celebrate our wedding on 26 September 2026 in Bandar Seri Begawan, Brunei.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Allura&display=swap" rel="stylesheet" />
      </head>
      <body
        className={[
          italiana.variable,
          cormorantGaramond.variable,
          tenorSans.variable,
          cormorantInfant.variable,
        ].join(' ')}
      >
        {children}
      </body>
    </html>
  )
}
