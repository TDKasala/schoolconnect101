import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function POSP() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l’accueil
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Module POSP - Gestion Pédagogique
          </h1>
          <p className="mt-4 text-lg leading-6 text-gray-500">
            Gestion complète des élèves, des classes, des présences, des notes et des bulletins.
          </p>
        </div>
        <div className="mt-10">
          {/* Content for POSP module will go here */}
        </div>
      </div>
    </div>
  );
}
