import { Metadata } from 'next'
import './styles/styles.css'
import './styles/center.css'

export const metadata: Metadata = {
  title: 'React Three Fiber Test',
  description: 'Generated by Next.js'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
