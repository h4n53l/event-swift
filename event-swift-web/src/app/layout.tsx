// src/app/layout.tsx
import { AuthProvider } from '../contexts/auth-provider'
import { Inter } from 'next/font/google'
import Background from './components/background'
import './global.css'
import Navbar from './components/navigation/navbar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Background>
          <Navbar />
        <AuthProvider>
          {children}
        </AuthProvider>
        </Background>
      </body>
    </html>
  )
}
