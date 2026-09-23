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

export interface AnyaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AnyaButtonVariant;
  size?: AnyaButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

/**
 * AnyaButton — Dedicated button system for Anya Soaps.
 *
 * Characteristics:
 * - Soft, natural, organic aesthetic with restrained contrast
 * - Subtle rounded corners (rounded-[12px]), never harsh squares or extreme pills
 * - Urbanist / refined letter-spaced typography
 * - Warm espresso (#2F2326), blush (#FDECEF), rose (#E39AA6), and sage (#8FA08C) palette
 * - Elegant tactile transitions (scale, soft shadows)
 */
export const AnyaButton: React.FC<AnyaButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}) => {
  // Base sizing and typography
  const sizeClasses: Record<AnyaButtonSize, string> = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-xs sm:text-sm gap-2',
    lg: 'px-7 py-3.5 text-sm sm:text-base gap-2.5',
  };

  // Dedicated variant treatments adhering to Anya brand identity
  const variantClasses: Record<AnyaButtonVariant, string> = {
    primary:
      'bg-[#2F2326] text-[#FFF4F6] hover:bg-[#4A3B3E] active:bg-[#20181A] shadow-xs hover:shadow-sm border border-transparent',
    secondary:
      'bg-[#FDECEF] text-[#2F2326] border border-[#E7C8CF] hover:bg-[#FFF4F6] hover:border-[#8FA08C]',
    outline:
      'bg-white/90 text-[#2F2326] border border-[#E7C8CF] hover:border-[#8FA08C] hover:bg-[#FFF4F6]/70 hover:text-[#2F2326]',
    botanical:
      'bg-[#8FA08C] text-[#2F2326] font-semibold hover:bg-[#7E8F7B] active:bg-[#6D7E6A] shadow-xs',
    compact:
      'bg-[#2F2326] text-[#FFF4F6] hover:bg-[#4A3B3E] active:bg-[#20181A] px-3.5 py-2 text-xs font-semibold rounded-[10px] shadow-2xs border border-transparent',
    text:
      'bg-transparent text-[#2F2326] hover:text-[#8FA08C] underline-offset-4 hover:underline p-0 border-none shadow-none',
    danger:
      'bg-[#FDECEF] text-[#C95252] border border-[#E7C8CF] hover:bg-[#F9D7DC]',
  };

  const radiusClass = variant === 'compact' ? 'rounded-[10px]' : 'rounded-[12px]';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center font-['Urbanist',sans-serif] font-medium tracking-wide transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8FA08C]/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] ${radiusClass} ${widthClass} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
