import { StoreVertical } from '../types';

/**
 * Vertical Capabilities Architecture
 * Defines what kind of ecommerce data, product models, media, and domain UX
 * a particular business vertical natively requires.
 *
 * NOTE: This is distinct from FeatureFlags ('Is this toggle enabled for this store?').
 * VerticalCapabilities defines intrinsic domain capabilities of the vertical.
 */
export interface VerticalCapabilities {
  // Variant Models
  supportsWeightVariants: boolean;
  supportsSizeVariants: boolean;
  supportsColorVariants: boolean;
  supportsMultiAxisVariants: boolean;

  // Media Architecture
  supportsMultipleImages: boolean;
  supportsProductGallery: boolean;

  // Food / Grocery Domain Capabilities
  supportsNutrition: boolean;
  supportsIngredients: boolean;
  supportsFreshnessInfo: boolean;
  supportsStorageInstructions: boolean;
  supportsRecipes: boolean;
  supportsDeliverySlots: boolean;

  // Fashion / Apparel Domain Capabilities
  supportsClothingAttributes: boolean; // fabric, material, fit, care instructions
  supportsSizeChart: boolean;
}

export interface VerticalDefinition {
  id: StoreVertical;
  name: string;
  description: string;
  capabilities: VerticalCapabilities;
  defaultVariantOptionLabel: string; // e.g. "Pack Size" for grocery, "Size" for fashion
  unitOfMeasureType: 'weight_volume' | 'apparel_sizing' | 'dimensions' | 'unit_count';
}

/**
 * Grocery & Fresh Food Vertical Definition
 */
export const GROCERY_VERTICAL: VerticalDefinition = {
  id: 'grocery',
  name: 'Grocery & Fresh Food',
  description: 'Fresh perishables, stone-ground batters, pantry staples and daily essentials',
  defaultVariantOptionLabel: 'Pack Size',
  unitOfMeasureType: 'weight_volume',
  capabilities: {
    supportsWeightVariants: true,
    supportsSizeVariants: false,
    supportsColorVariants: false,
    supportsMultiAxisVariants: false,
    supportsMultipleImages: true,
    supportsProductGallery: false,
    supportsNutrition: true,
    supportsIngredients: true,
    supportsFreshnessInfo: true,
    supportsStorageInstructions: true,
    supportsRecipes: true,
    supportsDeliverySlots: true,
    supportsClothingAttributes: false,
    supportsSizeChart: false,
  },
};

/**
 * Fashion & Apparel Vertical Definition
 */
export const FASHION_VERTICAL: VerticalDefinition = {
  id: 'fashion',
  name: 'Fashion & Apparel',
  description: 'Clothing, footwear, textiles, apparel accessories and seasonal fashion',
  defaultVariantOptionLabel: 'Size',
  unitOfMeasureType: 'apparel_sizing',
  capabilities: {
    supportsWeightVariants: false,
    supportsSizeVariants: true,
    supportsColorVariants: true,
    supportsMultiAxisVariants: true,
    supportsMultipleImages: true,
    supportsProductGallery: true,
    supportsNutrition: false,
    supportsIngredients: false,
    supportsFreshnessInfo: false,
    supportsStorageInstructions: false,
    supportsRecipes: false,
    supportsDeliverySlots: false,
    supportsClothingAttributes: true,
    supportsSizeChart: true,
  },
};

/**
 * Centralized Store Vertical Registry
 */
export const VERTICAL_REGISTRY: Record<string, VerticalDefinition> = {
  grocery: GROCERY_VERTICAL,
  fashion: FASHION_VERTICAL,
};

/**
 * Retrieves the vertical definition for a given vertical ID, falling back to grocery.
 */
export function getVerticalDefinition(vertical: StoreVertical): VerticalDefinition {
  return VERTICAL_REGISTRY[vertical] || GROCERY_VERTICAL;
}

/**
 * Retrieves the capability profile for a given vertical ID.
 */
export function getVerticalCapabilities(vertical: StoreVertical): VerticalCapabilities {
  return getVerticalDefinition(vertical).capabilities;
}

/**
 * Convenience helper to query if a vertical supports a specific domain capability.
 */
export function isCapabilitySupported(
  vertical: StoreVertical,
  capability: keyof VerticalCapabilities
): boolean {
  return Boolean(getVerticalCapabilities(vertical)[capability]);
}
