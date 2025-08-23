import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';

export default function FAQ() {
  const faqs = [
    {
      q: "Qu'est-ce que SchoolConnect ?",
      a: "SchoolConnect est une plateforme de gestion scolaire tout-en-un conçue pour les écoles de la RDC. Elle simplifie la pédagogie, les finances, la communication et l'administration pour vous permettre de vous concentrer sur l'essentiel : l'éducation.",
    },
    {
      q: 'La plateforme est-elle sécurisée ?',
      a: "Absolument. La sécurité de vos données est notre priorité absolue. Nous utilisons Supabase et PostgreSQL, des technologies de pointe, avec des sauvegardes régulières, un chiffrement des données en transit et au repos, et des contrôles d'accès stricts.",
    },
    {
      q: 'Proposez-vous une démonstration du produit ?',
      a: "Oui ! Nous serions ravis de vous offrir une démonstration personnalisée et gratuite. Contactez-nous pour planifier une session où nous explorerons ensemble les fonctionnalités les plus pertinentes pour votre établissement.",
    },
    {
      q: 'Comment fonctionne la tarification ?',
      a: "Nous avons une structure de tarification flexible et transparente, conçue pour s'adapter à toutes les tailles d'écoles. Consultez notre page de tarifs pour découvrir nos plans, y compris notre offre de démarrage gratuite.",
    },
    {
      q: "Est-ce que SchoolConnect convient aux grands réseaux d'écoles ?",
      a: "Oui. Notre plan Entreprise est spécifiquement conçu pour les groupes scolaires. Il offre un déploiement sur-mesure, des intégrations avancées, un accompagnement dédié et la capacité de gérer plusieurs établissements depuis une seule interface.",
    },
    {
      q: 'Quel type de support client offrez-vous ?',
      a: "Nous offrons un support réactif par email pour tous nos clients. Nos plans payants incluent un support prioritaire par email et téléphone, ainsi qu'un gestionnaire de compte dédié pour notre plan Entreprise afin de garantir votre succès.",
    },
  ] as const;

  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-brand-blue-light py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              Vous Avez des Questions ? <span className="text-brand-blue">Nous Avons les Réponses.</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              Trouvez ici les réponses aux questions les plus fréquentes sur SchoolConnect, sa sécurité, et ses fonctionnalités.
            </p>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-brand-blue transition-colors duration-300"
                >
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="font-semibold text-lg text-gray-900">{faq.q}</span>
                    <ChevronDown className="h-6 w-6 text-brand-blue transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Vous ne trouvez pas votre réponse ?
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-600">
              Notre équipe est là pour vous aider. Contactez-nous pour toute question supplémentaire.
            </p>
            <div className="mt-10">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-brand-green px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-green/90 transform hover:scale-105 transition-transform duration-300"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
