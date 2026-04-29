import { useId } from "react";

export function ParalixMark({ showText = false }) {
  const gradientId = useId();

  return (
    <span className={`paralix-mark ${showText ? "with-text" : ""}`}>
      <svg
        aria-hidden="true"
        className="paralix-mark-badge"
        fill="none"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="20" x2="108" y1="14" y2="116">
            <stop stopColor="#f5f7fb" />
            <stop offset="0.42" stopColor="#65a8ff" />
            <stop offset="1" stopColor="#e84c4c" />
          </linearGradient>
        </defs>
        <path
          d="M64 8L108 24V61C108 91 90 111 64 120C38 111 20 91 20 61V24L64 8Z"
          fill="#0b1018"
          stroke="#dce7f7"
          strokeWidth="4"
        />
        <path d="M64 19L97 31V61C97 84 84 99 64 107C44 99 31 84 31 61V31L64 19Z" fill={`url(#${gradientId})`} />
        <path d="M45 43H70C82 43 90 50 90 61C90 72 82 79 70 79H59V93H45V43Z" fill="#091018" />
        <path d="M59 55V67H69C73 67 76 65 76 61C76 57 73 55 69 55H59Z" fill="#f8fbff" />
        <path d="M38 100H90" stroke="#f8fbff" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" />
      </svg>

      {showText ? (
        <span className="paralix-mark-copy">
          <span>ER:LC Operations</span>
          <strong>Paralix</strong>
        </span>
      ) : null}
    </span>
  );
}
