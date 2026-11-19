import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SalonBook — Luxury Salon & Spa Appointment Booking',
  description: 'Experience refined artistry and bespoke salon treatments. Reserve your session with top stylists.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-alabaster-100 text-espresso-900 flex flex-col antialiased">
        {children}
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}
