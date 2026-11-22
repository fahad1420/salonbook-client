# SalonBook — Salon Appointment Booking Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.1-orange?style=for-the-badge)](https://www.better-auth.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://salonbook-booking.vercel.app)

> **Assignment 9 — Category: 002**  
> A premium, role-based salon and spa appointment booking platform built with Next.js App Router, TypeScript, Express.js, MongoDB, Better Auth (Session + Google OAuth), Stripe Checkout, and verified Webhooks.

---

## 🌐 Live Production Links & Repositories

| Resource | URL |
| :--- | :--- |
| **Live Web Application** | [https://salonbook-booking.vercel.app](https://salonbook-booking.vercel.app) |
| **Backend API Service** | [https://salonbook-api.vercel.app](https://salonbook-api.vercel.app) |
| **Client GitHub Repository** | [https://github.com/fahad1420/salonbook-client](https://github.com/fahad1420/salonbook-client) |
| **Server GitHub Repository** | [https://github.com/fahad1420/salonbook-server](https://github.com/fahad1420/salonbook-server) |

---

## 🔑 Evaluation Demo Credentials

The platform is seeded and deployed with dedicated evaluation accounts:

| Role | Email | Password | Primary Permissions & Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@salonbook.com` | `Password123!` | Real-time analytics, Service CRUD, ImgBB image uploads, Confirm/Cancel appointments, Manage/Block users (`isBlocked`), Financial Ledger |
| **Customer** | `vivienne@example.com` | `Password123!` | Browse catalog, Filter & sort, Book predefined slots, Double-booking conflict guard, Stripe Checkout payments, Download vector PDF receipts |
| **Google Sign-In** | *Any Google Account* | *Google OAuth 2.0* | One-click social authentication strictly assigning `customer` role |

---

## 📋 Project Overview & Purpose

**SalonBook** is a full-featured, commercial-grade salon appointment booking platform where customers can explore salon services, inspect service specifications, and schedule appointments online. 

The salon administrator manages services, reviews appointment requests, confirms or cancels appointments, monitors registered clients, and tracks customer payments. Customers manage their own reservations, cancel pending appointments, pay for confirmed appointments securely via Stripe, and download official booking receipts.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router, React Server & Client Components)
- **Language:** TypeScript (Strict Mode enabled)
- **Styling:** Tailwind CSS with custom luxury editorial palette (`#FAF8F5`, `#1C1917`, `#C59B6D`, `#E9E1D7`, `#788477`)
- **Typography:** Playfair Display, Cormorant Garamond, and Plus Jakarta Sans
- **Icons:** Lucide Icons (`lucide-react`)
- **Authentication:** Better Auth (MongoDB Adapter) with session cookie hydration & Google OAuth 2.0
- **Payments:** Stripe Checkout & Cryptographically Verified Webhook integration
- **Receipts & Exports:** `jspdf` vector PDF invoice generation + responsive Print stylesheet
- **Notifications:** Sonner Toast Notifications (zero blocking browser alerts)
- **Deployment:** Vercel Production Platform

---

## ✨ Key Features

### 👤 Customer Experience
- **Service Catalog Discovery:** Explore treatments with high-resolution imagery, pricing, duration, category badges, and descriptions.
- **Search & Filters:** Real-time search by service name, filter across 7 disciplines (*Haircut & Styling, Hair Coloring, Hair Treatment, Facial & Skincare, Makeup, Manicure & Pedicure, Spa & Massage*), and sort by price (*Low to High*, *High to Low*).
- **Service Details Page (`/services/[id]`):** In-depth treatment overview with direct booking action for authenticated users.
- **Appointment Booking:** Predefined time slots, past-date calendar lockout, and **Real-Time Slot Availability Indicator** (`/api/appointments/booked-slots`).
- **Conflict Prevention:** Server-side guard preventing double-booking of active appointments for identical slots (`HTTP 409 Conflict`).
- **Customer Dashboard (`/dashboard/customer`):**
  - **Overview:** Real-time statistics (Total, Pending, Confirmed, Cancelled).
  - **My Appointments:** Filtered tabs, appointment detail modal, self-service cancellation for pending bookings.
  - **Stripe Checkout Pay Now:** One-click checkout for confirmed, unpaid visits.
  - **Downloadable PDF Receipt:** Official vector PDF receipts with unique serial numbers, treatment details, and Stripe reference ID.
- **Profile Management:** Update personal name, contact telephone, and upload avatar.

### 🛡️ Administrator Command Center (`/dashboard/admin`)
- **Operational Analytics:** Real-time database aggregations (Total Customers, Active Services, Pending Appointments, Confirmed Appointments, Total Successful Payments, Gross Revenue).
- **Manage Services (CRUD):** Add new treatments, update details, toggle active/inactive status, delete treatments, and upload images directly to ImgBB via secure server gateway.
- **Manage Appointments:** Review customer requests, inspect special requests, confirm pending appointments, and cancel with confirmation protection.
- **Manage Customers:** Directory of registered customers with instant account suspension/reactivation (`isBlocked` flag with immediate session rejection).
- **Financial Ledger:** Read-only record of confirmed Stripe payment transactions, session IDs, and customer information.

### 🎨 Design & Accessibility
- **Luxury Theme Switching:** Seamless Atelier Dark Mode and Light Mode toggle with zero Flash of Unstyled Theme (FOUT).
- **Fully Responsive:** Custom layouts tailored for mobile smartphones, tablets, and wide-screen desktops.
- **Strict Error Handling:** Custom 404 Not Found, 500 Server Error boundaries, and URL validation.

---

## 🔒 Required Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Backend REST API Base URL
NEXT_PUBLIC_API_URL=https://salonbook-api.vercel.app/api

# Better Auth Base URL (Points to the backend server)
NEXT_PUBLIC_BETTER_AUTH_URL=https://salonbook-api.vercel.app

# Stripe Public Key (For client-side checkout redirection)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

> **Security Note:** Never commit actual API keys or secret tokens to version control. Production environment variables are securely configured in Vercel.

---

## 🚀 How to Run the Project Locally

### Prerequisites
- Node.js version `20.x` or higher
- npm (v10+), yarn, or pnpm
- Running instance of the `salonbook-server` backend

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fahad1420/salonbook-client.git
   cd salonbook-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create `.env.local` based on the template above:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend API URL
   ```

4. **Run the local development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

6. **Create a production build:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📁 Project Directory Structure

```
salonbook-client/
├── src/
│   ├── app/                      # Next.js App Router routes
│   │   ├── dashboard/            # Role-protected dashboards
│   │   │   ├── admin/            # Admin Command Center
│   │   │   │   ├── appointments/ # Appointment review & status
│   │   │   │   ├── services/     # Service CRUD & ImgBB upload
│   │   │   │   ├── transactions/ # Stripe financial ledger
│   │   │   │   └── users/        # Customer directory & suspension
│   │   │   └── customer/         # Customer Portal
│   │   │       ├── appointments/ # My Appointments & Stripe Pay
│   │   │       └── profile/      # Profile management
│   │   ├── payment/              # Payment outcome routes
│   │   │   ├── cancel/           # Stripe cancellation page
│   │   │   └── success/          # Stripe verified confirmation
│   │   ├── services/             # Browse catalog & details
│   │   │   └── [id]/             # Dynamic service detail route
│   │   ├── sign-in/              # Email & Google authentication
│   │   ├── sign-up/              # Customer registration
│   │   ├── layout.tsx            # Root layout with FOUT prevention
│   │   └── page.tsx              # Luxury editorial homepage
│   ├── components/               # Reusable UI components
│   │   ├── AppointmentDetailsModal.tsx
│   │   ├── AppointmentReceiptModal.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── Footer.tsx            # Complete salon footer
│   │   ├── Navbar.tsx            # Navigation & auth state
│   │   ├── ServiceCard.tsx       # Treatment presentation card
│   │   ├── ThemeToggle.tsx       # Dark/Light mode switcher
│   │   └── ...
│   ├── context/                  # Theme & Global State
│   │   └── ThemeContext.tsx
│   └── lib/                      # Utilities & Client SDKs
│       ├── auth-client.ts        # Better Auth client configuration
│       ├── pdfReceipt.ts         # jsPDF vector receipt generator
│       └── utils.ts
├── public/                       # Static brand assets & favicon
├── tailwind.config.ts            # Palette & typography configuration
├── tsconfig.json                 # Strict TypeScript configuration
└── package.json
```

---

## 🚢 Deployment Guideline

- **Platform:** Vercel
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Zero Reload Issues:** Configured with dynamic route caching, serverless route rewriting, and cross-origin credential cookies.
- **Protected Routes:** Automatic client-side hydration check before redirecting unauthenticated or unauthorized roles.

---

## 📄 License & Attribution

Developed for **Assignment 9 — Category: 002** evaluation. Built by **Fahad** as a modern, production-ready salon reservation platform.
