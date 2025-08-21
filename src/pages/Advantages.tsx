import { ArrowLeft } from 'lucide-react'

export default function Advantages() {
  return (
    <main className="pt-20">
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="inline-flex items-center gap-2 text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full mb-3">Avantages</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Les Avantages de SchoolConnect</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Découvrez pourquoi des centaines d'écoles en RDC ont choisi SchoolConnect pour moderniser leur gestion scolaire.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="/" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l’accueil
            </a>
            <a href="#cta" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Rejoignez-nous</a>
          </div>

          <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
              <dt className="text-xs text-gray-500">Écoles utilisatrices</dt>
              <dd className="text-2xl font-bold text-gray-900">500+</dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
              <dt className="text-xs text-gray-500">Élèves gérés</dt>
              <dd className="text-2xl font-bold text-gray-900">50,000+</dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
              <dt className="text-xs text-gray-500">Enseignants actifs</dt>
              <dd className="text-2xl font-bold text-gray-900">2,000+</dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
              <dt className="text-xs text-gray-500">Temps de disponibilité</dt>
              <dd className="text-2xl font-bold text-gray-900">99.9%</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Six Avantages Clés</h2>
            <p className="mt-2 text-gray-600">SchoolConnect transforme la gestion scolaire avec des bénéfices concrets et mesurables</p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">Gain de temps considérable</h3>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Automatisez les tâches répétitives et libérez du temps pour l'essentiel : l'éducation.</li>
                <li>Saisie automatique des données</li>
                <li>Génération instantanée de rapports</li>
                <li>Calculs automatiques des moyennes</li>
                <li>Notifications automatisées</li>
              </ul>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">Communication améliorée</h3>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Renforcez les liens entre tous les acteurs de votre communauté scolaire.</li>
                <li>Messagerie intégrée en temps réel</li>
                <li>Notifications push instantanées</li>
                <li>Portails dédiés par rôle</li>
                <li>Partage d'informations sécurisé</li>
              </ul>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">Décisions basées sur les données</h3>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Prenez des décisions éclairées grâce à des analyses détaillées et des rapports précis.</li>
                <li>Tableaux de bord interactifs</li>
                <li>Statistiques en temps réel</li>
                <li>Analyses prédictives</li>
                <li>Rapports personnalisables</li>
              </ul>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">Conception pour la RDC</h3>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Solution optimisée pour fonctionner parfaitement avec les infrastructures congolaises.</li>
                <li>Optimisation faible bande passante</li>
                <li>Mode hors ligne disponible</li>
                <li>Interface en français</li>
                <li>Adaptation aux réalités locales</li>
              </ul>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">Sécurité et fiabilité</h3>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Vos données sont protégées avec les plus hauts standards de sécurité.</li>
                <li>Chiffrement des données</li>
                <li>Sauvegardes automatiques</li>
                <li>Accès sécurisé par rôles</li>
                <li>Conformité aux standards</li>
              </ul>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">Image professionnelle</h3>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Modernisez l'image de votre école avec des outils technologiques avancés.</li>
                <li>Interface moderne et intuitive</li>
                <li>Rapports professionnels</li>
                <li>Communication digitale</li>
                <li>Attractivité renforcée</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center">Témoignages de nos utilisateurs</h2>
          <p className="mt-2 text-center text-gray-600">Découvrez ce que disent les directeurs et enseignants qui utilisent SchoolConnect</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <figure className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <blockquote className="text-gray-700 text-sm">"SchoolConnect a révolutionné notre gestion. Nous avons gagné 70% de temps sur nos tâches administratives."</blockquote>
              <figcaption className="mt-3 text-xs text-gray-500">Directeur Mukendi · École Primaire Saint-Joseph, Kinshasa</figcaption>
            </figure>
            <figure className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <blockquote className="text-gray-700 text-sm">"La communication avec les parents n'a jamais été aussi fluide. Les parents apprécient la transparence."</blockquote>
              <figcaption className="mt-3 text-xs text-gray-500">Mme Nsimba · Institut Technique de Lubumbashi</figcaption>
            </figure>
            <figure className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <blockquote className="text-gray-700 text-sm">"L'interface est si simple que même nos enseignants les moins technophiles l'utilisent sans problème."</blockquote>
              <figcaption className="mt-3 text-xs text-gray-500">Prof. Kalala · Collège Moderne de Goma</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center">Pourquoi choisir SchoolConnect ?</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">Déploiement rapide</h3>
              <p className="mt-1 text-sm text-gray-600">Mise en service en moins de 24h avec formation incluse.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">Support local</h3>
              <p className="mt-1 text-sm text-gray-600">Équipe de support basée en RDC, parlant vos langues.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">Évolution continue</h3>
              <p className="mt-1 text-sm text-gray-600">Mises à jour régulières basées sur vos retours.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900">Retour sur investissement garanti</h3>
              <p className="mt-1 text-sm text-gray-600">SchoolConnect se rembourse rapidement grâce aux gains d'efficacité et à l'amélioration de la gestion financière.</p>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Réduction des coûts administratifs</li>
                <li>Jusqu'à 60% de réduction du temps consacré aux tâches administratives.</li>
                <li>Amélioration des recettes</li>
                <li>Meilleur suivi des paiements et réduction des impayés.</li>
                <li>Attractivité renforcée</li>
                <li>Image moderne qui attire de nouveaux élèves et enseignants.</li>
              </ul>
            </div>
          </div>

          <div id="cta" className="mt-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-primary-600 text-white p-6 text-center shadow-lg">
            <h3 className="text-lg font-semibold">Calcul ROI - École de 200 élèves</h3>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-white/80">Coût mensuel SchoolConnect</p>
                <p className="text-xl font-bold">$50 USD</p>
              </div>
              <div>
                <p className="text-white/80">Économies administratives</p>
                <p className="text-xl font-bold">+$80 USD</p>
              </div>
              <div>
                <p className="text-white/80">Amélioration recettes</p>
                <p className="text-xl font-bold">+$120 USD</p>
              </div>
              <div>
                <p className="text-white/80">Bénéfice net mensuel</p>
                <p className="text-xl font-bold">+$150 USD</p>
              </div>
            </div>
            <p className="mt-3 text-sm">ROI de 300% dès le premier mois</p>
          </div>
        </div>
      </section>
    </main>
  )
}
