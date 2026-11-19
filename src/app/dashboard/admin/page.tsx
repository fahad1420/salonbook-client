'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';
import StatCard from '@/components/StatCard';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Appointment, Service } from '@/types';
import {
  Users,
  Scissors,
  CalendarCheck,
  Clock,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  ArrowRight,
  Loader2,
  Check,
  Ban,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminDashboardOverview() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeServices: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    successfulPayments: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/sign-in?redirect=/dashboard/admin');
      } else if (user.role !== 'admin') {
        router.push('/dashboard/customer');
      }
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    if (!user || user.role !== 'admin') return;
    setIsLoading(true);
    try {
      const [statsRes, apptsRes] = await Promise.all([
        api.get<{ success: boolean; data: typeof stats }>('/appointments/admin/stats'),
        api.get<{ success: boolean; data: Appointment[] }>('/appointments/admin/all'),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (apptsRes.success && apptsRes.data) {
        setRecentAppointments(apptsRes.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const res = await api.patch(`/appointments/${id}/status`, { status });
      if (res.success) {
        toast.success(`Appointment marked as ${status}.`);
        loadData();
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to update status.');
    }
  };

  if (authLoading || (!user && isLoading)) {
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-champagne-700">
                Salon Command Center
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                Executive Overview
              </h1>
              <p className="text-stone-500 text-sm">
                Monitor reservations, active treatment offerings, client registrations, and verified transactions.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link
                href="/dashboard/admin/services"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-xs font-semibold tracking-wide transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-champagne-400" />
                <span>Add New Service</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminSidebar />

            <div className="flex-1 w-full space-y-8">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                  title="Registered Clients"
                  value={stats.totalCustomers}
                  icon={Users}
                  description="Active salon customer base"
                />
                <StatCard
                  title="Active Services"
                  value={stats.activeServices}
                  icon={Scissors}
                  description="Treatments visible to public"
                />
                <StatCard
                  title="Total Bookings"
                  value={stats.totalAppointments}
                  icon={CalendarCheck}
                  description="Lifetime booking volume"
                />
                <StatCard
                  title="Pending Confirmations"
                  value={stats.pendingAppointments}
                  icon={Clock}
                  variant="pending"
                  description="Awaiting director approval"
                />
                <StatCard
                  title="Confirmed Bookings"
                  value={stats.confirmedAppointments}
                  icon={CheckCircle2}
                  variant="confirmed"
                  description="Scheduled client visits"
                />
                <StatCard
                  title="Paid Transactions"
                  value={stats.successfulPayments}
                  icon={DollarSign}
                  variant="confirmed"
                  description="Verified Stripe transactions"
                />
                <StatCard
                  title="Gross Revenue"
                  value={`$${stats.totalRevenue.toLocaleString()}`}
                  icon={DollarSign}
                  variant="revenue"
                  description="Settled Stripe volume"
                />
              </div>

              {/* Recent Bookings Queue */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster-300 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-medium text-espresso-950">
                      Recent Reservation Activity
                    </h2>
                    <p className="text-xs text-stone-500">
                      Action pending appointment requests or inspect confirmed sessions.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/admin/appointments"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-champagne-700 hover:text-champagne-800"
                  >
                    <span>Manage All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {isLoading ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 className="w-6 h-6 text-champagne-600 animate-spin" />
                  </div>
                ) : recentAppointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-alabaster-200 text-stone-400 uppercase tracking-wider font-semibold">
                          <th className="pb-3">Client</th>
                          <th className="pb-3">Service</th>
                          <th className="pb-3">Date &amp; Slot</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-alabaster-200">
                        {recentAppointments.map((appt) => {
                          const customer = typeof appt.customerId === 'object' ? appt.customerId : null;
                          const service = typeof appt.serviceId === 'object' ? (appt.serviceId as Service) : null;
                          const isPending = appt.status === 'pending';

                          return (
                            <tr key={appt._id} className="hover:bg-alabaster-50/70 transition-colors">
                              <td className="py-4 pr-3">
                                <p className="font-semibold text-espresso-950 text-sm">
                                  {customer?.name || 'Client'}
                                </p>
                                <p className="text-[11px] text-stone-500 truncate">{customer?.email}</p>
                              </td>
                              <td className="py-4 pr-3">
                                <p className="font-medium text-espresso-900">
                                  {service?.serviceName || 'Custom Treatment'}
                                </p>
                                <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                                  {service?.category}
                                </span>
                              </td>
                              <td className="py-4 pr-3 whitespace-nowrap">
                                <p className="font-medium text-espresso-900">{appt.appointmentDate}</p>
                                <p className="text-[11px] text-stone-400">{appt.timeSlot}</p>
                              </td>
                              <td className="py-4 pr-3 font-semibold text-espresso-950">
                                ${appt.servicePrice}
                              </td>
                              <td className="py-4 pr-3">
                                {appt.status === 'confirmed' ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Confirmed
                                  </span>
                                ) : appt.status === 'cancelled' ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                    Cancelled
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="py-4 text-right space-x-1.5 whitespace-nowrap">
                                {isPending ? (
                                  <>
                                    <button
                                      onClick={() => handleUpdateStatus(appt._id, 'confirmed')}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                                      title="Confirm Appointment"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Confirm</span>
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-medium transition-colors"
                                      title="Cancel Appointment"
                                    >
                                      <Ban className="w-3 h-3" />
                                      <span>Reject</span>
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[11px] text-stone-400">Processed</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-stone-500 text-sm py-8">
                    No reservations recorded yet.
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
