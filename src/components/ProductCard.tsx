import React, { useState, useMemo } from 'react';
import { Heart, Plus, Minus, Bell } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import {
  hasMultipleVariants,
  getDefaultVariant,
  getVariantQuantityInCart,
} from '../utils/productUtils';
import { useTheme } from '../providers/ThemeProvider';
import { AtelierProductCard } from '../themes/fashion/AtelierProductCard';

interface ProductCardProps {
  product: Product;
  quantityInCart?: number;
  cartMap?: Record<string, number>;
  isWishlisted: boolean;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onUpdateQuantity: (product: Product, newQuantity: number, variant?: ProductVariant) => void;
  onToggleWishlist: (product: Product) => void;
  onNotifyMe?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart = 0,
  cartMap,
  isWishlisted,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onNotifyMe,
  onProductClick,
}) => {
  const { theme } = useTheme();

  // If active theme uses editorial fashion cards, render the specialized Atelier card
  if (theme.id === 'atelier' || theme.capabilities?.productCardStyle === 'editorial-portrait') {
    return (
      <AtelierProductCard
        product={product}
        isWishlisted={isWishlisted}
        onAddToCart={(prod, v) => onAddToCart(prod, v)}
        onUpdateQuantity={(prodId, qty, vId) => {
          const v = product.variants?.find((item) => item.id === vId);
          onUpdateQuantity(product, qty, v);
        }}
        onToggleWishlist={() => onToggleWishlist(product)}
        onProductClick={() => onProductClick?.(product)}
        currentQuantity={quantityInCart}
      />
    );
  }

  const isMultiVariant = hasMultipleVariants(product);
  const defaultVar = useMemo(() => getDefaultVariant(product), [product]);

  // Default selection: use product's isDefault variant if one exists, otherwise first variant
  const initialVariantId = useMemo(() => {
    if (isMultiVariant && product.variants && product.variants.length > 0) {
      const def = product.variants.find((v) => v.isDefault);
      return def ? def.id : product.variants[0].id;
    }
    return defaultVar.id;
  }, [isMultiVariant, product.variants, defaultVar.id]);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(initialVariantId);

  // Active variant resolution
  const activeVariant = useMemo(() => {
    if (isMultiVariant && product.variants && product.variants.length > 0) {
      return product.variants.find((v) => v.id === selectedVariantId) || defaultVar;
    }
    return defaultVar;
  }, [isMultiVariant, product.variants, selectedVariantId, defaultVar]);

  // Stock status checks
  const isProductOutOfStock = product.stockStatus === 'out_of_stock';
  const isLowStock = product.stockStatus === 'low_stock';
  const isCurrentVariantOutOfStock = isMultiVariant
    ? (activeVariant.stockStatus === 'out_of_stock' || isProductOutOfStock)
    : isProductOutOfStock;

  // Selected variant cart quantity
  const currentVariantQuantity = useMemo(() => {
    if (cartMap) {
      return getVariantQuantityInCart(
        cartMap,
        product.id,
        isMultiVariant ? activeVariant.id : defaultVar.id,
        isMultiVariant ? activeVariant.isDefault : true
      );
    }
    return quantityInCart;
  }, [cartMap, product.id, isMultiVariant, activeVariant, defaultVar, quantityInCart]);

  const isCurrentVariantAdded = currentVariantQuantity > 0;
  const currentStockLimit = isMultiVariant
    ? (activeVariant.stockCount ?? product.stockCount)
    : product.stockCount;

  // Active pricing display
  const currentPrice = isMultiVariant ? activeVariant.price : product.price;
  const currentOriginalPrice = isMultiVariant ? activeVariant.originalPrice : product.originalPrice;

  return (
    <article
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between w-full bg-white rounded-[16px] border border-[#E7E7DF] p-2.5 sm:p-3 hover:border-[#37B4A1]/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-200"
    >
      {/* TOP: Image Area (Responsive tall) + Wishlist Heart + Fresh Label */}
      <div>
        <div
          onClick={() => onProductClick && onProductClick(product)}
          className={`relative w-full h-[135px] xs:h-[155px] sm:h-[175px] md:h-[180px] rounded-[12px] overflow-hidden bg-[#F2F3ED] ${
            onProductClick ? 'cursor-pointer' : ''
          }`}
        >
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
              isProductOutOfStock ? 'opacity-55 grayscale' : ''
            }`}
            loading="lazy"
          />

          {/* STATE 6: Fresh Today Small Label */}
          {product.isFreshToday && !isProductOutOfStock && (
            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-white/95 backdrop-blur-xs text-[#004B68] text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded-md border border-[#E7E7DF] shadow-xs">
              FRESH TODAY
            </div>
          )}

          {/* STATE 4: Out of Stock Overlay Badge */}
          {isProductOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center p-2">
              <span className="bg-[#172126] text-white text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-xs">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* STATE 5: Wishlist Active Heart Button */}
          <button
            id={`wishlist-btn-${product.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-1.5 rounded-full backdrop-blur-xs transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] min-w-[32px] min-h-[32px] flex items-center justify-center ${
              isWishlisted
                ? 'bg-white text-[#004B68] shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#626B69] hover:text-[#004B68]'
            }`}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform active:scale-90 ${
                isWishlisted ? 'fill-[#004B68] text-[#004B68]' : ''
              }`}
            />
          </button>
        </div>

        {/* METADATA: Category & Stock State */}
        <div className="mt-2 sm:mt-3 flex items-center justify-between gap-1 sm:gap-2">
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#626B69] uppercase truncate">
            {product.category}
          </span>

          {/* STATE 3: Low Stock Warning Label */}
          {isLowStock && !isProductOutOfStock && (
            <span className="text-[10px] sm:text-[11px] font-medium text-[#c05621] bg-[#feebc8]/60 px-1 sm:px-1.5 py-0.5 rounded shrink-0">
              Only {product.stockCount || 4} left
            </span>
          )}
        </div>

        {/* PRODUCT NAME & TAMIL NAME */}
        <div
          onClick={() => onProductClick && onProductClick(product)}
          className={`mt-0.5 sm:mt-1 ${onProductClick ? 'cursor-pointer' : ''}`}
        >
          <h4 className="text-[14px] sm:text-[16px] font-semibold text-[#172126] leading-tight group-hover:text-[#004B68] transition-colors line-clamp-1">
            {product.name}
          </h4>

          {/* Tamil Product Name with proper line height & distinct font rendering */}
          <p className="tamil-text text-[12px] sm:text-[13px] text-[#626B69] font-medium mt-0.5 line-clamp-1">
            {product.tamilName}
          </p>
        </div>

        {/* PACK SIZE (Single-variant) or INLINE VARIANT SELECTOR (Multi-variant) */}
        {isMultiVariant && product.variants ? (
          <div
            className="mt-1.5 flex flex-wrap items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
            role="group"
            aria-label={`${product.name} pack size options`}
          >
            {product.variants.map((variant) => {
              const isSelected = variant.id === activeVariant.id;
              const isVariantOutOfStock = variant.stockStatus === 'out_of_stock' || isProductOutOfStock;
              const variantQty = cartMap
                ? getVariantQuantityInCart(cartMap, product.id, variant.id, variant.isDefault)
                : 0;

              return (
                <button
                  key={variant.id}
                  id={`card-variant-btn-${product.id}-${variant.id}`}
                  type="button"
                  disabled={isVariantOutOfStock}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariantId(variant.id);
                  }}
                  className={`relative px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold border transition-all duration-150 flex items-center gap-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#004B68] ${
                    isSelected
                      ? 'bg-[#004B68] text-white border-[#004B68] shadow-2xs'
                      : isVariantOutOfStock
                      ? 'bg-[#F2F3ED] text-[#626B69]/40 border-[#E7E7DF] line-through cursor-not-allowed'
                      : 'bg-[#FAFAF6] text-[#172126] border-[#E7E7DF] hover:border-[#37B4A1] hover:text-[#004B68] cursor-pointer'
                  }`}
                  aria-pressed={isSelected}
                  title={isVariantOutOfStock ? `${variant.label} (Out of stock)` : variant.label}
                >
                  <span>{variant.label}</span>
                  {variantQty > 0 && (
                    <span
                      className={`text-[9px] sm:text-[10px] px-1 py-0.2 rounded font-bold leading-none ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : 'bg-[#53B847]/15 text-[#53B847]'
                      }`}
                    >
                      {variantQty}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-[11px] sm:text-[12px] text-[#626B69] mt-0.5 sm:mt-1 font-normal truncate">
            {product.packSize}
          </p>
        )}
      </div>

      {/* BOTTOM ROW: Price and Action Button States */}
      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#E7E7DF]/70 flex items-center justify-between gap-1 sm:gap-2">
        {/* Price display with optional strikethrough */}
        <div className="flex items-baseline gap-1 sm:gap-1.5 min-w-0">
          <span className="text-[16px] sm:text-[18px] md:text-[19px] font-bold text-[#172126] tracking-tight">
            ₹{currentPrice}
          </span>
          {currentOriginalPrice && currentOriginalPrice > currentPrice && (
            <span className="text-[11px] sm:text-[12px] text-[#626B69] line-through truncate">
              ₹{currentOriginalPrice}
            </span>
          )}
        </div>

        {/* ACTION BUTTON: Single vs Multi-variant Handlers */}
        <div className="shrink-0">
          {isCurrentVariantOutOfStock ? (
            /* Out of stock notify */
            <button
              id={`notify-btn-${product.id}${isMultiVariant ? `-${activeVariant.id}` : ''}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNotifyMe && onNotifyMe(product);
              }}
              className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-[#004B68] bg-[#F2F3ED] hover:bg-[#E7E7DF] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004B68]"
            >
              <Bell className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">Notify</span>
              <span className="xs:hidden">Notify</span>
            </button>
          ) : isCurrentVariantAdded ? (
            /* Added Quantity Controller [ −  qty  + ] */
            <div
              className="inline-flex items-center bg-[#53B847] text-white rounded-lg p-0.5 shadow-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id={`cart-decrease-${product.id}${isMultiVariant ? `-${activeVariant.id}` : ''}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateQuantity(
                    product,
                    currentVariantQuantity - 1,
                    isMultiVariant ? activeVariant : undefined
                  );
                }}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-black/10 rounded-md transition-colors focus:outline-none cursor-pointer"
                aria-label={`Decrease quantity of ${product.name}${isMultiVariant ? ` ${activeVariant.label}` : ''}`}
              >
                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              </button>
              <span className="w-5 sm:w-6 text-center text-[11px] sm:text-xs font-bold select-none">
                {currentVariantQuantity}
              </span>
              <button
                id={`cart-increase-${product.id}${isMultiVariant ? `-${activeVariant.id}` : ''}`}
                type="button"
                disabled={currentStockLimit !== undefined && currentVariantQuantity >= currentStockLimit}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateQuantity(
                    product,
                    currentVariantQuantity + 1,
                    isMultiVariant ? activeVariant : undefined
                  );
                }}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-black/10 rounded-md transition-colors focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                aria-label={`Increase quantity of ${product.name}${isMultiVariant ? ` ${activeVariant.label}` : ''}`}
                title={
                  currentStockLimit !== undefined && currentVariantQuantity >= currentStockLimit
                    ? `Only ${currentStockLimit} in stock`
                    : `Increase quantity of ${product.name}${isMultiVariant ? ` ${activeVariant.label}` : ''}`
                }
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            /* Available [ ADD ] Button */
            <button
              id={`add-to-cart-btn-${product.id}${isMultiVariant ? `-${activeVariant.id}` : ''}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, isMultiVariant ? activeVariant : undefined);
              }}
              className="inline-flex items-center justify-center px-2.5 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-[#53B847] hover:text-white bg-white hover:bg-[#53B847] border border-[#53B847] rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] cursor-pointer shadow-2xs min-h-[30px] sm:min-h-[34px]"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
