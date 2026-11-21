'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, Calendar, Download, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Appointment } from '@/types';
import { generateReceiptPDF } from '@/lib/pdfReceipt';
import { toast } from 'sonner';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const appointmentId = searchParams.get('appointment_id');

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!appointmentId);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    async function loadAppointment() {
      if (!appointmentId) return;
      try {
        const res = await api.get<{ success: boolean; data: Appointment }>(
          `/appointments/${appointmentId}`
        );
        if (res.success && res.data) {
          setAppointment(res.data);
        }
      } catch (err) {
        console.warn('Could not load appointment details on payment success page:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAppointment();
  }, [appointmentId]);

  const handleDownloadPDF = () => {
    if (!appointment) return;
    setIsDownloading(true);
    try {
      generateReceiptPDF(appointment);
      toast.success('Official payment receipt downloaded.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate PDF receipt.');
    } finally {
      setIsDownloading(false);
    }
  };

  const maskedId =
    sessionId && sessionId.length > 16
      ? `${sessionId.substring(0, 10)}...${sessionId.substring(sessionId.length - 8)}`
      : sessionId;

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100 dark:bg-[#121110] text-espresso-900 dark:text-alabaster-100 transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white dark:bg-espresso-950 rounded-3xl p-8 sm:p-10 border border-alabaster-300 dark:border-white/10 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-champagne-700 dark:text-champagne-300 bg-champagne-100 dark:bg-champagne-950/60 px-3 py-1 rounded-full border border-champagne-200 dark:border-champagne-800">
              Payment Confirmed
            </span>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-espresso-950 dark:text-white">
              Payment Received
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Your appointment has been confirmed and settled successfully through Stripe. Our atelier team is preparing for your arrival.
            </p>
          </div>

          {maskedId && (
            <div className="p-3.5 rounded-2xl bg-alabaster-100 dark:bg-espresso-900/60 border border-alabaster-300 dark:border-white/10 text-xs text-stone-600 dark:text-stone-300 font-mono">
              <span className="block text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 font-sans mb-0.5">
                Stripe Payment Reference
              </span>
              {maskedId}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-3">
            {appointment && (
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-champagne-600 hover:bg-champagne-500 text-espresso-950 text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Download Official PDF Receipt</span>
              </button>
            )}

            <Link
              href="/dashboard/customer/appointments"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-espresso-900 hover:bg-espresso-800 dark:bg-espresso-800 dark:hover:bg-espresso-700 text-alabaster-100 text-xs font-semibold tracking-wide transition-all shadow-md"
            >
              <Calendar className="w-4 h-4 text-champagne-400" />
              <span>View In My Appointments</span>
            </Link>

            <Link
              href="/"
              className="text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-espresso-950 dark:hover:text-white transition-colors"
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
    <Suspense fallback={<div className="min-h-screen bg-alabaster-100 dark:bg-[#121110]" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
