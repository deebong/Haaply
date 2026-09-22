import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { getDefaultVariant } from '../../utils/productUtils';

export interface AtelierProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, variant?: ProductVariant) => void;
  onUpdateQuantity?: (productId: string, quantity: number, variantId?: string) => void;
  currentQuantity?: number;
  onProductClick?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export const AtelierProductCard: React.FC<AtelierProductCardProps> = ({
  product,
  onAddToCart,
  onProductClick,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(() => {
    return getDefaultVariant(product);
  });
  const [justAdded, setJustAdded] = useState(false);

  // Secondary gallery image on hover if available
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const secondaryImage = product.images && product.images.length > 1 ? product.images[1] : primaryImage;

  const currentPrice = selectedVariant?.price ?? product.price;
  const originalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, selectedVariant);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };

  // Derive available sizes or colors if variants exist
  const sizes = React.useMemo<string[]>(() => {
    const fAttr = product.verticalAttributes as { sizes?: string[] } | undefined;
    if (fAttr?.sizes && Array.isArray(fAttr.sizes)) {
      return fAttr.sizes;
    }
    if (product.variants && product.variants.length > 0) {
      const extracted = new Set<string>();
      product.variants.forEach((v) => {
        if (v.options?.size) extracted.add(v.options.size);
      });
      if (extracted.size > 0) return Array.from(extracted);
    }
    return [];
  }, [product]);

  return (
    <div
      className="group relative flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* 1. IMAGE CONTAINER (3:4 Portrait Ratio with Restrained Framing) */}
      <div className="relative w-full aspect-[3/4] bg-[#F2F1ED] overflow-hidden">
        {/* Primary and secondary hover image */}
        <img
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-103"
          loading="lazy"
        />

        {/* Wishlist Button (Minimalist Floating Icon) */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-xs flex items-center justify-center text-[#181818] transition-all duration-200 shadow-xs focus:outline-none"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 stroke-[1.5] transition-colors ${
              isWishlisted ? 'fill-[#141414] text-[#141414]' : 'text-[#181818] hover:text-[#8C7355]'
            }`}
          />
        </button>

        {/* Editorial Pill (e.g. Discount or Tag) */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-[#141414] text-[#FBFBF9] text-[10px] tracking-widest uppercase font-medium px-2 py-0.5">
            -{discountPercent}%
          </div>
        )}

        {/* Quick Add / Select Size Slide-up Bar on Desktop Hover */}
        <div
          className={`absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm p-3 border-t border-[#E8E6E1] transition-all duration-300 transform ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          } hidden sm:flex items-center justify-between`}
        >
          <button
            type="button"
            onClick={handleAddClick}
            className="w-full py-2 bg-[#141414] text-[#FBFBF9] hover:bg-[#2E2E2E] text-[11px] tracking-[0.2em] uppercase font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. PRODUCT DETAILS & HIERARCHY */}
      <div className="pt-3 pb-2 flex flex-col flex-grow">
        {/* Category / Department */}
        <span className="text-[11px] tracking-[0.15em] uppercase text-[#767676] font-medium">
          {product.category}
        </span>

        {/* Product Title */}
        <h3 className="mt-1 text-sm sm:text-[15px] font-normal text-[#181818] leading-snug line-clamp-1 group-hover:text-[#8C7355] transition-colors">
          {product.name}
        </h3>

        {/* Available Sizes preview */}
        {sizes.length > 0 && (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-[#767676] tracking-wider uppercase font-light">
            <span>Sizes:</span>
            <span>{sizes.join(' · ')}</span>
          </div>
        )}

        {/* Pricing */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-medium text-[#181818] tracking-tight">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[#767676] line-through font-light">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <button
          type="button"
          onClick={handleAddClick}
          className="mt-2.5 sm:hidden w-full py-2 bg-[#141414] text-[#FBFBF9] text-[10px] tracking-[0.15em] uppercase font-medium flex items-center justify-center gap-1"
        >
          {justAdded ? 'Added' : 'Add to Bag'}
        </button>
      </div>
    </div>
  );
};
