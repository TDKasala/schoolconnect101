import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <main className="pt-20">
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Politique de Confidentialité</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Dernière mise à jour : 24 Juillet 2024</p>
          <div className="mt-6">
            <Link to="/" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l’accueil
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose lg:prose-xl">
          <h2>Introduction</h2>
          <p>
            Bienvenue sur SchoolConnect. Nous nous engageons à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre plateforme.
          </p>
          
          <h2>Collecte des informations</h2>
          <p>
            Nous collectons des informations lorsque vous vous inscrivez, utilisez nos services, ou communiquez avec nous. Cela inclut des informations personnelles telles que le nom, l'email, et les données relatives à l'établissement scolaire.
          </p>

          <h2>Utilisation des informations</h2>
          <p>
            Les informations collectées sont utilisées pour fournir et améliorer nos services, personnaliser votre expérience, communiquer avec vous, et assurer la sécurité de notre plateforme.
          </p>

          <h2>Partage des informations</h2>
          <p>
            Nous ne partageons pas vos informations personnelles avec des tiers, sauf si cela est nécessaire pour fournir nos services (par exemple, avec les administrateurs de votre école) ou si la loi l'exige.
          </p>

          <h2>Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité pour protéger vos informations. Cependant, aucune méthode de transmission sur Internet n'est sécurisée à 100%.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à <a href="mailto:privacy@schoolconnect.cd">privacy@schoolconnect.cd</a>.
          </p>
        </div>
      </section>
    </main>
  )
}
