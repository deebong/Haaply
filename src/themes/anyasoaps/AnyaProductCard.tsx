import React from 'react';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { AnyaButton } from './AnyaButton';

interface AnyaProductCardProps {
  product: Product;
  quantityInCart?: number;
  isWishlisted: boolean;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onUpdateQuantity?: (product: Product, newQuantity: number, variant?: ProductVariant) => void;
  onToggleWishlist: () => void;
  onProductClick?: () => void;
}

export const AnyaProductCard: React.FC<AnyaProductCardProps> = ({
  product,
  quantityInCart = 0,
  isWishlisted,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onProductClick,
}) => {
  const isAdded = quantityInCart > 0;
  const beautyAttrs = product.verticalAttributes as Record<string, any> | undefined;
  const defaultVariant = product.variants?.[0];

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    onProductClick?.();
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-[16px] border border-[#E7C8CF] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
    >
      {/* 1. MEDIA CONTAINER */}
      <div className="relative aspect-4/3 w-full bg-[#FFF4F6] overflow-hidden border-b border-[#E7C8CF]/50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-bold tracking-wider uppercase bg-[#FDECEF] text-[#8E3B4E] border border-[#E7C8CF] shadow-2xs">
              Save ₹{product.originalPrice - product.price}
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-1 rounded-[8px] text-[11px] font-medium bg-white/95 backdrop-blur-xs text-[#2F2326] border border-[#E7C8CF]/80 shadow-2xs">
            {product.packSize || '100g Bar'} • 4-Wk Cure
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-[10px] border border-[#E7C8CF]/80 backdrop-blur-xs transition-all flex items-center justify-center z-10 shadow-2xs ${
            isWishlisted
              ? 'bg-[#FDECEF] text-[#C95252] border-[#E7C8CF]'
              : 'bg-white/90 text-[#2F2326] hover:bg-white hover:text-[#8FA08C] hover:border-[#8FA08C]'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current text-[#C95252]' : ''}`} />
        </button>
      </div>

      {/* 2. BODY CONTENT */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8FA08C]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#8E7A7E]">
              <Star className="w-3 h-3 fill-[#E09A55] text-[#E09A55]" />
              <span className="font-semibold text-[#2F2326]">5.0</span>
            </div>
          </div>

          {/* Product Label */}
          <h3
            className="text-base sm:text-lg font-semibold text-[#2F2326] group-hover:text-[#8FA08C] transition-colors leading-snug"
            style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#6F5B60] mt-1.5 line-clamp-2 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Key Botanicals Highlight Chips */}
          {beautyAttrs?.ingredients && beautyAttrs.ingredients.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {(beautyAttrs.ingredients as string[]).slice(0, 2).map((ing) => (
                <span
                  key={ing}
                  className="inline-block text-[10px] px-2 py-0.5 rounded-[6px] bg-[#FFF8FA] text-[#4A3B3E] border border-[#E7C8CF]/70 font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. PRICE & ADD TO CART ACTION */}
        <div className="mt-4 pt-3.5 border-t border-[#E7C8CF]/60 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-[#2F2326] font-['Urbanist',sans-serif]">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#8E7A7E] line-through font-['Urbanist',sans-serif]">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#8E7A7E]">Cold saponified</span>
          </div>

          {/* Action Control */}
          {isAdded ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-[#FFF8FA] border border-[#E7C8CF] rounded-[10px] p-0.5 shadow-2xs"
            >
              <button
                type="button"
                onClick={() => {
                  if (onUpdateQuantity) {
                    onUpdateQuantity(product, quantityInCart - 1, defaultVariant);
                  }
                }}
                className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-white text-[#2F2326] transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold text-[#2F2326]">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (onUpdateQuantity) {
                    onUpdateQuantity(product, quantityInCart + 1, defaultVariant);
                  } else {
                    onAddToCart(product, defaultVariant);
                  }
                }}
                className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-white text-[#2F2326] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <AnyaButton
              variant="compact"
              size="sm"
              icon={<Plus className="w-3 h-3" />}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, defaultVariant);
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </AnyaButton>
          )}
        </div>
      </div>
    </article>
  );
};
