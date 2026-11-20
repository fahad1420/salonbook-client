'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomerSidebar from '@/components/CustomerSidebar';
import StatCard from '@/components/StatCard';
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal';
import AppointmentReceiptModal from '@/components/AppointmentReceiptModal';
import { useAuth } from '@/context/AuthContext';
import { Appointment, Service } from '@/types';
import { api } from '@/lib/api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Loader2,
  Eye,
  CreditCard,
  Crown,
  Receipt,
  Percent,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CustomerDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/sign-in?redirect=/dashboard/customer');
      } else if (user.role !== 'customer') {
        router.push('/dashboard/admin');
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user || user.role !== 'customer') return;
      setIsLoading(true);
      try {
        const [statsRes, apptRes] = await Promise.all([
          api.get<{ success: boolean; data: typeof stats }>('/appointments/my/stats'),
          api.get<{ success: boolean; data: Appointment[] }>('/appointments/my'),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (apptRes.success && apptRes.data) {
          setRecentAppointments(apptRes.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user && user.role === 'customer') {
      loadDashboardData();
    }
  }, [user]);

  const handlePayNow = async (appointmentId: string) => {
    try {
      toast.info('Connecting to Stripe checkout...');
      const res = await api.post<{ success: boolean; url: string }>(
        '/payments/create-checkout-session',
        { appointmentId }
      );
      if (res.success && res.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to initiate Stripe payment.');
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

  const total = stats.totalRequests || 1;
  const confirmedPct = Math.round((stats.confirmed / total) * 100);
  const pendingPct = Math.round((stats.pending / total) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-champagne-700">
                Client Portal
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                Welcome, {user?.name}
              </h1>
              <p className="text-stone-500 text-sm">
                Track reservation progress, access session histories, and manage salon appointments.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-xs font-semibold tracking-wide transition-all shadow-luxury self-start md:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-champagne-400" />
              <span>Book New Treatment</span>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <CustomerSidebar />

            <div className="flex-1 w-full space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                  title="Total Requests"
                  value={stats.totalRequests}
                  icon={Calendar}
                  description="Lifetime salon reservations"
                />
                <StatCard
                  title="Pending Review"
                  value={stats.pending}
                  icon={Clock}
                  variant="pending"
                  description="Awaiting atelier confirmation"
                />
                <StatCard
                  title="Confirmed"
                  value={stats.confirmed}
                  icon={CheckCircle2}
                  variant="confirmed"
                  description="Approved appointments"
                />
                <StatCard
                  title="Cancelled"
                  value={stats.cancelled}
                  icon={XCircle}
                  variant="cancelled"
                  description="Cancelled reservations"
                />
              </div>

              {/* Client Visual Membership & Activity Banner */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster-300 shadow-soft grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700">
                      <Crown className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-champagne-700">
                      Private Atelier Member
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-espresso-950">
                    Your Reservation Schedule &amp; Priority Standing
                  </h3>

                  <p className="text-xs text-stone-500 leading-relaxed">
                    You have <span className="font-semibold text-espresso-950">{stats.confirmed}</span> confirmed salon visit(s) scheduled. Concierge confirmation guarantees private suite preparation and master stylist assignment.
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-stone-500">
                      <span>Confirmed Visit Ratio</span>
                      <span className="font-semibold text-espresso-950">{confirmedPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-alabaster-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                        style={{ width: `${confirmedPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 bg-alabaster-50 rounded-2xl p-5 border border-alabaster-200 space-y-3">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                    Concierge Note
                  </span>
                  <p className="text-xs text-stone-600 leading-snug">
                    Need to reschedule or update color formulas? Contact our Madison Avenue front desk at <span className="font-medium text-espresso-950">+1 (212) 555-8900</span>.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-champagne-700 hover:text-champagne-800"
                    >
                      <span>Explore Seasonal Menu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table / List */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster-300 shadow-soft space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-medium text-espresso-950">
                      Recent Reservations
                    </h2>
                    <p className="text-xs text-stone-500">
                      Your latest booked treatments and confirmation statuses.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/customer/appointments"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-champagne-700 hover:text-champagne-800"
                  >
                    <span>View All</span>
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
                          <th className="pb-3">Service</th>
                          <th className="pb-3">Date &amp; Slot</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Payment</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-alabaster-200">
                        {recentAppointments.map((appt) => {
                          const service =
                            typeof appt.serviceId === 'object'
                              ? (appt.serviceId as Service)
                              : null;

                          const canPay =
                            appt.status === 'confirmed' &&
                            appt.paymentStatus === 'unpaid';

                          const isPaid = appt.paymentStatus === 'paid';

                          return (
                            <tr
                              key={appt._id}
                              className="hover:bg-alabaster-50/70 transition-colors"
                            >
                              <td className="py-4 pr-3">
                                <p className="font-semibold text-espresso-950 text-sm">
                                  {service?.serviceName || 'Custom Treatment'}
                                </p>
                                <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                                  {service?.category || 'Atelier'}
                                </span>
                              </td>
                              <td className="py-4 pr-3 text-stone-600 whitespace-nowrap">
                                <p className="font-medium text-espresso-900">
                                  {appt.appointmentDate}
                                </p>
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
                                    Pending Review
                                  </span>
                                )}
                              </td>
                              <td className="py-4 pr-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                    isPaid
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-stone-100 text-stone-600'
                                  }`}
                                >
                                  {isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                              </td>
                              <td className="py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setSelectedAppointment(appt)}
                                    className="p-1.5 rounded-lg border border-alabaster-300 hover:bg-alabaster-200 text-stone-700 transition-colors"
                                    title="View Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  {isPaid && (
                                    <button
                                      onClick={() => setSelectedReceipt(appt)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-alabaster-100 hover:bg-alabaster-200 text-espresso-950 text-[11px] font-medium border border-alabaster-300 transition-colors"
                                      title="View Digital Receipt"
                                    >
                                      <Receipt className="w-3 h-3 text-champagne-600" />
                                      <span>Receipt</span>
                                    </button>
                                  )}

                                  {canPay && (
                                    <button
                                      onClick={() => handlePayNow(appt._id)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-espresso-900 text-alabaster-100 hover:bg-espresso-800 text-[11px] font-semibold tracking-wide transition-all shadow-sm"
                                    >
                                      <CreditCard className="w-3 h-3 text-champagne-400" />
                                      <span>Pay Now</span>
                                    </button>
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
                    You haven&apos;t reserved any appointments yet.{' '}
                    <Link
                      href="/services"
                      className="text-champagne-700 underline font-medium"
                    >
                      Browse treatments
                    </Link>
                    .
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Appointment Detail Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      {/* Digital Receipt Modal */}
      <AppointmentReceiptModal
        appointment={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
