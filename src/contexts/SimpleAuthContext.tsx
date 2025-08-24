import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { sessionDebug } from '../utils/sessionDebug';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'platform_admin' | 'school_admin' | 'teacher' | 'parent';
  approved: boolean;
  school_id: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('SimpleAuth: Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, approved, school_id')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('SimpleAuth: Profile fetch error:', error);
        if (error.code === '42P17') {
          setError('Database configuration error. Please contact administrator.');
        } else if (error.code === 'PGRST116') {
          console.log('SimpleAuth: User profile not found');
          setProfile(null);
        } else {
          setError(`Profile fetch failed: ${error.message}`);
        }
        return;
      }

      console.log('SimpleAuth: Profile fetched successfully:', data);
      setProfile(data);
    } catch (err) {
      console.error('SimpleAuth: Profile fetch exception:', err);
      setError('Failed to fetch user profile');
    }
  };

  useEffect(() => {
    let mounted = true;
    let initTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('SimpleAuth: Initializing authentication...');
        
        // Debug session info in development
        if (process.env.NODE_ENV === 'development') {
          await sessionDebug.logSessionInfo();
        }
        
        // Set timeout to prevent infinite loading
        initTimeout = setTimeout(() => {
          if (mounted) {
            console.warn('SimpleAuth: Initialization timeout, forcing loading to false');
            setLoading(false);
            setError('Authentication initialization timed out');
          }
        }, 10000); // 10 second timeout
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('SimpleAuth: Session error:', error);
          if (mounted) {
            setError(error.message);
            setLoading(false);
            clearTimeout(initTimeout);
          }
          return;
        }

        console.log('SimpleAuth: Session check complete:', session ? 'Found' : 'None');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Always set loading to false after session check
          setLoading(false);
          clearTimeout(initTimeout);
          
          // Fetch profile separately without affecting loading state
          if (session?.user) {
            console.log('SimpleAuth: Fetching profile for user:', session.user.id);
            fetchProfile(session.user.id).catch(profileError => {
              console.error('SimpleAuth: Profile fetch failed during init:', profileError);
            });
          }
        }
      } catch (err) {
        console.error('SimpleAuth: Initialization error:', err);
        if (mounted) {
          setError('Authentication initialization failed');
          setLoading(false);
          clearTimeout(initTimeout);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('SimpleAuth: Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      setError(null);
      
      // Don't set loading back to true for auth state changes
      
      // Fetch profile for new session
      if (session?.user) {
        console.log('SimpleAuth: User authenticated, fetching profile...');
        fetchProfile(session.user.id).catch(profileError => {
          console.error('SimpleAuth: Profile fetch failed during auth change:', profileError);
        });
      } else {
        console.log('SimpleAuth: User signed out, clearing profile');
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      if (initTimeout) clearTimeout(initTimeout);
      subscription.unsubscribe();
      console.log('SimpleAuth: Cleanup completed');
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('SimpleAuth: Signing out...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setError(null);
      window.location.href = '/login';
    } catch (err) {
      console.error('SimpleAuth: Sign out error:', err);
      // Force redirect even on error
      window.location.href = '/login';
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    error,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
