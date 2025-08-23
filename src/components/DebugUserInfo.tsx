import React from 'react';
import { useAuth } from '../contexts/SimpleAuthContext';

export const DebugUserInfo: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">Loading user info...</div>;
  }

  return (
    <div className="p-4 bg-blue-100 border border-blue-400 rounded mb-4">
      <h3 className="font-bold mb-2">Debug: Current User Info</h3>
      <div className="space-y-1 text-sm">
        <div><strong>User ID:</strong> {user?.id || 'None'}</div>
        <div><strong>Email:</strong> {user?.email || 'None'}</div>
        <div><strong>Profile Role:</strong> {profile?.role || 'None'}</div>
        <div><strong>Approved:</strong> {profile?.approved ? 'Yes' : 'No'}</div>
        <div><strong>Full Name:</strong> {profile?.full_name || 'None'}</div>
        <div><strong>School ID:</strong> {profile?.school_id || 'None'}</div>
        <div><strong>Can Access Admin:</strong> {profile?.role === 'platform_admin' && profile?.approved ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};
