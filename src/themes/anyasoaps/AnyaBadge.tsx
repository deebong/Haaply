import React from 'react';
import { getAnyaClippedPolygon } from './AnyaCard';

export type AnyaBadgeVariant = 'blush' | 'cream' | 'surface' | 'plum' | 'accent' | 'outline';
export type AnyaBadgeSize = 'xs' | 'sm' | 'md';
export type AnyaBadgeShape = 'clipped' | 'rounded';

export interface AnyaBadgeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: AnyaBadgeVariant;
  size?: AnyaBadgeSize;
  shape?: AnyaBadgeShape;
  active?: boolean;
  icon?: React.ReactNode;
  as?: 'span' | 'button' | 'div';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: React.ReactNode;
}

/**
 * AnyaBadge — Tag, Chip & Badge Component for Anya Soaps.
 *
 * Supported Geometries:
 * - 'clipped' (default): Signature diagonal chamfers at Top-Left and Bottom-Right for prominent editorial/title tags.
 * - 'rounded': Compact rounded rectangular chip with subtle rounded corners and muted rose border for product-level metadata, ingredients, and skin types.
 */
export const AnyaBadge: React.FC<AnyaBadgeProps> = ({
  variant = 'blush',
  size = 'sm',
  shape = 'clipped',
  active = false,
  icon,
  as: Component = 'span',
  type = 'button',
  className = '',
  style,
  children,
  onClick,
  ...rest
}) => {
  // Sizing styles
  const sizeClasses = {
    xs: 'text-[9px] sm:text-[10px] px-2 py-0.5 tracking-wide',
    sm: 'text-[10px] sm:text-[11px] px-2.5 py-1 tracking-wide',
    md: 'text-xs px-3.5 py-1.5 tracking-wide',
  };

  const isClickable = Component === 'button' || Boolean(onClick);

  // 1. ROUNDED SHAPE (For Product-Level Metadata, Ingredients, Attributes, Skin Types)
  if (shape === 'rounded') {
    let roundedBg = 'bg-[#FFF4F6]';
    let roundedBorder = 'border-[#E7C8CF]';
    let roundedText = 'text-[#C97C89]';

    if (active) {
      roundedBg = 'bg-[#C97C89]';
      roundedBorder = 'border-[#C97C89]';
      roundedText = 'text-white';
    } else if (variant === 'cream') {
      roundedBg = 'bg-[#FFF8FA]';
      roundedBorder = 'border-[#E7C8CF]';
      roundedText = 'text-[#2F2326]';
    } else if (variant === 'surface') {
      roundedBg = 'bg-white';
      roundedBorder = 'border-[#E7C8CF]';
      roundedText = 'text-[#2F2326]';
    } else if (variant === 'plum') {
      roundedBg = 'bg-[#2F2326]';
      roundedBorder = 'border-[#2F2326]';
      roundedText = 'text-white';
    } else if (variant === 'accent') {
      roundedBg = 'bg-[#FFF4F6]';
      roundedBorder = 'border-[#C97C89]';
      roundedText = 'text-[#C97C89]';
    } else if (variant === 'outline') {
      roundedBg = 'bg-transparent';
      roundedBorder = 'border-[#E7C8CF]';
      roundedText = 'text-[#2F2326]';
    }

    return (
      <Component
        type={Component === 'button' ? type : undefined}
        onClick={onClick}
        className={`group inline-flex items-center gap-1.5 font-medium uppercase transition-all duration-200 select-none rounded-[5px] border ${roundedBorder} ${roundedBg} ${roundedText} ${
          isClickable ? 'cursor-pointer hover:border-[#C97C89] active:scale-[0.98]' : ''
        } ${sizeClasses[size]} ${className}`}
        style={style}
        {...(rest as any)}
      >
        {icon && <span className="shrink-0 leading-none">{icon}</span>}
        <span className="leading-none">{children}</span>
      </Component>
    );
  }

  // 2. CLIPPED SHAPE (For Major Editorial/Title Tags, Showcase Headers, Why Pillars)
  const cut = size === 'xs' ? 4 : size === 'md' ? 8 : 6;
  const innerCut = Math.max(1, cut - 1);
  const outerClip = getAnyaClippedPolygon(cut);
  const innerClip = getAnyaClippedPolygon(innerCut);

  // Color schemes
  let outerBg = 'bg-[#E7C8CF]';
  let innerBg = 'bg-[#FFF4F6]';
  let textColor = 'text-[#C97C89]';

  if (active) {
    outerBg = 'bg-[#C97C89]';
    innerBg = 'bg-[#2F2326]';
    textColor = 'text-white';
  } else if (variant === 'cream') {
    outerBg = 'bg-[#E7C8CF]';
    innerBg = 'bg-[#FFF8FA]';
    textColor = 'text-[#2F2326]';
  } else if (variant === 'surface') {
    outerBg = 'bg-[#E7C8CF]';
    innerBg = 'bg-white';
    textColor = 'text-[#2F2326]';
  } else if (variant === 'plum') {
    outerBg = 'bg-[#2F2326]';
    innerBg = 'bg-[#2F2326]';
    textColor = 'text-white';
  } else if (variant === 'accent') {
    outerBg = 'bg-[#C97C89]';
    innerBg = 'bg-[#FFF4F6]';
    textColor = 'text-[#C97C89]';
  } else if (variant === 'outline') {
    outerBg = 'bg-[#E7C8CF]';
    innerBg = 'bg-transparent';
    textColor = 'text-[#2F2326]';
  }

  return (
    <Component
      type={Component === 'button' ? type : undefined}
      onClick={onClick}
      className={`group relative inline-flex items-center gap-1.5 font-bold uppercase transition-all duration-200 select-none ${
        isClickable ? 'cursor-pointer hover:shadow-xs active:scale-[0.98]' : ''
      } ${sizeClasses[size]} ${textColor} ${className}`}
      style={{
        clipPath: outerClip,
        ...style,
      }}
      {...(rest as any)}
    >
      {/* Outer border canvas */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-colors duration-200 ${outerBg} ${
          isClickable && !active ? 'group-hover:bg-[#C97C89]' : ''
        }`}
        style={{ clipPath: outerClip }}
      />

      {/* Inner fill surface */}
      <span
        aria-hidden="true"
        className={`absolute inset-[1px] pointer-events-none transition-colors duration-200 ${innerBg} ${
          isClickable && !active ? 'group-hover:bg-[#FFF8FA]' : ''
        }`}
        style={{ clipPath: innerClip }}
      />

      {/* Content */}
      <span className="relative z-10 inline-flex items-center gap-1.5 leading-none">
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>
    </Component>
  );
};
