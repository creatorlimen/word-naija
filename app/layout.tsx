import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { GameProvider } from '@/lib/game/context'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Word Naija - Nigerian Word Puzzle Game',
  description: 'Solve crossword puzzles with Nigerian English and Pidgin vocabulary. A fun, offline word game inspired by Wordscapes.',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  )
}
