import React, { useState } from 'react';
import { X, Star, CheckCircle2, MessageSquare } from 'lucide-react';
import { ParcelRecord, ServiceRating } from '../types';

interface RatingModalProps {
  parcel: ParcelRecord | null;
  onClose: () => void;
  onSubmitRating: (trackingId: string, rating: ServiceRating) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  parcel,
  onClose,
  onSubmitRating,
}) => {
  const [stars, setStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [review, setReview] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!parcel) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const submittedAt = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newRating: ServiceRating = {
      stars: hoverStars || stars,
      review: review.trim() || undefined,
      submittedAt,
    };

    onSubmitRating(parcel.trackingId, newRating);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  const currentDisplayStars = hoverStars || stars;

  const starLabels = [
    'Poor Service',
    'Fair Delivery',
    'Good Experience',
    'Very Good & Timely',
    'Exceptional Courier Service',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-extrabold text-orange-400 uppercase tracking-wider">
              Feedback & Quality
            </span>
            <h2 className="text-xl font-extrabold text-white">Rate Delivery Service</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Thank You for Your Rating!</h3>
            <p className="text-xs text-slate-400">
              Your feedback helps our Northern Province courier team maintain top standards.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Parcel Details Snippet */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Consignment:</span>
                <span className="font-mono font-bold text-orange-400">{parcel.trackingId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Destination:</span>
                <span className="text-white font-semibold">{parcel.destinationHub} Hub</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Recipient:</span>
                <span className="text-white">{parcel.recipientName}</span>
              </div>
            </div>

            {/* Interactive Stars */}
            <div className="text-center space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                How was your delivery experience?
              </label>

              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onMouseEnter={() => setHoverStars(val)}
                    onMouseLeave={() => setHoverStars(null)}
                    onClick={() => setStars(val)}
                    className="p-1.5 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                    aria-label={`${val} star`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        val <= currentDisplayStars
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="text-xs font-semibold text-amber-400">
                {starLabels[currentDisplayStars - 1]}
              </div>
            </div>

            {/* Review Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Comments / Staff Feedback (Optional)</span>
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts on delivery speed, package condition, courier politeness..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-500/25 transition-colors cursor-pointer"
              >
                Submit Rating
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
