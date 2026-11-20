import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'SalonBook — Luxury Salon & Spa Appointment Booking',
  description:
    'Experience bespoke beauty artistry and restorative spa therapies. Reserve your private session with certified European master stylists.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-alabaster-100 text-espresso-900 flex flex-col antialiased selection:bg-champagne-500 selection:text-white font-sans">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            theme="light"
            toastOptions={{
              style: {
                background: '#FAF7F2',
                color: '#1E1B18',
                border: '1px solid #E8E0D5',
                boxShadow: '0 10px 30px -5px rgba(30, 27, 24, 0.08)',
                fontFamily: 'inherit',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
