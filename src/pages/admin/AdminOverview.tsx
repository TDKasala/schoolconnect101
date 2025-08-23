import React from 'react';
import { Shield, Users, School, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/SimpleAuthContext';

export const AdminOverview: React.FC = () => {
  const { profile, user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the SchoolConnect admin dashboard</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <Users className="h-8 w-8 text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Users</h3>
          <p className="text-gray-600">Manage platform users</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <School className="h-8 w-8 text-green-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Schools</h3>
          <p className="text-gray-600">Manage schools</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <Settings className="h-8 w-8 text-purple-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
          <p className="text-gray-600">Platform configuration</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <Shield className="h-8 w-8 text-red-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          <p className="text-gray-600">System security</p>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current User Information</h3>
        <div className="space-y-2">
          <p><strong>Email:</strong> {profile?.email || user?.email}</p>
          <p><strong>Name:</strong> {profile?.full_name || 'Not set'}</p>
          <p><strong>Role:</strong> {profile?.role || 'Unknown'}</p>
          <p><strong>Approved:</strong> {profile?.approved ? 'Yes' : 'No'}</p>
          <p><strong>User ID:</strong> {profile?.id || user?.id}</p>
        </div>
      </div>
    </div>
  );
};
