// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'ChatGenius - AI-Powered Facebook Chatbots',
  description: 'Engage customers 24/7, automate responses, and boost conversions with our intelligent chatbot solutions.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* FontAwesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="font-sans antialiased text-gray-800">
        <Navbar />
        {children}
        {/* Footer will be inside page or separate component */}
      </body>
    </html>
  )
}
