import { useState } from 'react';

const CANDIDATES = [
  `${import.meta.env.BASE_URL}images/profile-portrait.webp`,
  `${import.meta.env.BASE_URL}images/profile-portrait.jpg`,
  `${import.meta.env.BASE_URL}images/profile-portrait.jpeg`,
  `${import.meta.env.BASE_URL}images/profile-portrait.png`,
];

/**
 * Profile photo with graceful fallback.
 * Drop a portrait at public/images/profile-portrait.<webp|jpg|jpeg|png> and it
 * appears automatically; until then the NJ monogram is shown.
 */
export function ProfilePhoto({ className = '' }: { className?: string }) {
  const [srcIdx, setSrcIdx] = useState(0);
  const failed = srcIdx >= CANDIDATES.length;

  return (
    <span className={`relative block h-full w-full overflow-hidden ${className}`}>
      {/* monogram fallback layer */}
      <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-600 via-indigo-500 to-cyan-500 font-display text-2xl font-bold text-white">
        NJ
      </span>
      {!failed && (
        <img
          src={CANDIDATES[srcIdx]}
          alt="Niraj Laxman Jadhav — Data Analyst"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
          onError={() => setSrcIdx((i) => i + 1)}
        />
      )}
    </span>
  );
}
