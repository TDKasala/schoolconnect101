import { ArrowLeft, CheckCircle, Users, GraduationCap, UserCog, MessageSquare, Bell, Calendar, ShieldCheck, BarChart2, Banknote, UserPlus, Building, Globe, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { AnimatePresence, motion } from 'framer-motion';


const ParentPortalPreview = () => (
  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 w-full">
    <div className="flex items-center gap-4">
      <img className="h-16 w-16 rounded-full object-cover" src="/images/student-avatar.png" alt="Avatar élève" />
      <div>
        <h4 className="font-bold text-xl text-gray-900">Marie Kabongo</h4>
        <p className="text-gray-600">Classe de 6ème A</p>
      </div>
    </div>
    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-sm text-gray-500">Moyenne</p>
        <p className="font-bold text-2xl text-brand-blue">15.2<span className="text-base">/20</span></p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Présence</p>
        <p className="font-bold text-2xl text-brand-blue">98%</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Paiement</p>
        <p className="font-bold text-lg text-brand-green bg-brand-green/10 px-3 py-1 rounded-full">À jour</p>
      </div>
    </div>
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h5 className="font-semibold text-gray-800">Dernière Communication</h5>
      <div className="mt-3 bg-brand-blue-light p-4 rounded-lg">
        <p className="font-semibold text-brand-blue-dark">Réunion Parents-Professeurs</p>
        <p className="text-sm text-gray-700">Le 15 mars à 14h. Votre présence est vivement souhaitée.</p>
      </div>
    </div>
  </div>
);

const TeacherPortalPreview = () => (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 w-full">
        <h4 className="font-bold text-xl text-gray-900 mb-4">Carnet de notes - Mathématiques</h4>
        <div className="space-y-3">
            <div className="grid grid-cols-3 items-center bg-gray-50 p-2 rounded-lg">
                <span className="font-medium">Jean Dupont</span>
                <span className="text-center">17/20</span>
                <span className="text-right text-green-600">+2 pts</span>
            </div>
            <div className="grid grid-cols-3 items-center bg-gray-50 p-2 rounded-lg">
                <span className="font-medium">Amina Diallo</span>
                <span className="text-center">14/20</span>
                <span className="text-right text-red-600">-1 pt</span>
            </div>
            <div className="grid grid-cols-3 items-center bg-gray-50 p-2 rounded-lg">
                <span className="font-medium">Pierre Nzeza</span>
                <span className="text-center">16/20</span>
                <span className="text-right text-green-600">+1 pt</span>
            </div>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-4">
            <h5 className="font-semibold text-gray-800">Prochaine évaluation</h5>
            <div className="mt-3 bg-brand-yellow-light p-4 rounded-lg">
                <p className="font-semibold text-yellow-800">Interrogation Chapitre 3</p>
                <p className="text-sm text-yellow-700">Le 20 mars. Notée sur 20 points.</p>
            </div>
        </div>
    </div>
);

const AdminPortalPreview = () => (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 w-full">
        <h4 className="font-bold text-xl text-gray-900 mb-4">Tableau de Bord de l'École</h4>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-blue-light p-4 rounded-lg">
                <div className="flex items-center gap-2"><Users className="h-5 w-5 text-brand-blue"/> <span className="font-semibold">Total Élèves</span></div>
                <p className="font-bold text-2xl mt-1">1,254</p>
            </div>
            <div className="bg-brand-green-light p-4 rounded-lg">
                <div className="flex items-center gap-2"><Banknote className="h-5 w-5 text-brand-green"/> <span className="font-semibold">Taux de Recouvrement</span></div>
                <p className="font-bold text-2xl mt-1">92%</p>
            </div>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
            <h5 className="font-semibold text-gray-800 mb-2">Raccourcis rapides</h5>
            <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium px-3 py-2 rounded-lg"><UserPlus className="h-4 w-4" /> Inscrire un élève</button>
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium px-3 py-2 rounded-lg"><BarChart2 className="h-4 w-4" /> Voir les rapports</button>
            </div>
        </div>
    </div>
);

const portals = [
  {
    id: 'parent',
    icon: Users,
    title: 'Portail Parent',
    description: 'Accès complet aux informations de votre enfant avec suivi en temps réel pour une implication parentale renforcée.',
    features: [
        'Consultation des notes et bulletins',
        'Suivi des paiements et facturation',
        'Calendrier des événements et examens',
        'Communication directe avec les enseignants',
        'Historique des présences et absences',
        'Accès aux rapports de comportement',
    ],
    preview: <ParentPortalPreview />,
  },
  {
    id: 'teacher',
    icon: GraduationCap,
    title: 'Portail Enseignant',
    description: 'Outils dédiés pour optimiser la gestion de la classe, l\'enseignement et la communication avec les familles.',
    features: [
        'Gestion du carnet de notes numérique',
        'Pointage des présences simplifié',
        'Planification des cours et devoirs',
        'Banque de ressources pédagogiques',
        'Communication avec parents et administration',
        'Génération de rapports de performance par élève',
    ],
    preview: <TeacherPortalPreview />,
  },
  {
    id: 'admin',
    icon: UserCog,
    title: 'Portail Administrateur',
    description: 'Centre de commande pour la gestion globale de l\'établissement, des finances à la communication.',
    features: [
        'Tableau de bord avec statistiques clés',
        'Gestion du personnel, des élèves et des classes',
        'Supervision des finances et de la facturation',
        'Gestion des accès et des permissions',
        'Communication à l\'échelle de l\'école',
        'Configuration des années académiques',
    ],
    preview: <AdminPortalPreview />,
  },
];

export default function Portails() {
  useScrollToTop();
  
  const [activeTab, setActiveTab] = useState(portals[0].id);
  const activePortal = portals.find(p => p.id === activeTab);

  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-brand-blue-light py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              Des Portails <span className="text-brand-blue">Dédiés</span> pour Chaque Acteur
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              Découvrez des interfaces sur-mesure pour les administrateurs, enseignants et parents, conçues pour une collaboration et une efficacité maximales.
            </p>
          </div>
        </section>

        {/* Portals TABS Section */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Des Outils Puissants pour Chaque Rôle
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                Chaque portail est conçu pour fournir les fonctionnalités exactes dont nos utilisateurs ont besoin, sans complexité inutile.
              </p>
            </div>

            <div className="flex justify-center mb-12">
                <div className="flex space-x-2 bg-gray-200 p-2 rounded-full">
                    {portals.map(portal => (
                        <button 
                            key={portal.id} 
                            onClick={() => setActiveTab(portal.id)}
                            className={`${activeTab === portal.id ? 'bg-white text-brand-blue shadow' : 'text-gray-600 hover:bg-gray-300/50'} flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors duration-300`}
                        >
                            <portal.icon className={`h-5 w-5 ${activeTab === portal.id ? 'text-brand-blue' : 'text-gray-500'}`} />
                            {portal.title}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activePortal && (
                    <motion.div 
                        key={activePortal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid md:grid-cols-2 items-center gap-12"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{activePortal.title}</h3>
                            <p className="text-gray-600 text-lg mb-6">{activePortal.description}</p>
                            <ul className="space-y-3">
                                {activePortal.features.map(feature => (
                                    <li key={feature} className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-brand-green mt-1 flex-shrink-0" />
                                        <span className="ml-3 text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex items-center justify-center">
                           {activePortal.preview}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </section>

        {/* Communication Section */}
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Une Communication <span className="text-brand-green">Fluide et Centralisée</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                Renforcez les liens entre l'école, les enseignants et les parents grâce à des outils de communication intégrés et intuitifs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <MessageSquare className="h-10 w-10 text-brand-blue" />, title: 'Messagerie Intégrée', text: 'Échanges directs et sécurisés entre parents, enseignants et administration.' },
                { icon: <Bell className="h-10 w-10 text-brand-blue" />, title: 'Notifications en Temps Réel', text: 'Alertes instantanées pour les annonces, absences et événements importants.' },
                { icon: <Calendar className="h-10 w-10 text-brand-blue" />, title: 'Calendrier Partagé', text: 'Synchronisation des emplois du temps, devoirs et événements scolaires.' },
                { icon: <ShieldCheck className="h-10 w-10 text-brand-blue" />, title: 'Transparence Totale', text: 'Accès centralisé à l\'information pour une vision claire et partagée.' },
              ].map(item => (
                <div key={item.title} className="p-8 bg-gray-50 rounded-2xl text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg">
                  <div className="inline-block p-4 bg-brand-blue-light rounded-full mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Final CTA */}
      <section className="bg-brand-blue">
        <div className="max-w-4xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Connectez Votre Communauté Éducative
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Découvrez comment nos portails spécialisés peuvent transformer la collaboration au sein de votre école.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-brand-green px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-green/90 transform hover:scale-105 transition-transform duration-300"
            >
              Demander une démo
            </Link>
            <Link
              to="/tarifs"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-brand-blue shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
