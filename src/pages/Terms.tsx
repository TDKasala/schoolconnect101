import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <main className="pt-20">
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Conditions d'Utilisation</h1>
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
          <h2>1. Acceptation des conditions</h2>
          <p>
            En utilisant la plateforme SchoolConnect, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'êtes pas d'accord, n'utilisez pas nos services.
          </p>
          
          <h2>2. Utilisation de la plateforme</h2>
          <p>
            Vous vous engagez à utiliser SchoolConnect uniquement à des fins légales et conformément à ces conditions. Vous êtes responsable de toute activité sur votre compte.
          </p>

          <h2>3. Propriété intellectuelle</h2>
          <p>
            Tous les contenus et matériaux de SchoolConnect sont notre propriété ou celle de nos concédants de licence et sont protégés par les lois sur la propriété intellectuelle.
          </p>

          <h2>4. Limitation de responsabilité</h2>
          <p>
            SchoolConnect est fourni "tel quel". Nous ne serons pas responsables des dommages indirects, accessoires, ou consécutifs résultant de l'utilisation de notre plateforme.
          </p>

          <h2>5. Modifications</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout moment. Nous vous informerons de tout changement important.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question concernant ces conditions, veuillez nous contacter à <a href="mailto:legal@schoolconnect.cd">legal@schoolconnect.cd</a>.
          </p>
        </div>
      </section>
    </main>
  )
}
