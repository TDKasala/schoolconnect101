import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { NotificationBell } from '../NotificationBell';
import { 
  Shield, 
  Users, 
  UserCheck, 
  Settings, 
  Sparkles, 
  FileText, 
  MessageSquare,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Bell,
  FileSearch,
  MessageCircle,
  Mail
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    icon: LayoutDashboard,
    path: '/admin/dashboard'
  },
  {
    id: 'analytics',
    label: 'Analytics & Reports',
    icon: BarChart3,
    path: '/admin/analytics'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    path: '/admin/notifications'
  },
  {
    id: 'audit-logs',
    label: 'Audit Logs',
    icon: FileSearch,
    path: '/admin/audit-logs'
  },
  {
    id: 'platform-messaging',
    label: 'Platform Messaging',
    icon: MessageCircle,
    path: '/admin/platform-messaging'
  },
  {
    id: 'contact-center',
    label: 'Contact Center',
    icon: Mail,
    path: '/admin/contact-center'
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    path: '/admin/users'
  },
  {
    id: 'roles',
    label: 'Role Management',
    icon: UserCheck,
    path: '/admin/roles'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/admin/settings'
  },
  {
    id: 'ai-generator',
    label: 'AI Generator',
    icon: Sparkles,
    path: '/admin/ai-generator'
  },
  {
    id: 'reports',
    label: 'Reports/Logs',
    icon: FileText,
    path: '/admin/reports'
  },
  {
    id: 'support',
    label: 'Support/Messages',
    icon: MessageSquare,
    path: '/admin/support'
  }
];

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Role-based access control for admin layout
  useEffect(() => {
    if (!loading) {
      if (!user || !profile) {
        console.log('AdminLayout: No user or profile, redirecting to login');
        navigate('/login');
        return;
      }

      if (profile.role !== 'platform_admin') {
        console.log('AdminLayout: User is not platform_admin, redirecting based on role');
        switch (profile.role) {
          case 'school_admin':
          case 'teacher':
          case 'parent':
            navigate('/dashboard');
            break;
          default:
            navigate('/login');
        }
        return;
      }

      if (!profile.approved) {
        console.log('AdminLayout: User not approved');
        navigate('/login');
        return;
      }
    }
  }, [user, profile, loading, navigate]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false); // Close mobile sidebar after navigation
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Info & Sign Out */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profile?.email}
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-gray-900">
                SchoolConnect Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <span className="hidden sm:block text-sm text-gray-600">
                Welcome, {profile?.full_name || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
