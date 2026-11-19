'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImgBBUpload from '@/components/ImgBBUpload';
import { Sparkles, Lock, Mail, User as UserIcon, Phone, ArrowRight, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, googleSignIn } = useAuth();
  const router = useRouter();

  // Password rules validation
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password does not satisfy security requirements.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        image: image.trim(),
      });
      toast.success(`Welcome to SalonBook, ${newUser.name}!`);
      router.push('/dashboard/customer');
    } catch (err) {
      toast.error((err as Error).message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleDemo = async () => {
    setIsSubmitting(true);
    try {
      const newUser = await googleSignIn({
        name: 'Éléonore Moreau',
        email: 'eleonore.moreau@gmail.com',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      });
      toast.success(`Registered with Google as ${newUser.name}`);
      router.push('/dashboard/customer');
    } catch (err) {
      toast.error((err as Error).message || 'Google registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-alabaster-300 shadow-xl shadow-stone-200/50">
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-full bg-espresso-900 text-alabaster-100 items-center justify-center mb-1">
              <Sparkles className="w-6 h-6 text-champagne-400" />
            </div>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-espresso-950">
              Create Client Profile
            </h1>
            <p className="text-stone-500 text-sm">
              Join the atelier for priority reservations, customized treatments, and personal stylist consultations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vivienne Laurent"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 placeholder:text-stone-400 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                Email Address <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vivienne@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 placeholder:text-stone-400 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                Phone Number <span className="text-stone-400 lowercase font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 placeholder:text-stone-400 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Profile Avatar Mode Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-espresso-950">
                  Profile Avatar
                </span>
                <div className="flex items-center gap-1 bg-alabaster-200 p-0.5 rounded-lg text-[11px] font-medium">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      imageInputMode === 'upload'
                        ? 'bg-white text-espresso-950 shadow-xs'
                        : 'text-stone-600'
                    }`}
                  >
                    ImgBB Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      imageInputMode === 'url'
                        ? 'bg-white text-espresso-950 shadow-xs'
                        : 'text-stone-600'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {imageInputMode === 'upload' ? (
                <ImgBBUpload
                  label=""
                  value={image}
                  onChange={(url) => setImage(url)}
                  aspectRatio="square"
                  helperText="Upload a portrait photo. Will be hosted securely via ImgBB."
                />
              ) : (
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 placeholder:text-stone-400 outline-none transition-colors"
                />
              )}
            </div>

            {/* Password with rules */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                Password <span className="text-rose-600">*</span>
              </label>
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

              {/* Password Rules Checklist */}
              <div className="bg-alabaster-100 p-3 rounded-xl border border-alabaster-300 space-y-1 text-xs">
                <div className="flex items-center gap-1.5">
                  {hasMinLength ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  <span className={hasMinLength ? 'text-emerald-800 font-medium' : 'text-stone-500'}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasUpperCase ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  <span className={hasUpperCase ? 'text-emerald-800 font-medium' : 'text-stone-500'}>
                    At least 1 uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasLowerCase ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-stone-400" />
                  )}
                  <span className={hasLowerCase ? 'text-emerald-800 font-medium' : 'text-stone-500'}>
                    At least 1 lowercase letter (a-z)
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isPasswordValid}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 font-medium text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Profile...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
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
              <span className="bg-white px-3 text-stone-500">Or register with</span>
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
            <span>Google Profile</span>
          </button>

          <p className="text-center text-xs text-stone-500 pt-2">
            Already registered?{' '}
            <Link
              href="/sign-in"
              className="font-semibold text-champagne-700 hover:text-champagne-800 underline underline-offset-4"
            >
              Sign In to Your Account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
