import { ArrowLeft, BookLock, Database, ShieldCheck, UserCheck, Mail, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';

const policySections = [
  {
    icon: BookLock,
    title: 'Introduction',
    content: 'Bienvenue sur SchoolConnect. Nous nous engageons à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre plateforme.',
  },
  {
    icon: Database,
    title: 'Collecte des informations',
    content: 'Nous collectons des informations lorsque vous vous inscrivez, utilisez nos services, ou communiquez avec nous. Cela inclut des informations personnelles telles que le nom, l\'email, et les données relatives à l\'établissement scolaire.',
  },
  {
    icon: UserCheck,
    title: 'Utilisation des informations',
    content: 'Les informations collectées sont utilisées pour fournir et améliorer nos services, personnaliser votre expérience, communiquer avec vous, et assurer la sécurité de notre plateforme.',
  },
  {
    icon: Server,
    title: 'Partage des informations',
    content: 'Nous ne partageons pas vos informations personnelles avec des tiers, sauf si cela est nécessaire pour fournir nos services (par exemple, avec les administrateurs de votre école) ou si la loi l\'exige.',
  },
  {
    icon: ShieldCheck,
    title: 'Sécurité des Données',
    content: 'Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles robustes pour protéger vos informations contre l\'accès non autorisé, la modification, la divulgation ou la destruction. Cependant, aucune méthode de transmission sur Internet n\'est sécurisée à 100%.',
  },
  {
    icon: Mail,
    title: 'Contact',
    content: 'Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à l\'adresse suivante : privacy@schoolconnect.cd.',
  },
];

export default function Privacy() {
  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gray-50 py-20 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-dark mb-6 group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-semibold">Retour à l’accueil</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Politique de Confidentialité</h1>
            <p className="mt-4 text-lg text-gray-600">Dernière mise à jour : 24 Juillet 2024</p>
          </div>
        </section>

        {/* Policy Content Section */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {policySections.map((section) => (
                <div key={section.title} className="p-8 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-brand-blue-light rounded-full flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-brand-blue" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {section.content}
                    {section.title === 'Contact' && (
                      <a href="mailto:privacy@schoolconnect.cd" className="text-brand-blue font-semibold hover:underline ml-1">
                        privacy@schoolconnect.cd
                      </a>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand-blue">
          <div className="max-w-4xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Votre Confiance est Notre Priorité
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Nous nous engageons à protéger vos données et à maintenir la transparence.
            </p>
            <div className="mt-10">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-brand-blue shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300"
              >
                Contactez-nous pour plus d'infos
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
