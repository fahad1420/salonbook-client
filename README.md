# SalonBook — Luxury Salon & Spa Frontend Web Application

High-end, bespoke appointment booking platform for **SalonBook**, designed with warm alabaster (`#FAF8F5`), deep espresso (`#1C1917`), burnished champagne gold (`#C59B6D`), neutral sand (`#E9E1D7`), and refined sage (`#788477`) accents.

## Live Production Links & Repositories
- **Production Web Application:** [https://salonbook-booking.vercel.app](https://salonbook-booking.vercel.app)
- **Production API URL:** [https://salonbook-api.vercel.app](https://salonbook-api.vercel.app)
- **Frontend GitHub Repository:** [https://github.com/fahad1420/salonbook-client](https://github.com/fahad1420/salonbook-client)
- **Backend GitHub Repository:** [https://github.com/fahad1420/salonbook-server](https://github.com/fahad1420/salonbook-server)

---

## Tech Stack
- **Framework:** Next.js 14 (App Router) with TypeScript (Strict Mode)
- **Styling:** Tailwind CSS with custom luxury editorial palette (`#FAF8F5`, `#1C1917`, `#C59B6D`, `#E9E1D7`, `#788477`)
- **Typography:** Playfair Display, Cormorant Garamond, and Plus Jakarta Sans
- **Icons:** Lucide Icons
- **Brand Identity:** Custom architectural `SB` Monogram and typographic wordmark
- **Notifications:** Sonner Toast Notifications (zero browser `alert()` popups)
- **Authentication:** Better Auth (MongoDB Adapter) with Session Management & Google OAuth
- **Payments:** Stripe Checkout & Cryptographically Verified Webhooks
- **Deployment:** Vercel

---

## Core Modules & Features

### 1. Brand Identity & Editorial Showcase
- **Custom SB Monogram:** Architectural luxury brand monogram integrated across header, footer, authentication screens, and dashboard sidebars.
- **Hero Section:** Clear value proposition, atelier photography, primary booking CTA, and secondary category exploration.
- **Interactive Category Showcase:** 7 core disciplines (*Haircut & Styling, Hair Coloring, Hair Treatment, Facial & Skincare, Makeup, Manicure & Pedicure, Spa & Massage*) with dynamic treatment counts from the database.
- **Curated Featured Rituals:** Active treatments fetched live from MongoDB with transparent fees, duration allocations, and direct booking links.
- **How It Works (5-Step Reservation Flow):**
  1. Explore Services
  2. Select a Service
  3. Choose Date & Time Slot
  4. Confirm Appointment
  5. Complete Payment (once confirmed)
- **Why SalonBook:** Real platform benefits covering convenient booking, transparent pricing, appointment management, secure Stripe checkout, and isolated customer portals.
- **Operating Standards & Policies:** Sterilization protocols, clear session durations, and client self-service cancellation rules.

### 2. Treatment Discovery & Booking Flow
- **Browse Services (`/services`):** Live URL-synced search, category filtering pills, price sorting (`price_asc` / `price_desc`), pagination, and skeleton loading states.
- **Service Details (`/services/[id]`):** Authentication protection, full treatment specifications, and **Real-Time Slot Availability Indicator** (`GET /api/appointments/booked-slots`) dynamically disabling already-booked slots.

### 3. Customer Dashboard (`/dashboard/customer`)
- **Overview:** Personal reservation metrics and recent booking history.
- **My Appointments:** Filtered tabs, appointment detail modal, cancellation for pending requests, **Stripe Checkout Pay Now** button (for confirmed unpaid visits), and digital receipt access.
- **My Profile:** Personal profile information management with secure image upload.

### 4. Admin Command Center (`/dashboard/admin`)
- **Overview & Real-Time Metrics:** Live KPI cards (total customers, active services, pending appointments, confirmed appointments, successful payments, and revenue summaries) calculated directly from MongoDB.
- **Manage Services:** Treatment catalog, active/inactive toggle, edit modal, delete confirmation dialog, and server-side ImgBB upload.
- **Manage Appointments:** Concierge reservation review, confirm pending bookings, cancel requests with safety dialogs, and receipt inspection.
- **Manage Clients:** Registered customer directory with instantaneous account suspension/reactivation toggles (`isBlocked`).
- **Financial Ledger:** Stripe transaction records with masked session IDs and printable digital receipts.
- **Director Profile:** Administrator profile management.

### 5. Printable / Downloadable Digital Booking Receipt Modal
- Available for any confirmed/paid appointment with itemized pricing, schedule allocation, customer details, and a dedicated `window.print()` layout.

---

## Environment Variables (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=https://salonbook-api.vercel.app/api
NEXT_PUBLIC_BETTER_AUTH_URL=https://salonbook-api.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
