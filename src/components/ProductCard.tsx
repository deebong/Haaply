import React from 'react';
import { Heart, Plus, Minus, Bell, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  isWishlisted: boolean;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, newQuantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  onNotifyMe?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  isWishlisted,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onNotifyMe,
}) => {
  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const isLowStock = product.stockStatus === 'low_stock';
  const isAdded = quantityInCart > 0;

  return (
    <article
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between w-full max-w-[250px] bg-white rounded-[16px] border border-[#E7E7DF] p-3 hover:border-[#37B4A1]/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-200"
    >
      {/* TOP: Image Area (180px tall) + Wishlist Heart + Fresh Label */}
      <div>
        <div className="relative w-full h-[180px] rounded-[12px] overflow-hidden bg-[#F2F3ED]">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
              isOutOfStock ? 'opacity-55 grayscale' : ''
            }`}
            loading="lazy"
          />

          {/* STATE 6: Fresh Today Small Label */}
          {product.isFreshToday && !isOutOfStock && (
            <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-[#004B68] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border border-[#E7E7DF] shadow-xs">
              FRESH TODAY
            </div>
          )}

          {/* STATE 4: Out of Stock Overlay Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center p-2">
              <span className="bg-[#172126] text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-xs">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* STATE 5: Wishlist Active Heart Button */}
          <button
            id={`wishlist-btn-${product.id}`}
            type="button"
            onClick={() => onToggleWishlist(product)}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-xs transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] ${
              isWishlisted
                ? 'bg-white text-[#004B68] shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#626B69] hover:text-[#004B68]'
            }`}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-90 ${
                isWishlisted ? 'fill-[#004B68] text-[#004B68]' : ''
              }`}
            />
          </button>
        </div>

        {/* METADATA: Category & Stock State */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold tracking-wider text-[#626B69] uppercase truncate">
            {product.category}
          </span>

          {/* STATE 3: Low Stock Warning Label */}
          {isLowStock && !isOutOfStock && (
            <span className="text-[11px] font-medium text-[#c05621] bg-[#feebc8]/60 px-1.5 py-0.5 rounded text-nowrap">
              Only {product.stockCount || 4} left
            </span>
          )}
        </div>

        {/* PRODUCT NAME & TAMIL NAME */}
        <div className="mt-1">
          <h4 className="text-[16px] font-semibold text-[#172126] leading-tight group-hover:text-[#004B68] transition-colors line-clamp-1">
            {product.name}
          </h4>

          {/* Tamil Product Name with proper line height & distinct font rendering */}
          <p className="tamil-text text-[13px] text-[#626B69] font-medium mt-0.5 line-clamp-1">
            {product.tamilName}
          </p>
        </div>

        {/* PACK SIZE */}
        <p className="text-[12px] text-[#626B69] mt-1 font-normal">
          {product.packSize}
        </p>
      </div>

      {/* BOTTOM ROW: Price and Action Button States */}
      <div className="mt-4 pt-3 border-t border-[#E7E7DF]/70 flex items-center justify-between gap-2">
        {/* Price display with optional strikethrough */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[19px] font-bold text-[#172126] tracking-tight">
            ₹{product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[12px] text-[#626B69] line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* ACTION BUTTON: STATES 1, 2, 4 */}
        <div>
          {isOutOfStock ? (
            /* STATE 4: Out of stock notify */
            <button
              id={`notify-btn-${product.id}`}
              type="button"
              onClick={() => onNotifyMe && onNotifyMe(product)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#004B68] bg-[#F2F3ED] hover:bg-[#E7E7DF] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004B68]"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notify me</span>
            </button>
          ) : isAdded ? (
            /* STATE 2: Added Quantity Controller [ −  2  + ] */
            <div className="inline-flex items-center bg-[#53B847] text-white rounded-lg p-0.5 shadow-xs">
              <button
                id={`cart-decrease-${product.id}`}
                type="button"
                onClick={() => onUpdateQuantity(product, quantityInCart - 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-black/10 rounded-md transition-colors focus:outline-none"
                aria-label={`Decrease quantity of ${product.name}`}
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="w-6 text-center text-xs font-bold select-none">
                {quantityInCart}
              </span>
              <button
                id={`cart-increase-${product.id}`}
                type="button"
                onClick={() => onUpdateQuantity(product, quantityInCart + 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-black/10 rounded-md transition-colors focus:outline-none"
                aria-label={`Increase quantity of ${product.name}`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            /* STATE 1: Available [ ADD ] Button */
            <button
              id={`add-to-cart-btn-${product.id}`}
              type="button"
              onClick={() => onAddToCart(product)}
              className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold text-[#53B847] hover:text-white bg-white hover:bg-[#53B847] border border-[#53B847] rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] cursor-pointer shadow-2xs"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
