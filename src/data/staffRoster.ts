import { StaffMember } from '../types';

const STAFF_STORAGE_KEY = 'pigeon_staff_roster_v2';

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'STF-001',
    name: 'K. Senthil',
    phone: '+94 77 123 4567',
    email: 'senthil.k@pigeon.lk',
    hub: 'Jaffna',
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
    assignedVehicle: 'Motorcycle (NP-BC-1042)',
    deliveredParcelsCount: 48,
  },
  {
    id: 'STF-002',
    name: 'R. Mayuran',
    phone: '+94 77 234 5678',
    email: 'mayuran.r@pigeon.lk',
    hub: 'Kilinochchi',
    status: 'ACTIVE',
    joinedDate: '2026-02-01',
    assignedVehicle: 'Delivery Van (NP-DA-5821)',
    deliveredParcelsCount: 36,
  },
  {
    id: 'STF-003',
    name: 'T. Vimalan',
    phone: '+94 77 345 6789',
    email: 'vimalan.t@pigeon.lk',
    hub: 'Vavuniya',
    status: 'ACTIVE',
    joinedDate: '2026-02-18',
    assignedVehicle: 'Motorcycle (NP-BC-4491)',
    deliveredParcelsCount: 52,
  },
  {
    id: 'STF-004',
    name: 'N. Anton',
    phone: '+94 77 456 7890',
    email: 'anton.n@pigeon.lk',
    hub: 'Mannar',
    status: 'ACTIVE',
    joinedDate: '2026-03-05',
    assignedVehicle: 'Motorcycle (NP-BC-8910)',
    deliveredParcelsCount: 29,
  },
  {
    id: 'STF-005',
    name: 'S. Ganeshan',
    phone: '+94 77 567 8901',
    email: 'ganeshan.s@pigeon.lk',
    hub: 'Mullaitivu',
    status: 'ACTIVE',
    joinedDate: '2026-03-20',
    assignedVehicle: 'Utility Van (NP-DA-1102)',
    deliveredParcelsCount: 21,
  },
];

export function loadStoredStaff(): StaffMember[] {
  if (typeof window === 'undefined') return INITIAL_STAFF;
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
      return INITIAL_STAFF;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
    return INITIAL_STAFF;
  } catch {
    return INITIAL_STAFF;
  }
}

export function saveStoredStaff(staff: StaffMember[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
  } catch (err) {
    console.error('Failed to save staff roster:', err);
  }
}

/**
 * Calculates next sequential auto-incremented Staff ID: STF-001, STF-002, etc.
 */
export function getNextStaffId(existingStaff: StaffMember[]): string {
  let maxNum = 0;
  for (const s of existingStaff) {
    const match = s.id.match(/^STF-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  const nextNum = maxNum + 1;
  return `STF-${String(nextNum).padStart(3, '0')}`;
}
