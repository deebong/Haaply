import { StoreTheme } from './themeTypes';

/**
 * Anya Soaps Theme
 * Designed exclusively for the 'beauty' store vertical.
 *
 * Distinctive Visual Identity (derived from anyasoaps_index.html):
 * - Soft natural/premium skincare aesthetic
 * - Warm ivory, cream, and pale blush surfaces (#FFF4F6, #FDECEF)
 * - Artisan dusty rose & plum accents (#C97C89, #B56875)
 * - Dark charcoal/brown typography (#2F2326, #8E7A7E)
 * - Refined display typography pairing ('Urbanist' + italic 'Playfair Display')
 * - Spacious editorial layouts with soft borders and clipped-polygon badges
 * - Botanical / handcrafted natural artisan positioning
 */
export const anyasoapsTheme: StoreTheme = {
  id: 'anyasoaps',
  name: 'Anya Soaps',
  description: 'Handmade natural skincare & organic artisan soaps with warm botanical aesthetic and delicate rose blush surfaces',
  supportedVerticals: ['beauty'],
  capabilities: {
    supportsQuickAdd: true,
    supportsVariantChips: true,
    supportsHeroBanner: true,
    supportsStickyCart: false,
    supportsProductGallery: true,
    cardDensity: 'comfortable',
    layoutStyle: 'editorial',
    productCardStyle: 'editorial-portrait',
    headerStyle: 'editorial-centered',
    pdpStyle: 'editorial-gallery',
    footerStyle: 'editorial',
    showLocationBar: false,
    cartLabel: 'Cart',
  },
  colors: {
    primary: '#2F2326',
    primaryHover: '#4A3B3E',
    secondary: '#E39AA6',
    secondaryHover: '#C97C89',
    accent: '#C97C89',
    accentHover: '#B56875',
    background: '#FFF4F6',
    surface: '#FFFFFF',
    surfaceAlt: '#FFF8FA',
    text: '#2F2326',
    textMuted: '#8E7A7E',
    border: '#E7C8CF',
    borderStrong: '#D8B4BC',
    success: '#C97C89',
    warning: '#E09A55',
    danger: '#C95252',
  },
  typography: {
    headingFont: "'Urbanist', 'Playfair Display', 'Noto Sans', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    bodyFont: "'Urbanist', 'Noto Sans', 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    headingWeight: '600',
    bodyWeight: '400',
    fontScaleRatio: 1.25,
  },
  shape: {
    radiusSmall: '8px',
    radiusMedium: '14px',
    radiusLarge: '18px',
    radiusXLarge: '22px',
    buttonRadius: '12px',
    cardRadius: '18px',
    pillRadius: '9999px',
  },
  elevation: {
    shadowSmall: '0 2px 8px rgba(120, 60, 70, 0.04)',
    shadowMedium: '0 12px 28px rgba(120, 60, 70, 0.08)',
    shadowLarge: '0 24px 60px rgba(120, 60, 70, 0.14)',
  },
};
