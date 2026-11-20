'use client';

import React from 'react';
import { Appointment, Service, User } from '@/types';
import {
  Sparkles,
  Printer,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  User as UserIcon,
  CreditCard,
  Building,
  ShieldCheck,
} from 'lucide-react';

interface AppointmentReceiptModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export default function AppointmentReceiptModal({
  appointment,
  onClose,
}: AppointmentReceiptModalProps) {
  if (!appointment) return null;

  const service =
    typeof appointment.serviceId === 'object'
      ? (appointment.serviceId as Service)
      : null;
  const customer =
    typeof appointment.customerId === 'object'
      ? (appointment.customerId as User)
      : null;

  const receiptNumber = `REC-${appointment._id.slice(-6).toUpperCase()}`;
  const formattedDate = new Date(appointment.createdAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-alabaster-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-alabaster-200 bg-alabaster-50 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-champagne-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Booking Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-xs font-semibold transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-full text-stone-400 hover:text-espresso-950 hover:bg-alabaster-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 printable-receipt">
          {/* Atelier Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-alabaster-200 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-espresso-900 flex items-center justify-center text-alabaster-100">
                  <Sparkles className="w-3.5 h-3.5 text-champagne-400" />
                </div>
                <span className="font-serif text-xl font-medium tracking-tight text-espresso-950">
                  Salon<span className="text-champagne-600 font-normal">Book</span>
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-snug">
                Haute Coiffure &amp; Restorative Wellness Atelier<br />
                450 Madison Avenue, Penthouse Level, New York, NY 10022<br />
                +1 (212) 555-8900 &bull; concierge@salonbook.com
              </p>
            </div>

            <div className="sm:text-right space-y-0.5">
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                Paid in Full &bull; Confirmed
              </span>
              <p className="font-mono text-xs font-semibold text-espresso-900 pt-1">
                {receiptNumber}
              </p>
              <p className="text-[11px] text-stone-400">Date Issued: {formattedDate}</p>
            </div>
          </div>

          {/* Client & Reservation Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-alabaster-50 border border-alabaster-200 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 flex items-center gap-1">
                <UserIcon className="w-3 h-3 text-champagne-600" />
                Client Information
              </span>
              <p className="font-semibold text-espresso-950 text-sm">
                {customer?.name || 'Valued Guest'}
              </p>
              <p className="text-stone-500">{customer?.email || 'N/A'}</p>
              {customer?.phone && <p className="text-stone-500">{customer.phone}</p>}
            </div>

            <div className="p-4 rounded-2xl bg-alabaster-50 border border-alabaster-200 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-champagne-600" />
                Schedule Allocation
              </span>
              <p className="font-semibold text-espresso-950 text-sm">
                {appointment.appointmentDate}
              </p>
              <p className="text-stone-600 font-medium">{appointment.timeSlot}</p>
              <p className="text-[11px] text-stone-400">
                Duration: {service?.duration || 60} Minutes
              </p>
            </div>
          </div>

          {/* Itemized Line Items */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Reserved Service Treatment
            </h4>

            <div className="border border-alabaster-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-alabaster-100 text-stone-500 uppercase tracking-wider font-semibold border-b border-alabaster-200">
                  <tr>
                    <th className="py-2.5 px-4">Treatment</th>
                    <th className="py-2.5 px-4 text-center">Category</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-alabaster-100">
                  <tr>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-espresso-950">
                        {service?.serviceName || 'Custom Salon Service'}
                      </p>
                      <p className="text-[11px] text-stone-400 line-clamp-1">
                        {service?.description || 'Curated luxury salon appointment'}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center text-stone-600">
                      {service?.category || 'Salon Service'}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-espresso-950">
                      ${appointment.servicePrice}.00
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-stone-600">
                      Hospital-Grade Autoclave Sterilization &amp; Suite Linen
                    </td>
                    <td className="py-2.5 px-4 text-center text-emerald-600 font-medium">
                      Atelier Courtesy
                    </td>
                    <td className="py-2.5 px-4 text-right text-emerald-600 font-medium">
                      $0.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Breakdown & Stripe Reference */}
          <div className="p-4 rounded-2xl bg-alabaster-100 border border-alabaster-300 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>${appointment.servicePrice}.00</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Taxes &amp; Concierge Fees</span>
              <span>$0.00</span>
            </div>
            <div className="pt-2 border-t border-alabaster-300 flex justify-between font-semibold text-espresso-950 text-sm">
              <span>Total Paid (USD)</span>
              <span>${appointment.servicePrice}.00</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-alabaster-200">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-champagne-600" />
              <span>Processed via Stripe Electronic Checkout</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cryptographically Verified</span>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-[10px] text-center text-stone-400 italic">
            Thank you for choosing SalonBook Atelier. Please arrive 10 minutes prior to your session time. Cancellations must be made at least 24 hours in advance.
          </p>
        </div>
      </div>
    </div>
  );
}
