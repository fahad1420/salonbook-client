'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';
import StatCard from '@/components/StatCard';
import AppointmentReceiptModal from '@/components/AppointmentReceiptModal';
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
  TrendingUp,
  Receipt,
  PieChart,
  Percent,
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
  const [selectedReceipt, setSelectedReceipt] = useState<Appointment | null>(null);
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

  // Calculated Analytics Metrics
  const totalBookings = stats.totalAppointments || 1;
  const confirmedPct = Math.round((stats.confirmedAppointments / totalBookings) * 100);
  const pendingPct = Math.round((stats.pendingAppointments / totalBookings) * 100);
  const cancelledCount = Math.max(
    0,
    stats.totalAppointments - stats.confirmedAppointments - stats.pendingAppointments
  );
  const cancelledPct = Math.max(0, 100 - confirmedPct - pendingPct);

  const avgTicket =
    stats.successfulPayments > 0
      ? Math.round(stats.totalRevenue / stats.successfulPayments)
      : 0;

  const paymentConversion =
    stats.confirmedAppointments > 0
      ? Math.round((stats.successfulPayments / stats.confirmedAppointments) * 100)
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100 dark:bg-stone-950 transition-colors">
      <Navbar />

      <main className="flex-1 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-champagne-700 dark:text-champagne-400">
                Salon Command Center
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950 dark:text-alabaster-50">
                Executive Overview
              </h1>
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                Monitor reservations, active treatment offerings, client registrations, and verified transactions.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link
                href="/dashboard/admin/services"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-espresso-900 hover:bg-espresso-800 dark:bg-champagne-500 dark:hover:bg-champagne-400 text-alabaster-100 dark:text-stone-950 text-xs font-semibold tracking-wide transition-all shadow-luxury"
              >
                <PlusCircle className="w-4 h-4 text-champagne-400 dark:text-stone-950" />
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

              {/* Visual Analytics Breakdown Card */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-alabaster-300 dark:border-stone-800 shadow-soft space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-alabaster-200 dark:border-stone-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-champagne-700 dark:text-champagne-400">
                      Operational Health
                    </span>
                    <h2 className="font-serif text-xl font-medium text-espresso-950 dark:text-alabaster-50">
                      Booking Pipeline &amp; Performance Metrics
                    </h2>
                  </div>
                  <span className="text-xs text-stone-400 dark:text-stone-500">
                    Live Database Aggregations
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Status Breakdown Progress Bars */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Appointment Status Distribution
                    </h3>

                    {/* Confirmed Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-espresso-950 dark:text-alabaster-100 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                          Confirmed Visits
                        </span>
                        <span className="text-stone-500 dark:text-stone-400">
                          {stats.confirmedAppointments} ({confirmedPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-alabaster-200 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                          style={{ width: `${confirmedPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Pending Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-espresso-950 dark:text-alabaster-100 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                          Pending Director Review
                        </span>
                        <span className="text-stone-500 dark:text-stone-400">
                          {stats.pendingAppointments} ({pendingPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-alabaster-200 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-700"
                          style={{ width: `${pendingPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Cancelled Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-espresso-950 dark:text-alabaster-100 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-stone-400 inline-block" />
                          Cancelled / Archived
                        </span>
                        <span className="text-stone-500 dark:text-stone-400">
                          {cancelledCount} ({cancelledPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-alabaster-200 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-stone-400 rounded-full transition-all duration-700"
                          style={{ width: `${cancelledPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Efficiency KPIs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-alabaster-50 dark:bg-stone-800/40 border border-alabaster-300 dark:border-stone-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-champagne-700 dark:text-champagne-400 text-xs font-semibold">
                        <TrendingUp className="w-4 h-4" />
                        <span>Avg Ticket Size</span>
                      </div>
                      <p className="font-serif text-2xl font-semibold text-espresso-950 dark:text-alabaster-50">
                        ${avgTicket}
                      </p>
                      <p className="text-[11px] text-stone-400 dark:text-stone-500">Per settled transaction</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-alabaster-50 dark:bg-stone-800/40 border border-alabaster-300 dark:border-stone-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-champagne-700 dark:text-champagne-400 text-xs font-semibold">
                        <Percent className="w-4 h-4" />
                        <span>Payment Settle Rate</span>
                      </div>
                      <p className="font-serif text-2xl font-semibold text-espresso-950 dark:text-alabaster-50">
                        {paymentConversion}%
                      </p>
                      <p className="text-[11px] text-stone-400 dark:text-stone-500">Of confirmed bookings</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-alabaster-50 dark:bg-stone-800/40 border border-alabaster-300 dark:border-stone-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-champagne-700 dark:text-champagne-400 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmation Rate</span>
                      </div>
                      <p className="font-serif text-2xl font-semibold text-espresso-950 dark:text-alabaster-50">
                        {confirmedPct}%
                      </p>
                      <p className="text-[11px] text-stone-400 dark:text-stone-500">Requests approved</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-alabaster-50 dark:bg-stone-800/40 border border-alabaster-300 dark:border-stone-700 space-y-1">
                      <div className="flex items-center gap-1.5 text-champagne-700 dark:text-champagne-400 text-xs font-semibold">
                        <Scissors className="w-4 h-4" />
                        <span>Active Catalog</span>
                      </div>
                      <p className="font-serif text-2xl font-semibold text-espresso-950 dark:text-alabaster-50">
                        {stats.activeServices}
                      </p>
                      <p className="text-[11px] text-stone-400 dark:text-stone-500">Disciplines active</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Queue */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-alabaster-300 dark:border-stone-800 shadow-soft space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-medium text-espresso-950 dark:text-alabaster-50">
                      Recent Reservation Activity
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Action pending appointment requests or inspect confirmed sessions.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/admin/appointments"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-champagne-700 dark:text-champagne-400 hover:text-champagne-800"
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
                        <tr className="border-b border-alabaster-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 uppercase tracking-wider font-semibold">
                          <th className="pb-3">Client</th>
                          <th className="pb-3">Service</th>
                          <th className="pb-3">Date &amp; Slot</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Payment</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-alabaster-200 dark:divide-stone-800">
                        {recentAppointments.map((appt) => {
                          const customer =
                            typeof appt.customerId === 'object' ? appt.customerId : null;
                          const service =
                            typeof appt.serviceId === 'object'
                              ? (appt.serviceId as Service)
                              : null;
                          const isPending = appt.status === 'pending';
                          const isPaid = appt.paymentStatus === 'paid';

                          return (
                            <tr
                              key={appt._id}
                              className="hover:bg-alabaster-50/70 dark:hover:bg-stone-800/40 transition-colors"
                            >
                              <td className="py-4 pr-3">
                                <p className="font-semibold text-espresso-950 dark:text-alabaster-100 text-sm">
                                  {customer?.name || 'Client'}
                                </p>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                                  {customer?.email}
                                </p>
                              </td>
                              <td className="py-4 pr-3">
                                <p className="font-medium text-espresso-900 dark:text-alabaster-100">
                                  {service?.serviceName || 'Custom Treatment'}
                                </p>
                                <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                  {service?.category}
                                </span>
                              </td>
                              <td className="py-4 pr-3 whitespace-nowrap">
                                <p className="font-medium text-espresso-900 dark:text-alabaster-100">
                                  {appt.appointmentDate}
                                </p>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400">{appt.timeSlot}</p>
                              </td>
                              <td className="py-4 pr-3 font-semibold text-espresso-950 dark:text-alabaster-100 whitespace-nowrap">
                                ${appt.servicePrice}
                              </td>
                              <td className="py-4 pr-3 whitespace-nowrap">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                    isPaid
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                                  }`}
                                >
                                  {appt.paymentStatus}
                                </span>
                              </td>
                              <td className="py-4 pr-3 whitespace-nowrap">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                    appt.status === 'confirmed'
                                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                      : appt.status === 'cancelled'
                                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                  }`}
                                >
                                  {appt.status}
                                </span>
                              </td>
                              <td className="py-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                  {isPaid && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedReceipt(appt)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-alabaster-100 hover:bg-alabaster-200 text-espresso-900 text-[11px] font-medium border border-alabaster-300 transition-colors"
                                      title="View Receipt"
                                    >
                                      <Receipt className="w-3 h-3 text-champagne-600" />
                                      <span>Receipt</span>
                                    </button>
                                  )}

                                  {isPending && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateStatus(appt._id, 'confirmed')
                                        }
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium transition-colors"
                                      >
                                        <Check className="w-3 h-3" />
                                        <span>Confirm</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleUpdateStatus(appt._id, 'cancelled')
                                        }
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-medium transition-colors"
                                      >
                                        <Ban className="w-3 h-3" />
                                        <span>Cancel</span>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 text-center py-8">
                    No reservations logged yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Digital Receipt Modal */}
      <AppointmentReceiptModal
        appointment={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
