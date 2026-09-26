import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { supabase } from '../api/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
  avatarUrl?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const DEFAULT_GUEST_USER: User = {
  id: 'guest-demo-1',
  name: 'Visitante Convidado (Demo)',
  email: 'guest@sentinelx.io',
  role: 'SUPER_ADMIN',
  organizationId: 'org-1',
  organizationName: 'SENTINELX Security Corp',
  provider: 'guest',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sentinelx_token') || null);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('sentinelx_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {}
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to format Supabase user object into platform User
  const formatSupabaseUser = (sbUser: any, sessionToken: string): User => {
    return {
      id: sbUser.id,
      name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Google User',
      email: sbUser.email || '',
      role: 'SUPER_ADMIN',
      organizationId: 'org-1',
      organizationName: 'SENTINELX Security Corp',
      avatarUrl: sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture,
      provider: sbUser.app_metadata?.provider || 'google',
    };
  };

  // 1. Initial Session Restore on Mount (Handles OAuth Callbacks & Page Reloads)
  useEffect(() => {
    async function restoreSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session && session.user) {
          const formattedUser = formatSupabaseUser(session.user, session.access_token);
          setToken(session.access_token);
          setUser(formattedUser);
          localStorage.setItem('sentinelx_token', session.access_token);
          localStorage.setItem('sentinelx_org_id', formattedUser.organizationId);
          localStorage.setItem('sentinelx_user', JSON.stringify(formattedUser));
          localStorage.setItem('sentinelx_current_view', 'APP');
        }
      } catch (e) {
        console.warn('[SENTINELX Auth] Session restore notice:', e);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // 2. Monitor Supabase Auth State Changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        const formattedUser = formatSupabaseUser(session.user, session.access_token);
        setToken(session.access_token);
        setUser(formattedUser);
        localStorage.setItem('sentinelx_token', session.access_token);
        localStorage.setItem('sentinelx_org_id', formattedUser.organizationId);
        localStorage.setItem('sentinelx_user', JSON.stringify(formattedUser));
        localStorage.setItem('sentinelx_current_view', 'APP');
      } else if (event === 'SIGNED_OUT') {
        setToken(null);
        setUser(null);
        localStorage.removeItem('sentinelx_token');
        localStorage.removeItem('sentinelx_user');
        localStorage.removeItem('sentinelx_org_id');
        localStorage.setItem('sentinelx_current_view', 'LOGIN');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // 3. Fallback verification endpoint check if local backend token is present
  useEffect(() => {
    async function checkBackendAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      if (token === 'stx_guest_demo_token_98f73b') {
        setUser(DEFAULT_GUEST_USER);
        setIsLoading(false);
        return;
      }
      try {
        const res: any = await apiClient.get('/auth/me');
        if (res && res.success && res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem('sentinelx_org_id', res.data.user.organizationId);
          localStorage.setItem('sentinelx_user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        // Active session retained
      } finally {
        setIsLoading(false);
      }
    }

    if (token && token !== 'stx_guest_demo_token_98f73b') {
      checkBackendAuth();
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('sentinelx_token', newToken);
    localStorage.setItem('sentinelx_org_id', newUser.organizationId);
    localStorage.setItem('sentinelx_user', JSON.stringify(newUser));
    localStorage.setItem('sentinelx_current_view', 'APP');
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('[SENTINELX Auth Error] Google OAuth initialization failed:', err);
      setIsLoading(false);
      throw new Error(
        err.message || 'Não foi possível iniciar o login com Google. Verifique a configuração do Provider no Supabase.'
      );
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('sentinelx_token');
    localStorage.removeItem('sentinelx_user');
    localStorage.removeItem('sentinelx_org_id');
    localStorage.setItem('sentinelx_current_view', 'LOGIN');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
