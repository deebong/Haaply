import React from 'react';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { AnyaButton } from './AnyaButton';
import { getAnyaClippedPolygon } from './AnyaCard';
import { AnyaBadge } from './AnyaBadge';

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

  const cut = 14;
  const outerPolygon = getAnyaClippedPolygon(cut);
  const innerPolygon = getAnyaClippedPolygon(cut - 1);

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-[0_4px_16px_rgba(47,35,38,0.04)] hover:shadow-[0_12px_30px_rgba(47,35,38,0.09)]"
      style={{ clipPath: outerPolygon }}
    >
      {/* Outer border layer */}
      <div
        className="absolute inset-0 bg-[#E7C8CF] group-hover:bg-[#C97C89] transition-colors pointer-events-none"
        style={{ clipPath: outerPolygon }}
      />

      {/* Inner card surface */}
      <div
        className="absolute inset-[1px] bg-white transition-colors pointer-events-none"
        style={{ clipPath: innerPolygon }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col flex-1 h-full">
        {/* 1. MEDIA CONTAINER */}
        <div className="relative aspect-4/3 w-full bg-[#FFF4F6] overflow-hidden border-b border-[#E7C8CF]/70">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            {product.originalPrice && product.originalPrice > product.price && (
              <AnyaBadge variant="blush" size="xs" shape="rounded">
                Save ₹{product.originalPrice - product.price}
              </AnyaBadge>
            )}
            <AnyaBadge variant="surface" size="xs" shape="rounded" className="text-[#2F2326]">
              {product.packSize || '100g Bar'} • 4-Wk Cure
            </AnyaBadge>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 backdrop-blur-xs transition-all flex items-center justify-center z-10 shadow-2xs cursor-pointer ${
              isWishlisted
                ? 'bg-[#FFF4F6] text-[#C97C89] border border-[#C97C89]'
                : 'bg-white/95 text-[#2F2326] border border-[#E7C8CF] hover:text-[#C97C89] hover:border-[#C97C89]'
            }`}
            style={{ clipPath: getAnyaClippedPolygon(6) }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 stroke-[1.5] ${isWishlisted ? 'fill-[#C97C89] text-[#C97C89]' : ''}`} />
          </button>
        </div>

        {/* 2. BODY CONTENT */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#C97C89]">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-[#8E7A7E]">
                <Star className="w-3 h-3 fill-[#E09A55] text-[#E09A55]" />
                <span className="font-semibold text-[#2F2326]">5.0</span>
              </div>
            </div>

            {/* Product Label */}
            <h3
              className="text-base sm:text-lg font-semibold text-[#2F2326] group-hover:text-[#C97C89] transition-colors leading-snug"
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
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(beautyAttrs.ingredients as string[]).slice(0, 2).map((ing) => (
                  <AnyaBadge
                    key={ing}
                    variant="cream"
                    size="xs"
                    shape="rounded"
                    className="normal-case font-medium text-[#2F2326]"
                  >
                    {ing}
                  </AnyaBadge>
                ))}
              </div>
            )}
          </div>

          {/* 3. PRICE & ADD TO CART ACTION */}
          <div className="mt-4 pt-3.5 border-t border-[#E7C8CF]/70 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-bold text-[#2F2326]">
                  ₹{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-[#8E7A7E] line-through">
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
                className="flex items-center bg-[#FFF8FA] border border-[#E7C8CF] p-0.5 shadow-2xs"
                style={{ clipPath: getAnyaClippedPolygon(6) }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateQuantity) {
                      onUpdateQuantity(product, quantityInCart - 1, defaultVariant);
                    }
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-[6px] hover:bg-white text-[#2F2326] hover:text-[#C97C89] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
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
                  className="w-7 h-7 flex items-center justify-center rounded-[6px] hover:bg-white text-[#2F2326] hover:text-[#C97C89] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
              </div>
            ) : (
              <AnyaButton
                variant="compact"
                size="sm"
                icon={<Plus className="w-3 h-3 stroke-[2]" />}
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
      </div>
    </article>
  );
};
