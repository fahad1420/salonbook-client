'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { Transaction } from '@/types';
import { api } from '@/lib/api';
import {
  Receipt,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Lock,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTransactionsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/sign-in?redirect=/dashboard/admin/transactions');
      } else if (user.role !== 'admin') {
        router.push('/dashboard/customer');
      }
    }
  }, [user, authLoading, router]);

  const loadTransactions = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: Transaction[] }>(
        '/payments/transactions'
      );
      if (res.success && res.data) {
        setTransactions(res.data);
      }
    } catch (err) {
      toast.error('Failed to load transaction ledger.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const totalVolume = transactions
    .filter((t) => t.status === 'paid')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-alabaster-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-champagne-600 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-champagne-700">
              Audit &amp; Compliance
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950 mt-1">
              Financial Transactions Ledger
            </h1>
            <p className="text-stone-500 text-sm">
              Read-only cryptographically settled Stripe payments. Manual status overrides are strictly disabled.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminSidebar />

            <div className="flex-1 w-full space-y-6">
              {/* Summary Banner */}
              <div className="bg-espresso-950 text-white rounded-3xl p-6 sm:p-8 border border-espresso-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-champagne-400 font-semibold">
                    Total Settled Volume
                  </span>
                  <p className="font-serif text-3xl sm:text-4xl font-semibold text-white">
                    ${totalVolume.toLocaleString()}.00
                  </p>
                  <p className="text-xs text-stone-400">
                    Calculated from {transactions.filter((t) => t.status === 'paid').length} verified Stripe sessions.
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-espresso-800/80 border border-espresso-700 text-xs text-stone-300">
                  <Lock className="w-3.5 h-3.5 text-champagne-400" />
                  <span>Immutable Stripe Audit Trail</span>
                </div>
              </div>

              {/* Transactions Table Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster-300 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-medium text-espresso-950">
                    All Payment Records ({transactions.length})
                  </h2>
                </div>

                {isLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-7 h-7 text-champagne-600 animate-spin" />
                    <p className="text-xs text-stone-500">Loading ledger...</p>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-alabaster-200 text-stone-400 uppercase tracking-wider font-semibold">
                          <th className="pb-3">Client</th>
                          <th className="pb-3">Service &amp; Date</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Stripe Session ID</th>
                          <th className="pb-3">Settlement</th>
                          <th className="pb-3 text-right">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-alabaster-200">
                        {transactions.map((tx) => {
                          const customer = tx.customer;
                          const appt = tx.appointment;
                          const service = appt?.serviceId;

                          return (
                            <tr key={tx._id} className="hover:bg-alabaster-50/70 transition-colors">
                              <td className="py-4 pr-3">
                                <p className="font-semibold text-espresso-950 text-sm">
                                  {customer?.name || 'Client'}
                                </p>
                                <p className="text-[11px] text-stone-500 truncate">{customer?.email}</p>
                              </td>
                              <td className="py-4 pr-3">
                                <p className="font-medium text-espresso-900">
                                  {service?.serviceName || 'Atelier Treatment'}
                                </p>
                                <p className="text-[11px] text-stone-500">
                                  {appt?.appointmentDate} &bull; {appt?.timeSlot}
                                </p>
                              </td>
                              <td className="py-4 pr-3">
                                <p className="font-serif font-bold text-espresso-950 text-sm">
                                  ${tx.amount}.00
                                </p>
                                <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                                  {tx.currency}
                                </span>
                              </td>
                              <td className="py-4 pr-3">
                                <span className="font-mono text-[11px] text-stone-600 bg-alabaster-100 px-2 py-1 rounded-md border border-alabaster-300">
                                  {tx.stripeSessionId}
                                </span>
                              </td>
                              <td className="py-4 pr-3">
                                {tx.status === 'paid' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Settled (Paid)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                    <AlertCircle className="w-3 h-3" />
                                    Failed
                                  </span>
                                )}
                              </td>
                              <td className="py-4 text-right text-stone-500 whitespace-nowrap text-[11px]">
                                {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-stone-500 text-sm py-12">
                    No transactions recorded in ledger yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
