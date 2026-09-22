import { StoreTheme } from './themeTypes';

/**
 * Approved Haaply Fresh Theme
 * Exactly preserves Haaply's visual identity:
 * - Brand Green: #53B847
 * - Brand Teal: #37B4A1
 * - Brand Deep Blue: #004B68
 * - Warm background: #FAFAF6
 * - Clean crisp white cards: #FFFFFF
 * - Warm muted surfaces: #F2F3ED
 * - Subtle warm borders: #E7E7DF
 */
export const haaplyFreshTheme: StoreTheme = {
  id: 'haaply-fresh',
  name: 'Haaply Fresh',
  description: 'Natural stone-ground food marketplace with warm editorial tones',
  supportedVerticals: ['grocery'],
  capabilities: {
    supportsQuickAdd: true,
    supportsVariantChips: true,
    supportsHeroBanner: true,
    supportsStickyCart: true,
    supportsProductGallery: false,
    cardDensity: 'comfortable',
    layoutStyle: 'marketplace',
    productCardStyle: 'compact-quickadd',
    headerStyle: 'marketplace-search',
    pdpStyle: 'standard-nutrition',
    footerStyle: 'marketplace',
    showLocationBar: true,
    cartLabel: 'Basket',
  },
  colors: {
    primary: '#53B847',
    primaryHover: '#469e3c',
    secondary: '#37B4A1',
    secondaryHover: '#2ea190',
    accent: '#004B68',
    accentHover: '#00384e',
    background: '#FAFAF6',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F3ED',
    text: '#172126',
    textMuted: '#626B69',
    border: '#E7E7DF',
    borderStrong: '#D4D4CA',
    success: '#53B847',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  typography: {
    headingFont: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    bodyFont: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    tamilFont: "'Noto Sans Tamil', 'Plus Jakarta Sans', system-ui, sans-serif",
    headingWeight: '700',
    bodyWeight: '400',
    fontScaleRatio: 1.25,
  },
  shape: {
    radiusSmall: '8px',
    radiusMedium: '12px',
    radiusLarge: '16px',
    radiusXLarge: '22px',
    buttonRadius: '12px',
    cardRadius: '16px',
    pillRadius: '9999px',
  },
  elevation: {
    shadowSmall: '0 1px 3px rgba(0, 0, 0, 0.05)',
    shadowMedium: '0 4px 16px rgba(0, 0, 0, 0.04)',
    shadowLarge: '0 8px 30px rgba(0, 0, 0, 0.08)',
  },
};
