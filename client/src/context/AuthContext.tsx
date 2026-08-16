import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sentinelx_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res: any = await apiClient.get('/auth/me');
        if (res.success) {
          setUser(res.data.user);
          localStorage.setItem('sentinelx_org_id', res.data.user.organizationId);
        }
      } catch (err) {
        logout();
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('sentinelx_token', newToken);
    localStorage.setItem('sentinelx_org_id', newUser.organizationId);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sentinelx_token');
    localStorage.removeItem('sentinelx_org_id');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
