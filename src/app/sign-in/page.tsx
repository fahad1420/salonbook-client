'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, Lock, Mail, ArrowRight, Loader2, ShieldCheck, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, googleSignIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleRoleRedirect = (role: 'admin' | 'customer') => {
    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (role === 'admin') {
      router.push('/dashboard/admin');
    } else {
      router.push('/dashboard/customer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedUser = await signIn(email, password);
      toast.success(`Welcome back, ${loggedUser.name}`);
      handleRoleRedirect(loggedUser.role);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, role: 'admin' | 'customer') => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setIsSubmitting(true);
    try {
      const loggedUser = await signIn(demoEmail, 'Password123!');
      toast.success(`Signed in as demo ${role}: ${loggedUser.name}`);
      handleRoleRedirect(loggedUser.role);
    } catch (err) {
      toast.error((err as Error).message || 'Demo sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleDemo = async () => {
    setIsSubmitting(true);
    try {
      const loggedUser = await googleSignIn({
        name: 'Camille Dupont',
        email: 'camille.dupont@gmail.com',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      });
      toast.success(`Signed in with Google as ${loggedUser.name}`);
      handleRoleRedirect(loggedUser.role);
    } catch (err) {
      toast.error((err as Error).message || 'Google sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-alabaster-300 shadow-xl shadow-stone-200/50">
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-full bg-espresso-900 text-alabaster-100 items-center justify-center mb-1">
              <Sparkles className="w-6 h-6 text-champagne-400" />
            </div>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-espresso-950">
              Welcome to SalonBook
            </h1>
            <p className="text-stone-500 text-sm">
              Sign in to manage your appointments and bespoke atelier services.
            </p>
          </div>

          {/* Demo Account Quick Access */}
          <div className="bg-alabaster-100 rounded-2xl p-4 border border-alabaster-300 space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 text-center">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@salonbook.com', 'admin')}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white border border-alabaster-300 hover:border-champagne-500 text-xs font-medium text-espresso-900 hover:text-champagne-700 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-champagne-600" />
                <span>Admin Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('vivienne@example.com', 'customer')}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white border border-alabaster-300 hover:border-champagne-500 text-xs font-medium text-espresso-900 hover:text-champagne-700 transition-colors shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-champagne-600" />
                <span>Customer Demo</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 placeholder:text-stone-400 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 placeholder:text-stone-400 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 font-medium text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-alabaster-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-stone-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleDemo}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-alabaster-300 bg-white hover:bg-alabaster-100 text-espresso-900 font-medium text-sm transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Account</span>
          </button>

          <p className="text-center text-xs text-stone-500 pt-2">
            Don&apos;t have an account?{' '}
            <Link
              href="/sign-up"
              className="font-semibold text-champagne-700 hover:text-champagne-800 underline underline-offset-4"
            >
              Reserve &amp; Sign Up
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
