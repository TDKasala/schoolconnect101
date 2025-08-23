import { ArrowRight, Sparkles, Users, Award, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    { 
      value: '500+', 
      label: 'Écoles partenaires',
      icon: <Users className="h-8 w-8 text-brand-yellow" />,
      description: 'À travers la RDC'
    },
    { 
      value: '50K+', 
      label: 'Élèves gérés',
      icon: <Sparkles className="h-8 w-8 text-brand-green" />,
      description: 'Quotidiennement'
    },
    { 
      value: '99.9%', 
      label: 'Satisfaction client',
      icon: <Award className="h-8 w-8 text-brand-yellow" />,
      description: 'Taux de recommandation'
    },
  ]

  const benefits = [
    'Installation en 24h',
    'Formation complète incluse',
    'Support technique local',
    'Données sécurisées en RDC'
  ]

  return (
    <section ref={sectionRef} id="cta" className="relative bg-gradient-to-br from-brand-blue via-brand-blue-dark to-indigo-900 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className={`inline-flex items-center gap-2 text-sm font-semibold bg-brand-green/20 text-brand-green px-6 py-2 rounded-full mb-8 border border-brand-green/30 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <CheckCircle className="h-4 w-4" />
            Rejoignez la révolution numérique
          </div>

          <h2 className={`text-4xl md:text-6xl font-extrabold leading-tight ${isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            Prêt à <span className="bg-gradient-to-r from-brand-yellow to-yellow-300 bg-clip-text text-transparent">moderniser</span> votre école ?
          </h2>
          
          <p className={`mt-8 text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto ${isVisible ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
            Rejoignez les centaines d'écoles congolaises qui ont déjà choisi SchoolConnect pour simplifier leur gestion quotidienne et améliorer leurs résultats.
          </p>

          {/* Benefits list */}
          <div className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto ${isVisible ? 'animate-fade-in-up delay-600' : 'opacity-0'}`}>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm font-medium text-blue-100">
                <CheckCircle className="h-4 w-4 text-brand-green flex-shrink-0" />
                {benefit}
              </div>
            ))}
          </div>
          
          <div className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 ${isVisible ? 'animate-fade-in-up delay-800' : 'opacity-0'}`}>
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-green to-green-500 px-10 py-4 text-lg font-bold text-white shadow-2xl hover:shadow-brand-green/25 transform hover:scale-105 transition-all duration-300 hover:from-green-500 hover:to-brand-green hover-glow-green"
            >
              <span>Demander une démo gratuite</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link
              to="/tarifs"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-10 py-4 text-lg font-semibold text-white shadow-xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
            >
              <span>Voir les tarifs</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Enhanced stats section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className={`group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${1000 + index * 200}ms` }}
            >
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
              
              <div className="relative text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
                
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-brand-yellow transition-colors duration-300">
                  {stat.value}
                </div>
                
                <div className="text-lg font-semibold text-blue-100 mb-1">
                  {stat.label}
                </div>
                
                <div className="text-sm text-blue-200">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className={`mt-16 text-center ${isVisible ? 'animate-fade-in-up delay-1600' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-8 bg-white/5 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-100">Serveurs actifs en RDC</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-brand-green" />
              <span className="text-sm font-medium text-blue-100">Certifié sécurité</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-brand-yellow" />
              <span className="text-sm font-medium text-blue-100">Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
