import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden py-20 md:py-24 bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 text-white">
      <div className="absolute inset-0">
        <div className="absolute -top-10 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl"/>
        <div className="absolute -bottom-16 right-1/4 h-56 w-56 rounded-full bg-yellow-300/30 blur-3xl"/>
      </div>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="inline-flex items-center gap-2 text-xs bg-white/10 border border-white/10 px-3 py-1 rounded-full mb-4 backdrop-blur">Support & Hébergement Inclus</p>
        <h2 className="text-3xl md:text-4xl font-extrabold">Prêt à moderniser votre école ?</h2>
        <p className="mt-3 text-white/90 max-w-2xl mx-auto">Rejoignez les écoles qui ont déjà choisi SchoolConnect pour simplifier leur gestion quotidienne.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#demo" className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-indigo-700 font-semibold shadow-sm hover:bg-indigo-50">Demander une démo</a>
          <a href="#" className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-500 px-5 py-3 font-semibold shadow-sm hover:bg-indigo-400">Commencer <ArrowRight className="h-4 w-4"/></a>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6 text-left text-white/90">
          <div className="rounded-xl bg-white/10 border border-white/10 p-4"><div className="text-2xl font-bold">50+</div><div className="text-sm">Écoles actives</div></div>
          <div className="rounded-xl bg-white/10 border border-white/10 p-4"><div className="text-2xl font-bold">10k+</div><div className="text-sm">Élèves suivis</div></div>
          <div className="rounded-xl bg-white/10 border border-white/10 p-4"><div className="text-2xl font-bold">99%</div><div className="text-sm">Satisfaction</div></div>
        </div>
      </div>
    </section>
  )
}
