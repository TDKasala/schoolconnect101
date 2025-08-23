import { ArrowLeft, FileCheck, Users, Copyright, ShieldAlert, FileEdit, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';
import { useScrollToTop } from '../hooks/useScrollToTop';

const termsSections = [
  {
    icon: FileCheck,
    title: '1. Acceptation des conditions',
    content: 'En utilisant la plateforme SchoolConnect, vous acceptez d\'être lié par ces conditions d\'utilisation. Si vous n\'êtes pas d\'accord, n\'utilisez pas nos services.',
  },
  {
    icon: Users,
    title: '2. Utilisation de la plateforme',
    content: 'Vous vous engagez à utiliser SchoolConnect uniquement à des fins légales et conformément à ces conditions. Vous êtes responsable de toute activité sur votre compte.',
  },
  {
    icon: Copyright,
    title: '3. Propriété intellectuelle',
    content: 'Tous les contenus et matériaux de SchoolConnect sont notre propriété ou celle de nos concédants de licence et sont protégés par les lois sur la propriété intellectuelle.',
  },
  {
    icon: ShieldAlert,
    title: '4. Limitation de responsabilité',
    content: 'SchoolConnect est fourni \"tel quel\". Nous ne serons pas responsables des dommages indirects, accessoires, ou consécutifs résultant de l\'utilisation de notre plateforme.',
  },
  {
    icon: FileEdit,
    title: '5. Modifications des Conditions',
    content: 'Nous nous réservons le droit de modifier ces conditions à tout moment. Nous vous informerons de tout changement important en publiant les nouvelles conditions sur cette page.',
  },
  {
    icon: Mail,
    title: 'Contact',
    content: 'Pour toute question concernant ces conditions, veuillez nous contacter à l\'adresse suivante : legal@schoolconnect.cd.',
  },
];

export default function Terms() {
  useScrollToTop();
  
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
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Conditions d'Utilisation</h1>
            <p className="mt-4 text-lg text-gray-600">Dernière mise à jour : 24 Juillet 2024</p>
          </div>
        </section>

        {/* Terms Content Section */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {termsSections.map((section) => (
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
                      <a href="mailto:legal@schoolconnect.cd" className="text-brand-blue font-semibold hover:underline ml-1">
                        legal@schoolconnect.cd
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
              Prêt à Simplifier la Gestion de Votre École ?
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Rejoignez les centaines d'écoles qui font confiance à SchoolConnect.
            </p>
            <div className="mt-10">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-brand-blue shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300"
              >
                Demander une démo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
