'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal';
import ConfirmModal from '@/components/ConfirmModal';
import { useAuth } from '@/context/AuthContext';
import { Appointment, Service, User } from '@/types';
import { api } from '@/lib/api';
import {
  CalendarCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Check,
  Ban,
  Loader2,
  Phone,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAppointmentsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [actioningAppt, setActioningAppt] = useState<{
    id: string;
    action: 'confirmed' | 'cancelled';
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/sign-in?redirect=/dashboard/admin/appointments');
      } else if (user.role !== 'admin') {
        router.push('/dashboard/customer');
      }
    }
  }, [user, authLoading, router]);

  const loadAppointments = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: Appointment[] }>(
        '/appointments/admin/all'
      );
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

  const handleConfirmAction = async () => {
    if (!actioningAppt) return;
    setIsUpdating(true);
    try {
      const res = await api.patch(`/appointments/${actioningAppt.id}/status`, {
        status: actioningAppt.action,
      });
      if (res.success) {
        toast.success(`Appointment status updated to ${actioningAppt.action}.`);
        setActioningAppt(null);
        loadAppointments();
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to update appointment status.');
    } finally {
      setIsUpdating(false);
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
              Operations
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950 mt-1">
              Manage Salon Bookings
            </h1>
            <p className="text-stone-500 text-sm">
              Review, confirm, or decline client reservations across all atelier disciplines.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminSidebar />

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
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-alabaster-200 text-stone-400 uppercase tracking-wider font-semibold">
                          <th className="pb-3">Client</th>
                          <th className="pb-3">Service</th>
                          <th className="pb-3">Date &amp; Slot</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Payment</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-alabaster-200">
                        {filteredAppointments.map((appt) => {
                          const customer = typeof appt.customerId === 'object' ? (appt.customerId as User) : null;
                          const service = typeof appt.serviceId === 'object' ? (appt.serviceId as Service) : null;

                          const isPending = appt.status === 'pending';
                          const isConfirmed = appt.status === 'confirmed';

                          return (
                            <tr key={appt._id} className="hover:bg-alabaster-50/70 transition-colors">
                              <td className="py-4 pr-3">
                                <div className="space-y-0.5">
                                  <p className="font-semibold text-espresso-950 text-sm">
                                    {customer?.name || 'Client'}
                                  </p>
                                  <p className="text-[11px] text-stone-500 flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-stone-400" />
                                    <span>{customer?.email}</span>
                                  </p>
                                  {customer?.phone && (
                                    <p className="text-[11px] text-stone-500 flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-stone-400" />
                                      <span>{customer?.phone}</span>
                                    </p>
                                  )}
                                </div>
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
                              <td className="py-4 pr-3 font-semibold text-espresso-950 text-sm">
                                ${appt.servicePrice}
                              </td>
                              <td className="py-4 pr-3">
                                {appt.status === 'confirmed' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Confirmed
                                  </span>
                                ) : appt.status === 'cancelled' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                    <AlertCircle className="w-3 h-3" />
                                    Cancelled
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="py-4 pr-3">
                                <span
                                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    appt.paymentStatus === 'paid'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-stone-100 text-stone-500'
                                  }`}
                                >
                                  {appt.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                </span>
                              </td>
                              <td className="py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => setSelectedAppointment(appt)}
                                  className="p-1.5 rounded-xl border border-alabaster-300 hover:bg-alabaster-100 text-stone-600 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {isPending && (
                                  <button
                                    onClick={() =>
                                      setActioningAppt({ id: appt._id, action: 'confirmed' })
                                    }
                                    className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                                    title="Confirm Booking"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}

                                {(isPending || isConfirmed) && (
                                  <button
                                    onClick={() =>
                                      setActioningAppt({ id: appt._id, action: 'cancelled' })
                                    }
                                    className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                                    title="Cancel Booking"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-stone-500 text-sm py-12">
                    No reservations matching &ldquo;{filter}&rdquo; status.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      <ConfirmModal
        isOpen={!!actioningAppt}
        title={actioningAppt?.action === 'confirmed' ? 'Confirm Appointment' : 'Cancel Appointment'}
        message={
          actioningAppt?.action === 'confirmed'
            ? 'Are you sure you want to confirm this reservation? The client will be notified and enabled to proceed with payment.'
            : 'Are you sure you want to cancel this reservation? The time slot will be reopened in the reservation catalog.'
        }
        confirmLabel={actioningAppt?.action === 'confirmed' ? 'Yes, Confirm' : 'Yes, Cancel'}
        isDestructive={actioningAppt?.action === 'cancelled'}
        isLoading={isUpdating}
        onConfirm={handleConfirmAction}
        onCancel={() => setActioningAppt(null)}
      />

      <Footer />
    </div>
  );
}
