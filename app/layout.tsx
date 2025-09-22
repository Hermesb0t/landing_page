// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Providers from '@/components/Providers'

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
        <meta name="facebook-domain-verification" content="rcqtwgmce5jm5mm7683tpu3xjyvt9p" />
      </head>
      <body className="font-sans antialiased text-gray-800">
        <Navbar />
        {/*<Providers>{children}</Providers>*/}
        {children}
        <Footer />
        {/* Footer will be inside page or separate component */}
      </body>
    </html>
  )
}
