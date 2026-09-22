// --- Store Vertical & Capability Architecture ---

export type StoreVertical = 'grocery' | 'fashion' | 'electronics' | 'beauty' | (string & {});

/**
 * Grocery & Fresh Food Vertical Attributes
 */
export interface GroceryProductAttributes {
  tamilName?: string;
  packSize?: string;
  prepTime?: string;
  ingredients?: string[];
  nutritionInfo?: {
    calories?: string;
    protein?: string;
    carbohydrates?: string;
    fat?: string;
    fiber?: string;
    servingSize?: string;
  };
  storageInstructions?: string;
  shelfLife?: string;
  isFreshToday?: boolean;
  isOrganic?: boolean;
}

/**
 * Fashion & Apparel Vertical Attributes
 */
export interface FashionProductAttributes {
  sizes?: string[];
  colors?: string[];
  material?: string;
  fabric?: string;
  fit?: string;
  careInstructions?: string[];
  gender?: 'men' | 'women' | 'unisex' | 'kids';
  season?: string;
  modelInfo?: string;
}

/**
 * Extensible union for vertical-specific attributes
 */
export type VerticalAttributes =
  | GroceryProductAttributes
  | FashionProductAttributes
  | Record<string, unknown>;

export interface ProductVariant {
  id: string;
  productId: string;
  label: string; // Generic display label: e.g. "500g", "Small", "Navy / L"
  packSize?: string; // Grocery convenience & backwards compatibility
  price: number;
  originalPrice?: number;
  sku?: string;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount?: number;
  isDefault?: boolean;
  options?: Record<string, string>; // Multi-axis variant options: { size: 'M', color: 'Navy' }
  image?: string; // Optional variant-specific image
}

export interface Product {
  id: string;
  name: string;
  tamilName?: string;
  category: string;
  categorySlug: string;
  packSize: string;
  price: number;
  originalPrice?: number;
  image: string; // Primary image
  images?: string[]; // Multi-image gallery architecture
  description: string;
  isFreshToday?: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount?: number;
  prepTime?: string;
  ingredients?: string[];
  tags?: string[];
  variants: ProductVariant[];

  // Extensible Vertical Attributes Architecture
  verticalAttributes?: VerticalAttributes;
  options?: Record<string, string[]>; // Available option values: { color: ['Ecru', 'Charcoal'], size: ['S', 'M'] }
}

export interface Category {
  id: string;
  name: string;
  tamilName?: string;
  slug: string;
  tagline: string;
  image: string;
  itemCount: number;
}

export interface MealIntent {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  image: string;
  prepTime: string;
  featuredProductIds: string[];
}

export interface DeliveryLocation {
  area: string;
  city: string;
  pincode: string;
  landmark?: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

// --- Single / Multi Store Fulfillment & Inventory Architecture ---

export type FulfillmentLocationType =
  | 'warehouse'
  | 'store'
  | 'store_outlet'
  | 'dark_store'
  | 'production_unit';

export interface FulfillmentLocation {
  id: string;
  storeId?: string;
  name: string;
  type: FulfillmentLocationType;
  address: {
    street: string;
    area: string;
    city: string;
    pincode: string;
    state?: string;
  };
  serviceAreas: string[]; // Pincodes or area zones serviced
  operatingHours: {
    openTime: string;
    closeTime: string;
  };
  active: boolean;
}

export type FulfillmentModel = 'single_store' | 'multi_store';

export interface FulfillmentConfig {
  fulfillmentModel: FulfillmentModel;
  defaultFulfillmentLocationId: string;
}

export interface InventoryRecord {
  variantId: string;
  locationId: string;
  quantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  updatedAt?: string;
}

// --- Payment Architecture Readiness (Part 11) ---

export type PaymentProviderId =
  | 'phonepe'
  | 'cod'
  | 'razorpay'
  | 'upi'
  | 'cards_netbanking'
  | 'future_provider';

export type PaymentMethodType = 'upi' | 'card_netbanking' | 'cod' | 'phonepe';

export interface PaymentProviderConfig {
  id: PaymentProviderId;
  name: string;
  supportedMethods: PaymentMethodType[];
  isActive: boolean;
  isTestMode?: boolean;
}

export interface PaymentMethodOption {
  id: PaymentMethodType;
  name: string;
  description: string;
  isAvailable: boolean;
  badge?: string;
}

// --- Promotion / Coupon Readiness (Part 12) ---

export type PromotionDiscountType = 'percentage' | 'fixed_amount';

export interface Promotion {
  id: string;
  storeId?: string;
  code: string;
  title: string;
  type: PromotionDiscountType;
  value: number;
  startDate: string;
  endDate: string;
  minimumOrderValue?: number;
  customerRestrictions?: {
    isNewCustomerOnly?: boolean;
    allowedCustomerIds?: string[];
  };
  productRestrictions?: {
    allowedCategorySlugs?: string[];
    allowedProductIds?: string[];
    allowedVariantIds?: string[];
  };
  usageLimit?: number;
  timesUsed?: number;
  active: boolean;
}

// --- Delivery & Driver Architecture Readiness (Part 13) ---

export type DriverDeliveryStatus =
  | 'unassigned'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery';

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  vehicleType?: string;
  assignedLocationId?: string;
  active: boolean;
}

// --- Checkout & Orders ---

export interface CheckoutAddress {
  storeId?: string;
  recipientName: string;
  phone: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  pincode: string;
  landmark?: string;
  deliveryInstructions?: string;
}

export interface DeliverySlot {
  id: string;
  date: string;
  displayDate: string;
  startTime: string;
  endTime: string;
  displayTime: string;
  available: boolean;
  capacity?: number;
  note?: string;
}

export interface OrderLineItem {
  productId: string;
  variantId: string;
  productName: string;
  packSize: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderPayload {
  orderId?: string;
  storeId?: string;
  customerId?: string;
  recipientName: string;
  phone: string;
  items: OrderLineItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount?: number;
  appliedPromotionCode?: string;
  grandTotal: number;
  deliveryAddress: CheckoutAddress;
  deliverySlot: DeliverySlot;
  // Multi-location readiness
  fulfillmentLocationId?: string;
  // Driver readiness
  driverId?: string;
  deliveryStatus?: DriverDeliveryStatus;
  assignedAt?: string;
  deliveredAt?: string;
  // Payment readiness
  paymentProvider?: PaymentProviderId;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'pending' | 'completed' | 'not_connected' | 'failed';
  transactionReference?: string;
  orderStatus: 'draft' | 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  storeId?: string;
  name: string;
  phone: string;
  email?: string;
  defaultAddress?: CheckoutAddress;
}

export type { StoreInstance } from './config/storeInstance';

