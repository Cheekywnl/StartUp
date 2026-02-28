import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VCMail — Connect with Investors',
  description: 'Create account, record your pitch, and connect with potential investors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white antialiased">{children}</body>
    </html>
  )
}
