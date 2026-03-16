import { useId } from "react";

export function TLRPMark({ showText = false }) {
  const gradientId = useId();

  return (
    <span className={`tlrp-mark ${showText ? "with-text" : ""}`}>
      <svg
        aria-hidden="true"
        className="tlrp-mark-badge"
        fill="none"
        viewBox="0 0 120 138"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="18" x2="96" y1="16" y2="120">
            <stop stopColor="#ebf4ff" />
            <stop offset="0.45" stopColor="#78a8ff" />
            <stop offset="1" stopColor="#2f5fe1" />
          </linearGradient>
        </defs>
        <path
          d="M60 4L104 20V69C104 95 88 115 60 132C32 115 16 95 16 69V20L60 4Z"
          fill="#08111E"
          stroke="#9EBEFF"
          strokeWidth="4"
        />
        <path
          d="M60 14L94 26V68C94 89 81 105 60 117C39 105 26 89 26 68V26L60 14Z"
          fill={`url(#${gradientId})`}
          opacity="0.95"
        />
        <path d="M34 47H86" opacity="0.28" stroke="#F6FAFF" strokeWidth="4" />
        <path d="M40 69H80" opacity="0.22" stroke="#F6FAFF" strokeWidth="4" />
        <text
          fill="#06101C"
          fontFamily="Bahnschrift, Trebuchet MS, sans-serif"
          fontSize="25"
          fontWeight="800"
          letterSpacing="-1.8"
          textAnchor="middle"
          x="60"
          y="82"
        >
          TLRP
        </text>
      </svg>

      {showText ? (
        <span className="tlrp-mark-copy">
          <span>Emergency Roleplay</span>
          <strong>TLRP</strong>
        </span>
      ) : null}
    </span>
  );
}
