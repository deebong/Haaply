import React, { useState } from 'react';
import logoPng from '../assets/logo.png';
import logoSvg from '../assets/logo-with-icon.svg';

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
  const [imgSrc, setImgSrc] = useState(logoPng);

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
          if (imgSrc !== logoSvg) {
            setImgSrc(logoSvg);
          }
        }}
      />
    </div>
  );
};
