import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Search,
  Truck,
  Phone,
  UserX,
  UserCheck,
  Building,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { DestinationHub, StaffMember } from '../types';
import { getNextStaffId } from '../data/staffRoster';

interface StaffManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: StaffMember[];
  onStaffListChange: (updated: StaffMember[]) => void;
}

const ALL_HUBS: DestinationHub[] = [
  'Jaffna',
  'Kilinochchi',
  'Vavuniya',
  'Mannar',
  'Mullaitivu',
];

export const StaffManagementModal: React.FC<StaffManagementModalProps> = ({
  isOpen,
  onClose,
  staffList,
  onStaffListChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'RESIGNED'>('ALL');

  // Sub-modal states
  const [isRegistering, setIsRegistering] = useState(false);
  const [reassignTargetStaff, setReassignTargetStaff] = useState<StaffMember | null>(null);

  // Form states for new registration
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formHub, setFormHub] = useState<DestinationHub>('Jaffna');
  const [formVehicle, setFormVehicle] = useState('Motorcycle');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const nextAutoId = getNextStaffId(staffList);

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.hub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'ALL' || s.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const activeCount = staffList.filter((s) => s.status === 'ACTIVE').length;
  const resignedCount = staffList.filter((s) => s.status === 'RESIGNED').length;

  // Handle new staff registration (Auto-incremented ID)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    const newStaff: StaffMember = {
      id: nextAutoId,
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || `${nextAutoId.toLowerCase()}@pigeon.lk`,
      hub: formHub,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
      assignedVehicle: formVehicle.trim() || 'Motorcycle (Standard)',
      deliveredParcelsCount: 0,
    };

    const updated = [...staffList, newStaff];
    onStaffListChange(updated);
    setIsRegistering(false);
    resetForm();
    showFeedback(`Staff member ${newStaff.name} registered successfully with ID ${newStaff.id}!`);
  };

  // Handle resigning staff
  const handleResignStaff = (staffId: string) => {
    const updated = staffList.map((s) => {
      if (s.id !== staffId) return s;
      return {
        ...s,
        status: 'RESIGNED' as const,
        resignedDate: new Date().toISOString().split('T')[0],
      };
    });
    onStaffListChange(updated);
    showFeedback(`Staff member ${staffId} marked as RESIGNED. ID is now open for reassignment.`);
  };

  // Handle reassigning existing ID to a new replacement staff
  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignTargetStaff || !formName.trim() || !formPhone.trim()) return;

    const targetId = reassignTargetStaff.id;
    const updated = staffList.map((s) => {
      if (s.id !== targetId) return s;
      return {
        ...s,
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim() || `${targetId.toLowerCase()}@pigeon.lk`,
        hub: formHub,
        status: 'ACTIVE' as const,
        resignedDate: undefined,
        joinedDate: new Date().toISOString().split('T')[0],
        assignedVehicle: formVehicle.trim() || 'Motorcycle (Standard)',
      };
    });

    onStaffListChange(updated);
    const assignedName = formName.trim();
    setReassignTargetStaff(null);
    resetForm();
    showFeedback(`ID ${targetId} successfully reassigned to ${assignedName}! Status set to ACTIVE.`);
  };

  const openReassignModal = (staff: StaffMember) => {
    setReassignTargetStaff(staff);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormHub(staff.hub);
    setFormVehicle(staff.assignedVehicle);
  };

  const resetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormHub('Jaffna');
    setFormVehicle('Motorcycle');
  };

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider">
                Admin Operations Console
              </div>
              <h2 className="text-2xl font-extrabold text-white">Delivery Staff Roster</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsRegistering(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/25"
            >
              <UserPlus className="w-4 h-4" />
              <span>➕ Register New Staff ({nextAutoId})</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="p-3.5 bg-emerald-950/90 border-b border-emerald-600/70 text-xs font-bold text-emerald-200 flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Top Summary Stats */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/40 grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Registered Staff</div>
              <div className="text-2xl font-mono font-extrabold text-white">{staffList.length}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
              ID
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Active Field Officers</div>
              <div className="text-2xl font-mono font-extrabold text-emerald-400">{activeCount}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Resigned / Reassignable</div>
              <div className="text-2xl font-mono font-extrabold text-amber-400">{resignedCount}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl w-full sm:w-auto">
            {(['ALL', 'ACTIVE', 'RESIGNED'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, hub, phone..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Staff ID</th>
                <th className="py-3.5 px-6">Officer Name</th>
                <th className="py-3.5 px-6">Assigned Hub</th>
                <th className="py-3.5 px-6">Contact & Vehicle</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                    No staff records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-900/60 transition-colors">
                    {/* Staff ID */}
                    <td className="py-4 px-6 font-mono font-extrabold text-orange-400 text-base">
                      {staff.id}
                    </td>

                    {/* Officer Name & Joined Date */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{staff.name}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        Joined: {staff.joinedDate}
                      </div>
                    </td>

                    {/* Assigned Hub */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200">
                        <Building className="w-3.5 h-3.5 text-orange-400" />
                        <span>{staff.hub} Hub</span>
                      </span>
                    </td>

                    {/* Contact & Vehicle */}
                    <td className="py-4 px-6 text-xs text-slate-300 space-y-0.5">
                      <div className="flex items-center gap-1 font-mono text-slate-300">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{staff.phone}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {staff.assignedVehicle}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {staff.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>RESIGNED</span>
                        </span>
                      )}
                    </td>

                    {/* Action Buttons: Resign or Reassign */}
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                      {staff.status === 'ACTIVE' ? (
                        <button
                          type="button"
                          onClick={() => handleResignStaff(staff.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs font-bold transition-colors cursor-pointer"
                          title="Mark staff member as resigned"
                        >
                          Mark Resigned
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openReassignModal(staff)}
                          className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Reassign this existing Staff ID to a new replacement officer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reassign Staff ID</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div>
            Showing {filteredStaff.length} of {staffList.length} staff members
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
          >
            Close Roster
          </button>
        </div>

        {/* SUB-MODAL 1: Register New Staff Form (Auto-incremented ID) */}
        {isRegistering && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider">
                    Sequential Auto-ID Registration
                  </span>
                  <h3 className="text-xl font-extrabold text-white">Register New Staff</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Auto-incremented ID display */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Assigned Staff ID:
                  </span>
                  <span className="text-base font-mono font-extrabold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/30">
                    {nextAutoId} (Auto)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Officer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. S. Ragavan"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+94 77 000 0000"
                      className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Regional Hub
                    </label>
                    <select
                      value={formHub}
                      onChange={(e) => setFormHub(e.target.value as DestinationHub)}
                      className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      {ALL_HUBS.map((h) => (
                        <option key={h} value={h}>
                          {h} Hub
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder={`${nextAutoId.toLowerCase()}@pigeon.lk`}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Assigned Vehicle / Asset
                  </label>
                  <input
                    type="text"
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    placeholder="e.g. Motorcycle (NP-BC-5521)"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-extrabold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-500/25 cursor-pointer"
                  >
                    Register Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SUB-MODAL 2: Reassign Resigned Staff ID to a New Officer */}
        {reassignTargetStaff && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider">
                    Staff ID Reassignment
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    Reassign {reassignTargetStaff.id}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setReassignTargetStaff(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
                Staff ID <strong className="font-mono">{reassignTargetStaff.id}</strong> (previously held by {reassignTargetStaff.name}) will be assigned to a new replacement officer and marked ACTIVE.
              </div>

              <form onSubmit={handleReassignSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    New Officer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. New Officer Name"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+94 77 000 0000"
                      className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Regional Hub
                    </label>
                    <select
                      value={formHub}
                      onChange={(e) => setFormHub(e.target.value as DestinationHub)}
                      className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      {ALL_HUBS.map((h) => (
                        <option key={h} value={h}>
                          {h} Hub
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder={`${reassignTargetStaff.id.toLowerCase()}@pigeon.lk`}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Assigned Vehicle / Asset
                  </label>
                  <input
                    type="text"
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    placeholder="e.g. Motorcycle (NP-BC-1234)"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setReassignTargetStaff(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-extrabold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-500/25 cursor-pointer"
                  >
                    Confirm Reassignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
