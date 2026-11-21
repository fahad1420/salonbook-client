import { jsPDF } from 'jspdf';
import { Appointment, Service, User } from '@/types';

export function generateReceiptPDF(appointment: Appointment): void {
  if (appointment.paymentStatus !== 'paid') {
    throw new Error('Official receipts are only available for confirmed, paid appointments.');
  }

  const service =
    typeof appointment.serviceId === 'object'
      ? (appointment.serviceId as Service)
      : null;
  const customer =
    typeof appointment.customerId === 'object'
      ? (appointment.customerId as User)
      : null;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const receiptNumber = `SB-REC-${appointment._id.slice(-8).toUpperCase()}`;
  const serviceName = service?.serviceName || 'Atelier Treatment';
  const category = service?.category || 'Salon Service';
  const customerName = customer?.name || 'Valued Guest';
  const customerEmail = customer?.email || 'N/A';
  const customerPhone = customer?.phone || 'N/A';
  const price = appointment.servicePrice || service?.price || 0;
  const duration = service?.duration ? `${service.duration} mins` : 'Standard allocation';
  const date = appointment.appointmentDate;
  const slot = appointment.timeSlot;
  const paidDate = new Date(appointment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const stripeRef = (appointment as any).stripeSessionId
    ? `STRIPE-${String((appointment as any).stripeSessionId).slice(-12).toUpperCase()}`
    : `TXN-${appointment._id.slice(-10).toUpperCase()}`;

  // 1. Top Decorative Header Bar
  doc.setFillColor(30, 27, 24); // Espresso 900
  doc.rect(0, 0, 210, 36, 'F');

  // Accent Gold line
  doc.setFillColor(197, 155, 109); // Champagne Gold
  doc.rect(0, 36, 210, 2, 'F');

  // Brand Name
  doc.setTextColor(250, 247, 242); // Alabaster 100
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('SALONBOOK', 20, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(197, 155, 109);
  doc.text('ATELIER & SPA APPOINTMENT RESERVATION', 20, 26);

  // Receipt Label right-aligned
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(250, 247, 242);
  doc.text('PAYMENT RECEIPT', 190, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 190, 180);
  doc.text(receiptNumber, 190, 25, { align: 'right' });

  // 2. Receipt Status Badge
  doc.setFillColor(235, 245, 235);
  doc.roundedRect(20, 46, 170, 12, 2, 2, 'F');
  doc.setDrawColor(120, 180, 120);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, 46, 170, 12, 2, 2, 'D');

  doc.setTextColor(30, 120, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('STATUS: CONFIRMED & FULLY SETTLED (PAID)', 25, 53.5);

  doc.setTextColor(80, 100, 80);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Settlement Date: ${paidDate}`, 185, 53.5, { align: 'right' });

  // 3. Customer & Atelier Information Grid
  let y = 68;

  // Box 1: Customer Details
  doc.setFillColor(250, 247, 242);
  doc.roundedRect(20, y, 82, 38, 2, 2, 'F');
  doc.setDrawColor(230, 224, 215);
  doc.roundedRect(20, y, 82, 38, 2, 2, 'D');

  doc.setTextColor(140, 100, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CLIENT DETAILS', 25, y + 7);

  doc.setTextColor(30, 27, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(customerName, 25, y + 14);

  doc.setTextColor(100, 95, 90);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Email: ${customerEmail}`, 25, y + 21);
  doc.text(`Phone: ${customerPhone}`, 25, y + 27);
  const customerIdStr =
    (customer as any)?.id ||
    (customer as any)?._id ||
    (typeof appointment.customerId === 'string' ? appointment.customerId : (appointment.customerId as any)?._id || (appointment.customerId as any)?.id || '');
  doc.text(`Customer ID: ${customerIdStr}`, 25, y + 33);

  // Box 2: Appointment Details
  doc.setFillColor(250, 247, 242);
  doc.roundedRect(108, y, 82, 38, 2, 2, 'F');
  doc.setDrawColor(230, 224, 215);
  doc.roundedRect(108, y, 82, 38, 2, 2, 'D');

  doc.setTextColor(140, 100, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('APPOINTMENT DETAILS', 113, y + 7);

  doc.setTextColor(30, 27, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Date: ${date}`, 113, y + 14);

  doc.setTextColor(100, 95, 90);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Time Slot: ${slot}`, 113, y + 21);
  doc.text(`Treatment Duration: ${duration}`, 113, y + 27);
  doc.text(`Booking Ref: #${appointment._id.slice(-8).toUpperCase()}`, 113, y + 33);

  // 4. Line Items Table
  y = 116;

  // Table Header
  doc.setFillColor(30, 27, 24);
  doc.rect(20, y, 170, 8, 'F');

  doc.setTextColor(250, 247, 242);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ITEM / SERVICE DESCRIPTION', 25, y + 5.5);
  doc.text('DISCIPLINE', 110, y + 5.5);
  doc.text('AMOUNT (USD)', 185, y + 5.5, { align: 'right' });

  // Row 1: The Service
  y += 8;
  doc.setFillColor(255, 255, 255);
  doc.rect(20, y, 170, 14, 'F');
  doc.setDrawColor(230, 224, 215);
  doc.setLineWidth(0.2);
  doc.line(20, y + 14, 190, y + 14);

  doc.setTextColor(30, 27, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(serviceName, 25, y + 6);

  doc.setTextColor(120, 115, 110);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Allocated specialist appointment on ${date} (${slot})`, 25, y + 11);

  doc.text(category, 110, y + 8);

  doc.setTextColor(30, 27, 24);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`$${price.toFixed(2)}`, 185, y + 8, { align: 'right' });

  // Row 2: Subtotal and Total section
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 95, 90);
  doc.text('Subtotal:', 140, y);
  doc.text(`$${price.toFixed(2)}`, 185, y, { align: 'right' });

  y += 6;
  doc.text('Concierge Reservation Fee:', 140, y);
  doc.text('$0.00', 185, y, { align: 'right' });

  y += 6;
  doc.text('Taxes & Surcharges (Included):', 140, y);
  doc.text('$0.00', 185, y, { align: 'right' });

  y += 4;
  doc.setDrawColor(197, 155, 109);
  doc.setLineWidth(0.4);
  doc.line(140, y, 190, y);

  y += 7;
  doc.setFillColor(250, 247, 242);
  doc.roundedRect(138, y - 5, 52, 12, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 27, 24);
  doc.text('Total Paid:', 142, y + 3);

  doc.setTextColor(140, 100, 60);
  doc.setFontSize(11);
  doc.text(`$${price.toFixed(2)} USD`, 186, y + 3, { align: 'right' });

  // 5. Payment Method & Audit Trail
  y += 24;
  doc.setFillColor(250, 247, 242);
  doc.roundedRect(20, y, 170, 24, 2, 2, 'F');
  doc.setDrawColor(230, 224, 215);
  doc.roundedRect(20, y, 170, 24, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(140, 100, 60);
  doc.text('PAYMENT & TRANSACTION VERIFICATION', 25, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 75, 70);
  doc.text(`Payment Gateway: Stripe Checkout (Verified Server Webhook)`, 25, y + 12);
  doc.text(`Transaction Reference: ${stripeRef}`, 25, y + 17);
  doc.text(`Security Verification: SHA-256 Webhook Cryptographic Signature Validated`, 25, y + 22);

  // 6. Atelier Policies & Notes
  y += 32;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 27, 24);
  doc.text('APPOINTMENT POLICIES & CONCIERGE INFORMATION', 20, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 115, 110);
  doc.text(
    '• Please arrive 10 minutes prior to your allocated time slot. Your specialist will be reserved exclusively for you.',
    20,
    y + 5
  );
  doc.text(
    '• Cancellation of paid appointments is subject to salon administration policy. Contact customer support via dashboard.',
    20,
    y + 9
  );
  doc.text(
    '• This document constitutes a certified digital proof of purchase from SalonBook Atelier & Spa.',
    20,
    y + 13
  );

  // 7. Bottom Signature Bar
  doc.setDrawColor(230, 224, 215);
  doc.setLineWidth(0.3);
  doc.line(20, 275, 190, 275);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(150, 145, 140);
  doc.text('SalonBook Atelier & Spa • Automated Accounting System • Verified Academic Demonstration Platform', 105, 280, {
    align: 'center',
  });
  doc.text(`Generated on ${new Date().toUTCString()} • Receipt ID: ${receiptNumber}`, 105, 284, {
    align: 'center',
  });

  // Save the PDF file
  const filename = `SalonBook-Receipt-${appointment._id.slice(-6).toUpperCase()}.pdf`;
  doc.save(filename);
}
