import {
  DataProvider,
  ProductFilterOptions,
  ProviderCapabilities,
  OrderResult,
} from './dataProviderTypes';
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
import {
  PRODUCTS,
  CATEGORIES,
  MEAL_INTENTS,
  TODAY_FRESH_PICKS_IDS,
  EVERYDAY_FAVOURITES_IDS,
  DEFAULT_DELIVERY_LOCATION,
} from '../products';
import {
  FASHION_PRODUCTS,
  FASHION_CATEGORIES,
  FASHION_NEW_ARRIVALS_IDS,
  FASHION_BESTSELLERS_IDS,
} from '../fashionDemoData';
import {
  ANYA_PRODUCTS,
  ANYA_CATEGORIES,
  ANYA_SIGNATURE_COLLECTION_IDS,
  ANYA_BESTSELLERS_IDS,
} from '../anyaSoapsData';
import { DEFAULT_SITE_CONFIG, SiteConfig } from '../../config/siteConfig';
import {
  DEFAULT_FULFILLMENT_LOCATIONS,
  ATELIER_FULFILLMENT_LOCATIONS,
  ANYA_FULFILLMENT_LOCATIONS,
} from '../fulfillmentLocations';

/**
 * Firebase Production Capabilities
 */
export const FIREBASE_CAPABILITIES: ProviderCapabilities = {
  realtime: true,
  transactions: true,
  serverFiltering: true,
  advancedQueries: true,
  bulkOperations: true,
  offlineSupport: true,
  authSupported: true,
};

/**
 * Firebase Data Provider for Haaply & Multi-Store Instances
 *
 * Implements the DataProvider contract for multi-store architecture.
 * Manages tenant-isolated data for:
 * - Product catalogs (Haaply Grocery vs. Atelier Fashion)
 * - Category classifications & meal intents
 * - Customer session, PIN authentication & addresses
 * - Delivery slots & order lifecycle records
 * - Store-isolated wishlist states
 */
export class FirebaseDataProvider implements DataProvider {
  readonly id = 'firebase';
  readonly name = 'Firebase (Haaply Cloud)';
  readonly capabilities = FIREBASE_CAPABILITIES;

  private isInitialized = false;

  // In-memory customer state isolated by storeId
  private currentCustomerByStore: Record<string, CustomerProfile | null> = {
    'store-haaply': {
      id: 'cust-haaply-001',
      storeId: 'store-haaply',
      name: 'Karthik',
      phone: '9843210980',
      email: 'karthik@haaply.com',
      defaultAddress: {
        storeId: 'store-haaply',
        recipientName: 'Karthik',
        phone: '9843210980',
        houseFlat: 'Flat 4B, Green Meadows',
        street: 'Avinashi Road',
        area: DEFAULT_DELIVERY_LOCATION.area,
        city: DEFAULT_DELIVERY_LOCATION.city,
        pincode: DEFAULT_DELIVERY_LOCATION.pincode,
        landmark: 'Near Lakshmi Mills Junction',
      },
    },
    'store-atelier': {
      id: 'cust-atelier-001',
      storeId: 'store-atelier',
      name: 'Ananya Sharma',
      phone: '9880123456',
      email: 'ananya@atelier-studio.com',
      defaultAddress: {
        storeId: 'store-atelier',
        recipientName: 'Ananya Sharma',
        phone: '9880123456',
        houseFlat: 'Penthouse 12, Sobha Primrose',
        street: 'Lavelle Road',
        area: 'Lavelle Road',
        city: 'Bangalore',
        pincode: '560001',
        landmark: 'Near Bangalore Club',
      },
    },
    'store-anyasoaps': {
      id: 'cust-anya-001',
      storeId: 'store-anyasoaps',
      name: 'Priya Sundaram',
      phone: '9840123456',
      email: 'priya@anyasoaps.com',
      defaultAddress: {
        storeId: 'store-anyasoaps',
        recipientName: 'Priya Sundaram',
        phone: '9840123456',
        houseFlat: 'No. 14, Lotus Villa',
        street: 'Avinashi Road',
        area: 'Peelamedu',
        city: 'Coimbatore',
        pincode: '641004',
        landmark: 'Near PSG College',
      },
    },
  };

  private addresses: CheckoutAddress[] = [];
  private orders: OrderPayload[] = [];
  private wishlistByStore: Record<string, Set<string>> = {
    'store-haaply': new Set(['prod-idli-batter', 'prod-fresh-paneer']),
    'store-atelier': new Set(['atelier-linen-overshirt', 'atelier-silk-shirt']),
    'store-anyasoaps': new Set(['anya-goat-milk-soap', 'anya-rose-shea-butter']),
  };

  constructor() {
    // Seed default addresses
    Object.values(this.currentCustomerByStore).forEach((cust) => {
      if (cust?.defaultAddress) {
        this.addresses.push(cust.defaultAddress);
      }
    });
  }

  isReady(): boolean {
    return true;
  }

  async initialize(): Promise<void> {
    this.isInitialized = true;
  }

  // --- Products & Catalog (Tenant Isolated) ---

  async getProducts(filters?: ProductFilterOptions): Promise<Product[]> {
    const targetStoreId = filters?.storeId || 'store-haaply';
    let result =
      targetStoreId === 'store-atelier'
        ? [...FASHION_PRODUCTS]
        : targetStoreId === 'store-anyasoaps'
        ? [...ANYA_PRODUCTS]
        : [...PRODUCTS];

    if (filters?.categorySlug) {
      result = result.filter((p) => p.categorySlug === filters.categorySlug);
    }

    if (filters?.isFreshToday) {
      result = result.filter((p) => p.isFreshToday);
    }

    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.tamilName && p.tamilName.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters?.offset) {
      result = result.slice(filters.offset);
    }

    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  async getProductById(id: string, storeId?: string): Promise<Product | null> {
    if (storeId === 'store-atelier') {
      return FASHION_PRODUCTS.find((p) => p.id === id) || null;
    }
    if (storeId === 'store-anyasoaps') {
      return ANYA_PRODUCTS.find((p) => p.id === id) || null;
    }
    if (storeId === 'store-haaply') {
      return PRODUCTS.find((p) => p.id === id) || null;
    }

    // Neutral fallback
    return (
      PRODUCTS.find((p) => p.id === id) ||
      FASHION_PRODUCTS.find((p) => p.id === id) ||
      ANYA_PRODUCTS.find((p) => p.id === id) ||
      null
    );
  }

  async getCategories(storeId?: string): Promise<Category[]> {
    if (storeId === 'store-atelier') {
      return [...FASHION_CATEGORIES];
    }
    if (storeId === 'store-anyasoaps') {
      return [...ANYA_CATEGORIES];
    }
    return [...CATEGORIES];
  }

  async getMealIntents(storeId?: string): Promise<MealIntent[]> {
    if (storeId === 'store-atelier' || storeId === 'store-anyasoaps') {
      return [];
    }
    return [...MEAL_INTENTS];
  }

  async getFeaturedProductIds(storeId?: string): Promise<{ freshPicks: string[]; favourites: string[] }> {
    if (storeId === 'store-atelier') {
      return {
        freshPicks: [...FASHION_NEW_ARRIVALS_IDS],
        favourites: [...FASHION_BESTSELLERS_IDS],
      };
    }
    if (storeId === 'store-anyasoaps') {
      return {
        freshPicks: [...ANYA_SIGNATURE_COLLECTION_IDS],
        favourites: [...ANYA_BESTSELLERS_IDS],
      };
    }
    return {
      freshPicks: [...TODAY_FRESH_PICKS_IDS],
      favourites: [...EVERYDAY_FAVOURITES_IDS],
    };
  }

  // --- Customer & Authentication (Tenant Isolated) ---

  async getCurrentCustomer(storeId?: string): Promise<CustomerProfile | null> {
    const sid = storeId || 'store-haaply';
    return this.currentCustomerByStore[sid] || null;
  }

  async loginWithPin(phone: string, pin: string, storeId?: string): Promise<CustomerProfile> {
    if (!phone || phone.length < 10) {
      throw new Error('Please provide a valid 10-digit mobile number');
    }
    if (!pin || pin.length < 4) {
      throw new Error('Please provide your 4-digit secret PIN');
    }

    const sid = storeId || 'store-haaply';
    const isAtelier = sid === 'store-atelier';
    const isAnya = sid === 'store-anyasoaps';

    const profile: CustomerProfile = {
      id: `cust-${sid}-${phone.slice(-4)}`,
      storeId: sid,
      name:
        phone === '9843210980'
          ? 'Karthik'
          : phone === '9880123456'
          ? 'Ananya Sharma'
          : phone === '9840123456'
          ? 'Priya Sundaram'
          : 'Valued Customer',
      phone,
      email: `${phone}@${isAtelier ? 'atelier-studio.com' : isAnya ? 'anyasoaps.com' : 'haaply.in'}`,
    };

    this.currentCustomerByStore[sid] = profile;
    return profile;
  }

  async logout(): Promise<void> {
    this.currentCustomerByStore = {
      'store-haaply': null,
      'store-atelier': null,
      'store-anyasoaps': null,
    };
  }

  // --- Addresses (Tenant Isolated) ---

  async getSavedAddresses(_customerId?: string, storeId?: string): Promise<CheckoutAddress[]> {
    const sid = storeId || 'store-haaply';
    return this.addresses.filter((a) => !a.storeId || a.storeId === sid);
  }

  async saveAddress(address: CheckoutAddress, _customerId?: string, storeId?: string): Promise<CheckoutAddress> {
    const sid = storeId || address.storeId || 'store-haaply';
    const scopedAddress: CheckoutAddress = { ...address, storeId: sid };

    const existingIndex = this.addresses.findIndex(
      (a) => a.phone === address.phone && a.houseFlat === address.houseFlat && a.storeId === sid
    );
    if (existingIndex >= 0) {
      this.addresses[existingIndex] = scopedAddress;
    } else {
      this.addresses.push(scopedAddress);
    }
    return scopedAddress;
  }

  // --- Orders & Fulfillment (Tenant Isolated) ---

  async getDeliverySlots(storeId?: string): Promise<DeliverySlot[]> {
    if (storeId === 'store-atelier') {
      return [
        {
          id: 'slot-express-courier',
          date: 'express',
          displayDate: 'Express Insured Delivery',
          startTime: '10:00',
          endTime: '18:00',
          displayTime: '2–3 Business Days',
          available: true,
          capacity: 50,
          note: 'Signature required upon delivery in archival packaging',
        },
        {
          id: 'slot-studio-pickup',
          date: 'pickup',
          displayDate: 'Lavelle Studio Concierge Pickup',
          startTime: '11:00',
          endTime: '19:00',
          displayTime: 'Tomorrow (11:00 AM – 7:00 PM)',
          available: true,
          capacity: 15,
          note: 'Ready for private fitting and inspection',
        },
      ];
    }

    return [
      {
        id: 'slot-today-evening',
        date: 'today',
        displayDate: 'Today',
        startTime: '17:30',
        endTime: '19:30',
        displayTime: '5:30 PM – 7:30 PM',
        available: true,
        capacity: 12,
        note: 'Fresh evening batch from 3 PM milling',
      },
      {
        id: 'slot-tomorrow-morning',
        date: 'tomorrow-morning',
        displayDate: 'Tomorrow Morning',
        startTime: '06:30',
        endTime: '08:30',
        displayTime: '6:30 AM – 8:30 AM',
        available: true,
        capacity: 25,
        note: 'Early morning breakfast dispatch',
      },
      {
        id: 'slot-tomorrow-evening',
        date: 'tomorrow-evening',
        displayDate: 'Tomorrow Evening',
        startTime: '17:30',
        endTime: '19:30',
        displayTime: '5:30 PM – 7:30 PM',
        available: true,
        capacity: 20,
        note: 'Fresh afternoon batch',
      },
    ];
  }

  async createOrder(order: OrderPayload): Promise<OrderResult> {
    const sid = order.storeId || 'store-haaply';
    const prefix = sid === 'store-atelier' ? 'ATL' : sid === 'store-anyasoaps' ? 'ANYA' : 'HP';
    const orderId = `${prefix}-${Date.now().toString().slice(-6)}`;
    const savedOrder: OrderPayload = {
      ...order,
      orderId,
      storeId: sid,
      orderStatus: 'pending',
      createdAt: order.createdAt || new Date().toISOString(),
    };

    this.orders.unshift(savedOrder);

    return {
      orderId,
      status: 'pending',
      message:
        sid === 'store-atelier'
          ? 'Order confirmed. Archival tailoring & insured courier dispatch in progress.'
          : sid === 'store-anyasoaps'
          ? 'Order received! Handcrafted botanical artisan batch preparing for dispatch.'
          : 'Order recorded in Haaply Cloud dispatch queue.',
    };
  }

  async getOrders(_customerId?: string, storeId?: string): Promise<OrderPayload[]> {
    if (storeId) {
      return this.orders.filter((o) => o.storeId === storeId);
    }
    return [...this.orders];
  }

  // --- Wishlist (Tenant Isolated) ---

  async getWishlist(_customerId?: string, storeId?: string): Promise<string[]> {
    const sid = storeId || 'store-haaply';
    if (!this.wishlistByStore[sid]) {
      this.wishlistByStore[sid] = new Set();
    }
    return Array.from(this.wishlistByStore[sid]);
  }

  async toggleWishlist(
    productId: string,
    _customerId?: string,
    storeId?: string
  ): Promise<{ productIds: string[]; isSaved: boolean }> {
    const sid = storeId || 'store-haaply';
    if (!this.wishlistByStore[sid]) {
      this.wishlistByStore[sid] = new Set();
    }
    const storeWishlist = this.wishlistByStore[sid];
    let isSaved = false;
    if (storeWishlist.has(productId)) {
      storeWishlist.delete(productId);
      isSaved = false;
    } else {
      storeWishlist.add(productId);
      isSaved = true;
    }
    return {
      productIds: Array.from(storeWishlist),
      isSaved,
    };
  }

  // --- Fulfillment & Location Operations (Tenant Isolated) ---

  async getFulfillmentLocations(activeOnly = true, storeId?: string): Promise<FulfillmentLocation[]> {
    const source =
      storeId === 'store-atelier'
        ? ATELIER_FULFILLMENT_LOCATIONS
        : storeId === 'store-anyasoaps'
        ? ANYA_FULFILLMENT_LOCATIONS
        : DEFAULT_FULFILLMENT_LOCATIONS;

    return activeOnly ? source.filter((l) => l.active) : [...source];
  }

  async getFulfillmentLocationById(id: string): Promise<FulfillmentLocation | null> {
    const allLocations = [
      ...DEFAULT_FULFILLMENT_LOCATIONS,
      ...ATELIER_FULFILLMENT_LOCATIONS,
      ...ANYA_FULFILLMENT_LOCATIONS,
    ];
    const loc = allLocations.find((l) => l.id === id);
    return loc || null;
  }

  async getInventoryRecord(
    variantId: string,
    locationId: string
  ): Promise<InventoryRecord | null> {
    return {
      variantId,
      locationId,
      quantity: 50,
      status: 'in_stock',
    };
  }

  // --- Site Configuration ---

  async getSiteConfig(storeId?: string): Promise<SiteConfig | null> {
    if (storeId === 'store-atelier') {
      return null;
    }
    return DEFAULT_SITE_CONFIG;
  }
}

// Default singleton instance of FirebaseDataProvider
export const firebaseDataProvider = new FirebaseDataProvider();
