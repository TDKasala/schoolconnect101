import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section 
      className="relative bg-cover bg-center text-white" 
      style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center justify-center text-center pt-16">
          <div className="max-w-3xl opacity-0 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              La gestion scolaire, <span className="text-brand-yellow">simplifiée</span> pour la RDC
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200">
              Plateforme moderne de gestion scolaire, optimisée pour les écoles congolaises: gérer les élèves, finances et communications en toute simplicité.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center rounded-lg bg-brand-green px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-green/90 transform hover:scale-105 transition-transform duration-300"
              >
                Demander une démo
              </Link>
              <a 
                href="#cta" 
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
              >
                Ouvrir un compte <ArrowRight className="h-5 w-5"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
