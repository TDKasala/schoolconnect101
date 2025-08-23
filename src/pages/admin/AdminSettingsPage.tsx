import React from 'react';
import { Settings, Clock } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon: Settings</h1>
        <p className="text-gray-600 mb-4">
          This feature will allow you to configure platform settings and preferences.
        </p>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          Feature in development
        </div>
      </div>
    </div>
  );
};
