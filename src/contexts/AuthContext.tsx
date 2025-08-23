import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData: {
    first_name: string;
    last_name: string;
    role: string;
    school_id?: string;
  }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (error: AuthError): string => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email ou mot de passe incorrect';
      case 'Email not confirmed':
        return 'Veuillez confirmer votre email avant de vous connecter';
      case 'User already registered':
        return 'Un compte existe déjà avec cette adresse email';
      case 'Password should be at least 6 characters':
        return 'Le mot de passe doit contenir au moins 6 caractères';
      case 'Unable to validate email address: invalid format':
        return 'Format d\'email invalide';
      case 'Signup requires a valid password':
        return 'Un mot de passe valide est requis';
      default:
        return error.message || 'Une erreur est survenue';
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AuthContext: Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          console.log('AuthContext: User profile not found in database');
          setProfile(null);
        } else {
          setError(`Profile fetch failed: ${error.message}`);
        }
        setLoading(false);
        return;
      }

      console.log('AuthContext: Profile fetched successfully:', data);
      setProfile(data);
      setLoading(false);
    } catch (err) {
      console.error('AuthContext: Unexpected error in fetchProfile:', err);
      setError('Failed to fetch user profile');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(getErrorMessage(error));
      setLoading(false);
      return { error };
    }

    if (data.user) {
      await fetchProfile(data.user.id);
    }

    setLoading(false);
    return { error: null };
  };

  const signUp = async (
    email: string,
    password: string,
    userData: {
      first_name: string;
      last_name: string;
      role: string;
      school_id?: string;
    }
  ) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(getErrorMessage(error));
      setLoading(false);
      return { error };
    }

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: `${userData.first_name} ${userData.last_name}`,
          role: userData.role as 'platform_admin' | 'school_admin' | 'teacher' | 'parent',
          school_id: userData.school_id || null,
          approved: false,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        setError('Erreur lors de la création du profil');
        setLoading(false);
        return { error: new AuthError(profileError.message) };
      }

      await fetchProfile(data.user.id);
    }

    setLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Signing out user...');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthContext: Error during signOut:', error);
        setError(error.message);
      } else {
        console.log('AuthContext: User signed out successfully');
      }
      
      // Clear state regardless of signOut result
      setUser(null);
      setSession(null);
      setProfile(null);
      setError(null);
      setLoading(false);
      
      // Force redirect to login
      window.location.href = '/login';
    } catch (err) {
      console.error('AuthContext: Unexpected error during signOut:', err);
      // Clear state even on error
      setUser(null);
      setSession(null);
      setProfile(null);
      setError(null);
      setLoading(false);
      window.location.href = '/login';
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('Utilisateur non connecté') };
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      setError('Erreur lors de la mise à jour du profil');
      setLoading(false);
      return { error: new Error(error.message) };
    }

    setProfile(data);
    setLoading(false);
    return { error: null };
  };

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing authentication...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Error getting session:', error);
          if (mounted) {
            setError(error.message);
            setLoading(false);
          }
          return;
        }

        console.log('AuthContext: Initial session:', session ? 'Found' : 'None');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('AuthContext: Fetching profile for user:', session.user.id);
            await fetchProfile(session.user.id);
          } else {
            console.log('AuthContext: No session, setting loading to false');
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('AuthContext: Unexpected error during initialization:', err);
        if (mounted) {
          setError('Failed to initialize authentication');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      setError(null);
      
      if (session?.user) {
        console.log('AuthContext: User authenticated, fetching profile...');
        await fetchProfile(session.user.id);
      } else {
        console.log('AuthContext: User signed out, clearing state');
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      console.log('AuthContext: Cleanup completed');
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
