import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, ArrowRight, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center space-y-8 bg-white rounded-3xl p-8 sm:p-12 border border-alabaster-300 shadow-luxury">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne-100 text-champagne-700 text-xs font-semibold tracking-wider uppercase border border-champagne-300">
              <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
              <span>404 &bull; Sanctuary Not Located</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-espresso-950">
              Page Not Found
            </h1>

            <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              The treatment ritual, private suite, or reservation page you are seeking may have been rescheduled, archived, or does not exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-xs font-semibold tracking-wide transition-all shadow-luxury hover:-translate-y-0.5"
            >
              <Home className="w-4 h-4 text-champagne-400" />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-alabaster-50 text-espresso-900 border border-alabaster-300 text-xs font-semibold tracking-wide transition-all shadow-soft"
            >
              <Compass className="w-4 h-4 text-champagne-600" />
              <span>Explore Treatments</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
