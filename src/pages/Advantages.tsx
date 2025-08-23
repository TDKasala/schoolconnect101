import { Link } from 'react-router-dom';
import { Zap, Users, BarChart, Globe, Shield, Sparkles, ThumbsUp, Rocket, Target, CheckCircle, Star } from 'lucide-react';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';

const keyAdvantages = [
  {
    icon: <Zap className="h-8 w-8 text-brand-blue" />,
    title: 'Gain de temps considérable',
    description: 'Automatisez les tâches répétitives et libérez du temps pour l\'essentiel : l\'éducation.',
    points: [
      'Saisie automatique des données',
      'Génération instantanée de rapports',
      'Calculs automatiques des moyennes',
      'Notifications automatisées',
    ],
  },
  {
    icon: <Users className="h-8 w-8 text-brand-blue" />,
    title: 'Communication améliorée',
    description: 'Renforcez les liens entre tous les acteurs de votre communauté scolaire.',
    points: [
      'Messagerie intégrée en temps réel',
      'Notifications push instantanées',
      'Portails dédiés par rôle',
      'Partage d\'informations sécurisé',
    ],
  },
  {
    icon: <BarChart className="h-8 w-8 text-brand-blue" />,
    title: 'Décisions basées sur les données',
    description: 'Prenez des décisions éclairées grâce à des analyses détaillées et des rapports précis.',
    points: [
      'Tableaux de bord interactifs',
      'Statistiques en temps réel',
      'Analyses prédictives',
      'Rapports personnalisables',
    ],
  },
  {
    icon: <Globe className="h-8 w-8 text-brand-blue" />,
    title: 'Conception pour la RDC',
    description: 'Solution optimisée pour fonctionner parfaitement avec les infrastructures congolaises.',
    points: [
      'Optimisation faible bande passante',
      'Mode hors ligne disponible',
      'Interface en français',
      'Adaptation aux réalités locales',
    ],
  },
  {
    icon: <Shield className="h-8 w-8 text-brand-blue" />,
    title: 'Sécurité et fiabilité',
    description: 'Vos données sont protégées avec les plus hauts standards de sécurité.',
    points: [
      'Chiffrement des données',
      'Sauvegardes automatiques',
      'Accès sécurisé par rôles',
      'Conformité aux standards',
    ],
  },
  {
    icon: <Sparkles className="h-8 w-8 text-brand-blue" />,
    title: 'Image professionnelle',
    description: 'Modernisez l\'image de votre école avec des outils technologiques avancés.',
    points: [
      'Interface moderne et intuitive',
      'Rapports professionnels',
      'Communication digitale',
      'Attractivité renforcée',
    ],
  },
];

const testimonials = [
  {
    quote: "SchoolConnect a révolutionné notre gestion. Nous avons gagné 70% de temps sur nos tâches administratives.",
    author: 'Directeur Mukendi',
    school: 'École Primaire Saint-Joseph, Kinshasa',
  },
  {
    quote: "La communication avec les parents n'a jamais été aussi fluide. Les parents apprécient la transparence.",
    author: 'Mme Nsimba',
    school: 'Institut Technique de Lubumbashi',
  },
  {
    quote: "L'interface est si simple que même nos enseignants les moins technophiles l'utilisent sans problème.",
    author: 'Prof. Kalala',
    school: 'Collège Moderne de Goma',
  },
];

const whyChooseUs = [
    {
        icon: <Rocket className="h-8 w-8 text-brand-green" />,
        title: 'Déploiement Rapide',
        description: 'Mise en service en moins de 24h avec formation de votre personnel incluse pour une transition en douceur.',
    },
    {
        icon: <ThumbsUp className="h-8 w-8 text-brand-green" />,
        title: 'Support Local et Réactif',
        description: 'Notre équipe de support est basée en RDC, parle vos langues et comprend vos défis quotidiens.',
    },
    {
        icon: <Target className="h-8 w-8 text-brand-green" />,
        title: 'Évolution Continue',
        description: 'Nous améliorons constamment la plateforme avec des mises à jour régulières basées sur vos retours.',
    },
];

export default function Advantages() {
  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-brand-blue-light py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              L'Avantage <span className="text-brand-blue">SchoolConnect</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              Découvrez pourquoi des centaines d'écoles en RDC nous font confiance pour transformer leur gestion et catalyser leur succès.
            </p>
            <div className="mt-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/50 p-6 rounded-2xl shadow-sm">
                  <p className="text-4xl font-bold text-brand-blue">500+</p>
                  <p className="mt-1 text-sm font-medium text-gray-700">Écoles Partenaires</p>
                </div>
                <div className="bg-white/50 p-6 rounded-2xl shadow-sm">
                  <p className="text-4xl font-bold text-brand-blue">50,000+</p>
                  <p className="mt-1 text-sm font-medium text-gray-700">Élèves Gérés</p>
                </div>
                <div className="bg-white/50 p-6 rounded-2xl shadow-sm">
                  <p className="text-4xl font-bold text-brand-blue">99.9%</p>
                  <p className="mt-1 text-sm font-medium text-gray-700">Disponibilité</p>
                </div>
                <div className="bg-white/50 p-6 rounded-2xl shadow-sm">
                  <p className="text-4xl font-bold text-brand-blue">70%</p>
                  <p className="mt-1 text-sm font-medium text-gray-700">Temps Économisé</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Advantages Section */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Des Bénéfices Concrets pour Votre École</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                SchoolConnect n'est pas juste un logiciel, c'est un partenaire de croissance qui apporte des avantages mesurables.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {keyAdvantages.map((advantage) => (
                <div key={advantage.title} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-blue-light">
                    {advantage.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">{advantage.title}</h3>
                  <p className="mt-2 text-gray-600">{advantage.description}</p>
                  <ul className="mt-4 space-y-2">
                    {advantage.points.map((point) => (
                      <li key={point} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-brand-green flex-shrink-0 mt-0.5" />
                        <span className="ml-3 text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Ils nous font confiance</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                Découvrez ce que les directeurs et enseignants disent de leur expérience avec SchoolConnect.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.author} className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                  </div>
                  <blockquote className="text-gray-700 text-lg leading-relaxed">"{testimonial.quote}"</blockquote>
                  <figcaption className="mt-6">
                    <p className="font-bold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.school}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 md:py-28 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Pourquoi Choisir SchoolConnect ?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Nous allons au-delà du logiciel pour vous offrir un partenariat durable et un service exceptionnel.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    {whyChooseUs.map((item) => (
                        <div key={item.title} className="p-8 bg-white rounded-2xl shadow-sm">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-green-light text-brand-green mx-auto">
                                {item.icon}
                            </div>
                            <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
                            <p className="mt-2 text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ROI CTA Section */}
        <section className="bg-brand-blue">
          <div className="max-w-4xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Un Investissement Rentable Dès le Premier Jour
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Calculez le retour sur investissement pour votre école et voyez comment SchoolConnect se finance par les économies qu'il génère.
            </p>
            <div className="mt-10 bg-white/10 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white">ROI pour une école de 200 élèves</h3>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
                    <div>
                        <p className="text-sm opacity-80">Coût Mensuel</p>
                        <p className="text-3xl font-bold">$50</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-80">Économies Admin</p>
                        <p className="text-3xl font-bold text-brand-green-light">+$80</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-80">Recettes Améliorées</p>
                        <p className="text-3xl font-bold text-brand-green-light">+$120</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-80">Bénéfice Net</p>
                        <p className="text-3xl font-bold text-brand-green-light">+$150</p>
                    </div>
                </div>
                <p className="mt-6 text-lg font-semibold text-white">Soit un retour sur investissement de <span className="text-brand-yellow">300%</span> chaque mois.</p>
            </div>
            <div className="mt-10">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-brand-green px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-green/90 transform hover:scale-105 transition-transform duration-300"
              >
                Commencez Votre Transformation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
