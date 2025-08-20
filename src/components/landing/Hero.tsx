import { Check, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600 text-white">
      {/* background decorative blobs */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-blob"/>
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-yellow-300/30 blur-3xl animate-blob"/>
        <div className="absolute top-20 right-32 hidden md:block h-40 w-40 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 rotate-6 animate-float"/>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs md:text-sm bg-white/10 px-3 py-1 rounded-full mb-4 backdrop-blur border border-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Plateforme moderne pour les écoles congolaises
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              La gestion scolaire, <span className="text-yellow-300">simplifiée</span> pour la RDC
            </h1>
            <p className="mt-4 text-white/90 max-w-xl">
              Plateforme moderne de gestion scolaire, optimisée pour les écoles congolaises: gérer les élèves, finances et communications en toute simplicité.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#demo" className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-primary-700 font-semibold shadow-sm hover:bg-primary-50">
                Demander une démo
              </a>
              <a href="#" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 px-5 py-3 font-semibold shadow-glow hover:bg-primary-400 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-[length:200%_100%] animate-shimmer">
                Ouvrir un compte <ArrowRight className="h-4 w-4"/>
              </a>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-white/90">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300"/> Suivi des élèves en temps réel</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300"/> Finances simplifiées</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300"/> Communication facile</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300"/> Hébergé et sécurisé</li>
            </ul>
          </div>

          <div className="relative animate-float">
            <div className="mx-auto max-w-md md:max-w-none md:ml-8">
              {/* card mockup */}
              <div className="relative rounded-2xl bg-white text-gray-900 shadow-2xl p-4 md:p-6 border border-primary-50">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Éducation de Qualité</div>
                  <div className="text-xs text-gray-500">Espace admin</div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-primary-50 p-3">
                    <div className="text-xs text-gray-500">Élèves</div>
                    <div className="text-xl font-bold text-blue-700">247</div>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <div className="text-xs text-gray-500">Classes</div>
                    <div className="text-xl font-bold text-blue-700">18</div>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <div className="text-xs text-gray-500">Taux de présence</div>
                    <div className="text-xl font-bold text-blue-700">94%</div>
                  </div>
                </div>
                <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-primary-100 via-accent-100 to-white"/>
              </div>

              {/* floating shapes */}
              <div className="absolute -top-8 -left-6 h-16 w-16 rounded-xl bg-white/20 border border-white/20 backdrop-blur"/>
              <div className="absolute -bottom-8 -right-6 h-20 w-20 rounded-full bg-yellow-300/80 blur-xl"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
