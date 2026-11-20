'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Service, SALON_TIME_SLOTS, SalonTimeSlot } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { api, ApiError } from '@/lib/api';
import {
  Clock,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  ShieldAlert,
  Info,
  ShieldCheck,
  Check,
  Ban,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [isLoadingService, setIsLoadingService] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [appointmentDate, setAppointmentDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState<SalonTimeSlot>(SALON_TIME_SLOTS[0]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time slot availability state
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    async function loadService() {
      setIsLoadingService(true);
      try {
        const res = await api.get<{ success: boolean; data: Service }>(
          `/services/detail/${id}`
        );
        if (res.success && res.data) {
          setService(res.data);
        } else {
          setErrorMessage('Service not found');
        }
      } catch (err) {
        setErrorMessage((err as Error).message || 'Failed to load service');
      } finally {
        setIsLoadingService(false);
      }
    }

    if (id) {
      loadService();
    }
  }, [id]);

  // Real-time slot availability lookup
  useEffect(() => {
    async function fetchBookedSlots() {
      if (!service?._id || !appointmentDate) return;
      setIsLoadingSlots(true);
      try {
        const res = await api.get<{ success: boolean; bookedSlots: string[] }>(
          `/appointments/booked-slots?serviceId=${service._id}&date=${appointmentDate}`
        );
        if (res.success && Array.isArray(res.bookedSlots)) {
          setBookedSlots(res.bookedSlots);
          // If current selected timeSlot is booked, auto-select first available slot if any
          if (res.bookedSlots.includes(timeSlot)) {
            const availableSlot = SALON_TIME_SLOTS.find(
              (s) => !res.bookedSlots.includes(s)
            );
            if (availableSlot) {
              setTimeSlot(availableSlot);
            }
          }
        }
      } catch (err) {
        console.error('Failed to query slot availability:', err);
      } finally {
        setIsLoadingSlots(false);
      }
    }

    fetchBookedSlots();
  }, [service?._id, appointmentDate]);

  // Handle unauthenticated user redirect
  useEffect(() => {
    if (!authLoading && !user) {
      toast.info('Please sign in to reserve an appointment.');
      router.push(`/sign-in?redirect=/services/${id}`);
    }
  }, [user, authLoading, router, id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Authentication required.');
      router.push(`/sign-in?redirect=/services/${id}`);
      return;
    }

    if (user.role === 'admin') {
      toast.error('Administrative accounts cannot submit customer bookings.');
      return;
    }

    if (user.isBlocked) {
      toast.error('Your account has been suspended by salon administration.');
      return;
    }

    if (!service || service.status !== 'active') {
      toast.error('This service is currently unavailable for booking.');
      return;
    }

    if (!appointmentDate) {
      toast.error('Please select an appointment date.');
      return;
    }

    if (appointmentDate < todayStr) {
      toast.error('Appointments cannot be scheduled for past dates.');
      return;
    }

    if (bookedSlots.includes(timeSlot)) {
      toast.error(
        'This time slot is already reserved for this date. Please select an available slot.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/appointments', {
        serviceId: service._id,
        appointmentDate,
        timeSlot,
        message: message.trim(),
      });

      if (res.success) {
        toast.success(
          'Appointment request submitted! Awaiting concierge confirmation.'
        );
        router.push('/dashboard/customer/appointments');
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.error(
          'This slot is already reserved for this date. Please choose another time slot.'
        );
        // Refresh booked slots list immediately
        if (service?._id && appointmentDate) {
          api
            .get<{ success: boolean; bookedSlots: string[] }>(
              `/appointments/booked-slots?serviceId=${service._id}&date=${appointmentDate}`
            )
            .then((r) => {
              if (r.success) setBookedSlots(r.bookedSlots);
            });
        }
      } else {
        toast.error((error as Error).message || 'Failed to book appointment.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingService || authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-alabaster-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-champagne-600 animate-spin" />
            <p className="text-sm font-medium text-stone-500">
              Loading service details...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (errorMessage || !service) {
    return (
      <div className="min-h-screen flex flex-col bg-alabaster-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-alabaster-300 text-center space-y-4 shadow-soft">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="font-serif text-2xl font-medium text-espresso-950">
              Service Unavailable
            </h2>
            <p className="text-stone-500 text-sm">
              The salon service you requested could not be located or may have been archived.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-espresso-900 text-white text-xs font-semibold hover:bg-espresso-800 transition-colors shadow-soft"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Catalog</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isInactive = service.status === 'inactive';
  const isAdminUser = user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-espresso-950 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Services Catalog</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Service Details & Photo */}
            <div className="lg:col-span-7 space-y-8">
              <div className="relative h-80 sm:h-[420px] w-full rounded-3xl overflow-hidden border border-alabaster-300 shadow-luxury">
                <Image
                  src={service.image}
                  alt={service.serviceName}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-espresso-950 text-xs font-semibold tracking-wider uppercase shadow-soft border border-white/40">
                    {service.category}
                  </span>
                </div>
                {isInactive && (
                  <div className="absolute top-4 right-4 bg-rose-600 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-soft">
                    Currently Inactive
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-8 border border-alabaster-300 shadow-soft space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-500">
                    <span className="flex items-center gap-1.5 font-semibold text-espresso-950">
                      <Clock className="w-4 h-4 text-champagne-600" />
                      {service.duration} Minutes Session
                    </span>
                    <span>&bull;</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Medical-Grade Sterilization
                    </span>
                    <span>&bull;</span>
                    <span className="text-champagne-700 bg-champagne-50 px-2.5 py-0.5 rounded-full border border-champagne-200">
                      Private Suite
                    </span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                    {service.serviceName}
                  </h1>
                </div>

                <div className="pt-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    Treatment Description
                  </h2>
                  <p className="text-stone-600 text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-alabaster-200 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                      Atelier Investment
                    </span>
                    <p className="font-serif text-3xl font-semibold text-espresso-950 mt-0.5">
                      ${service.price}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                      Standard Duration
                    </span>
                    <p className="text-base font-semibold text-espresso-900 mt-1">
                      {service.duration} mins
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Appointment Reservation Form with Live Slot Availability */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-alabaster-300 shadow-luxury space-y-6">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-champagne-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Reserve Session</span>
                  </div>
                  <h2 className="font-serif text-2xl font-medium text-espresso-950">
                    Book Appointment
                  </h2>
                  <p className="text-stone-500 text-xs">
                    Choose your date to preview real-time salon slot availability.
                  </p>
                </div>

                {isInactive ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Service Temporarily Unavailable</p>
                      <p className="mt-0.5 text-amber-700">
                        This treatment is currently marked as inactive by the atelier director and cannot be booked at this time.
                      </p>
                    </div>
                  </div>
                ) : isAdminUser ? (
                  <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-stone-700 text-xs flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Administrator Notice</p>
                      <p className="mt-0.5 text-stone-600">
                        You are logged in as an Administrator. Administrative accounts cannot place customer appointment bookings. Sign in as a customer to test the booking flow.
                      </p>
                    </div>
                  </div>
                ) : null}

                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  {/* Appointment Date */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                      Appointment Date <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        required
                        min={todayStr}
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        disabled={isInactive || isAdminUser}
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 outline-none transition-colors disabled:bg-stone-50 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Predefined Time Slot with Live Availability Indicator */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                        Salon Time Slot <span className="text-rose-600">*</span>
                      </label>
                      {isLoadingSlots ? (
                        <span className="flex items-center gap-1 text-[11px] text-stone-400">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Checking slots...
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-medium">
                          {SALON_TIME_SLOTS.length - bookedSlots.length} of {SALON_TIME_SLOTS.length} slots free
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {SALON_TIME_SLOTS.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = timeSlot === slot && !isBooked;

                        return (
                          <button
                            type="button"
                            key={slot}
                            disabled={isInactive || isAdminUser || isBooked}
                            onClick={() => setTimeSlot(slot)}
                            className={`flex items-center justify-between p-3.5 rounded-xl text-xs font-medium border transition-all ${
                              isBooked
                                ? 'border-dashed border-stone-200 bg-stone-100/70 text-stone-400 cursor-not-allowed line-through'
                                : isSelected
                                ? 'border-champagne-600 bg-champagne-50 text-espresso-950 shadow-soft ring-1 ring-champagne-400'
                                : 'border-alabaster-300 hover:border-champagne-400 bg-white text-stone-700'
                            } disabled:opacity-60`}
                          >
                            <span className="flex items-center gap-2">
                              <Clock
                                className={`w-3.5 h-3.5 ${
                                  isBooked ? 'text-stone-300' : 'text-champagne-600'
                                }`}
                              />
                              <span className={isBooked ? 'line-through text-stone-400' : ''}>
                                {slot}
                              </span>
                            </span>

                            {isBooked ? (
                              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 no-underline">
                                Booked
                              </span>
                            ) : isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-champagne-600" />
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-medium">
                                Available
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Message */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                      Stylist Notes &amp; Preferences{' '}
                      <span className="text-stone-400 font-normal lowercase">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isInactive || isAdminUser}
                      placeholder="Special allergies, hair texture notes, or consultation requests..."
                      className="w-full px-4 py-2.5 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 placeholder:text-stone-400 outline-none transition-colors resize-none disabled:bg-stone-50 disabled:opacity-60"
                    />
                  </div>

                  {/* Price Summary Breakdown */}
                  <div className="bg-alabaster-100 rounded-2xl p-4 border border-alabaster-300 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Service Fee</span>
                      <span>${service.price}.00</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Hygiene &amp; Linen Fee</span>
                      <span className="text-emerald-700 font-medium">Complimentary</span>
                    </div>
                    <div className="pt-2 border-t border-alabaster-300 flex justify-between font-semibold text-espresso-950 text-sm">
                      <span>Total Due (Upon Confirmation)</span>
                      <span>${service.price}.00</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isInactive || isAdminUser}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 font-medium text-sm tracking-wide transition-all shadow-luxury hover:shadow-luxury-hover disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Slot Availability...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Booking Request</span>
                        <Sparkles className="w-4 h-4 text-champagne-400" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2 text-[11px] text-stone-500 justify-center">
                    <Info className="w-3.5 h-3.5 text-stone-400" />
                    <span>No charge today. Payment requested once confirmed by concierge.</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
