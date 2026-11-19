'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, Calendar, ArrowLeft } from 'lucide-react';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment_id');

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-alabaster-300 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Checkout Incomplete
            </span>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-espresso-950">
              Payment Cancelled
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed">
              Your appointment reservation remains confirmed and held for you. You can complete your settlement at any time from your client dashboard prior to your visit.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/dashboard/customer/appointments"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-xs font-semibold tracking-wide transition-all shadow-md"
            >
              <Calendar className="w-4 h-4 text-champagne-400" />
              <span>Return to My Appointments</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-stone-500 hover:text-espresso-950 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore More Treatments</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-alabaster-100" />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
