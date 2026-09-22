import { FulfillmentConfig, StoreVertical } from '../types';
import { DEFAULT_FULFILLMENT_LOCATION_ID } from '../data/fulfillmentLocations';

/**
 * Centralized Site Configuration Model
 * Decouples business/storefront identity from theme and feature flags.
 * Used to generate distinct client stores from a single engine.
 */

export interface DeliveryRules {
  freeDeliveryThreshold: number; // e.g. 199
  standardDeliveryFee: number;    // e.g. 25
  defaultCity: string;            // e.g. 'Coimbatore'
  estimatedDeliveryWindow: string; // e.g. 'Today within 2 hrs'
}

export interface ContactInfo {
  phone: string;
  email: string;
  supportHours: string;
  fssaiNumber?: string;
}

export interface SiteConfig {
  id: string;
  name: string;
  legalBusinessName: string;
  tagline: string;
  description: string;
  currencySymbol: string;
  currencyCode: string;
  locale: string;
  vertical: StoreVertical;
  activeThemeId: string;
  contact: ContactInfo;
  delivery: DeliveryRules;
  fulfillment: FulfillmentConfig;
}

/**
 * Production Site Config for Haaply
 */
export const DEFAULT_SITE_CONFIG: SiteConfig = {
  id: 'haaply',
  name: 'Haaply',
  legalBusinessName: 'Haaply Foods Private Limited',
  tagline: 'Fresh food for your home',
  description: 'Stone-ground batters, heritage millets and wholesome ready-to-cook staples prepared fresh every morning in Coimbatore.',
  currencySymbol: '₹',
  currencyCode: 'INR',
  locale: 'en-IN',
  vertical: 'grocery',
  activeThemeId: 'haaply-fresh',
  contact: {
    phone: '+91 98765 43210',
    email: 'hello@haaply.com',
    supportHours: '6:00 AM – 9:00 PM, Daily',
    fssaiNumber: '12423008000123',
  },
  delivery: {
    freeDeliveryThreshold: 199,
    standardDeliveryFee: 25,
    defaultCity: 'Coimbatore',
    estimatedDeliveryWindow: 'Same-day scheduled slot',
  },
  fulfillment: {
    fulfillmentModel: 'single_store',
    defaultFulfillmentLocationId: DEFAULT_FULFILLMENT_LOCATION_ID,
  },
};
