'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomerSidebar from '@/components/CustomerSidebar';
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal';
import ConfirmModal from '@/components/ConfirmModal';
import { useAuth } from '@/context/AuthContext';
import { Appointment, Service } from '@/types';
import { api } from '@/lib/api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  CreditCard,
  Ban,
  Loader2,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CustomerAppointmentsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/sign-in?redirect=/dashboard/customer/appointments');
      } else if (user.role !== 'customer') {
        router.push('/dashboard/admin');
      }
    }
  }, [user, authLoading, router]);

  const loadAppointments = useCallback(async () => {
    if (!user || user.role !== 'customer') return;
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: Appointment[] }>('/appointments/my');
      if (res.success && res.data) {
        setAppointments(res.data);
      }
    } catch (err) {
      toast.error('Failed to load appointments.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleCancelConfirm = async () => {
    if (!cancellingAppt) return;
    setIsCancelling(true);
    try {
      const res = await api.patch(`/appointments/${cancellingAppt._id}/cancel`);
      if (res.success) {
        toast.success('Appointment cancelled successfully.');
        setCancellingAppt(null);
        loadAppointments();
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to cancel appointment.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePayNow = async (appointmentId: string) => {
    try {
      toast.info('Initiating secure Stripe payment session...');
      const res = await api.post<{ success: boolean; url: string }>(
        '/payments/create-checkout-session',
        { appointmentId }
      );
      if (res.success && res.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to initiate Stripe checkout.');
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (filter === 'all') return true;
    return appt.status === filter;
  });

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
              Personal Schedule
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950 mt-1">
              My Appointments
            </h1>
            <p className="text-stone-500 text-sm">
              Review your reserved sessions, settle confirmed bookings, or cancel pending requests.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <CustomerSidebar />

            <div className="flex-1 w-full space-y-6">
              {/* Filter Tabs */}
              <div className="bg-white rounded-2xl p-2 border border-alabaster-300 flex flex-wrap gap-1.5">
                {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                      filter === tab
                        ? 'bg-espresso-900 text-alabaster-100 shadow-sm'
                        : 'text-stone-600 hover:bg-alabaster-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Appointments List / Table */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster-300 shadow-sm">
                {isLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-7 h-7 text-champagne-600 animate-spin" />
                    <p className="text-xs text-stone-500">Loading appointments...</p>
                  </div>
                ) : filteredAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments.map((appt) => {
                      const service =
                        typeof appt.serviceId === 'object'
                          ? (appt.serviceId as Service)
                          : null;

                      const isPending = appt.status === 'pending';
                      const isConfirmed = appt.status === 'confirmed';
                      const isUnpaid = appt.paymentStatus === 'unpaid';
                      const canPay = isConfirmed && isUnpaid;

                      return (
                        <div
                          key={appt._id}
                          className="p-5 sm:p-6 rounded-2xl border border-alabaster-300 hover:border-champagne-300 transition-all bg-alabaster-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                        >
                          <div className="flex items-start gap-4 min-w-0">
                            {service?.image && (
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-alabaster-300">
                                <Image
                                  src={service.image}
                                  alt={service.serviceName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}

                            <div className="space-y-1 min-w-0">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-champagne-700 bg-champagne-100 px-2 py-0.5 rounded-full border border-champagne-200">
                                {service?.category || 'Atelier'}
                              </span>
                              <h3 className="font-serif text-lg font-semibold text-espresso-950 truncate">
                                {service?.serviceName || 'Custom Treatment'}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                                <span className="flex items-center gap-1 text-espresso-900 font-medium">
                                  <Calendar className="w-3.5 h-3.5 text-champagne-600" />
                                  {appt.appointmentDate}
                                </span>
                                <span>&bull;</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-champagne-600" />
                                  {appt.timeSlot}
                                </span>
                                <span>&bull;</span>
                                <span className="font-semibold text-espresso-950">
                                  ${appt.servicePrice}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Statuses and Actions */}
                          <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                            <div className="flex flex-col items-end gap-1">
                              {appt.status === 'confirmed' ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Confirmed
                                </span>
                              ) : appt.status === 'cancelled' ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                  <AlertCircle className="w-3 h-3" />
                                  Cancelled
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </span>
                              )}

                              <span
                                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  appt.paymentStatus === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-100 text-stone-500'
                                }`}
                              >
                                {appt.paymentStatus === 'paid' ? 'Paid in Full' : 'Unpaid'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 pt-2 sm:pt-0">
                              <button
                                onClick={() => setSelectedAppointment(appt)}
                                className="p-2 rounded-xl border border-alabaster-300 hover:bg-white text-stone-700 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Self Cancellation (Allowed ONLY for own pending appointments) */}
                              {isPending && (
                                <button
                                  onClick={() => setCancellingAppt(appt)}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
                                  title="Cancel Appointment"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Cancel</span>
                                </button>
                              )}

                              {/* Pay Now (Shown ONLY when status === confirmed AND paymentStatus === unpaid) */}
                              {canPay && (
                                <button
                                  onClick={() => handlePayNow(appt._id)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-espresso-900 text-alabaster-100 hover:bg-espresso-800 text-xs font-semibold tracking-wide transition-all shadow-sm"
                                >
                                  <CreditCard className="w-3.5 h-3.5 text-champagne-400" />
                                  <span>Pay Now</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 space-y-3">
                    <p className="text-stone-500 text-sm">
                      No appointments matching &ldquo;{filter}&rdquo; status.
                    </p>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-espresso-900 text-white text-xs font-semibold"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-champagne-400" />
                      <span>Book a Treatment</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* View Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      {/* Cancellation Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!cancellingAppt}
        title="Cancel Appointment Request"
        message="Are you sure you want to cancel this pending appointment? Once cancelled, this time slot will be released back to the salon reservation pool."
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Reservation"
        isDestructive={true}
        isLoading={isCancelling}
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancellingAppt(null)}
      />

      <Footer />
    </div>
  );
}
