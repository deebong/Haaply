import {
  Product,
  Category,
  MealIntent,
  CheckoutAddress,
  DeliverySlot,
  OrderPayload,
  CustomerProfile,
  FulfillmentLocation,
  InventoryRecord,
} from '../../types';
import { SiteConfig } from '../../config/siteConfig';

/**
 * Capability Matrix for Storefront Data Providers
 * Allows the application to query what features the active backend supports
 * before attempting operations (e.g. realtime subscriptions vs poll-based queries).
 */
export interface ProviderCapabilities {
  /** Supports real-time document listeners/subscriptions (e.g., Firestore, Supabase Realtime) */
  realtime: boolean;
  /** Supports ACID transactions across multiple collections/tables */
  transactions: boolean;
  /** Supports server-side filtering and indexing */
  serverFiltering: boolean;
  /** Supports relational joins and advanced SQL aggregations */
  advancedQueries: boolean;
  /** Supports atomic batch inserts/updates */
  bulkOperations: boolean;
  /** Supports offline caching and local persistence (e.g., Firestore offline cache) */
  offlineSupport: boolean;
  /** Supports native customer authentication (e.g., Firebase Auth, Supabase Auth) */
  authSupported: boolean;
}

/**
 * Filter options for querying products
 */
export interface ProductFilterOptions {
  categorySlug?: string;
  query?: string;
  isFreshToday?: boolean;
  limit?: number;
  offset?: number;
  storeId?: string;
}

/**
 * Result returned upon order creation
 */
export interface OrderResult {
  orderId: string;
  status: 'draft' | 'pending' | 'confirmed' | 'failed';
  message?: string;
  trackingUrl?: string;
}

/**
 * Provider Descriptor Metadata
 * Used by the registry and future admin/diagnostic tools
 */
export interface ProviderDescriptor {
  id: string;
  name: string;
  description: string;
  capabilities: ProviderCapabilities;
  status: 'production' | 'planned' | 'experimental' | 'deprecated';
  /** Indicates whether client-side direct access is forbidden and requires an API proxy */
  requiresBackendProxy: boolean;
}

/**
 * Central Data Provider Contract
 * 
 * Every backend provider (Firebase, Google Sheets, MySQL, Supabase, REST)
 * implements this contract. The storefront UI never interacts directly with
 * underlying SDKs (Firestore, Google API Client, MySQL drivers, etc.).
 */
export interface DataProvider {
  /** Unique provider identifier */
  readonly id: string;
  /** Human-readable provider title */
  readonly name: string;
  /** Feature capabilities of this provider */
  readonly capabilities: ProviderCapabilities;

  /** Health / readiness check */
  isReady(): boolean;

  /** Optional async initialization lifecycle hook */
  initialize?(): Promise<void>;

  // --- Product & Catalog Operations ---
  getProducts(filters?: ProductFilterOptions): Promise<Product[]>;
  getProductById(id: string, storeId?: string): Promise<Product | null>;
  getCategories(storeId?: string): Promise<Category[]>;
  getMealIntents(storeId?: string): Promise<MealIntent[]>;
  getFeaturedProductIds(storeId?: string): Promise<{ freshPicks: string[]; favourites: string[] }>;

  // --- Customer & Authentication Operations ---
  getCurrentCustomer(storeId?: string): Promise<CustomerProfile | null>;
  loginWithPin(phone: string, pin: string, storeId?: string): Promise<CustomerProfile>;
  logout(): Promise<void>;

  // --- Address & Logistics Operations ---
  getSavedAddresses(customerId?: string, storeId?: string): Promise<CheckoutAddress[]>;
  saveAddress(address: CheckoutAddress, customerId?: string, storeId?: string): Promise<CheckoutAddress>;

  // --- Order & Fulfillment Operations ---
  getDeliverySlots(storeId?: string): Promise<DeliverySlot[]>;
  createOrder(order: OrderPayload): Promise<OrderResult>;
  getOrders(customerId?: string, storeId?: string): Promise<OrderPayload[]>;

  // --- Fulfillment & Location Operations (Optional) ---
  getFulfillmentLocations?(activeOnly?: boolean, storeId?: string): Promise<FulfillmentLocation[]>;
  getFulfillmentLocationById?(id: string): Promise<FulfillmentLocation | null>;
  getInventoryRecord?(variantId: string, locationId: string): Promise<InventoryRecord | null>;

  // --- Wishlist Operations ---
  getWishlist(customerId?: string, storeId?: string): Promise<string[]>;
  toggleWishlist(productId: string, customerId?: string, storeId?: string): Promise<{ productIds: string[]; isSaved: boolean }>;

  // --- Store Configuration (Optional) ---
  getSiteConfig?(storeId?: string): Promise<SiteConfig | null>;
}
