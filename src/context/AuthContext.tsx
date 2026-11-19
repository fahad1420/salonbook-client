'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    image?: string;
    phone?: string;
  }) => Promise<User>;
  googleSignIn: (data: { name: string; email: string; image?: string }) => Promise<User>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('salonbook_token');
    localStorage.removeItem('salonbook_user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('salonbook_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      setToken(storedToken);
      const res = await api.get<{ success: boolean; user: User }>('/auth/me');
      if (res.success && res.user) {
        if (res.user.isBlocked) {
          toast.error('Your account has been suspended by salon administration.');
          handleLogout();
        } else {
          setUser(res.user);
          localStorage.setItem('salonbook_user', JSON.stringify(res.user));
        }
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        toast.error('Account suspended. Please contact salon concierge.');
      }
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signIn = async (email: string, password: string): Promise<User> => {
    const res = await api.post<{ success: boolean; token: string; user: User }>(
      '/auth/sign-in',
      { email, password }
    );

    if (res.success && res.token && res.user) {
      if (res.user.isBlocked) {
        throw new Error('Your account has been suspended by salon administration.');
      }
      localStorage.setItem('salonbook_token', res.token);
      localStorage.setItem('salonbook_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error('Failed to sign in.');
  };

  const signUp = async (data: {
    name: string;
    email: string;
    password: string;
    image?: string;
    phone?: string;
  }): Promise<User> => {
    const res = await api.post<{ success: boolean; token: string; user: User }>(
      '/auth/sign-up',
      data
    );

    if (res.success && res.token && res.user) {
      localStorage.setItem('salonbook_token', res.token);
      localStorage.setItem('salonbook_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error('Failed to create account.');
  };

  const googleSignIn = async (data: {
    name: string;
    email: string;
    image?: string;
  }): Promise<User> => {
    const res = await api.post<{ success: boolean; token: string; user: User }>(
      '/auth/google',
      data
    );

    if (res.success && res.token && res.user) {
      if (res.user.isBlocked) {
        throw new Error('Your account has been suspended by salon administration.');
      }
      localStorage.setItem('salonbook_token', res.token);
      localStorage.setItem('salonbook_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error('Google authentication failed.');
  };

  const signOut = () => {
    handleLogout();
    toast.success('Signed out successfully');
    router.push('/');
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('salonbook_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        signIn,
        signUp,
        googleSignIn,
        signOut,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
