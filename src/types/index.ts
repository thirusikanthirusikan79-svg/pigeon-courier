export type UserRole = 'customer' | 'admin' | 'staff';

export type ShipmentStatus = 'ORDER_RECEIVED' | 'IN_TRANSIT' | 'DELIVERED';

export type DestinationHub =
  | 'Jaffna'
  | 'Kilinochchi'
  | 'Vavuniya'
  | 'Mannar'
  | 'Mullaitivu';

export interface ServiceRating {
  stars: number;
  review?: string;
  submittedAt: string;
}

export interface ParcelRecord {
  id: string;
  trackingId: string;
  senderName: string;
  senderPhone: string;
  senderEmail?: string;
  recipientName: string;
  recipientPhone: string;
  pickupAddress: string;
  deliveryAddress?: string; // 👈 Added explicit Delivery (To) address field
  destinationHub: DestinationHub;
  weightKg: number;
  fareLkr: number;
  parcelCategory: string;
  specialInstructions?: string;
  status: ShipmentStatus;
  assignedStaff?: string;
  deliveredByStaffId?: string;
  createdAt: string;
  updatedAt: string;
  trackingUrl: string;
  rating?: ServiceRating;
}

export interface StaffMember {
  id: string; // e.g. STF-001
  name: string;
  phone: string;
  email: string;
  hub: DestinationHub;
  status: 'ACTIVE' | 'RESIGNED';
  joinedDate: string;
  resignedDate?: string;
  assignedVehicle: string;
  deliveredParcelsCount: number;
}

export interface AuthUser {
  role: UserRole;
  name: string;
  email: string;
  staffId?: string;
  assignedHub?: DestinationHub;
}

export interface AdminCredentials {
  username: string;
  passwordHash: string;
}

export interface ParcelBookingPayload {
  tracking_id: string;
  sender_name: string;
  sender_phone: string;
  sender_email?: string;
  recipient_name: string;
  recipient_phone: string;
  destination_hub: string;
  pickup_address?: string;
  delivery_address?: string; // 👈 Added delivery address for webhooks/payloads
  weight_kg: number;
  fare_lkr: number;
  status: string;
  assigned_staff_id?: string;
  tracking_url: string;
}