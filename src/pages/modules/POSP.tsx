import { ArrowRight, BookOpen, BarChart, UserCheck, Calendar, Award, TrendingUp, Users, Shield, Zap } from 'lucide-react';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const features = [
  {
    icon: <UserCheck className="h-8 w-8 text-brand-blue" />,
    title: 'Suivi de présence numérique',
    description: 'Pointage électronique des élèves avec historique complet et statistiques de présence.',
  },
  {
    icon: <BookOpen className="h-8 w-8 text-brand-blue" />,
    title: 'Carnet de notes en ligne',
    description: 'Gestion complète des évaluations avec saisie simplifiée et consultation en temps réel.',
  },
  {
    icon: <Calendar className="h-8 w-8 text-brand-blue" />,
    title: 'Gestion des examens et devoirs',
    description: 'Planification et suivi des évaluations avec calendrier intégré.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-brand-blue" />,
    title: 'Calcul automatique des moyennes',
    description: 'Calculs automatisés avec pondération personnalisable selon vos critères.',
  },
  {
    icon: <Award className="h-8 w-8 text-brand-blue" />,
    title: 'Suivi disciplinaire',
    description: 'Gestion des sanctions et récompenses avec historique comportemental.',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-brand-blue" />,
    title: 'Statistiques de réussite',
    description: 'Tableaux de bord avec analyses détaillées des performances scolaires.',
  },
];

const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-brand-green" />,
      title: 'Gain de temps considérable',
      description: 'Automatisez les tâches répétitives et libérez du temps pour vous concentrer sur l\'essentiel : l\'enseignement et la réussite de vos élèves.',
    },
    {
      icon: <Users className="h-8 w-8 text-brand-green" />,
      title: 'Suivi personnalisé et efficace',
      description: 'Obtenez une vue à 360° des progrès de chaque élève grâce à des outils d\'analyse avancés et des rapports détaillés.',
    },
    {
      icon: <Shield className="h-8 w-8 text-brand-green" />,
      title: 'Communication centralisée',
      description: 'Partagez facilement et en toute sécurité les informations importantes avec les parents, les élèves et l\'administration.',
    },
];

const TeacherDashboardPreview = () => (
    <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200/80 transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-lg text-gray-800">Tableau de bord Enseignant</h4>
        <span className="text-sm font-medium text-gray-500">Aujourd'hui</span>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold text-brand-blue">Mathématiques - 6ème A</p>
          <div className="mt-2 flex justify-between items-baseline">
            <span className="text-gray-600">Taux de présence</span>
            <span className="font-bold text-2xl text-green-500">93%</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold text-brand-blue">Moyenne de la classe</p>
          <div className="mt-2 flex justify-between items-baseline">
            <span className="text-gray-600">Dernière évaluation</span>
            <span className="font-bold text-2xl text-brand-yellow">14.2/20</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold text-brand-blue">Tâches en attente</p>
          <div className="mt-2 flex justify-between items-baseline">
            <span className="text-gray-600">Devoirs à corriger</span>
            <span className="font-bold text-2xl text-red-500">12</span>
          </div>
        </div>
      </div>
    </div>
  );

export default function POSP() {
  useScrollToTop();
  
  return (
    <div className="bg-white text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-brand-blue-light pt-24 pb-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-dark-blue mb-4 leading-tight">
            Module Pédagogie (POSP)
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-8">
            Optimisez la gestion pédagogique de votre établissement. Des outils intuitifs pour le suivi des présences, des notes, des examens et de la discipline.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="bg-brand-blue text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-brand-blue-dark transition-all duration-300 ease-in-out transform hover:scale-105">
              Demander une démo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue">Une suite complète pour la gestion pédagogique</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Tout ce dont vous avez besoin pour une gestion scolaire efficace et centralisée.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
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
                <div className="order-2 lg:order-1">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue mb-6">Simplifiez le quotidien, maximisez l'impact</h2>
                    <div className="space-y-6">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="flex items-start">
                                <div className="flex-shrink-0 p-2 bg-brand-green-light rounded-full">
                                    {benefit.icon}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                                    <p className="text-gray-600 mt-1">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 lg:order-2">
                    <TeacherDashboardPreview />
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-dark-blue text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à transformer votre gestion pédagogique ?</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
            Découvrez par vous-même comment SchoolConnect peut simplifier vos processus et améliorer la réussite de vos élèves. Demandez une démo personnalisée dès aujourd'hui.
          </p>
          <Link
            to="/contact"
            className="bg-brand-yellow text-brand-dark-blue font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-white transition-all duration-300 ease-in-out transform hover:scale-105 inline-flex items-center"
          >
            Commencer maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
