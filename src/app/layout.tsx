import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'SalonBook — Luxury Salon & Spa Appointment Booking',
  description:
    'Book salon and spa appointments with transparent pricing and real-time slot scheduling.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('salonbook_theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-alabaster-100 dark:bg-[#121110] text-espresso-900 dark:text-alabaster-100 flex flex-col antialiased selection:bg-champagne-500 selection:text-white font-sans transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                className: 'dark:!bg-espresso-900 dark:!text-alabaster-100 dark:!border-espresso-800',
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
        </ThemeProvider>
      </body>
    </html>
  );
}
