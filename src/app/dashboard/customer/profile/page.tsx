'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomerSidebar from '@/components/CustomerSidebar';
import ImgBBUpload from '@/components/ImgBBUpload';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { User as UserIcon, Mail, Phone, Shield, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerProfilePage() {
  const { user, isLoading: authLoading, updateUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/sign-in?redirect=/dashboard/customer/profile');
      } else if (user.role !== 'customer') {
        router.push('/dashboard/admin/profile');
      } else {
        setName(user.name || '');
        setPhone(user.phone || '');
        setImage(user.image || '');
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.put<{ success: boolean; message: string; user: any }>(
        '/auth/profile',
        {
          name: name.trim(),
          phone: phone.trim(),
          image: image.trim(),
        }
      );

      if (res.success && res.user) {
        updateUser(res.user);
        toast.success('Profile updated successfully.');
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-alabaster-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-champagne-600 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-champagne-700">
              Account Management
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950 mt-1">
              Client Profile Settings
            </h1>
            <p className="text-stone-500 text-sm">
              Keep your contact details and atelier styling preferences up to date.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <CustomerSidebar />

            <div className="flex-1 w-full bg-white rounded-3xl p-6 sm:p-10 border border-alabaster-300 shadow-sm space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                {/* Account Security Banner */}
                <div className="p-4 rounded-2xl bg-alabaster-100 border border-alabaster-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-champagne-700" />
                    <div>
                      <p className="font-semibold text-espresso-950">Security &amp; Role</p>
                      <p className="text-stone-500">
                        Role: <span className="font-semibold uppercase">{user.role}</span> &bull; Status: Active
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Email Address (Registered)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-alabaster-300 bg-stone-50 text-stone-500 text-sm cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vivienne Laurent"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Profile Photo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-espresso-950">
                      Profile Avatar
                    </span>
                    <div className="flex items-center gap-1 bg-alabaster-200 p-0.5 rounded-lg text-[11px] font-medium">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`px-2 py-0.5 rounded-md transition-colors ${
                          imageMode === 'upload'
                            ? 'bg-white text-espresso-950 shadow-xs'
                            : 'text-stone-600'
                        }`}
                      >
                        ImgBB Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`px-2 py-0.5 rounded-md transition-colors ${
                          imageMode === 'url'
                            ? 'bg-white text-espresso-950 shadow-xs'
                            : 'text-stone-600'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {imageMode === 'upload' ? (
                    <ImgBBUpload
                      label=""
                      value={image}
                      onChange={(url) => setImage(url)}
                      aspectRatio="square"
                      helperText="Portrait image uploaded securely to ImgBB cloud storage."
                    />
                  ) : (
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 outline-none transition-colors"
                    />
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 font-medium text-sm tracking-wide transition-all shadow-md disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-champagne-400" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
