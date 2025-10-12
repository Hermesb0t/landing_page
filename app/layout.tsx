// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'ChatGenius - AI-Powered Facebook Chatbots',
  description: 'Engage customers 24/7, automate responses, and boost conversions with our intelligent chatbot solutions.',
  other: {
    "facebook-domain-verification": "rcqtwgmce5jm5mm7683tpu3xjyvt9p"
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-gray-800">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
