'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';
import ImgBBUpload from '@/components/ImgBBUpload';
import ConfirmModal from '@/components/ConfirmModal';
import ServiceImage from '@/components/ServiceImage';
import { useAuth } from '@/context/AuthContext';
import { Service, SERVICE_CATEGORIES, ServiceCategory } from '@/types';
import { api } from '@/lib/api';
import {
  Scissors,
  PlusCircle,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  Loader2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminServicesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>(SERVICE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion State
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/sign-in?redirect=/dashboard/admin/services');
      } else if (user.role !== 'admin') {
        router.push('/dashboard/customer');
      }
    }
  }, [user, authLoading, router]);

  const loadServices = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    setIsLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: Service[] }>('/services/admin/all');
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      toast.error('Failed to retrieve salon services.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setServiceName('');
    setCategory(SERVICE_CATEGORIES[0]);
    setDescription('');
    setPrice('');
    setDuration('');
    setImage('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setServiceName(service.serviceName);
    setCategory(service.category);
    setDescription(service.description);
    setPrice(service.price);
    setDuration(service.duration);
    setImage(service.image);
    setStatus(service.status);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (service: Service) => {
    try {
      const res = await api.patch<{ success: boolean; data: Service }>(
        `/services/${service._id}/status`
      );
      if (res.success) {
        toast.success(`Service status toggled to ${res.data.status}.`);
        loadServices();
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to toggle status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/services/${deletingService._id}`);
      if (res.success) {
        toast.success('Service deleted from catalog.');
        setDeletingService(null);
        loadServices();
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to delete service.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName.trim()) {
      toast.error('Please enter a service name.');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description.');
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error('Price must be greater than 0.');
      return;
    }

    if (!duration || Number(duration) <= 0) {
      toast.error('Duration must be greater than 0 minutes.');
      return;
    }

    // CRITICAL ENFORCEMENT: ImgBB file upload is mandatory
    if (!image || !image.startsWith('http')) {
      toast.error('Please upload a service image via ImgBB.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        duration: Number(duration),
        image: image.trim(),
        status,
      };

      if (editingService) {
        const res = await api.put(`/services/${editingService._id}`, payload);
        if (res.success) {
          toast.success('Service updated successfully.');
          setIsModalOpen(false);
          loadServices();
        }
      } else {
        const res = await api.post('/services', payload);
        if (res.success) {
          toast.success('New service created and published.');
          setIsModalOpen(false);
          loadServices();
        }
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to save service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-champagne-700">
                Atelier Catalog
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                Manage Salon Services
              </h1>
              <p className="text-stone-500 text-sm">
                Add new treatments with ImgBB cloud photos, edit fees, and toggle catalog visibility.
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-xs font-semibold tracking-wide transition-all shadow-sm self-start md:self-auto"
            >
              <PlusCircle className="w-4 h-4 text-champagne-400" />
              <span>Create New Service</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AdminSidebar />

            <div className="flex-1 w-full space-y-6">
              {/* Services Table Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster-300 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-medium text-espresso-950">
                    All Services ({services.length})
                  </h2>
                </div>

                {isLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-7 h-7 text-champagne-600 animate-spin" />
                    <p className="text-xs text-stone-500">Loading catalog...</p>
                  </div>
                ) : services.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-alabaster-200 text-stone-400 uppercase tracking-wider font-semibold">
                          <th className="pb-3">Service</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Duration</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-alabaster-200">
                        {services.map((service) => {
                          const isActive = service.status === 'active';
                          return (
                            <tr key={service._id} className="hover:bg-alabaster-50/70 transition-colors">
                              <td className="py-4 pr-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-alabaster-300 bg-stone-100">
                                    <ServiceImage
                                      src={service.image}
                                      alt={service.serviceName}
                                      category={service.category}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0 max-w-[200px]">
                                    <p className="font-semibold text-espresso-950 text-sm truncate">
                                      {service.serviceName}
                                    </p>
                                    <p className="text-[11px] text-stone-500 line-clamp-1">
                                      {service.description}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 pr-3 text-stone-600">
                                <span className="text-[10px] font-semibold uppercase tracking-wider bg-champagne-100 text-champagne-700 px-2 py-0.5 rounded-full border border-champagne-200 whitespace-nowrap">
                                  {service.category}
                                </span>
                              </td>
                              <td className="py-4 pr-3 font-semibold text-espresso-950 text-sm">
                                ${service.price}
                              </td>
                              <td className="py-4 pr-3 text-stone-600">
                                {service.duration} mins
                              </td>
                              <td className="py-4 pr-3">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(service)}
                                  className="inline-flex items-center gap-1.5 focus:outline-none"
                                  title="Toggle status"
                                >
                                  {isActive ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Active
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200">
                                      <AlertCircle className="w-3 h-3" />
                                      Inactive
                                    </span>
                                  )}
                                </button>
                              </td>
                              <td className="py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleOpenEditModal(service)}
                                  className="p-1.5 rounded-xl border border-alabaster-300 hover:bg-alabaster-100 text-stone-600 hover:text-espresso-950 transition-colors"
                                  title="Edit Service"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingService(service)}
                                  className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Delete Service"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-stone-500 text-sm py-12">
                    No services in catalog yet. Click &ldquo;Create New Service&rdquo; to add your first treatment.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add / Update Service Modal (Mandatory ImgBB file upload ONLY) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-alabaster-300 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-alabaster-200 pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-champagne-700">
                  {editingService ? 'Modify Offering' : 'New Atelier Offering'}
                </span>
                <h3 className="font-serif text-2xl font-medium text-espresso-950">
                  {editingService ? 'Edit Salon Service' : 'Add Salon Service'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitService} className="space-y-5">
              {/* Service Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                  Service Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Artisanal Precision Haircut & Blowout"
                  className="w-full px-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                  Category <span className="text-rose-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full px-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 outline-none"
                >
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                    Price (USD) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="120"
                    className="w-full px-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                    Duration (Minutes) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="60"
                    className="w-full px-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 outline-none"
                  />
                </div>
              </div>

              {/* MANDATORY ImgBB File Upload Input ONLY */}
              <div className="space-y-1.5">
                <ImgBBUpload
                  label="Service Image (ImgBB File Upload Only)"
                  value={image}
                  onChange={(url) => setImage(url)}
                  required
                  aspectRatio="video"
                  helperText="Upload treatment photography. Files are hosted exclusively via ImgBB API."
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                  Description <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the botanical compounds, techniques, and client experience..."
                  className="w-full px-4 py-3 rounded-xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-white text-sm text-espresso-900 outline-none resize-none"
                />
              </div>

              {/* Status Radio */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
                  Publishing Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={status === 'active'}
                      onChange={() => setStatus('active')}
                      className="text-espresso-900 focus:ring-champagne-500"
                    />
                    <span>Active (Bookable)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={status === 'inactive'}
                      onChange={() => setStatus('inactive')}
                      className="text-espresso-900 focus:ring-champagne-500"
                    />
                    <span>Inactive (Hidden from booking)</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-alabaster-200">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-alabaster-300 text-stone-700 text-xs font-semibold hover:bg-alabaster-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !image}
                  className="px-6 py-2.5 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-xs font-semibold shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingService ? 'Update Service' : 'Publish Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingService}
        title="Remove Service"
        message={`Are you sure you want to permanently delete "${deletingService?.serviceName}"? Existing appointments referencing this service will retain their records.`}
        confirmLabel="Yes, Delete Service"
        cancelLabel="Keep Service"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingService(null)}
      />

      <Footer />
    </div>
  );
}
