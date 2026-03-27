'use client';

import { useState } from 'react';

export default function VerifiedBadge({
  type = 'landlord',
  size = 'sm',
}: {
  type?: 'landlord' | 'tenant';
  size?: 'sm' | 'md' | 'lg';
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  const iconSize = { sm: 12, md: 14, lg: 16 };

  const label = type === 'landlord' ? 'Verified Landlord' : 'Verified Tenant';
  const tooltip =
    type === 'landlord'
      ? 'This landlord has been verified with government ID and proof of property ownership.'
      : 'This tenant has been verified with government ID and employment status.';

  return (
    <span
      className={`relative inline-flex items-center font-semibold rounded-full bg-gold-light text-gold cursor-help ${sizeClasses[size]}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <svg
        width={iconSize[size]}
        height={iconSize[size]}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 1l3.09 6.26L22 8.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 13.14l-5-4.87 6.91-1.01L12 1z" />
      </svg>
      {label}
      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-slate-900 text-white text-xs font-normal p-2.5 shadow-lg z-50 text-center leading-relaxed pointer-events-none">
          {tooltip}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  );
}
