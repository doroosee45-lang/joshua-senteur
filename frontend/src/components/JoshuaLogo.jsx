import React from 'react';

export default function JoshuaLogo({ size = 'sm', subtitle = 'PARFUMERIE' }) {
  const isLarge = size === 'lg';
  const isMedium = size === 'md';

  return (
    <div className="inline-flex flex-col items-center select-none group">
      {/* Ornate Perfume Flacon + Blossom Botanical Crest inspired by La Roselle Atelier */}
      <svg
        viewBox="0 0 64 64"
        className={`${
          isLarge ? 'w-14 h-14 mb-1' : isMedium ? 'w-11 h-11 mb-0.5' : 'w-8 h-8 mb-0.5'
        } text-[#E2C0BC] transition-transform duration-500 group-hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft blush halo */}
        <circle cx="32" cy="24" r="14" fill="#E2C0BC" fillOpacity="0.14" />
        {/* Delicate 5-petal blossom crown */}
        <g stroke="#E2C0BC" strokeWidth="1.2" fill="#FAF8F4" fillOpacity="0.88">
          <ellipse cx="32" cy="12" rx="3.2" ry="5.5" />
          <ellipse cx="32" cy="12" rx="3.2" ry="5.5" transform="rotate(72 32 17)" />
          <ellipse cx="32" cy="12" rx="3.2" ry="5.5" transform="rotate(144 32 17)" />
          <ellipse cx="32" cy="12" rx="3.2" ry="5.5" transform="rotate(216 32 17)" />
          <ellipse cx="32" cy="12" rx="3.2" ry="5.5" transform="rotate(288 32 17)" />
        </g>
        <circle cx="32" cy="17" r="2" fill="#D4B8AE" />
        {/* Botanical leaves */}
        <path
          d="M21 22C16 20 14 15 17 13C20 15 22 18 23 22"
          stroke="#D4B8AE"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M43 22C48 20 50 15 47 13C44 15 42 18 41 22"
          stroke="#D4B8AE"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* Faceted haute parfumerie crystal flacon */}
        <rect x="28" y="24" width="8" height="4" rx="1" stroke="#D4B8AE" strokeWidth="1.2" />
        <path
          d="M26 28H38L44 35V51C44 53.2 42.2 55 40 55H24C21.8 55 20 53.2 20 51V35L26 28Z"
          stroke="#E2C0BC"
          strokeWidth="1.35"
          fill="#E2C0BC"
          fillOpacity="0.1"
        />
        {/* Inner crystal facet lines */}
        <path
          d="M26 28L24 55M38 28L40 55M20 36H44"
          stroke="#D4B8AE"
          strokeOpacity="0.55"
          strokeWidth="0.9"
        />
      </svg>

      {/* Flowing Romantic Script Title */}
      <span
        className={`font-script leading-none text-[#E8D0C9] tracking-wide ${
          isLarge
            ? 'text-4xl sm:text-5xl'
            : isMedium
            ? 'text-3xl'
            : 'text-[22px] sm:text-[25px]'
        }`}
      >
        Joshua Parfum
      </span>

      {/* Flanking Hairlines + Spaced Micro-Caps */}
      <div className="flex items-center gap-2 mt-1">
        <span
          className={`h-[1px] bg-[#D4B8AE]/60 ${isLarge ? 'w-7 sm:w-9' : 'w-4'}`}
        />
        <span
          className={`uppercase font-sans text-[#D4B8AE] font-medium ${
            isLarge
              ? 'text-[9px] sm:text-[10px] tracking-[0.34em]'
              : 'text-[7px] tracking-[0.28em]'
          }`}
        >
          {subtitle}
        </span>
        <span
          className={`h-[1px] bg-[#D4B8AE]/60 ${isLarge ? 'w-7 sm:w-9' : 'w-4'}`}
        />
      </div>
    </div>
  );
}
