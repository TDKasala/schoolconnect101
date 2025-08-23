import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  MessageSquare, 
  Users, 
  GraduationCap,
  Send,
  Copy,
  Download,
  RefreshCw,
  Wand2,
  BookOpen,
  Calendar,
  Mail
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'content' | 'communication' | 'academic' | 'administrative';
}

const aiTools: AITool[] = [
  {
    id: 'bulletin-generator',
    name: 'Générateur de Bulletins',
    description: 'Génère automatiquement des bulletins scolaires personnalisés avec commentaires IA',
    icon: GraduationCap,
    category: 'academic'
  },
  {
    id: 'announcement-writer',
    name: 'Rédacteur d\'Annonces',
    description: 'Crée des annonces officielles pour l\'école avec un ton professionnel',
    icon: MessageSquare,
    category: 'communication'
  },
  {
    id: 'email-composer',
    name: 'Compositeur d\'Emails',
    description: 'Génère des emails personnalisés pour parents, enseignants et étudiants',
    icon: Mail,
    category: 'communication'
  },
  {
    id: 'lesson-planner',
    name: 'Planificateur de Cours',
    description: 'Aide à créer des plans de cours structurés et des activités pédagogiques',
    icon: BookOpen,
    category: 'academic'
  },
  {
    id: 'report-generator',
    name: 'Générateur de Rapports',
    description: 'Crée des rapports administratifs et académiques détaillés',
    icon: FileText,
    category: 'administrative'
  },
  {
    id: 'event-planner',
    name: 'Planificateur d\'Événements',
    description: 'Organise et planifie les événements scolaires avec suggestions IA',
    icon: Calendar,
    category: 'administrative'
  }
];

export const AdminAIGenerator: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tous', count: aiTools.length },
    { id: 'academic', name: 'Académique', count: aiTools.filter(t => t.category === 'academic').length },
    { id: 'communication', name: 'Communication', count: aiTools.filter(t => t.category === 'communication').length },
    { id: 'administrative', name: 'Administratif', count: aiTools.filter(t => t.category === 'administrative').length }
  ];

  const filteredTools = activeCategory === 'all' 
    ? aiTools 
    : aiTools.filter(tool => tool.category === activeCategory);

  const handleGenerate = async () => {
    if (!selectedTool || !prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const sampleContent = generateSampleContent(selectedTool.id, prompt);
      setGeneratedContent(sampleContent);
      setIsGenerating(false);
    }, 2000);
  };

  const generateSampleContent = (toolId: string, userPrompt: string): string => {
    const samples: Record<string, string> = {
      'bulletin-generator': `BULLETIN SCOLAIRE - TRIMESTRE 1

Élève: [Nom de l'élève]
Classe: [Classe]
Période: Premier Trimestre 2024

RÉSULTATS ACADÉMIQUES:
- Mathématiques: 15/20 - Très bon niveau, continue tes efforts
- Français: 14/20 - Bonne maîtrise de l'expression écrite
- Sciences: 16/20 - Excellent travail en laboratoire
- Histoire-Géographie: 13/20 - Participation active en classe

COMMENTAIRE GÉNÉRAL:
Élève sérieux et appliqué qui fait preuve d'une grande motivation. Les résultats sont satisfaisants dans l'ensemble. Nous encourageons la poursuite des efforts, particulièrement en français où des progrès sont encore possibles.

RECOMMANDATIONS:
- Continuer le travail régulier
- Approfondir la lecture personnelle
- Participer davantage aux discussions en classe`,

      'announcement-writer': `ANNONCE OFFICIELLE - ÉCOLE SCHOOLCONNECT

Objet: ${userPrompt}

Chers parents, enseignants et élèves,

Nous avons le plaisir de vous informer des dernières actualités de notre établissement.

[Contenu principal généré selon votre demande]

Cette initiative s'inscrit dans notre démarche d'amélioration continue de la qualité de l'enseignement et du bien-être de nos élèves.

Pour toute question ou information complémentaire, n'hésitez pas à contacter l'administration.

Cordialement,
La Direction`,

      'email-composer': `Objet: ${userPrompt}

Bonjour,

J'espère que ce message vous trouve en bonne santé.

[Contenu personnalisé selon votre demande]

Nous restons à votre disposition pour tout complément d'information.

Cordialement,
L'équipe SchoolConnect`,

      'lesson-planner': `PLAN DE COURS - ${userPrompt}

OBJECTIFS PÉDAGOGIQUES:
- Objectif principal: [À définir selon la matière]
- Objectifs secondaires: [Compétences transversales]

DÉROULEMENT (45 minutes):
1. Introduction (5 min) - Rappel des acquis
2. Développement (25 min) - Nouveaux concepts
3. Exercices pratiques (10 min) - Application
4. Synthèse (5 min) - Récapitulatif

MATÉRIEL NÉCESSAIRE:
- Support de cours
- Exercices d'application
- Matériel spécialisé si nécessaire

ÉVALUATION:
- Participation orale
- Exercices pratiques
- Contrôle de connaissances`,

      'report-generator': `RAPPORT - ${userPrompt}

RÉSUMÉ EXÉCUTIF:
Ce rapport présente une analyse détaillée de [sujet] sur la période considérée.

DONNÉES PRINCIPALES:
- Indicateur 1: [Valeur et évolution]
- Indicateur 2: [Valeur et évolution]
- Indicateur 3: [Valeur et évolution]

ANALYSE:
Les résultats montrent une tendance positive dans l'ensemble, avec quelques points d'attention à surveiller.

RECOMMANDATIONS:
1. Maintenir les bonnes pratiques actuelles
2. Renforcer les domaines identifiés comme prioritaires
3. Mettre en place un suivi régulier

CONCLUSION:
[Synthèse des points clés et perspectives]`,

      'event-planner': `PLANIFICATION D'ÉVÉNEMENT - ${userPrompt}

INFORMATIONS GÉNÉRALES:
- Événement: [Nom de l'événement]
- Date proposée: [À définir]
- Lieu: [À confirmer]
- Public cible: [Élèves/Parents/Enseignants]

PROGRAMME PRÉLIMINAIRE:
09h00 - Accueil et inscription
09h30 - Cérémonie d'ouverture
10h00 - Activités principales
12h00 - Pause déjeuner
14h00 - Ateliers et démonstrations
16h00 - Clôture et remise des prix

RESSOURCES NÉCESSAIRES:
- Personnel: [Nombre d'encadrants]
- Matériel: [Liste du matériel]
- Budget estimé: [Montant]

TÂCHES À RÉALISER:
- Réservation du lieu
- Communication aux familles
- Préparation du matériel
- Coordination des équipes`
    };

    return samples[toolId] || `Contenu généré pour: ${userPrompt}\n\n[Le contenu IA sera généré ici selon vos spécifications]`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const downloadContent = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ai-generated-${selectedTool?.id}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
          Générateur IA
        </h1>
        <p className="text-gray-600">
          Outils d'intelligence artificielle pour automatiser la création de contenu éducatif et administratif
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Tools List */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Outils Disponibles</h2>
          <div className="space-y-3">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    selectedTool?.id === tool.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start">
                    <Icon className={`h-5 w-5 mt-0.5 mr-3 ${
                      selectedTool?.id === tool.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Generator */}
        <div className="lg:col-span-2">
          {selectedTool ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <selectedTool.icon className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">{selectedTool.name}</h2>
                </div>
                <p className="text-gray-600 mb-4">{selectedTool.description}</p>

                {/* Prompt Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Décrivez ce que vous souhaitez générer:
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Bulletin pour un élève de 6ème avec de bons résultats en mathématiques..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? 'Génération...' : 'Générer avec IA'}
                </button>
              </div>

              {/* Generated Content */}
              {generatedContent && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Contenu Généré</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copier
                      </button>
                      <button
                        onClick={downloadContent}
                        className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-md p-4 border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {generatedContent}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un outil IA</h3>
              <p className="text-gray-600">
                Choisissez un outil dans la liste de gauche pour commencer à générer du contenu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
