'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, Sparkles, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const maskedId =
    sessionId && sessionId.length > 16
      ? `${sessionId.substring(0, 10)}...${sessionId.substring(sessionId.length - 8)}`
      : sessionId;

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-alabaster-300 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-champagne-700 bg-champagne-100 px-3 py-1 rounded-full border border-champagne-200">
              Payment Confirmed
            </span>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-espresso-950">
              Payment Received
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed">
              Your luxury appointment has been settled successfully through Stripe. Our atelier team is preparing for your arrival.
            </p>
          </div>

          {maskedId && (
            <div className="p-3.5 rounded-2xl bg-alabaster-100 border border-alabaster-300 text-xs text-stone-600 font-mono">
              <span className="block text-[10px] uppercase font-semibold text-stone-400 font-sans mb-0.5">
                Stripe Payment Reference
              </span>
              {maskedId}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/dashboard/customer/appointments"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-xs font-semibold tracking-wide transition-all shadow-md"
            >
              <Calendar className="w-4 h-4 text-champagne-400" />
              <span>View In My Appointments</span>
            </Link>

            <Link
              href="/"
              className="text-xs font-medium text-stone-500 hover:text-espresso-950 transition-colors"
            >
              Return to SalonBook Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-alabaster-100" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
