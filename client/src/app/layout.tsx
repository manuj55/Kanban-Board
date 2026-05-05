import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { StoreProvider } from '@/components/providers/StoreProvider'
import ToasterProvider from '@/components/providers/ToasterProvider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Neura Kanban — Task Management',
  description:
    'Kanban-style task management app built with Next.js, Redux Toolkit, and MongoDB.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <StoreProvider>
          {children}
          <ToasterProvider />
        </StoreProvider>
      </body>
    </html>
  )
}
