'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';
import ConfirmModal from '@/components/ConfirmModal';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { api } from '@/lib/api';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Lock,
  Unlock,
  CheckCircle2,
  Ban,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Block/Unblock toggle modal
  const [togglingUser, setTogglingUser] = useState<User | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/sign-in?redirect=/dashboard/admin/users');
      } else if (user.role !== 'admin') {
        router.push('/dashboard/customer');
      }
    }
  }, [user, authLoading, router]);

  const loadCustomers = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: User[] }>('/users');
      if (res.success && res.data) {
        setCustomers(res.data);
      }
    } catch (err) {
      toast.error('Failed to load registered customers.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleToggleBlockConfirm = async () => {
    if (!togglingUser) return;
    setIsToggling(true);
    try {
      const res = await api.patch<{ success: boolean; message: string }>(
        `/users/${togglingUser.id || (togglingUser as any)._id}/block`
      );
      if (res.success) {
        toast.success(res.message);
        setTogglingUser(null);
        loadCustomers();
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to update user block status.');
    } finally {
      setIsToggling(false);
    }
  };

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
              Client Registry
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950 mt-1">
              Registered Clients ({customers.length})
            </h1>
            <p className="text-stone-500 text-sm">
              Inspect registered salon clients, review contact information, or suspend disruptive accounts.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminSidebar />

            <div className="flex-1 w-full space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster-300 shadow-sm space-y-6">
                {isLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-7 h-7 text-champagne-600 animate-spin" />
                    <p className="text-xs text-stone-500">Loading client registry...</p>
                  </div>
                ) : customers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-alabaster-200 text-stone-400 uppercase tracking-wider font-semibold">
                          <th className="pb-3">Client</th>
                          <th className="pb-3">Contact</th>
                          <th className="pb-3">Role</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Access Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-alabaster-200">
                        {customers.map((c) => {
                          const isBlocked = c.isBlocked;
                          return (
                            <tr key={c.id || (c as any)._id} className="hover:bg-alabaster-50/70 transition-colors">
                              <td className="py-4 pr-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full overflow-hidden bg-champagne-200 border border-champagne-300 flex items-center justify-center text-espresso-950 font-serif font-semibold text-sm shrink-0">
                                    {c.image ? (
                                      <Image
                                        src={c.image}
                                        alt={c.name}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span>{c.name.charAt(0).toUpperCase()}</span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-espresso-950 text-sm">
                                      {c.name}
                                    </p>
                                    <p className="text-[11px] text-stone-500">
                                      ID: #{((c.id || (c as any)._id) || '').substring(0, 8)}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 pr-3">
                                <p className="text-stone-700 flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                                  <span>{c.email}</span>
                                </p>
                                {c.phone && (
                                  <p className="text-stone-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                                    <Phone className="w-3 h-3 text-stone-400" />
                                    <span>{c.phone}</span>
                                  </p>
                                )}
                              </td>
                              <td className="py-4 pr-3">
                                <span className="text-[10px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200">
                                  {c.role}
                                </span>
                              </td>
                              <td className="py-4 pr-3">
                                {isBlocked ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                    <Ban className="w-3 h-3" />
                                    Suspended
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Active
                                  </span>
                                )}
                              </td>
                              <td className="py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setTogglingUser(c)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                                    isBlocked
                                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                      : 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                                  }`}
                                >
                                  {isBlocked ? (
                                    <>
                                      <Unlock className="w-3.5 h-3.5" />
                                      <span>Unblock</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3.5 h-3.5" />
                                      <span>Block</span>
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-stone-500 text-sm py-12">
                    No customers registered yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Block / Unblock Modal */}
      <ConfirmModal
        isOpen={!!togglingUser}
        title={togglingUser?.isBlocked ? 'Reactivate Client Account' : 'Suspend Client Account'}
        message={
          togglingUser?.isBlocked
            ? `Are you sure you want to unblock ${togglingUser?.name}? Their access to appointment booking and client dashboard will be restored immediately.`
            : `Are you sure you want to suspend ${togglingUser?.name}? They will be immediately blocked from logging in, viewing dashboard pages, and creating new bookings.`
        }
        confirmLabel={togglingUser?.isBlocked ? 'Yes, Reactivate' : 'Yes, Suspend Account'}
        isDestructive={!togglingUser?.isBlocked}
        isLoading={isToggling}
        onConfirm={handleToggleBlockConfirm}
        onCancel={() => setTogglingUser(null)}
      />

      <Footer />
    </div>
  );
}
