import {
  DataProvider,
  ProductFilterOptions,
  ProviderCapabilities,
  OrderResult,
  ProviderDescriptor,
} from './dataProviderTypes';
import {
  Product,
  Category,
  MealIntent,
  CheckoutAddress,
  DeliverySlot,
  OrderPayload,
  CustomerProfile,
} from '../../types';

/**
 * Google Sheets Provider Capabilities
 * 
 * Notice that Google Sheets has fundamentally different capabilities compared
 * to Firebase or relational databases:
 * - No native real-time websocket subscriptions
 * - No multi-sheet ACID transactions
 * - No native customer identity/auth subsystem
 * - High suitability for catalog spreadsheets, batch exports, and inventory sync
 */
export const GOOGLE_SHEETS_CAPABILITIES: ProviderCapabilities = {
  realtime: false,
  transactions: false,
  serverFiltering: false,
  advancedQueries: false,
  bulkOperations: true,
  offlineSupport: false,
  authSupported: false,
};

/**
 * Configuration options required for a secure Google Sheets provider.
 * 
 * SECURITY MANDATE:
 * Service account JSON credentials or Google Cloud private keys MUST NEVER be placed
 * in client-side React code or browser bundles.
 * 
 * Access to Google Sheets must always flow through an authorized proxy endpoint:
 *   Browser / Storefront
 *          ↓
 *   GoogleSheetsDataProvider (Client adapter)
 *          ↓
 *   Secure Proxy (e.g., Cloud Function, Next.js /api route, or Google Apps Script Web App)
 *          ↓
 *   Google Sheets API (v4) / Google Drive
 */
export interface GoogleSheetsConfig {
  /** Secure backend proxy or Apps Script URL (never raw Google credentials) */
  proxyEndpointUrl?: string;
  /** Spreadsheet ID */
  spreadsheetId?: string;
  /** Cache time-to-live in seconds to prevent hitting Google API rate limits */
  cacheTtlSeconds?: number;
  /** Read-only mode flag */
  readOnly?: boolean;
}

export const GOOGLE_SHEETS_DESCRIPTOR: ProviderDescriptor = {
  id: 'google-sheets',
  name: 'Google Sheets (Secure Proxy)',
  description: 'Spreadsheet-backed catalog and order intake via secure Apps Script or Cloud Function proxy.',
  capabilities: GOOGLE_SHEETS_CAPABILITIES,
  status: 'planned',
  requiresBackendProxy: true,
};

/**
 * GoogleSheetsDataProvider (Architectural Shell)
 * 
 * This class establishes the contract and integration points for a future
 * Google Sheets backend. Per project instructions, it does NOT contain fake
 * mocked connections or simulated network delays. It throws descriptive
 * configuration errors if invoked without an authorized proxy endpoint.
 */
export class GoogleSheetsDataProvider implements DataProvider {
  readonly id = 'google-sheets';
  readonly name = 'Google Sheets (Secure Proxy)';
  readonly capabilities = GOOGLE_SHEETS_CAPABILITIES;

  private config: GoogleSheetsConfig;

  constructor(config: GoogleSheetsConfig = {}) {
    this.config = config;
  }

  isReady(): boolean {
    // Only ready if a valid secure proxy endpoint has been provisioned
    return Boolean(this.config.proxyEndpointUrl && this.config.spreadsheetId);
  }

  private ensureConnected(): void {
    if (!this.isReady()) {
      throw new Error(
        '[GoogleSheetsDataProvider] Not connected. Google Sheets requires a secure serverless or Apps Script proxy endpoint. Direct client-side Google API credentials are not permitted for security.'
      );
    }
  }

  async getProducts(_filters?: ProductFilterOptions): Promise<Product[]> {
    this.ensureConnected();
    return [];
  }

  async getProductById(_id: string): Promise<Product | null> {
    this.ensureConnected();
    return null;
  }

  async getCategories(): Promise<Category[]> {
    this.ensureConnected();
    return [];
  }

  async getMealIntents(): Promise<MealIntent[]> {
    this.ensureConnected();
    return [];
  }

  async getFeaturedProductIds(): Promise<{ freshPicks: string[]; favourites: string[] }> {
    this.ensureConnected();
    return { freshPicks: [], favourites: [] };
  }

  async getCurrentCustomer(): Promise<CustomerProfile | null> {
    // Google Sheets does not provide native customer authentication
    return null;
  }

  async loginWithPin(_phone: string, _pin: string): Promise<CustomerProfile> {
    throw new Error(
      '[GoogleSheetsDataProvider] Native customer authentication is not supported by Google Sheets. Please combine with an external Auth provider or session service.'
    );
  }

  async logout(): Promise<void> {
    // No-op for Sheets
  }

  async getSavedAddresses(_customerId?: string): Promise<CheckoutAddress[]> {
    this.ensureConnected();
    return [];
  }

  async saveAddress(address: CheckoutAddress, _customerId?: string): Promise<CheckoutAddress> {
    this.ensureConnected();
    return address;
  }

  async getDeliverySlots(): Promise<DeliverySlot[]> {
    this.ensureConnected();
    return [];
  }

  async createOrder(_order: OrderPayload): Promise<OrderResult> {
    this.ensureConnected();
    throw new Error('[GoogleSheetsDataProvider] Order submission requires active proxy connection.');
  }

  async getOrders(_customerId?: string): Promise<OrderPayload[]> {
    this.ensureConnected();
    return [];
  }

  async getWishlist(_customerId?: string): Promise<string[]> {
    return [];
  }

  async toggleWishlist(
    _productId: string,
    _customerId?: string
  ): Promise<{ productIds: string[]; isSaved: boolean }> {
    return { productIds: [], isSaved: false };
  }
}
