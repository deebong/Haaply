import { DataProvider, ProductFilterOptions, OrderResult } from './dataProviderTypes';
import {
  Product,
  ProductVariant,
  Category,
  MealIntent,
  CheckoutAddress,
  DeliverySlot,
  OrderPayload,
  CustomerProfile,
  FulfillmentLocation,
  FulfillmentConfig,
  FulfillmentModel,
  InventoryRecord,
  DeliveryLocation,
} from '../../types';
import { getDataProvider } from './providerRegistry';
import { DEFAULT_SITE_CONFIG } from '../../config/siteConfig';
import {
  DEFAULT_FULFILLMENT_LOCATIONS,
  DEFAULT_FULFILLMENT_LOCATION_ID,
} from '../fulfillmentLocations';

/**
 * Product & Catalog Application Service
 */
export class ProductService {
  constructor(
    private provider: DataProvider,
    private storeId: string = 'store-haaply'
  ) {}

  async getProducts(filters?: ProductFilterOptions): Promise<Product[]> {
    return this.provider.getProducts({ storeId: this.storeId, ...filters });
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.provider.getProductById(id, this.storeId);
  }

  async getProductVariant(productId: string, variantId: string): Promise<ProductVariant | null> {
    const product = await this.provider.getProductById(productId, this.storeId);
    if (!product || !product.variants) return null;
    return product.variants.find((v) => v.id === variantId) || null;
  }

  async getCategories(): Promise<Category[]> {
    return this.provider.getCategories(this.storeId);
  }

  async getMealIntents(): Promise<MealIntent[]> {
    return this.provider.getMealIntents(this.storeId);
  }

  async getFeaturedProducts(): Promise<{ freshPicks: string[]; favourites: string[] }> {
    return this.provider.getFeaturedProductIds(this.storeId);
  }
}

/**
 * Customer & Authentication Application Service
 */
export class CustomerService {
  constructor(
    private provider: DataProvider,
    private storeId: string = 'store-haaply'
  ) {}

  async getCurrentCustomer(): Promise<CustomerProfile | null> {
    return this.provider.getCurrentCustomer(this.storeId);
  }

  async loginWithPin(phone: string, pin: string): Promise<CustomerProfile> {
    return this.provider.loginWithPin(phone, pin, this.storeId);
  }

  async logout(): Promise<void> {
    return this.provider.logout();
  }

  async getSavedAddresses(customerId?: string): Promise<CheckoutAddress[]> {
    return this.provider.getSavedAddresses(customerId, this.storeId);
  }

  async saveAddress(address: CheckoutAddress, customerId?: string): Promise<CheckoutAddress> {
    return this.provider.saveAddress(address, customerId, this.storeId);
  }
}

/**
 * Order & Fulfillment Application Service
 */
export class OrderService {
  constructor(
    private provider: DataProvider,
    private storeId: string = 'store-haaply'
  ) {}

  async getDeliverySlots(): Promise<DeliverySlot[]> {
    return this.provider.getDeliverySlots(this.storeId);
  }

  async createOrder(order: OrderPayload): Promise<OrderResult> {
    if (!order.storeId) {
      order.storeId = this.storeId;
    }
    return this.provider.createOrder(order);
  }

  async getOrders(customerId?: string): Promise<OrderPayload[]> {
    return this.provider.getOrders(customerId, this.storeId);
  }
}

/**
 * Wishlist Application Service
 */
export class WishlistService {
  constructor(
    private provider: DataProvider,
    private storeId: string = 'store-haaply'
  ) {}

  async getSavedItemIds(customerId?: string): Promise<string[]> {
    return this.provider.getWishlist(customerId, this.storeId);
  }

  async toggleWishlist(
    productId: string,
    customerId?: string
  ): Promise<{ productIds: string[]; isSaved: boolean }> {
    return this.provider.toggleWishlist(productId, customerId, this.storeId);
  }
}

/**
 * Criteria for resolving a fulfillment location
 */
export interface LocationResolutionCriteria {
  deliveryAddress?: CheckoutAddress | DeliveryLocation;
  pincode?: string;
  city?: string;
  area?: string;
}

/**
 * Fulfillment & Logistics Application Service
 *
 * Provides a clean abstraction boundary for single-store and multi-store
 * fulfillment models. Decouples UI components from location routing,
 * warehouse IDs, and service area rules.
 */
export class FulfillmentService {
  constructor(
    private provider: DataProvider,
    private config: FulfillmentConfig = DEFAULT_SITE_CONFIG.fulfillment,
    private storeId: string = 'store-haaply'
  ) {}

  /**
   * Returns the active fulfillment model ('single_store' | 'multi_store')
   */
  getFulfillmentModel(): FulfillmentModel {
    return this.config.fulfillmentModel;
  }

  /**
   * Returns the configured default fulfillment location ID
   */
  getDefaultLocationId(): string {
    return this.config.defaultFulfillmentLocationId || DEFAULT_FULFILLMENT_LOCATION_ID;
  }

  /**
   * Retrieves all fulfillment locations available in the system
   */
  async getLocations(activeOnly = true): Promise<FulfillmentLocation[]> {
    if (this.provider.getFulfillmentLocations) {
      return this.provider.getFulfillmentLocations(activeOnly, this.storeId);
    }
    const locations = DEFAULT_FULFILLMENT_LOCATIONS;
    return activeOnly ? locations.filter((loc) => loc.active) : locations;
  }

  /**
   * Retrieves a specific fulfillment location by its unique ID
   */
  async getLocationById(id: string): Promise<FulfillmentLocation | null> {
    if (this.provider.getFulfillmentLocationById) {
      return this.provider.getFulfillmentLocationById(id);
    }
    const locations = await this.getLocations(false);
    return locations.find((l) => l.id === id) || null;
  }

  /**
   * Resolves the appropriate fulfillment location based on configuration and criteria.
   *
   * In "single_store" mode:
   * Always resolves to the configured default fulfillment location.
   * There is no requirement for the customer to choose a store.
   *
   * In "multi_store" mode:
   * Resolves based on customer delivery location, service area pincodes, or city zones.
   * UI components invoke this service method rather than implementing inline routing logic.
   */
  async resolveFulfillmentLocation(
    criteria?: LocationResolutionCriteria
  ): Promise<FulfillmentLocation | null> {
    const model = this.getFulfillmentModel();

    if (model === 'single_store') {
      const defaultId = this.getDefaultLocationId();
      return this.getLocationById(defaultId);
    }

    // --- Multi-Store Resolution Boundary ---
    const locations = await this.getLocations(true);
    const targetPincode =
      criteria?.pincode || criteria?.deliveryAddress?.pincode;

    if (targetPincode) {
      const trimmed = targetPincode.trim();
      const matching = locations.find((loc) =>
        loc.serviceAreas.includes(trimmed)
      );
      if (matching) return matching;
    }

    const targetCity =
      criteria?.city || criteria?.deliveryAddress?.city;
    if (targetCity) {
      const cityLower = targetCity.trim().toLowerCase();
      const cityMatch = locations.find(
        (loc) => loc.address.city.toLowerCase() === cityLower
      );
      if (cityMatch) return cityMatch;
    }

    // Fallback to default location if outside mapped service areas
    return this.getLocationById(this.getDefaultLocationId());
  }

  /**
   * Retrieves or checks inventory record for a given product variant at a location.
   *
   * Follows the platform hierarchy:
   * Product -> ProductVariant -> InventoryRecord -> FulfillmentLocation
   */
  async getInventoryRecord(
    variantId: string,
    locationId?: string
  ): Promise<InventoryRecord | null> {
    const targetLocationId =
      locationId ||
      (await this.resolveFulfillmentLocation())?.id ||
      this.getDefaultLocationId();

    if (this.provider.getInventoryRecord) {
      return this.provider.getInventoryRecord(variantId, targetLocationId);
    }

    // Default neutral inventory status
    return {
      variantId,
      locationId: targetLocationId,
      quantity: 50,
      status: 'in_stock',
    };
  }
}

/**
 * Unified Application Data Service Layer
 * Sits between UI components and the active DataProvider.
 */
export class DataService {
  readonly products: ProductService;
  readonly customer: CustomerService;
  readonly orders: OrderService;
  readonly wishlist: WishlistService;
  readonly fulfillment: FulfillmentService;

  constructor(
    readonly provider: DataProvider,
    fulfillmentConfig: FulfillmentConfig = DEFAULT_SITE_CONFIG.fulfillment,
    readonly storeId: string = 'store-haaply'
  ) {
    this.products = new ProductService(provider, storeId);
    this.customer = new CustomerService(provider, storeId);
    this.orders = new OrderService(provider, storeId);
    this.wishlist = new WishlistService(provider, storeId);
    this.fulfillment = new FulfillmentService(provider, fulfillmentConfig, storeId);
  }
}

/**
 * Factory for creating a DataService with a given or default DataProvider
 */
export function createDataService(
  provider?: DataProvider,
  fulfillmentConfig?: FulfillmentConfig,
  storeId?: string
): DataService {
  const activeProvider = provider || getDataProvider();
  return new DataService(activeProvider, fulfillmentConfig, storeId);
}

// Default singleton data service backed by the active provider
export const defaultDataService = createDataService();
