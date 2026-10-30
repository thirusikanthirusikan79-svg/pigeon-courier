import { ParcelRecord, DestinationHub } from '../types';

const STORAGE_KEY = 'pigeon_courier_parcels_v7';

export const INITIAL_PARCELS: ParcelRecord[] = [
  {
    id: 'PGN-JFN-74829',
    trackingId: 'PGN-JFN-74829',
    senderName: 'Sivaguru Kumar',
    senderPhone: '+94 77 123 4567',
    senderEmail: 'customer@pigeon.lk',
    recipientName: 'Hospital Road Pharmacy',
    recipientPhone: '+94 77 890 1234',
    pickupAddress: 'No. 12, Station Road, Vavuniya',
    destinationHub: 'Jaffna',
    weightKg: 14.5,
    fareLkr: 2390,
    parcelCategory: 'Medical & Diagnostic Supplies',
    specialInstructions: 'Handle with care - fragile glassware',
    status: 'IN_TRANSIT',
    assignedStaff: 'K. Senthil (STF-001)',
    deliveredByStaffId: undefined,
    createdAt: '2026-10-25 08:30 AM',
    updatedAt: '2026-10-25 10:45 AM',
    trackingUrl: 'http://localhost:5173/track/PGN-JFN-74829',
  },
  {
    id: 'PGN-KLN-38291',
    trackingId: 'PGN-KLN-38291',
    senderName: 'Sivaguru Kumar',
    senderPhone: '+94 77 123 4567',
    senderEmail: 'customer@pigeon.lk',
    recipientName: 'Paranthan Agro Supply Center',
    recipientPhone: '+94 76 543 2198',
    pickupAddress: 'No. 45, Stanley Road, Jaffna',
    destinationHub: 'Kilinochchi',
    weightKg: 8.5,
    fareLkr: 1670,
    parcelCategory: 'Commercial Electronics',
    specialInstructions: 'Keep dry, waterproof packaging',
    status: 'ORDER_RECEIVED',
    assignedStaff: 'R. Mayuran (STF-002)',
    deliveredByStaffId: undefined,
    createdAt: '2026-10-25 09:15 AM',
    updatedAt: '2026-10-25 09:15 AM',
    trackingUrl: 'http://localhost:5173/track/PGN-KLN-38291',
  },
  {
    id: 'PGN-VAV-91823',
    trackingId: 'PGN-VAV-91823',
    senderName: 'Sivaguru Kumar',
    senderPhone: '+94 77 123 4567',
    senderEmail: 'customer@pigeon.lk',
    recipientName: 'Kandy Road Educational Institute',
    recipientPhone: '+94 77 333 9911',
    pickupAddress: 'No. 18, Clock Tower Road, Jaffna',
    destinationHub: 'Vavuniya',
    weightKg: 5.2,
    fareLkr: 1274,
    parcelCategory: 'Educational Textbooks & Literature',
    specialInstructions: 'Deliver to main office reception',
    status: 'DELIVERED',
    assignedStaff: 'T. Vimalan (STF-003)',
    deliveredByStaffId: 'STF-003',
    createdAt: '2026-10-25 08:00 AM',
    updatedAt: '2026-10-25 11:15 AM',
    trackingUrl: 'http://localhost:5173/track/PGN-VAV-91823',
    // Unrated: enables ⭐ Rate Service button for customer
  },
  {
    id: 'PGN-MAN-48192',
    trackingId: 'PGN-MAN-48192',
    senderName: 'Sivaguru Kumar',
    senderPhone: '+94 77 123 4567',
    senderEmail: 'customer@pigeon.lk',
    recipientName: 'Mannar Coastal Fisheries Office',
    recipientPhone: '+94 71 888 4422',
    pickupAddress: 'A9 Interchange Terminal, Vavuniya',
    destinationHub: 'Mannar',
    weightKg: 28.5,
    fareLkr: 4070,
    parcelCategory: 'Marine Hardware Parts',
    specialInstructions: 'Deliver before 5:00 PM',
    status: 'DELIVERED',
    assignedStaff: 'N. Anton (STF-004)',
    deliveredByStaffId: 'STF-004',
    createdAt: '2026-10-24 11:00 AM',
    updatedAt: '2026-10-25 07:30 AM',
    trackingUrl: 'http://localhost:5173/track/PGN-MAN-48192',
    rating: {
      stars: 5,
      review: 'Prompt morning arrival at Mannar pier. Excellent careful handling.',
      submittedAt: '2026-10-25 08:00 AM',
    },
  },
  {
    id: 'PGN-MUL-56281',
    trackingId: 'PGN-MUL-56281',
    senderName: 'Sivaguru Kumar',
    senderPhone: '+94 77 123 4567',
    senderEmail: 'customer@pigeon.lk',
    recipientName: 'Mullaitivu District General Hospital',
    recipientPhone: '+94 77 999 1234',
    pickupAddress: 'Paranthan Junction Depot, Kilinochchi',
    destinationHub: 'Mullaitivu',
    weightKg: 42.0,
    fareLkr: 5690,
    parcelCategory: 'Emergency Medical Supplies',
    specialInstructions: 'Priority emergency protocol',
    status: 'IN_TRANSIT',
    assignedStaff: 'S. Ganeshan (STF-005)',
    deliveredByStaffId: undefined,
    createdAt: '2026-10-25 10:00 AM',
    updatedAt: '2026-10-25 10:00 AM',
    trackingUrl: 'http://localhost:5173/track/PGN-MUL-56281',
  },
];

export function calculateFare(weightKg: number): number {
  if (weightKg <= 0) return 0;
  const baseFare = 650;
  const perKgRate = 120;
  return baseFare + Math.round(weightKg * perKgRate);
}

export function generateTrackingId(hub: DestinationHub): string {
  const prefixMap: Record<DestinationHub, string> = {
    Jaffna: 'JFN',
    Kilinochchi: 'KIL',
    Vavuniya: 'VAV',
    Mannar: 'MNR',
    Mullaitivu: 'MUL',
  };
  const prefix = prefixMap[hub] || 'NOR';
  const random = Math.floor(10000 + Math.random() * 90000);
  return `PGN-${prefix}-${random}`;
}

export function loadStoredParcels(): ParcelRecord[] {
  if (typeof window === 'undefined') return INITIAL_PARCELS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PARCELS));
      return INITIAL_PARCELS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PARCELS));
    return INITIAL_PARCELS;
  } catch {
    return INITIAL_PARCELS;
  }
}

export function saveStoredParcels(parcels: ParcelRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parcels));
  } catch (err) {
    console.error('Failed to save parcels to localStorage:', err);
  }
}

export function resetToInitialParcels(): ParcelRecord[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PARCELS));
  }
  return INITIAL_PARCELS;
}
