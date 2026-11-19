export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role: 'customer' | 'admin';
  isBlocked: boolean;
  createdAt?: string;
}

export type ServiceCategory =
  | 'Haircut & Styling'
  | 'Hair Coloring'
  | 'Hair Treatment'
  | 'Facial & Skincare'
  | 'Makeup'
  | 'Manicure & Pedicure'
  | 'Spa & Massage';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Haircut & Styling',
  'Hair Coloring',
  'Hair Treatment',
  'Facial & Skincare',
  'Makeup',
  'Manicure & Pedicure',
  'Spa & Massage',
];

export interface Service {
  _id: string;
  serviceName: string;
  category: ServiceCategory;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type SalonTimeSlot =
  | '10:00 AM - 11:00 AM'
  | '11:30 AM - 12:30 PM'
  | '02:00 PM - 03:00 PM'
  | '04:00 PM - 05:00 PM'
  | '06:00 PM - 07:00 PM';

export const SALON_TIME_SLOTS: SalonTimeSlot[] = [
  '10:00 AM - 11:00 AM',
  '11:30 AM - 12:30 PM',
  '02:00 PM - 03:00 PM',
  '04:00 PM - 05:00 PM',
  '06:00 PM - 07:00 PM',
];

export interface Appointment {
  _id: string;
  serviceId: Service | string;
  customerId: User | string;
  appointmentDate: string;
  timeSlot: SalonTimeSlot;
  message?: string;
  servicePrice: number;
  paymentStatus: 'unpaid' | 'paid';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'failed';
  stripeSessionId: string;
  fullSessionId?: string;
  createdAt: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  appointment?: {
    _id: string;
    appointmentDate: string;
    timeSlot: string;
    servicePrice: number;
    status: string;
    paymentStatus: string;
    serviceId?: {
      _id: string;
      serviceName: string;
      category: string;
    };
  };
}
