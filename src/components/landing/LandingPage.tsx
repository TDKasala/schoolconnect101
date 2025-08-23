import Navbar from './Navbar'
import Hero from './Hero';
import Features from './Features';
import Modules from './Modules';
import CTA from './CTA';
import Footer from './Footer';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export default function LandingPage() {
  useScrollToTop();
  
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
