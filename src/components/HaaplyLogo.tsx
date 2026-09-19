import React, { useState } from 'react';

interface HaaplyLogoProps {
  className?: string;
  variant?: 'full' | 'mark-only';
  width?: number;
}

export const HaaplyLogo: React.FC<HaaplyLogoProps> = ({
  className = '',
  variant = 'full',
  width = 125,
}) => {
  const [imgSrc, setImgSrc] = useState('/logo.png');

  return (
    <div
      id="haaply-logo"
      className={`inline-flex items-center cursor-pointer select-none group ${className}`}
      title="Haaply — Fresh Food For Your Home"
    >
      <img
        src={imgSrc}
        alt="Haaply"
        width={width}
        className="h-auto max-h-[44px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
        style={{ width: `${width}px` }}
        loading="eager"
        onError={() => {
          // If logo-with-icon.png is not yet uploaded to /public, fallback gracefully
          if (imgSrc !== '/logo-with-icon.svg') {
            setImgSrc('/logo-with-icon.svg');
          }
        }}
      />
    </div>
  );
};
