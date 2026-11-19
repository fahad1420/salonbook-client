# SalonBook — Luxury Salon & Spa Frontend Web Application

High-end, bespoke appointment booking platform for **SalonBook**, designed with warm alabaster (`#FAF8F5`), deep espresso (`#1C1917`), and muted rose-gold (`#B76E79`) accents.

## Tech Stack
- **Framework:** Next.js (App Router) with TypeScript (Strict Mode)
- **Styling:** Tailwind CSS with custom luxury editorial palette
- **Icons:** Lucide Icons
- **Notifications:** Sonner Toast Notifications
- **Deployment:** Vercel

## Core Application Modules

### 1. Public Showcase & Discovery
- **Hero Banner:** Editorial typography, clear call-to-actions, and luxury atelier photography.
- **Service Categories:** Interactive category navigation linking to `/services?category=...`.
- **Featured Salon Services:** Live database-fetched active treatments with pricing and duration badges.
- **Signature Experience Section:** Hospital-grade sanitation, master stylists, clean organic formulations, and client satisfaction metrics.
- **Browse Services (`/services`):** Search by service name, category pills, price sorting (`asc` / `desc`), and pulse skeleton loaders.

### 2. Client Authentication & Booking
- **Sign In (`/sign-in`):** Email & Password, Google OAuth, and instant demo account autofill.
- **Sign Up (`/sign-up`):** Password security checklist, ImgBB photo upload, and customer role assignment.
- **Service Details & Booking (`/services/[id]`):** Authentication guard, predefined salon time slots, duplicate slot conflict rejection, and pending reservation creation.

### 3. Customer Dashboard (`/dashboard/customer`)
- **Overview:** Metric cards (Total Requests, Pending, Confirmed, Cancelled).
- **My Appointments:** Filter tabs, view details modal, self-cancellation for pending bookings, and Stripe Checkout Pay Now trigger.
- **My Profile:** Safe profile editing with ImgBB avatar upload.

### 4. Admin Command Center (`/dashboard/admin`)
- **Overview:** Salon KPIs, active services, pending reviews, confirmed appointments, and gross revenue metrics.
- **Manage Services:** Full catalog overview, active/inactive status toggle, edit modal, delete with confirmation, and **mandatory ImgBB file upload input only**.
- **Manage Appointments:** Confirm pending bookings or cancel appointments with confirmation dialogs.
- **Manage Clients:** Registered customer list with instant account suspension/reactivation toggles.
- **Financial Ledger:** Read-only Stripe transaction ledger with masked session IDs.
- **Director Profile:** Administrator profile management with ImgBB upload.

### 5. Stripe Checkout Integration
- **Success Screen (`/payment/success`):** Displays confirmed payment reference and redirects to reservations.
- **Cancellation Screen (`/payment/cancel`):** Reassures client that appointment is held and can be settled later.

## Environment Variables (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
