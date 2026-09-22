import { StoreVertical } from '../types';

/**
 * Centralized Design Tokens & Theme Types for Haaply Multi-Storefront Architecture
 */

export interface ThemeColors {
  primary: string;           // e.g. Brand Green #53B847
  primaryHover: string;      // e.g. #469e3c
  secondary: string;         // e.g. Brand Teal #37B4A1
  secondaryHover: string;    // e.g. #2ea190
  accent: string;            // e.g. Brand Deep Blue #004B68
  accentHover: string;       // e.g. #00384e
  background: string;        // e.g. #FAFAF6
  surface: string;           // e.g. #FFFFFF
  surfaceAlt: string;        // e.g. #F2F3ED
  text: string;              // e.g. #172126
  textMuted: string;         // e.g. #626B69
  border: string;            // e.g. #E7E7DF
  borderStrong: string;      // e.g. #D4D4CA
  success: string;           // e.g. #53B847
  warning: string;           // e.g. #F59E0B
  danger: string;            // e.g. #EF4444
}

export interface ThemeTypography {
  headingFont: string;       // e.g. 'Plus Jakarta Sans', system-ui, sans-serif
  bodyFont: string;          // e.g. 'Plus Jakarta Sans', system-ui, sans-serif
  tamilFont?: string;        // e.g. 'Noto Sans Tamil', sans-serif
  headingWeight: string;     // e.g. '700'
  bodyWeight: string;        // e.g. '400'
  fontScaleRatio: number;    // e.g. 1.25
}

export interface ThemeShape {
  radiusSmall: string;       // e.g. '8px'
  radiusMedium: string;      // e.g. '12px'
  radiusLarge: string;       // e.g. '16px'
  radiusXLarge: string;      // e.g. '22px'
  buttonRadius: string;      // e.g. '12px'
  cardRadius: string;        // e.g. '16px'
  pillRadius: string;        // e.g. '9999px'
}

export interface ThemeElevation {
  shadowSmall: string;       // e.g. '0 1px 3px rgba(0,0,0,0.05)'
  shadowMedium: string;      // e.g. '0 4px 16px rgba(0,0,0,0.04)'
  shadowLarge: string;       // e.g. '0 8px 30px rgba(0,0,0,0.08)'
}

export interface ThemeCapabilities {
  supportsQuickAdd?: boolean;
  supportsVariantChips?: boolean;
  supportsHeroBanner?: boolean;
  supportsStickyCart?: boolean;
  supportsProductGallery?: boolean;
  cardDensity?: 'comfortable' | 'compact' | 'editorial';
  layoutStyle?: 'marketplace' | 'editorial';
  productCardStyle?: 'compact-quickadd' | 'editorial-portrait';
  headerStyle?: 'marketplace-search' | 'editorial-centered';
  pdpStyle?: 'standard-nutrition' | 'editorial-gallery';
  footerStyle?: 'marketplace' | 'editorial';
  showLocationBar?: boolean;
  cartLabel?: 'Basket' | 'Bag' | 'Cart';
}

export interface StoreTheme {
  id: string;
  name: string;
  description: string;
  supportedVerticals: StoreVertical[]; // Compatible store verticals: e.g. ['grocery'], ['fashion'], or ['*']
  colors: ThemeColors;
  typography: ThemeTypography;
  shape: ThemeShape;
  elevation: ThemeElevation;
  capabilities?: ThemeCapabilities;
}
