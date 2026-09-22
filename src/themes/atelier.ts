import { StoreTheme } from './themeTypes';

/**
 * Atelier Theme (Theme 2)
 * Designed exclusively for the 'fashion' store vertical.
 * 
 * Distinctive Visual Identity:
 * - High-contemporary fashion aesthetics
 * - Editorial serif typography ('Playfair Display' / 'Cormorant Garamond')
 * - Generous negative space and restrained architectural chrome
 * - Image-led editorial compositions with 3:4 portrait ratios
 * - Crisp, refined architectural contours (2px - 4px micro radii)
 * - Multi-axis variant models (Size x Color swatches)
 * - High-resolution multi-image product gallery
 * - Editorial "Shopping Bag" terminology instead of grocery "Basket"
 */
export const atelierTheme: StoreTheme = {
  id: 'atelier',
  name: 'Atelier',
  description: 'High-contemporary fashion storefront with editorial serif typography, image-led layouts, and restrained architectural chrome',
  supportedVerticals: ['fashion'],
  capabilities: {
    supportsQuickAdd: false,
    supportsVariantChips: false,
    supportsHeroBanner: true,
    supportsStickyCart: false,
    supportsProductGallery: true,
    cardDensity: 'editorial',
    layoutStyle: 'editorial',
    productCardStyle: 'editorial-portrait',
    headerStyle: 'editorial-centered',
    pdpStyle: 'editorial-gallery',
    footerStyle: 'editorial',
    showLocationBar: false,
    cartLabel: 'Bag',
  },
  colors: {
    primary: '#141414',
    primaryHover: '#2E2E2E',
    secondary: '#8C7355',
    secondaryHover: '#755E44',
    accent: '#A65D43',
    accentHover: '#8B4B34',
    background: '#FBFBF9',
    surface: '#FFFFFF',
    surfaceAlt: '#F5F4F0',
    text: '#181818',
    textMuted: '#767676',
    border: '#E8E6E1',
    borderStrong: '#CBC7BF',
    success: '#2E7D32',
    warning: '#D97706',
    danger: '#DC2626',
  },
  typography: {
    headingFont: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
    bodyFont: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    headingWeight: '500',
    bodyWeight: '400',
    fontScaleRatio: 1.333, // High contrast editorial scale
  },
  shape: {
    radiusSmall: '2px',
    radiusMedium: '4px',
    radiusLarge: '6px',
    radiusXLarge: '8px',
    buttonRadius: '2px',
    cardRadius: '2px',
    pillRadius: '9999px',
  },
  elevation: {
    shadowSmall: 'none',
    shadowMedium: '0 4px 20px rgba(0, 0, 0, 0.03)',
    shadowLarge: '0 12px 36px rgba(0, 0, 0, 0.06)',
  },
};
