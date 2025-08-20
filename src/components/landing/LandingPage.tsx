import Navbar from './Navbar'
import Hero from './Hero'
import Features from './Features'
import Modules from './Modules'
import CTA from './CTA'
import Footer from './Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Modules />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
