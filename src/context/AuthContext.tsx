'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { api, ApiError } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
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
  signInWithGoogle: () => Promise<void>;
  googleTokenSignIn: (idToken: string) => Promise<User>;
  signOut: () => Promise<void>;
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
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('salonbook_token') : null;

    try {
      if (storedToken) {
        setToken(storedToken);
      }

      // Check current Better Auth session via /api/auth/me or authClient.getSession
      const res = await api.get<{ success: boolean; user: User }>('/auth/me');
      if (res.success && res.user) {
        if (res.user.isBlocked) {
          toast.error('Your account has been suspended by salon administration.');
          handleLogout();
        } else {
          setUser(res.user);
          localStorage.setItem('salonbook_user', JSON.stringify(res.user));
        }
      } else {
        handleLogout();
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

    if (res.success && res.user) {
      if (res.user.isBlocked) {
        throw new Error('Your account has been suspended by salon administration.');
      }
      if (res.token) {
        localStorage.setItem('salonbook_token', res.token);
        setToken(res.token);
      }
      localStorage.setItem('salonbook_user', JSON.stringify(res.user));
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

    if (res.success && res.user) {
      if (res.token) {
        localStorage.setItem('salonbook_token', res.token);
        setToken(res.token);
      }
      localStorage.setItem('salonbook_user', JSON.stringify(res.user));
      setUser(res.user);
      return res.user;
    }
    throw new Error('Failed to create account.');
  };

  const signInWithGoogle = async (): Promise<void> => {
    const callbackURL = `${window.location.origin}/dashboard/customer`;
    await authClient.signIn.social({
      provider: 'google',
      callbackURL,
    });
  };

  const googleTokenSignIn = async (idToken: string): Promise<User> => {
    const res = await api.post<{ success: boolean; token: string; user: User }>(
      '/auth/google-token',
      { idToken }
    );

    if (res.success && res.user) {
      if (res.user.isBlocked) {
        throw new Error('Your account has been suspended by salon administration.');
      }
      if (res.token) {
        localStorage.setItem('salonbook_token', res.token);
        setToken(res.token);
      }
      localStorage.setItem('salonbook_user', JSON.stringify(res.user));
      setUser(res.user);
      return res.user;
    }
    throw new Error('Google authentication failed.');
  };

  const signOut = async () => {
    try {
      await authClient.signOut().catch(() => {});
    } finally {
      handleLogout();
      toast.success('Signed out successfully');
      router.push('/');
    }
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
        signInWithGoogle,
        googleTokenSignIn,
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
