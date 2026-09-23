import { StoreInstance } from './storeInstance';
import { DEFAULT_SITE_CONFIG } from './siteConfig';
import { DEFAULT_FEATURE_FLAGS } from './featureConfig';

/**
 * Default Store Instance 1: Haaply (Fresh Grocery & Batters)
 */
export const HAAPLY_STORE_INSTANCE: StoreInstance = {
  id: 'store-haaply',
  slug: 'haaply',
  name: 'Haaply',
  vertical: 'grocery',
  activeThemeId: 'haaply-fresh',
  siteConfig: {
    ...DEFAULT_SITE_CONFIG,
    id: 'store-haaply',
    name: 'Haaply',
    vertical: 'grocery',
    activeThemeId: 'haaply-fresh',
  },
  featureFlags: {
    ...DEFAULT_FEATURE_FLAGS,
  },
  fulfillment: {
    ...DEFAULT_SITE_CONFIG.fulfillment,
  },
  delivery: {
    ...DEFAULT_SITE_CONFIG.delivery,
  },
  dataProviderId: 'firebase',
};

/**
 * Default Store Instance 2: Atelier (Contemporary Fashion & Studio Wardrobe)
 */
export const ATELIER_STORE_INSTANCE: StoreInstance = {
  id: 'store-atelier',
  slug: 'atelier',
  name: 'Atelier',
  vertical: 'fashion',
  activeThemeId: 'atelier',
  siteConfig: {
    id: 'store-atelier',
    name: 'Atelier',
    legalBusinessName: 'Atelier Studio India Pvt Ltd',
    tagline: 'Contemporary Silhouette & Tailoring',
    description: 'Curated capsule collections, pure European flax linen, and mindful modern tailoring.',
    currencySymbol: '₹',
    currencyCode: 'INR',
    locale: 'en-IN',
    vertical: 'fashion',
    activeThemeId: 'atelier',
    contact: {
      phone: '+91 80 4123 9876',
      email: 'concierge@atelier-studio.com',
      supportHours: '10:00 AM – 7:00 PM, Mon–Sat',
    },
    delivery: {
      freeDeliveryThreshold: 5000,
      standardDeliveryFee: 150,
      defaultCity: 'Bangalore',
      estimatedDeliveryWindow: 'Express Insured Delivery (2–4 business days)',
    },
    fulfillment: {
      fulfillmentModel: 'single_store',
      defaultFulfillmentLocationId: 'loc-atelier-flagship',
    },
  },
  featureFlags: {
    ...DEFAULT_FEATURE_FLAGS,
    recipes: false,
    mealIntents: false,
    nutrition: false,
    deliverySlots: false,
    storePickup: true,
  },
  fulfillment: {
    fulfillmentModel: 'single_store',
    defaultFulfillmentLocationId: 'loc-atelier-flagship',
  },
  delivery: {
    freeDeliveryThreshold: 5000,
    standardDeliveryFee: 150,
    defaultCity: 'Bangalore',
    estimatedDeliveryWindow: 'Express Insured Delivery (2–4 business days)',
  },
  dataProviderId: 'firebase',
};

/**
 * Default Store Instance 3: Anya Soaps (Handcrafted Artisan Soaps & Botanical Skincare)
 */
export const ANYASOAPS_STORE_INSTANCE: StoreInstance = {
  id: 'store-anyasoaps',
  slug: 'anyasoaps',
  name: 'Anya Soaps',
  vertical: 'beauty',
  activeThemeId: 'anyasoaps',
  siteConfig: {
    id: 'store-anyasoaps',
    name: 'Anya Soaps',
    legalBusinessName: 'Anya Natural Skincare & Artisan Soaps Pvt Ltd',
    tagline: 'Handmade Natural Skincare & Organic Artisan Soaps',
    description: '100% natural, handmade artisan soaps crafted with organic botanicals, cold-pressed oils, and pure essential oils.',
    currencySymbol: '₹',
    currencyCode: 'INR',
    locale: 'en-IN',
    vertical: 'beauty',
    activeThemeId: 'anyasoaps',
    contact: {
      phone: '+91 8220265266',
      email: 'hello@anyasoaps.com',
      supportHours: '09:30 AM – 06:30 PM, Mon–Sat',
    },
    delivery: {
      freeDeliveryThreshold: 1500,
      standardDeliveryFee: 90,
      defaultCity: 'Coimbatore',
      estimatedDeliveryWindow: 'Pan-India Insured Dispatch (2–5 business days)',
    },
    fulfillment: {
      fulfillmentModel: 'single_store',
      defaultFulfillmentLocationId: 'loc-anya-studio',
    },
  },
  featureFlags: {
    ...DEFAULT_FEATURE_FLAGS,
    recipes: false,
    mealIntents: false,
    nutrition: false,
    deliverySlots: false,
    storePickup: false,
  },
  fulfillment: {
    fulfillmentModel: 'single_store',
    defaultFulfillmentLocationId: 'loc-anya-studio',
  },
  delivery: {
    freeDeliveryThreshold: 1500,
    standardDeliveryFee: 90,
    defaultCity: 'Coimbatore',
    estimatedDeliveryWindow: 'Pan-India Insured Dispatch (2–5 business days)',
  },
  dataProviderId: 'firebase',
};

/**
 * Multi-Store Registry mapping store IDs to their StoreInstance configurations
 */
export const STORE_REGISTRY: Record<string, StoreInstance> = {
  'store-haaply': HAAPLY_STORE_INSTANCE,
  'store-atelier': ATELIER_STORE_INSTANCE,
  'store-anyasoaps': ANYASOAPS_STORE_INSTANCE,
};

export const DEFAULT_STORE_ID = 'store-haaply';

/**
 * Returns all registered store instances
 */
export function getAllStores(): StoreInstance[] {
  return Object.values(STORE_REGISTRY);
}

/**
 * Finds a store instance by its unique ID (e.g. 'store-haaply')
 */
export function getStoreById(storeId: string): StoreInstance | undefined {
  return STORE_REGISTRY[storeId];
}

/**
 * Finds a store instance by its URL slug (e.g. 'haaply' or 'atelier')
 */
export function getStoreBySlug(slug: string): StoreInstance | undefined {
  return Object.values(STORE_REGISTRY).find((s) => s.slug === slug);
}

/**
 * Resolves a store ID or alias from URL parameters / environment hints.
 * Supports:
 * - ?store=haaply -> store-haaply
 * - ?store=store-haaply -> store-haaply
 * - ?store=atelier -> store-atelier
 * - ?store=store-atelier -> store-atelier
 * - ?store=anyasoaps -> store-anyasoaps
 * - ?store=store-anyasoaps -> store-anyasoaps
 * - ?theme=anyasoaps -> store-anyasoaps (backward-compatible legacy fallback)
 * - ?theme=atelier -> store-atelier (backward-compatible legacy fallback)
 * - ?theme=haaply-fresh -> store-haaply (backward-compatible legacy fallback)
 */
export function resolveStoreIdentifier(rawInput?: string | null): StoreInstance {
  if (!rawInput) return HAAPLY_STORE_INSTANCE;

  const normalized = rawInput.trim().toLowerCase();

  // 1. Direct ID match
  if (STORE_REGISTRY[normalized]) {
    return STORE_REGISTRY[normalized];
  }

  // 2. Direct Slug match
  const bySlug = getStoreBySlug(normalized);
  if (bySlug) return bySlug;

  // 3. Prefix matching (e.g. 'haaply' -> 'store-haaply')
  if (STORE_REGISTRY[`store-${normalized}`]) {
    return STORE_REGISTRY[`store-${normalized}`];
  }

  // 4. Legacy theme parameter aliases
  if (normalized === 'anyasoaps' || normalized === 'anya') return ANYASOAPS_STORE_INSTANCE;
  if (normalized === 'atelier') return ATELIER_STORE_INSTANCE;
  if (normalized === 'haaply-fresh') return HAAPLY_STORE_INSTANCE;

  return HAAPLY_STORE_INSTANCE;
}
