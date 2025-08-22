import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, BookOpen, BarChart, UserCheck, Calendar, Award, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: <UserCheck className="h-6 w-6 text-blue-600" />,
    title: 'Suivi de présence numérique',
    description: 'Pointage électronique des élèves avec historique complet et statistiques de présence.',
    details: ['Pointage rapide et précis', 'Historique détaillé par élève', 'Alertes automatiques d\'absence', 'Rapports de présence personnalisables'],
  },
  {
    icon: <BookOpen className="h-6 w-6 text-blue-600" />,
    title: 'Carnet de notes en ligne',
    description: 'Gestion complète des évaluations avec saisie simplifiée et consultation en temps réel.',
    details: ['Saisie intuitive des notes', 'Organisation par matières', 'Consultation temps réel', 'Historique des évaluations'],
  },
  {
    icon: <Calendar className="h-6 w-6 text-blue-600" />,
    title: 'Gestion des examens et devoirs',
    description: 'Planification et suivi des évaluations avec calendrier intégré.',
    details: ['Calendrier des examens', 'Planification des devoirs', 'Notifications automatiques', 'Suivi des corrections'],
  },
  {
    icon: <BarChart className="h-6 w-6 text-blue-600" />,
    title: 'Calcul automatique des moyennes',
    description: 'Calculs automatisés avec pondération personnalisable selon vos critères.',
    details: ['Moyennes automatiques', 'Pondération flexible', 'Classements automatiques', 'Bulletins générés'],
  },
  {
    icon: <Award className="h-6 w-6 text-blue-600" />,
    title: 'Suivi disciplinaire',
    description: 'Gestion des sanctions et récompenses avec historique comportemental.',
    details: ['Registre disciplinaire', 'Suivi comportemental', 'Alertes parents', 'Rapports de conduite'],
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
    title: 'Statistiques de réussite',
    description: 'Tableaux de bord avec analyses détaillées des performances scolaires.',
    details: ['Analyses par classe', 'Évolution des performances', 'Comparaisons temporelles', 'Rapports visuels'],
  },
];

export default function POSP() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <Link
                to="/"
                className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 mb-8"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l’accueil
            </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Module Pédagogie
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Gérez l'ensemble de vos activités pédagogiques avec des outils modernes et intuitifs, conçus pour simplifier le quotidien des enseignants.
          </p>
          <div className="mt-8">
            <a
              href="mailto:contact@schoolconnect.cd?subject=Demande%20de%20d%C3%A9mo%20-%20Module%20P%C3%A9dagogie"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Demander une démo
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Fonctionnalités Complètes</h2>
            <p className="mt-4 text-lg text-gray-500">
              Tous les outils nécessaires pour une gestion pédagogique efficace et moderne
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                        <ul className="mt-3 space-y-1">
                            {feature.details.map(detail => (
                                <li key={detail} className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="ml-2 text-sm text-gray-500">{detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900">Simplifiez votre gestion pédagogique</h2>
                <div className="mt-8 space-y-6">
                    <div className="flex items-start">
                        <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold">Gain de temps considérable</h3>
                            <p className="text-gray-600">Automatisez les tâches répétitives et concentrez-vous sur l'enseignement.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <UserCheck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold">Suivi personnalisé</h3>
                            <p className="text-gray-600">Suivez les progrès de chaque élève avec des outils d'analyse avancés.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold">Communication améliorée</h3>
                            <p className="text-gray-600">Partagez facilement les informations avec les parents et l'administration.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h4 className="font-bold text-lg text-gray-800">Tableau de bord enseignant</h4>
                <div className="mt-4 bg-white p-4 rounded-lg shadow-inner">
                    <p className="font-semibold text-blue-700">6ème A - Mathématiques</p>
                    <div className="mt-3 flex justify-between items-baseline">
                        <span className="text-gray-600">Présents</span>
                        <span className="font-bold text-xl">28/30</span>
                    </div>
                    <div className="mt-2 flex justify-between items-baseline">
                        <span className="text-gray-600">Moyenne générale</span>
                        <span className="font-bold text-xl text-green-600">14.2/20</span>
                    </div>
                    <div className="mt-2 flex justify-between items-baseline">
                        <span className="text-gray-600">Devoirs à corriger</span>
                        <span className="font-bold text-xl text-red-600">12</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
