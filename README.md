# SalonBook — Luxury Salon & Spa Frontend Web Application

High-end, bespoke appointment booking platform for **SalonBook**, designed with warm alabaster (`#FAF7F2`), deep espresso charcoal (`#1E1B18`), and burnished champagne gold (`#C59B6D`) accents, inspired by top platforms like **Fresha** and **Booksy**.

## Live Production Links & Repositories
- **Production Web Application:** [https://salonbook-booking.vercel.app](https://salonbook-booking.vercel.app)
- **Production API URL:** [https://salonbook-api.vercel.app](https://salonbook-api.vercel.app)
- **Frontend GitHub Repository:** [https://github.com/fahad1420/salonbook-client](https://github.com/fahad1420/salonbook-client)
- **Backend GitHub Repository:** [https://github.com/fahad1420/salonbook-server](https://github.com/fahad1420/salonbook-server)

### Demo Credentials
- **Salon Director (Admin):** `admin@salonbook.com` / `Password123!`
- **Client (Customer):** `vivienne@example.com` / `Password123!`

---

## Tech Stack
- **Framework:** Next.js 14 (App Router) with TypeScript (Strict Mode)
- **Styling:** Tailwind CSS with custom luxury editorial palette (`#FAF7F2`, `#1E1B18`, `#C59B6D`)
- **Typography:** Playfair Display, Cormorant Garamond, and Plus Jakarta Sans
- **Icons:** Lucide Icons
- **Notifications:** Sonner Toast Notifications (zero browser `alert()` popups)
- **Authentication:** Custom JWT Bearer Auth & Google OAuth
- **Payments:** Stripe Checkout & Cryptographically Verified Webhooks
- **Deployment:** Vercel

## Core Modules & High-Value Luxury Features

### 1. Bespoke Editorial Showcase & Discovery
- **Asymmetric Split Hero Banner:** Refined serif typography, live trust badges (*"4.9★ Rated Luxury Studio • Instant Online Booking • Certified Master Stylists"*), primary CTA, and framed atelier photography.
- **Interactive Category Showcase:** Sleek discipline cards with real-time dynamic service counts aggregated from the database, linking directly to `/services?category=...`.
- **Curated Featured Rituals:** 6+ active treatments fetched live with investment pricing, duration badges, and smooth hover transitions.
- **The SalonBook Standard & Master Stylists Spotlight:** Clinical autoclave sterilization standards paired with 3 realistic European master stylist profiles.
- **Verified Client Stories:** Real customer testimonials with service badges and star ratings.

### 2. Treatment Discovery & Booking Flow
- **Browse Services (`/services`):** URL-synced search, category filter pills, price sorting (`Low to High` / `High to Low`), reset button, and custom empty state illustrations.
- **Service Details (`/services/[id]`):** Authentication protection, full treatment specifications, and **Real-Time Slot Availability Indicator** (`GET /api/appointments/booked-slots`) dynamically disabling already-booked slots.

### 3. Customer Dashboard (`/dashboard/customer`)
- **Overview:** Personal metrics, Atelier Member Standing breakdown, and recent activity.
- **My Appointments:** Status tabs, view details modal, cancellation for pending requests, **Stripe Checkout Pay Now** button (for confirmed unpaid visits), and **Digital Receipt Modal**.
- **My Profile:** Safe personal details editing with ImgBB avatar upload.

### 4. Admin Command Center (`/dashboard/admin`)
- **Overview & Visual Analytics:** Real-time KPI cards, **Appointment Status Breakdown Progress Bars**, and financial conversion metrics (Average Ticket Size, Confirmation Rate, Payment Settle Rate).
- **Manage Services:** Full treatment catalog, active/inactive toggle, edit modal, delete with safety dialog, and **ImgBB file upload ONLY (zero raw URL input)**.
- **Manage Appointments:** Confirm pending bookings, cancel reservations with confirmation dialogs, and instant receipt viewing.
- **Manage Clients:** Registered customer list with instantaneous account suspension/reactivation toggles (`isBlocked`).
- **Financial Ledger:** Read-only Stripe transaction records with masked session IDs and **Printable Digital Receipt** access.
- **Director Profile:** Administrator profile management with ImgBB upload.

### 5. Printable / Downloadable Digital Booking Receipt Modal
- Accessible for any `paid` appointment in Customer Appointments, Admin Overview, and Admin Transactions.
- Branded header, official receipt number (`REC-XXXXXX`), client and schedule allocation, itemized fee breakdown, and **"Print / Download Receipt"** (`window.print()`) action with dedicated print media CSS rules.

### 6. Custom Branded 404 & Error Boundaries
- `src/app/not-found.tsx`: Bespoke 404 screen guiding guests back to the atelier catalog or home.
- `src/app/error.tsx`: Elegant error boundary with reset and recovery actions.

## Environment Variables (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=https://salonbook-api.vercel.app/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
