// app/page.tsx
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Pricing from '../components/Pricing'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      {/* CTA Section inside Hero or separate - I put it inside Hero for now */}
      <Contact />
      <Footer />
    </>
  )
}
