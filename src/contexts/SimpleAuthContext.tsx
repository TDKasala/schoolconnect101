import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('SimpleAuth: Initializing...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('SimpleAuth: Session error:', error);
          if (mounted) {
            setError(error.message);
          }
        } else {
          console.log('SimpleAuth: Session check complete:', session ? 'Found' : 'None');
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }
        
        // Always set loading to false after session check
        if (mounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('SimpleAuth: Initialization error:', err);
        if (mounted) {
          setError('Authentication initialization failed');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('SimpleAuth: Auth state changed:', event);
      
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      setError(null);
      
      // Loading is already false from initialization
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('SimpleAuth: Signing out...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
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
    loading,
    error,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
