import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Loader2,
  Palette,
  Shield,
  Bell,
  Image
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  description: string;
  updated_at: string;
}

interface SettingsFormData {
  [key: string]: string | boolean | number;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
  show: boolean;
}

const SETTING_CATEGORIES = {
  general: {
    title: 'General Settings',
    icon: Settings,
    description: 'Basic platform configuration'
  },
  authentication: {
    title: 'Authentication',
    icon: Shield,
    description: 'User authentication and security settings'
  },
  notifications: {
    title: 'Notifications',
    icon: Bell,
    description: 'Email and notification preferences'
  },
  branding: {
    title: 'Branding',
    icon: Image,
    description: 'Logo, colors, and visual branding'
  }
};

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [formData, setFormData] = useState<SettingsFormData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>({ type: 'success', message: '', show: false });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      setSettings(data || []);
      
      // Initialize form data
      const initialFormData: SettingsFormData = {};
      data?.forEach(setting => {
        if (setting.type === 'boolean') {
          initialFormData[setting.key] = setting.value === 'true';
        } else if (setting.type === 'number') {
          initialFormData[setting.key] = parseInt(setting.value) || 0;
        } else {
          initialFormData[setting.key] = setting.value || '';
        }
      });
      setFormData(initialFormData);
    } catch (err) {
      console.error('Error fetching settings:', err);
      showToast('error', 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const validateSetting = (key: string, value: any, type: string): string | null => {
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    if (type === 'url' && value) {
      try {
        new URL(value);
      } catch {
        if (!value.startsWith('/')) {
          return 'Please enter a valid URL or path starting with /';
        }
      }
    }
    
    if (type === 'number' && value !== undefined) {
      const num = Number(value);
      if (isNaN(num) || num < 0) {
        return 'Please enter a valid positive number';
      }
    }
    
    return null;
  };

  const handleInputChange = (key: string, value: any, type: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
    
    // Validate on change
    const error = validateSetting(key, value, type);
    if (error) {
      setErrors(prev => ({ ...prev, [key]: error }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate all settings
      const newErrors: { [key: string]: string } = {};
      settings.forEach(setting => {
        const error = validateSetting(setting.key, formData[setting.key], setting.type);
        if (error) {
          newErrors[setting.key] = error;
        }
      });
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        showToast('error', 'Please fix validation errors before saving');
        return;
      }

      // Update settings in database
      const updates = settings.map(setting => {
        let value = formData[setting.key];
        if (setting.type === 'boolean') {
          value = value ? 'true' : 'false';
        } else if (setting.type === 'number') {
          value = value.toString();
        }
        
        return supabase
          .from('settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', setting.key);
      });

      const results = await Promise.all(updates);
      
      // Check for errors
      const hasErrors = results.some(result => result.error);
      if (hasErrors) {
        throw new Error('Failed to update some settings');
      }

      showToast('success', 'Settings saved successfully');
      fetchSettings(); // Refresh to get updated timestamps
    } catch (err) {
      console.error('Error saving settings:', err);
      showToast('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const renderSettingInput = (setting: Setting) => {
    const value = formData[setting.key];
    const hasError = errors[setting.key];

    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={setting.key}
              checked={value as boolean}
              onChange={(e) => handleInputChange(setting.key, e.target.checked, setting.type)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={setting.key} className="ml-2 text-sm text-gray-700">
              {setting.description}
            </label>
          </div>
        );
      
      case 'color':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={value as string}
              onChange={(e) => handleInputChange(setting.key, e.target.value, setting.type)}
              className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={value as string}
              onChange={(e) => handleInputChange(setting.key, e.target.value, setting.type)}
              className={`flex-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="#000000"
            />
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) => handleInputChange(setting.key, parseInt(e.target.value) || 0, setting.type)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              hasError ? 'border-red-300' : 'border-gray-300'
            }`}
            min="0"
          />
        );
      
      default:
        return (
          <input
            type={setting.type === 'email' ? 'email' : 'text'}
            value={value as string}
            onChange={(e) => handleInputChange(setting.key, e.target.value, setting.type)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              hasError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder={setting.type === 'url' ? 'https://example.com or /path' : ''}
          />
        );
    }
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Platform Settings</h1>
          <p className="text-gray-600">Configure global platform settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || Object.keys(errors).some(key => errors[key])}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center ${
          toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Settings Categories */}
      <div className="space-y-8">
        {Object.entries(SETTING_CATEGORIES).map(([categoryKey, category]) => {
          const categorySettings = getSettingsByCategory(categoryKey);
          
          if (categorySettings.length === 0) return null;

          const Icon = category.icon;

          return (
            <div key={categoryKey} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Icon className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{category.title}</h2>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categorySettings.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {setting.key.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </label>
                    {renderSettingInput(setting)}
                    {errors[setting.key] && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {errors[setting.key]}
                      </p>
                    )}
                    {setting.description && setting.type !== 'boolean' && (
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {settings.length === 0 && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No settings found</h3>
          <p className="text-gray-500">Settings will appear here once the database is configured.</p>
        </div>
      )}
    </div>
  );
};
