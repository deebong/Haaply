import React from 'react';

export type AnyaButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'botanical'
  | 'compact'
  | 'text'
  | 'danger';

export type AnyaButtonSize = 'sm' | 'md' | 'lg';
export type AnyaButtonCornerCut = 'tl-br' | 'tr-bl';

export interface AnyaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AnyaButtonVariant;
  size?: AnyaButtonSize;
  cutCorners?: AnyaButtonCornerCut;
  cutSize?: number;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

/**
 * AnyaButton — Signature Clipped-Corner Button System for Anya Soaps.
 *
 * Characteristics:
 * - Rectangular editorial geometry with sharp 90-degree corners
 * - Signature diagonal chamfers/cuts on opposing corners (default: TOP-LEFT & BOTTOM-RIGHT)
 * - Uppercase letter-spaced typography (tracking-[0.14em])
 * - Two-tier border clipping for outline & secondary variants ensuring crisp borders on diagonal cuts
 * - Rich Anya palette: Deep Plum (#2F2326), Soft Blush (#FDECEF), Primary Pink (#C97C89), Soft Pink (#E39AA6), Rose Border (#E7C8CF)
 */
export const AnyaButton: React.FC<AnyaButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  cutCorners = 'tl-br',
  cutSize: propCutSize,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  style,
  ...rest
}) => {
  if (variant === 'text') {
    return (
      <button
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 font-['Urbanist','Noto_Sans',system-ui,sans-serif] uppercase tracking-[0.14em] font-semibold text-xs text-[#2F2326] hover:text-[#C97C89] transition-colors focus:outline-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer group ${className}`}
        style={style}
        {...rest}
      >
        {icon && iconPosition === 'left' && <span className="shrink-0 transition-transform group-hover:-translate-x-0.5">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="shrink-0 transition-transform group-hover:translate-x-0.5">{icon}</span>}
      </button>
    );
  }

  // Corner chamfer dimensions
  const defaultCut = size === 'sm' || variant === 'compact' ? 8 : size === 'lg' ? 12 : 10;
  const cut = propCutSize ?? defaultCut;
  const innerCut = Math.max(1, cut - 1);

  // Outer polygon (exact button boundary)
  const outerClip =
    cutCorners === 'tr-bl'
      ? `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, ${cut}px 100%, 0 calc(100% - ${cut}px))`
      : `polygon(${cut}px 0, 100% 0, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%, 0 ${cut}px)`;

  // Inner polygon (inset by 1px for uniform border along orthogonal and diagonal edges)
  const innerClip =
    cutCorners === 'tr-bl'
      ? `polygon(0 0, calc(100% - ${innerCut}px) 0, 100% ${innerCut}px, 100% 100%, ${innerCut}px 100%, 0 calc(100% - ${innerCut}px))`
      : `polygon(${innerCut}px 0, 100% 0, 100% calc(100% - ${innerCut}px), calc(100% - ${innerCut}px) 100%, 0 100%, 0 ${innerCut}px)`;

  // Sizing definitions
  const sizeClasses: Record<AnyaButtonSize, string> = {
    sm: 'px-3.5 py-1.5 text-[11px] gap-1.5 min-h-[32px]',
    md: 'px-5 py-2.5 text-xs gap-2 min-h-[40px]',
    lg: 'px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm gap-2.5 min-h-[48px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  // Theme color mapping: outer layer (border) and inner layer (fill)
  const isBordered = variant === 'secondary' || variant === 'outline' || variant === 'danger';

  // Base text color
  let textColorClass = 'text-[#FFF4F6]';
  if (variant === 'secondary' || variant === 'outline') {
    textColorClass = 'text-[#2F2326]';
  } else if (variant === 'botanical') {
    textColorClass = 'text-white';
  } else if (variant === 'danger') {
    textColorClass = 'text-[#C95252]';
  }

  // Outer & inner layer styling
  let outerBgClass = 'bg-[#2F2326] group-hover:bg-[#4A3B3E] group-active:bg-[#20181A]';
  let innerBgClass = 'bg-[#2F2326] group-hover:bg-[#4A3B3E] group-active:bg-[#20181A]';

  if (variant === 'secondary') {
    outerBgClass = 'bg-[#E7C8CF] group-hover:bg-[#C97C89]';
    innerBgClass = 'bg-[#FFF4F6] group-hover:bg-white';
  } else if (variant === 'outline') {
    outerBgClass = 'bg-[#E7C8CF] group-hover:bg-[#C97C89]';
    innerBgClass = 'bg-white group-hover:bg-[#FFF4F6]';
  } else if (variant === 'botanical') {
    outerBgClass = 'bg-[#C97C89] group-hover:bg-[#B56875] group-active:bg-[#9E5360]';
    innerBgClass = 'bg-[#C97C89] group-hover:bg-[#B56875] group-active:bg-[#9E5360]';
  } else if (variant === 'danger') {
    outerBgClass = 'bg-[#E7C8CF] group-hover:bg-[#E39AA6]';
    innerBgClass = 'bg-[#FFF4F6] group-hover:bg-[#FBE8EC]';
  } else if (variant === 'compact') {
    outerBgClass = 'bg-[#2F2326] group-hover:bg-[#4A3B3E]';
    innerBgClass = 'bg-[#2F2326] group-hover:bg-[#4A3B3E]';
  }

  return (
    <button
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center font-['Urbanist','Noto_Sans',system-ui,sans-serif] font-semibold uppercase tracking-[0.14em] transition-all duration-200 select-none cursor-pointer focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] ${widthClass} ${sizeClasses[size]} ${textColorClass} ${className}`}
      style={{
        clipPath: outerClip,
        ...style,
      }}
      {...rest}
    >
      {/* Outer Layer (serves as 100% background or border canvas) */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-colors duration-200 ${outerBgClass}`}
        style={{ clipPath: outerClip }}
      />

      {/* Inner Fill Layer (for bordered buttons, inset by 1px to reveal 1px border along all edges including diagonal chamfers) */}
      {isBordered && (
        <span
          aria-hidden="true"
          className={`absolute inset-[1px] pointer-events-none transition-colors duration-200 ${innerBgClass}`}
          style={{ clipPath: innerClip }}
        />
      )}

      {/* Button Content */}
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && (
          <span className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">
            {icon}
          </span>
        )}
        <span className="leading-tight">{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
            {icon}
          </span>
        )}
      </span>
    </button>
  );
};
