/**
 * Feature Configuration Types for Reusable Storefront Platform
 * Allows storefronts to selectively toggle modules on or off without code rewrites.
 */

export interface FeatureFlags {
  // Core Commerce
  catalog: boolean;
  search: boolean;
  cart: boolean;
  checkout: boolean;
  wishlist: boolean;

  // Editorial & Discovery
  recipes: boolean;
  mealIntents: boolean;
  nutrition: boolean;
  reviews: boolean;

  // Order & Fulfillment
  deliverySlots: boolean;
  storePickup: boolean;
  liveTracking: boolean;

  // Payment Methods
  upiPayment: boolean;
  cardsAndNetbanking: boolean;
  cashOnDelivery: boolean;

  // Growth & Loyalty
  coupons: boolean;
  subscriptions: boolean;
  loyaltyPoints: boolean;

  // User & Accessibility
  customerAccounts: boolean;
  orderHistory: boolean;
  multiLanguage: boolean;
  voiceSearch: boolean;
  pushNotifications: boolean;
}

/**
 * Default Feature Flags for Haaply
 */
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // Core Commerce - Active
  catalog: true,
  search: true,
  cart: true,
  checkout: true,
  wishlist: true,

  // Editorial & Discovery - Active
  recipes: true,
  mealIntents: true,
  nutrition: false, // Planned for next phase
  reviews: false,   // Planned for next phase

  // Order & Fulfillment
  deliverySlots: true,
  storePickup: false,
  liveTracking: false,

  // Payment Methods
  upiPayment: true,
  cardsAndNetbanking: true,
  cashOnDelivery: true,

  // Growth & Loyalty
  coupons: false,
  subscriptions: false,
  loyaltyPoints: false,

  // User & Accessibility
  customerAccounts: true,
  orderHistory: true,
  multiLanguage: false,
  voiceSearch: false,
  pushNotifications: false,
};
