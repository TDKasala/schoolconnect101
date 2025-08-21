import { ArrowLeft, CheckCircle2, Calendar, ClipboardList, Notebook, BarChart3, AlarmClock, School } from 'lucide-react'

export default function Pedagogie() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="inline-flex items-center gap-2 text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full mb-3">Fonctionnalités</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Module Pédagogie</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Gérez l'ensemble de vos activités pédagogiques avec des outils modernes et intuitifs,
            conçus pour simplifier le quotidien des enseignants.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="/" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l’accueil
            </a>
            <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20P%C3%A9dagogie" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              Demander une démo
            </a>
          </div>
        </div>
      </section>

      {/* Fonctionnalités complètes */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">Fonctionnalités Complètes</h2>
            <p className="mt-2 text-gray-600">Tous les outils nécessaires pour une gestion pédagogique efficace et moderne</p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suivi de présence */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <AlarmClock className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Suivi de présence numérique</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Pointage électronique des élèves avec historique complet et statistiques de présence.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Pointage rapide et précis</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Historique détaillé par élève</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Alertes automatiques d'absence</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Rapports de présence personnalisables</li>
              </ul>
            </div>

            {/* Carnet de notes */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <Notebook className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Carnet de notes en ligne</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Gestion complète des évaluations avec saisie simplifiée et consultation en temps réel.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Saisie intuitive des notes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Organisation par matières</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Consultation temps réel</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Historique des évaluations</li>
              </ul>
            </div>

            {/* Examens et devoirs */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Gestion des examens et devoirs</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Planification et suivi des évaluations avec calendrier intégré.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Calendrier des examens</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Planification des devoirs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Notifications automatiques</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Suivi des corrections</li>
              </ul>
            </div>

            {/* Calcul des moyennes */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <School className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Calcul automatique des moyennes</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Calculs automatisés avec pondération personnalisable selon vos critères.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Moyennes automatiques</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Pondération flexible</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Classements automatiques</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Bulletins générés</li>
              </ul>
            </div>

            {/* Suivi disciplinaire */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Suivi disciplinaire</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Gestion des sanctions et récompenses avec historique comportemental.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Registre disciplinaire</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Suivi comportemental</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Alertes parents</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Rapports de conduite</li>
              </ul>
            </div>

            {/* Statistiques de réussite */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Statistiques de réussite</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Tableaux de bord avec analyses détaillées des performances scolaires.</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Analyses par classe</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Évolution des performances</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Comparaisons temporelles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600"/> Rapports visuels</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Simplifiez votre gestion */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Simplifiez votre gestion pédagogique</h2>
            <div className="mt-6 space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900">Gain de temps considérable</h3>
                <p className="text-sm text-gray-600">Automatisez les tâches répétitives et concentrez-vous sur l'enseignement.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Suivi personnalisé</h3>
                <p className="text-sm text-gray-600">Suivez les progrès de chaque élève avec des outils d'analyse avancés.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Communication améliorée</h3>
                <p className="text-sm text-gray-600">Partagez facilement les informations avec les parents et l'administration.</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20P%C3%A9dagogie" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Demander une démo</a>
              <a href="#tarifs" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Voir les tarifs</a>
            </div>
          </div>

          {/* Dashboard mock */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900">Tableau de bord enseignant</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-primary-50 p-4">
                <p className="text-gray-600">6ème A - Mathématiques</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">28/30 <span className="text-sm font-medium text-gray-700">présents</span></p>
              </div>
              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-gray-600">Moyenne générale</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">14.2/20</p>
              </div>
              <div className="rounded-xl bg-yellow-50 p-4">
                <p className="text-gray-600">Devoirs à corriger</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-4">
                <p className="text-gray-600">Présence du jour</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">93%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16" id="cta">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Prêt à révolutionner votre pédagogie ?</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Découvrez comment le module Pédagogie peut transformer la gestion de vos classes.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20P%C3%A9dagogie" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Demander une démo</a>
            <a href="#tarifs" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Voir les tarifs</a>
          </div>
        </div>
      </section>
    </main>
  )
}
