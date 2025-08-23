import { ArrowRight, MessageSquare, GraduationCap, CalendarCheck, BarChart2, ShieldCheck, Users } from 'lucide-react';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const portalFeatures = [
  {
    icon: <GraduationCap className="h-8 w-8 text-brand-blue" />,
    title: 'Suivi Académique en Temps Réel',
    description: 'Consultez les notes, les moyennes et les commentaires des enseignants dès leur publication.',
  },
  {
    icon: <CalendarCheck className="h-8 w-8 text-brand-blue" />,
    title: 'Gestion des Absences',
    description: 'Visualisez l\'historique de présence, signalez les absences prévues et recevez des alertes.',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-brand-blue" />,
    title: 'Messagerie Sécurisée',
    description: 'Communiquez directement avec les enseignants et l\'administration de manière simple et sécurisée.',
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-brand-blue" />,
    title: 'Rapports de Progrès',
    description: 'Accédez à des bulletins et des rapports de performance détaillés pour suivre l\'évolution de l\'élève.',
  },
];

const ParentPortalPreview = () => (
  <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200/80 transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <div className="flex justify-between items-center mb-6">
      <h4 className="font-bold text-lg text-gray-800">Portail Parent - John Doe</h4>
      <img src="/images/avatar-parent.png" alt="Parent Avatar" className="h-12 w-12 rounded-full border-2 border-brand-blue"/>
    </div>
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="font-semibold text-brand-blue">Prochain événement</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-gray-600">Réunion Parents-Profs</span>
          <span className="font-bold text-lg text-brand-yellow">25/10/2023</span>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="font-semibold text-brand-blue">Dernière note publiée</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-gray-600">Histoire - Interrogation</span>
          <span className="font-bold text-2xl text-green-500">17/20</span>
        </div>
      </div>
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="font-semibold text-red-700">Alerte d'absence</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-red-600">Absence non justifiée</span>
          <span className="font-bold text-lg text-red-600">20/10/2023</span>
        </div>
      </div>
    </div>
  </div>
);

export default function PortailsModule() {
  useScrollToTop();
  
  return (
    <div className="bg-white text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-brand-green-light pt-24 pb-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-dark-blue mb-4 leading-tight">
            Module Portails : Parents & Élèves
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-8">
            Renforcez le lien entre l'école et la maison avec des portails dédiés, sécurisés et accessibles 24/7 pour un suivi scolaire optimal.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="bg-brand-green text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-brand-green-dark transition-all duration-300 ease-in-out transform hover:scale-105">
              Découvrir les avantages
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue">Un accès direct à l'information essentielle</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Tout ce dont les parents et les élèves ont besoin, à portée de main.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {portalFeatures.map((feature) => (
              <div key={feature.title} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col items-center text-center">
                <div className="p-4 bg-brand-blue-light rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue mb-6">Une collaboration école-famille renforcée</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-brand-green-light rounded-full">
                    <Users className="h-8 w-8 text-brand-green" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">Engagement Parental Accru</h3>
                    <p className="text-gray-600 mt-1">Les parents deviennent des partenaires actifs dans le parcours éducatif de leur enfant.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-brand-green-light rounded-full">
                    <ShieldCheck className="h-8 w-8 text-brand-green" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">Autonomie et Responsabilité</h3>
                    <p className="text-gray-600 mt-1">Les élèves apprennent à suivre leurs propres progrès et à gérer leurs responsabilités scolaires.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-2 lg:order-1">
              <ParentPortalPreview />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-dark-blue text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Connectez votre communauté scolaire dès aujourd'hui</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
            Offrez une expérience transparente et collaborative. Contactez-nous pour une démo et voyez comment les portails SchoolConnect peuvent transformer votre communication.
          </p>
          <Link
            to="/contact"
            className="bg-brand-yellow text-brand-dark-blue font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-white transition-all duration-300 ease-in-out transform hover:scale-105 inline-flex items-center"
          >
            Demander une démo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
