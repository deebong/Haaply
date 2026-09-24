import React from 'react';

export type AnyaCardVariant = 'surface' | 'cream' | 'blush' | 'plum' | 'glass';
export type AnyaCardCutSize = 'sm' | 'md' | 'lg';

export interface AnyaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AnyaCardVariant;
  cutSize?: AnyaCardCutSize | number;
  border?: boolean;
  borderColor?: string;
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Helper to generate clipped-corner polygon for Anya Soaps containers & cards.
 * Cut corners: TOP-LEFT & BOTTOM-RIGHT (opposing chamfers).
 * Top-Right and Bottom-Left remain sharp 90-degree corners.
 */
export function getAnyaClippedPolygon(cut: number): string {
  return `polygon(${cut}px 0, 100% 0, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%, 0 ${cut}px)`;
}

export function anyaClippedCornerStyle(cut: number = 14): React.CSSProperties {
  return {
    clipPath: getAnyaClippedPolygon(cut),
  };
}

/**
 * AnyaCard — Signature Clipped-Corner Card & Surface Primitive for Anya Soaps.
 *
 * Characteristics:
 * - Rectangular editorial container
 * - Signature diagonal chamfers on TOP-LEFT and BOTTOM-RIGHT
 * - Clean 90-degree corners on Top-Right and Bottom-Left
 * - Two-tier border clipping ensures crisp, consistent 1px border along all edges including diagonal cuts
 * - Rich Anya palette: Deep Plum (#2F2326), Warm Cream (#FFF8FA), Soft Blush (#FFF4F6), Rose Border (#E7C8CF), Accent Pink (#C97C89)
 */
export const AnyaCard: React.FC<AnyaCardProps> = ({
  children,
  variant = 'surface',
  cutSize = 'md',
  border = true,
  borderColor = '#E7C8CF',
  hoverEffect = false,
  className = '',
  style,
  onClick,
  ...rest
}) => {
  const numericCut =
    typeof cutSize === 'number'
      ? cutSize
      : cutSize === 'sm'
      ? 10
      : cutSize === 'lg'
      ? 20
      : 14;

  const innerCut = Math.max(1, numericCut - 1);
  const outerClip = getAnyaClippedPolygon(numericCut);
  const innerClip = getAnyaClippedPolygon(innerCut);

  // Background fills for variants
  const innerBgMap: Record<AnyaCardVariant, string> = {
    surface: 'bg-gradient-to-b from-white to-[#FFF8FA]',
    cream: 'bg-[#FFF8FA]',
    blush: 'bg-[#FFF4F6]',
    plum: 'bg-[#2F2326] text-[#FFF4F6]',
    glass: 'bg-white/85 backdrop-blur-md',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative transition-all duration-300 ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-lg' : ''
      } ${className}`}
      style={{
        clipPath: outerClip,
        ...style,
      }}
      {...rest}
    >
      {/* Outer Layer: provides border frame or solid background */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-colors duration-200 ${
          hoverEffect ? 'group-hover:bg-[#C97C89]' : ''
        }`}
        style={{
          backgroundColor: border ? borderColor : 'transparent',
          clipPath: outerClip,
        }}
      />

      {/* Inner Fill Layer: covers entire card under padding with 1px inset for crisp border */}
      <div
        aria-hidden="true"
        className={`absolute pointer-events-none transition-colors duration-200 ${
          border ? 'inset-[1px]' : 'inset-0'
        } ${innerBgMap[variant]}`}
        style={{
          clipPath: border ? innerClip : outerClip,
        }}
      />

      {/* Content Layer: in-flow so padding and children work naturally without gaps or clipping */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
