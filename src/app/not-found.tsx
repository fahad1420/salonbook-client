import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, ArrowRight, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100 dark:bg-stone-950 transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center space-y-8 bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-12 border border-alabaster-300 dark:border-stone-800 shadow-luxury">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne-100 dark:bg-champagne-950/40 text-champagne-700 dark:text-champagne-300 text-xs font-semibold tracking-wider uppercase border border-champagne-300 dark:border-champagne-800/40">
              <Sparkles className="w-3.5 h-3.5 text-champagne-600 dark:text-champagne-400" />
              <span>404 &bull; Sanctuary Not Located</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-espresso-950 dark:text-alabaster-50">
              Page Not Found
            </h1>

            <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              The treatment ritual, private suite, or reservation page you are seeking may have been rescheduled, archived, or does not exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-espresso-900 hover:bg-espresso-800 dark:bg-champagne-500 dark:hover:bg-champagne-400 text-alabaster-100 dark:text-stone-950 text-xs font-semibold tracking-wide transition-all shadow-luxury hover:-translate-y-0.5"
            >
              <Home className="w-4 h-4 text-champagne-400 dark:text-stone-950" />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white dark:bg-stone-800 hover:bg-alabaster-50 dark:hover:bg-stone-700 text-espresso-900 dark:text-alabaster-100 border border-alabaster-300 dark:border-stone-700 text-xs font-semibold tracking-wide transition-all shadow-soft"
            >
              <Compass className="w-4 h-4 text-champagne-600 dark:text-champagne-400" />
              <span>Explore Treatments</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
