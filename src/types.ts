export interface Product {
  id: string;
  name: string;
  tamilName: string;
  category: string;
  categorySlug: string;
  packSize: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  isFreshToday?: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount?: number;
  prepTime?: string;
  ingredients?: string[];
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
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
  quantity: number;
}

export interface CheckoutAddress {
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

export type PaymentMethodType = 'upi' | 'card_netbanking' | 'cod';

export interface PaymentMethodOption {
  id: PaymentMethodType;
  name: string;
  description: string;
  isAvailable: boolean;
  badge?: string;
}

export interface OrderPayload {
  orderId?: string;
  customerId?: string;
  recipientName: string;
  phone: string;
  items: {
    productId: string;
    productName: string;
    packSize: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  deliveryAddress: CheckoutAddress;
  deliverySlot: DeliverySlot;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'pending' | 'completed' | 'not_connected';
  orderStatus: 'draft' | 'pending' | 'confirmed';
  createdAt: string;
}
