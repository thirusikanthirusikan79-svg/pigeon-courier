import React from 'react';

interface PigeonLogoProps {
  className?: string;
  iconContainerClass?: string;
  showSubtitle?: boolean;
}

export const PigeonLogo: React.FC<PigeonLogoProps> = ({
  className = '',
  iconContainerClass = 'w-11 h-11 rounded-xl p-2',
  showSubtitle = true,
}) => {
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Official Pigeon Courier Vector Icon in Orange Gradient Container */}
      <div
        className={`${iconContainerClass} bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-lg shadow-orange-500/25 flex items-center justify-center shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
          aria-hidden="true"
        >
          <path
            d="M3 8.5L12 3.5L21 8.5V16.5L12 21.5L3 16.5V8.5Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#ffffff"
            fillOpacity="0.18"
          />
          <path d="M12 12V21.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 12L21 8.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 12L3 8.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M8.5 6L14 7.5L16.5 4.5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div>
        <div className="text-2xl font-extrabold tracking-tight text-white leading-none">
          Pigeon
        </div>
        {showSubtitle && (
          <div className="text-[11px] font-extrabold tracking-widest text-orange-400 uppercase mt-1">
            COURIER | LOGISTICS & EXPRESS
          </div>
        )}
      </div>
    </div>
  );
};
