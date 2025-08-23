import { ShieldCheck, Sparkles, MapPin, ArrowRight, CheckCircle, Zap, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

export default function Features() {
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

  const items = [
    {
      icon: <Zap className="h-8 w-8 text-brand-blue"/>,
      title: 'Simple et intuitif',
      text: 'Interface pensée pour les réalités locales, facile à prendre en main par vos équipes sans formation complexe.',
      features: ['Installation en 24h', 'Formation incluse', 'Support français/lingala'],
      color: 'blue'
    },
    {
      icon: <Globe className="h-8 w-8 text-brand-green"/>,
      title: 'Optimisé pour la RDC',
      text: 'Fonctionne même avec des connexions limitées. Multi-langue et adapté au contexte congolais.',
      features: ['Mode hors-ligne', 'Optimisé mobile', 'Monnaie locale (CDF)'],
      color: 'green'
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-brand-yellow"/>,
      title: 'Support Local',
      text: 'Équipe basée à Kinshasa pour un accompagnement humain et réactif dans votre transition numérique.',
      features: ['Support 24/7', 'Équipe locale', 'Maintenance incluse'],
      color: 'yellow'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-brand-blue/5',
          border: 'border-brand-blue/20',
          hoverBorder: 'hover:border-brand-blue/40',
          iconBg: 'bg-brand-blue/10',
          glow: 'hover-glow'
        }
      case 'green':
        return {
          bg: 'bg-brand-green/5',
          border: 'border-brand-green/20',
          hoverBorder: 'hover:border-brand-green/40',
          iconBg: 'bg-brand-green/10',
          glow: 'hover-glow-green'
        }
      case 'yellow':
        return {
          bg: 'bg-brand-yellow/5',
          border: 'border-brand-yellow/20',
          hoverBorder: 'hover:border-brand-yellow/40',
          iconBg: 'bg-brand-yellow/10',
          glow: 'hover-glow-yellow'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          hoverBorder: 'hover:border-gray-300',
          iconBg: 'bg-gray-100',
          glow: ''
        }
    }
  }

  return (
    <section ref={sectionRef} id="avantages" className="py-20 sm:py-32 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-brand-green/10 to-brand-blue/10 text-brand-green px-6 py-2 rounded-full mb-6 border border-brand-green/20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <CheckCircle className="h-4 w-4" />
            Pourquoi SchoolConnect ?
          </div>
          
          <h2 className={`text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight ${isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            Une solution <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">complète</span> pour votre école
          </h2>
          
          <p className={`mt-6 text-xl text-gray-600 leading-relaxed ${isVisible ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
            Conçue avec les directeurs, enseignants et parents congolais pour simplifier la gestion quotidienne et améliorer la communication.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {items.map((item, i) => {
            const colorClasses = getColorClasses(item.color)
            return (
              <div
                key={i}
                className={`group relative ${colorClasses.bg} rounded-3xl p-8 transition-all duration-500 ease-out hover:-translate-y-3 border-2 ${colorClasses.border} ${colorClasses.hoverBorder} ${colorClasses.glow} ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${600 + i * 200}ms` }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-bl-3xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-3xl"></div>
                
                <div className={`relative h-16 w-16 rounded-2xl ${colorClasses.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-blue transition-colors duration-300">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {item.text}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <CheckCircle className="h-4 w-4 text-brand-green flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  to="/avantages" 
                  className="group/link inline-flex items-center gap-2 text-brand-blue font-semibold hover:gap-3 transition-all duration-300"
                >
                  En savoir plus
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            )
          })}
        </div>

        {/* Stats section */}
        <div className={`mt-20 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 ${isVisible ? 'animate-fade-in-up delay-1000' : 'opacity-0'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand-blue mb-2">500+</div>
              <div className="text-gray-600 font-medium">Écoles partenaires</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand-green mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Élèves gérés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand-yellow mb-2">99.9%</div>
              <div className="text-gray-600 font-medium">Temps de fonctionnement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand-blue mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support disponible</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
