'use client';

import React from 'react';
import Image from 'next/image';
import { Appointment, Service } from '@/types';
import { X, Calendar, Clock, DollarSign, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export default function AppointmentDetailsModal({
  appointment,
  onClose,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null;

  const service = typeof appointment.serviceId === 'object' ? (appointment.serviceId as Service) : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/40 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/40 dark:text-rose-400">
            <AlertCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/40 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
    }
  };

  const getPaymentBadge = (paymentStatus: string) => {
    if (paymentStatus === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300">
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300">
        Unpaid
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-alabaster-300 dark:border-stone-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-alabaster-200 dark:border-stone-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Reservation Reference #{appointment._id.substring(appointment._id.length - 8)}
            </span>
            <h3 className="font-serif text-2xl font-medium text-espresso-950 dark:text-alabaster-50">
              Appointment Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Service Header */}
        {service && (
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-alabaster-100 dark:bg-stone-800/60 border border-alabaster-300 dark:border-stone-700">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-alabaster-300 dark:border-stone-700">
              <Image
                src={service.image}
                alt={service.serviceName}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-champagne-700 dark:text-champagne-300 bg-champagne-100 dark:bg-champagne-950/60 px-2 py-0.5 rounded-full border border-champagne-200 dark:border-champagne-800">
                {service.category}
              </span>
              <h4 className="font-serif text-base font-semibold text-espresso-950 dark:text-alabaster-100 truncate mt-1">
                {service.serviceName}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">{service.duration} Minutes</p>
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-alabaster-50 dark:bg-stone-800/40 border border-alabaster-200 dark:border-stone-800 space-y-1">
            <span className="text-stone-400 dark:text-stone-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-champagne-600 dark:text-champagne-400" />
              <span>Date</span>
            </span>
            <p className="font-semibold text-espresso-950 dark:text-alabaster-100 text-sm">
              {appointment.appointmentDate}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-alabaster-50 dark:bg-stone-800/40 border border-alabaster-200 dark:border-stone-800 space-y-1">
            <span className="text-stone-400 dark:text-stone-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-champagne-600 dark:text-champagne-400" />
              <span>Time Window</span>
            </span>
            <p className="font-semibold text-espresso-950 dark:text-alabaster-100 text-sm">
              {appointment.timeSlot}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-alabaster-50 dark:bg-stone-800/40 border border-alabaster-200 dark:border-stone-800 space-y-1">
            <span className="text-stone-400 dark:text-stone-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-champagne-600 dark:text-champagne-400" />
              <span>Price</span>
            </span>
            <p className="font-semibold text-espresso-950 dark:text-alabaster-100 text-sm">
              ${appointment.servicePrice}.00
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-alabaster-50 dark:bg-stone-800/40 border border-alabaster-200 dark:border-stone-800 space-y-1">
            <span className="text-stone-400 dark:text-stone-500 uppercase tracking-wider font-semibold">
              Payment Status
            </span>
            <div className="pt-0.5">{getPaymentBadge(appointment.paymentStatus)}</div>
          </div>
        </div>

        {/* Status Banner */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/40 border border-alabaster-300 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Reservation Status:</span>
          <div>{getStatusBadge(appointment.status)}</div>
        </div>

        {/* Message Notes */}
        {appointment.message && (
          <div className="p-4 rounded-2xl bg-alabaster-50 dark:bg-stone-800/40 border border-alabaster-200 dark:border-stone-800 space-y-1.5 text-xs">
            <span className="font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-champagne-600 dark:text-champagne-400" />
              <span>Client Notes for Stylist</span>
            </span>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed italic">
              &ldquo;{appointment.message}&rdquo;
            </p>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-espresso-900 text-alabaster-100 dark:bg-champagne-500 dark:text-stone-950 text-xs font-semibold hover:bg-espresso-800 dark:hover:bg-champagne-400 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
