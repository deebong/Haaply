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
