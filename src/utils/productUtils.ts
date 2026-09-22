import {
  Product,
  ProductVariant,
  GroceryProductAttributes,
  FashionProductAttributes,
} from '../types';

/**
 * Returns the primary display image for a product.
 * Compatible with both single-image legacy products and multi-image media arrays.
 */
export function getProductPrimaryImage(product: Product): string {
  if (product.image) return product.image;
  if (product.images && product.images.length > 0) return product.images[0];
  return '';
}

/**
 * Returns all media images for a product as a guaranteed array.
 * If product only has `image`, returns `[product.image]`.
 */
export function getProductImages(product: Product): string[] {
  if (product.images && product.images.length > 0) {
    return product.images;
  }
  return product.image ? [product.image] : [];
}

/**
 * Extracts grocery & food domain attributes cleanly from a product,
 * seamlessly reconciling explicit verticalAttributes with legacy direct fields.
 */
export function getGroceryAttributes(product: Product): GroceryProductAttributes {
  const directAttributes = product.verticalAttributes as GroceryProductAttributes | undefined;
  return {
    tamilName: directAttributes?.tamilName || product.tamilName,
    packSize: directAttributes?.packSize || product.packSize,
    prepTime: directAttributes?.prepTime || product.prepTime,
    ingredients: directAttributes?.ingredients || product.ingredients,
    nutritionInfo: directAttributes?.nutritionInfo,
    storageInstructions: directAttributes?.storageInstructions,
    shelfLife: directAttributes?.shelfLife,
    isFreshToday: directAttributes?.isFreshToday ?? product.isFreshToday,
    isOrganic: directAttributes?.isOrganic,
  };
}

/**
 * Extracts fashion & apparel domain attributes if present on the product.
 */
export function getFashionAttributes(product: Product): FashionProductAttributes | null {
  if (!product.verticalAttributes) return null;
  const attrs = product.verticalAttributes as FashionProductAttributes;
  if (attrs.sizes || attrs.colors || attrs.fabric || attrs.material || attrs.fit) {
    return attrs;
  }
  return null;
}

/**
 * Checks if a product has multiple customer-selectable variants.
 */
export function hasMultipleVariants(product: Product): boolean {
  return Boolean(product.variants && product.variants.length > 1);
}

/**
 * Returns the default variant of a product, or the first variant, or generates a safe fallback.
 */
export function getDefaultVariant(product: Product): ProductVariant {
  if (product.variants && product.variants.length > 0) {
    const defaultVariant = product.variants.find((v) => v.isDefault);
    if (defaultVariant) return defaultVariant;
    return product.variants[0];
  }

  return {
    id: `${product.id}-default`,
    productId: product.id,
    label: product.packSize,
    packSize: product.packSize,
    price: product.price,
    originalPrice: product.originalPrice,
    stockStatus: product.stockStatus,
    stockCount: product.stockCount,
    isDefault: true,
  };
}

/**
 * Calculates the lowest starting price among all variants of a product.
 */
export function getMinVariantPrice(product: Product): number {
  if (product.variants && product.variants.length > 0) {
    return Math.min(...product.variants.map((v) => v.price));
  }
  return product.price;
}

/**
 * Builds a standardized key for the cart map: `${productId}:${variantId}` or `${productId}`
 */
export function getCartKey(productId: string, variantId?: string): string {
  if (variantId && variantId !== productId) {
    return `${productId}:${variantId}`;
  }
  return productId;
}

/**
 * Parses a cart key into productId and optional variantId.
 */
export function parseCartKey(key: string): { productId: string; variantId?: string } {
  if (key.includes(':')) {
    const [productId, variantId] = key.split(':');
    return { productId, variantId };
  }
  return { productId: key };
}

/**
 * Gets the quantity in cart for a specific product and variant, checking:
 * 1. `${productId}:${variantId}`
 * 2. `${variantId}`
 * 3. `${productId}` (if default variant or single variant)
 */
export function getVariantQuantityInCart(
  cartMap: Record<string, number>,
  productId: string,
  variantId?: string,
  isDefault?: boolean
): number {
  if (variantId) {
    const compositeKey = `${productId}:${variantId}`;
    if (cartMap[compositeKey] !== undefined) {
      return cartMap[compositeKey];
    }
    if (cartMap[variantId] !== undefined) {
      return cartMap[variantId];
    }
    if (isDefault && cartMap[productId] !== undefined) {
      return cartMap[productId];
    }
    return 0;
  }
  return cartMap[productId] || 0;
}

/**
 * Calculates the total units of a product currently present in the cart across all its variants,
 * checking composite keys `${productId}:${variantId}`, standalone `${variantId}`, and legacy `${productId}`.
 */
export function getProductQuantityInCart(
  product: Product,
  cartMap: Record<string, number>
): number {
  let total = 0;
  const legacyCount = cartMap[product.id] || 0;
  let hasVariantMatch = false;

  // Check composite keys in cartMap (productId:variantId)
  for (const [key, qty] of Object.entries(cartMap)) {
    if (key.startsWith(`${product.id}:`)) {
      total += qty;
      hasVariantMatch = true;
    }
  }

  // Check standalone variant IDs if any
  if (product.variants && product.variants.length > 0) {
    for (const v of product.variants) {
      if (cartMap[v.id]) {
        total += cartMap[v.id];
        hasVariantMatch = true;
      }
    }
  }

  if (hasVariantMatch) {
    return total;
  }

  return legacyCount;
}

