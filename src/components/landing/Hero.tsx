import { ArrowRight, Play, Star, Users, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-brand-blue via-brand-blue-dark to-indigo-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-yellow/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center justify-between pt-16">
          {/* Left content */}
          <div className="flex-1 max-w-2xl">
            {/* Trust indicators */}
            <div className="flex items-center gap-6 mb-8 opacity-0 animate-fade-in-up">
              <div className="flex items-center gap-2 text-brand-yellow">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-sm font-medium text-white/90">4.9/5 étoiles</span>
              </div>
              <div className="flex items-center gap-2 text-brand-green">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium text-white/90">500+ écoles</span>
              </div>
              <div className="flex items-center gap-2 text-brand-yellow">
                <Award className="h-5 w-5" />
                <span className="text-sm font-medium text-white/90">Certifié RDC</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight opacity-0 animate-fade-in-up delay-200">
              La gestion scolaire, <span className="bg-gradient-to-r from-brand-yellow to-yellow-300 bg-clip-text text-transparent">simplifiée</span> pour la RDC
            </h1>
            
            <p className="mt-8 text-lg md:text-xl text-blue-100 leading-relaxed opacity-0 animate-fade-in-up delay-400">
              Plateforme moderne de gestion scolaire, optimisée pour les écoles congolaises. Gérez les élèves, finances et communications en toute simplicité avec des outils conçus pour votre réalité.
            </p>
            
            {/* Key benefits */}
            <div className="mt-8 flex flex-wrap gap-4 opacity-0 animate-fade-in-up delay-500">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                <span className="text-sm font-medium text-white">Installation rapide</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-brand-yellow rounded-full"></div>
                <span className="text-sm font-medium text-white">Support local</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">Données sécurisées</span>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-start gap-4 opacity-0 animate-fade-in-up delay-600">
              <Link 
                to="/contact" 
                className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-green to-green-500 px-8 py-4 text-lg font-bold text-white shadow-2xl hover:shadow-brand-green/25 transform hover:scale-105 transition-all duration-300 hover:from-green-500 hover:to-brand-green"
              >
                <span>Demander une démo</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <button className="group inline-flex items-center justify-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Voir la démo</span>
              </button>
            </div>
          </div>

          {/* Right illustration area */}
          <div className="hidden lg:block flex-1 max-w-lg ml-12">
            <div className="relative opacity-0 animate-fade-in-right delay-800">
              {/* Dashboard mockup */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 flex items-center px-3">
                    <span className="text-xs text-gray-500">schoolconnect.cd</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Tableau de Bord</h3>
                    <span className="text-xs bg-brand-green text-white px-2 py-1 rounded-full">En ligne</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-brand-blue/10 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-brand-blue">1,247</div>
                      <div className="text-xs text-gray-600">Élèves actifs</div>
                    </div>
                    <div className="bg-brand-green/10 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-brand-green">98%</div>
                      <div className="text-xs text-gray-600">Taux présence</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Revenus ce mois</span>
                      <span className="text-sm text-brand-green">+12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-brand-green to-green-400 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-brand-yellow text-white p-3 rounded-full shadow-lg animate-bounce delay-1000">
                <Award className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-brand-green text-white p-3 rounded-full shadow-lg animate-bounce delay-1500">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
