// Logo C — exact SVG reproduction of the Pigeon Courier brand mark
// Dark navy "Pigeon" text, orange bird integrated over 'o', orange box-locator pin inside 'o'
// Subtitle: COURIER | LOGISTICS & EXPRESS

export default function LogoC({ height = 44 }) {
  // Maintain aspect ratio: viewBox 148 x 46
  const width = (height / 46) * 148;
  return (
    <svg
      viewBox="0 0 148 46"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pigeon Courier Service logo"
    >
      {/* "Pige" in dark navy */}
      <text
        x="2"
        y="27"
        fontSize="26"
        fontWeight="800"
        fill="#0F172A"
        textLength="66"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        Pige
      </text>

      {/* Custom 'o' group: orange bird + box-locator pin */}
      <g transform="translate(69, 1)">
        {/* Bird body */}
        <path
          d="M7 16 C7 10 12 4.5 19 3.5 C22.5 3 26 4.2 28.5 6.5 C25.5 7.2 22.8 7.5 20.5 8.8 C17.2 10.6 14.5 13.8 13 17.5 Z"
          fill="#F97316"
        />
        {/* Bird wing (darker accent) */}
        <path d="M19 3.5 L28 5.8 L23.5 8.8 Z" fill="#EA580C" />
        {/* Wing feathers */}
        <path
          d="M11 10 C14.5 6 20 5 24.5 6 C20.5 8.2 16.8 12.5 14.2 17 Z"
          fill="#FB923C"
        />
        {/* Box-pin body */}
        <path
          d="M6 18.5 C6 16.5 7.5 15.5 9.5 15.5 L21.5 15.5 C23.5 15.5 25 16.5 25 18.5 L25 25.5 C25 27.5 23 30 18.5 33 L15.5 35.5 L12.5 33 C8 30 6 27.5 6 25.5 Z"
          fill="#F97316"
        />
        {/* Parcel white interior */}
        <rect x="9.5" y="18" width="12" height="9" rx="1.5" fill="#FFFFFF" />
        {/* Tape H */}
        <line
          x1="9.5" y1="22.5" x2="21.5" y2="22.5"
          stroke="#F97316" strokeWidth="1.3" strokeDasharray="1.5 1"
        />
        {/* Tape V */}
        <line
          x1="15.5" y1="18" x2="15.5" y2="27"
          stroke="#F97316" strokeWidth="1.3"
        />
        {/* Pin point */}
        <circle cx="15.5" cy="31" r="1" fill="#FFFFFF" />
      </g>

      {/* "n" in dark navy */}
      <text
        x="101"
        y="27"
        fontSize="26"
        fontWeight="800"
        fill="#0F172A"
        textLength="20"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        n
      </text>

      {/* Subtitle */}
      <text
        x="2"
        y="39.5"
        fontSize="6"
        fontWeight="800"
        fill="#0F172A"
        textLength="121"
        lengthAdjust="spacing"
        fontFamily="Plus Jakarta Sans, sans-serif"
        letterSpacing="0.5"
      >
        COURIER | LOGISTICS &amp; EXPRESS
      </text>
    </svg>
  );
}
