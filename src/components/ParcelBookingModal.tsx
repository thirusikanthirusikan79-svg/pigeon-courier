import React, { useState, useEffect } from 'react';
import {
  X,
  PackagePlus,
  AlertOctagon,
  PhoneCall,
  CheckCircle2,
  Loader2,
  DollarSign,
  ArrowRight,
  Sliders,
  Sparkles,
  Check,
} from 'lucide-react';
import { DestinationHub, ParcelRecord } from '../types';
import { calculateFare, generateTrackingId } from '../data/initialParcels';
import { dispatchParcelWebhook } from '../services/webhookService';
import {
  estimateParcelWeightAndFare,
  parseAndValidateAddress,
  AddressValidationResult,
  WeightEstimationResult,
} from '../services/aiLogisticsService';

interface ParcelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParcelCreated: (parcel: ParcelRecord) => void;
  senderDefaultName?: string;
  senderDefaultPhone?: string;
  senderDefaultEmail?: string;
}

const DESTINATION_HUBS: DestinationHub[] = [
  'Jaffna',
  'Kilinochchi',
  'Vavuniya',
  'Mannar',
  'Mullaitivu',
];

export const ParcelBookingModal: React.FC<ParcelBookingModalProps> = ({
  isOpen,
  onClose,
  onParcelCreated,
  senderDefaultName = '',
  senderDefaultPhone = '',
  senderDefaultEmail = '',
}) => {
  const [senderName, setSenderName] = useState(senderDefaultName || '');
  const [senderPhone, setSenderPhone] = useState(senderDefaultPhone || '');
  const [senderEmail, setSenderEmail] = useState(senderDefaultEmail || '');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [destinationHub, setDestinationHub] = useState<DestinationHub>('Jaffna');
  const [weightKgInput, setWeightKgInput] = useState<string>('5.0');
  const [parcelCategory, setParcelCategory] = useState('Standard Express Parcel');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Sync default values when modal opens or props update
  useEffect(() => {
    if (senderDefaultName) setSenderName(senderDefaultName);
    if (senderDefaultPhone) setSenderPhone(senderDefaultPhone);
    if (senderDefaultEmail) setSenderEmail(senderDefaultEmail);
  }, [senderDefaultName, senderDefaultPhone, senderDefaultEmail, isOpen]);

  // AI Feature 1: Weight & Fare Estimator
  const [isAiEstimatorOpen, setIsAiEstimatorOpen] = useState(false);
  const [aiItemDescription, setAiItemDescription] = useState('');
  const [aiWeightResult, setAiWeightResult] = useState<WeightEstimationResult | null>(null);

  // AI Feature 2: Separate Address Validation States for Pickup & Delivery
  const [pickupValidation, setPickupValidation] = useState<AddressValidationResult | null>(null);
  const [isValidatingPickup, setIsValidatingPickup] = useState(false);
  const [deliveryValidation, setDeliveryValidation] = useState<AddressValidationResult | null>(null);
  const [isValidatingDelivery, setIsValidatingDelivery] = useState(false);

  // Status & Submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    parcel: ParcelRecord;
    webhookMessage: string;
  } | null>(null);

  if (!isOpen) return null;

  // Weight parsing and enforcement
  const weightKg = parseFloat(weightKgInput) || 0;
  const isOverweight = weightKg > 500;
  const isInvalidWeight = weightKg <= 0 || isNaN(weightKg);
  const liveFareLkr = !isOverweight && !isInvalidWeight ? calculateFare(weightKg) : 0;

  const handleWeightNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeightKgInput(e.target.value);
  };

  const handleWeightSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeightKgInput(e.target.value);
  };

  // AI Weight & Fare Estimation Trigger
  const handleRunAiWeightEstimator = (customDesc?: string) => {
    const desc = customDesc || aiItemDescription || parcelCategory || 'Standard parcel box';
    const result = estimateParcelWeightAndFare(desc);
    setAiWeightResult(result);
  };

  const handleApplyAiWeight = () => {
    if (!aiWeightResult) return;
    setWeightKgInput(aiWeightResult.estimatedWeightKg.toFixed(1));
    setParcelCategory(aiWeightResult.packageCategory);
    if (!specialInstructions && aiWeightResult.packagingAdvice) {
      setSpecialInstructions(aiWeightResult.packagingAdvice);
    }
    setIsAiEstimatorOpen(false);
  };

  // AI Validation for Pickup (From)
  const handleValidatePickup = () => {
    if (!pickupAddress.trim()) return;
    setIsValidatingPickup(true);
    setTimeout(() => {
      const result = parseAndValidateAddress(pickupAddress, destinationHub);
      setPickupValidation(result);
      setIsValidatingPickup(false);
    }, 400);
  };

  const handleApplyPickupFormat = () => {
    if (!pickupValidation) return;
    setPickupAddress(pickupValidation.formattedAddress);
    setPickupValidation(null);
  };

  // AI Validation for Delivery (To)
  const handleValidateDelivery = () => {
    if (!deliveryAddress.trim()) return;
    setIsValidatingDelivery(true);
    setTimeout(() => {
      const result = parseAndValidateAddress(deliveryAddress, destinationHub);
      setDeliveryValidation(result);
      setIsValidatingDelivery(false);
    }, 400);
  };

  const handleApplyDeliveryFormat = () => {
    if (!deliveryValidation) return;
    setDeliveryAddress(deliveryValidation.formattedAddress);
    setDeliveryValidation(null);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isOverweight || isInvalidWeight) {
      return;
    }

    if (!senderName.trim() || !recipientName.trim() || !pickupAddress.trim() || !deliveryAddress.trim()) {
      return;
    }

    setIsSubmitting(true);

    const trackingId = generateTrackingId(destinationHub);
    const trackingUrl = `http://localhost:3000/track/${trackingId}`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newParcel: ParcelRecord = {
      id: trackingId,
      trackingId,
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim() || '+94 77 000 0000',
      senderEmail: (senderEmail || senderDefaultEmail || '').trim().toLowerCase(),
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim() || '+94 77 111 2222',
      pickupAddress: pickupAddress.trim(),
      deliveryAddress: deliveryAddress.trim(), // 👈 Direct Delivery Address
      destinationHub,
      weightKg,
      fareLkr: liveFareLkr,
      parcelCategory: parcelCategory.trim() || 'General Cargo',
      specialInstructions: specialInstructions.trim(),
      status: 'ORDER_RECEIVED',
      assignedStaff: `${destinationHub} Hub Dispatch`,
      createdAt: formattedDate,
      updatedAt: formattedDate,
      trackingUrl,
    };

    const webhookRes = await dispatchParcelWebhook(newParcel);

    onParcelCreated(newParcel);
    setIsSubmitting(false);

    setBookingResult({
      parcel: newParcel,
      webhookMessage: webhookRes.message,
    });
  };

  const handleResetAndClose = () => {
    setBookingResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Northern Express Booking</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Book Consignment & Smart Logistics
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {bookingResult ? (
          <div className="p-8 sm:p-12 text-center space-y-6 overflow-y-auto flex-1">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">
                Parcel Successfully Booked & Synced!
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Tracking ID has been dispatched to {bookingResult.parcel.destinationHub} Regional Hub.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-3 font-mono text-xs max-w-xl mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Tracking ID:</span>
                <span className="text-orange-400 font-bold text-base">
                  {bookingResult.parcel.trackingId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Route & Hub:</span>
                <span className="text-white font-sans font-bold">
                  {bookingResult.parcel.destinationHub} Regional Hub
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Weight & Fare:</span>
                <span className="text-white">
                  {bookingResult.parcel.weightKg} KG · LKR{' '}
                  {bookingResult.parcel.fareLkr.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-sans font-semibold">
                  {bookingResult.webhookMessage}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
            {isOverweight && (
              <div className="p-4 rounded-2xl bg-red-950/90 border-2 border-red-600 space-y-3 animate-pulse">
                <div className="flex items-start gap-3">
                  <AlertOctagon className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                      Overweight Limit Exceeded
                    </h4>
                    <p className="text-xs font-bold text-red-200 leading-relaxed">
                      Maximum standard parcel weight limit is 500 KG. For bulk cargo shipments exceeding 500 KG,
                      please contact our support team directly.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="tel:+94212220000"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs tracking-wide transition-colors shadow-lg shadow-red-600/30"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>📞 Contact Support (+94 21 222 0000)</span>
                  </a>
                </div>
              </div>
            )}

            {/* AI Smart Weight & Fare Estimator Assistant Drawer */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-orange-950/15 to-slate-950 border border-orange-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-300">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>AI Smart Weight & Fare Estimator</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiEstimatorOpen(!isAiEstimatorOpen)}
                  className="text-xs font-mono font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
                >
                  {isAiEstimatorOpen ? 'Hide Assistant' : '✨ Estimate Weight with AI'}
                </button>
              </div>

              {isAiEstimatorOpen && (
                <div className="pt-2 space-y-3 border-t border-slate-800 text-xs">
                  <p className="text-slate-400">
                    Describe your parcel contents or choose a preset to automatically estimate physical density, weight in KG, packaging guidelines, and price.
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Bundle of 40 School Textbooks',
                      'Medical Diagnostics & Saline Bottles',
                      'Laptop & Dual Workstation Displays',
                      'Agricultural Water Pump Assembly',
                      'Heavy Industrial 520 KG Machinery',
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setAiItemDescription(preset);
                          handleRunAiWeightEstimator(preset);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiItemDescription}
                      onChange={(e) => setAiItemDescription(e.target.value)}
                      placeholder="e.g. 5 boxes of ceramic tiles or medical lab equipment"
                      className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRunAiWeightEstimator()}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer shadow-md shadow-orange-500/20"
                    >
                      Analyze Density
                    </button>
                  </div>

                  {aiWeightResult && (
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">AI Estimated Weight:</span>
                        <span
                          className={`font-bold text-sm ${
                            aiWeightResult.isOverweight ? 'text-red-400' : 'text-orange-400'
                          }`}
                        >
                          {aiWeightResult.estimatedWeightKg} KG ({aiWeightResult.densityClassification})
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Calculated Fare:</span>
                        <span className="text-white font-bold">
                          {aiWeightResult.isOverweight
                            ? 'BLOCKED (> 500 KG)'
                            : `LKR ${aiWeightResult.calculatedFareLkr.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-sans">
                        💡 Advice: {aiWeightResult.packagingAdvice}
                      </div>

                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={handleApplyAiWeight}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-sans cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply Estimated Weight ({aiWeightResult.estimatedWeightKg} KG)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sender & Recipient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider">
                  Sender Details
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Sender Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Sivaguru Kumar"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Sender Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="e.g. +94 77 123 4567"
                      className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Sender Email
                    </label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="e.g. customer@pigeon.lk"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider">
                  Recipient Details
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Hospital Road Pharmacy"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Recipient Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="e.g. +94 77 890 1234"
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Distinct Pickup & Delivery Addresses with Independent AI Validation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Address (From) with AI Validate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">
                    Pickup Street Address (From)
                  </label>
                  <button
                    type="button"
                    onClick={handleValidatePickup}
                    disabled={!pickupAddress.trim() || isValidatingPickup}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-[11px] font-bold text-orange-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {isValidatingPickup ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Validating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-orange-400" />
                        <span>✨ AI Validate</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g. No. 12, Station Road, Vavuniya"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Delivery Address (To) with AI Validate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">
                    Delivery Street Address (To)
                  </label>
                  <button
                    type="button"
                    onClick={handleValidateDelivery}
                    disabled={!deliveryAddress.trim() || isValidatingDelivery}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-[11px] font-bold text-orange-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {isValidatingDelivery ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Validating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-orange-400" />
                        <span>✨ AI Validate</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. No. 45, Hospital Road, Jaffna"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Pickup Validation Success Box */}
            {pickupValidation && (
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs space-y-1.5 font-mono animate-in fade-in">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pickup Address Verified ({pickupValidation.accuracyScore}% Confidence)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyPickupFormat}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold cursor-pointer"
                  >
                    Apply Format
                  </button>
                </div>
                <div className="text-white">
                  Standardized (From): <strong>{pickupValidation.formattedAddress}</strong>
                </div>
              </div>
            )}

            {/* Delivery Validation Success Box */}
            {deliveryValidation && (
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs space-y-1.5 font-mono animate-in fade-in">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Delivery Address Verified ({deliveryValidation.accuracyScore}% Confidence)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyDeliveryFormat}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold cursor-pointer"
                  >
                    Apply Format
                  </button>
                </div>
                <div className="text-white">
                  Standardized (To): <strong>{deliveryValidation.formattedAddress}</strong>
                </div>
              </div>
            )}

            {/* Destination Hub */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Destination Regional Hub
              </label>
              <select
                value={destinationHub}
                onChange={(e) => setDestinationHub(e.target.value as DestinationHub)}
                className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {DESTINATION_HUBS.map((hub) => (
                  <option key={hub} value={hub}>
                    {hub} Regional Hub Corridor
                  </option>
                ))}
              </select>
            </div>

            {/* Weight Input */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-orange-400" />
                  <span>Parcel Weight (Synchronized Slider + Direct Input)</span>
                </label>
                <span
                  className={`text-xs font-mono font-bold ${
                    isOverweight ? 'text-red-400' : 'text-orange-400'
                  }`}
                >
                  {isOverweight ? '⚠️ EXCEEDS 500 KG MAXIMUM LIMIT' : `${weightKg.toFixed(1)} KG`}
                </span>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min="0.5"
                  max="550"
                  step="0.5"
                  value={Math.min(isNaN(weightKg) ? 5 : weightKg, 550)}
                  onChange={handleWeightSliderChange}
                  className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.5 KG</span>
                  <span>100 KG</span>
                  <span>250 KG</span>
                  <span className="text-amber-400 font-bold">500 KG (Max Standard Limit)</span>
                  <span className="text-red-400">550 KG</span>
                </div>
              </div>

              <div className="pt-1">
                <div className="relative">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={weightKgInput}
                    onChange={handleWeightNumberChange}
                    placeholder="e.g. 15.0"
                    className={`w-full px-3.5 py-2.5 text-sm font-mono font-bold bg-slate-900 border rounded-xl text-white placeholder-slate-500 focus:outline-none ${
                      isOverweight
                        ? 'border-red-500 focus:border-red-500 text-red-200'
                        : 'border-slate-700 focus:border-orange-500'
                    }`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                    KG (Direct Type)
                  </span>
                </div>
              </div>
            </div>

            {/* Parcel Category & Special Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Parcel Category
                </label>
                <input
                  type="text"
                  required
                  value={parcelCategory}
                  onChange={(e) => setParcelCategory(e.target.value)}
                  placeholder="e.g. Medical Supplies, Documents, Electronics"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Handle with care, deliver morning"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Live Fare Calculation Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">
                    Calculated Standard Fare:
                  </div>
                  <div className="text-xl font-extrabold text-white font-mono">
                    {isOverweight ? (
                      <span className="text-red-400 text-sm font-sans font-bold">
                        Blocked (Over 500 KG Limit)
                      </span>
                    ) : (
                      `LKR ${liveFareLkr.toLocaleString()}`
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono">
                <div>Base: LKR 650</div>
                <div>+ LKR 120/KG</div>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isOverweight || isInvalidWeight || isSubmitting}
                className={`px-6 py-2.5 text-sm font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                  isOverweight || isInvalidWeight || isSubmitting
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking Consignment...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Parcel Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};