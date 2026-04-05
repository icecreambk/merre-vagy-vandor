import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Merre vagy, vándor?',
  description: 'Szimbolikus világtérkép, amely megmutatja, hol élnek az erdélyi magyarok szerte a világon.',
  openGraph: {
    title: 'Merre vagy, vándor?',
    description: 'Mutasd meg a világnak, hol élsz te — erdélyi magyarok a világ minden sarkában.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  )
}
