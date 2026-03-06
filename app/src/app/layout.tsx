import type {Metadata} from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sanity Agent Context Demo',
  description: 'AI-powered shopping assistant backed by Sanity structured content',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
