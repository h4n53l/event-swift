// src/app/layout.tsx
import { AuthProvider } from '../contexts/auth-provider'
import { Inter } from 'next/font/google'
import './global.css'
import Background from './components/Background'
import Navbar from './components/navigation/Navbar'
import Footer from './components/navigation/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Event Swift',
  description: 'Seamless Event Planning',
  image: 'images/EventSwiftIcon.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      <head>
      <link rel="icon" href="images/EventSwiftIcon.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <Background>
        <AuthProvider>
          <Navbar />
        <div
        className="flex-grow"
        >
          {children}
          </div>
        <Footer />
        </AuthProvider>
        </Background>
      </body>
    </html>
  )
}
