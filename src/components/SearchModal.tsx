import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { ProductCard } from './ProductCard';
import { useScrollLock } from '../hooks/useScrollLock';
import { getProductQuantityInCart } from '../utils/productUtils';
import { useTheme } from '../providers/ThemeProvider';
import { useActiveStore } from '../providers/StoreProvider';
import { filterProductsByQuery, getPopularSearchTerms, getSearchPlaceholder } from '../utils/searchUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialQuery?: string;
  cartMap: Record<string, number>;
  wishlistSet: Set<string>;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onUpdateQuantity: (product: Product, newQuantity: number, variant?: ProductVariant) => void;
  onToggleWishlist: (product: Product) => void;
  onNotifyMe?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  initialQuery = '',
  cartMap,
  wishlistSet,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onNotifyMe,
  onProductClick,
}) => {
  const { theme } = useTheme();
  const { activeStore } = useActiveStore();
  const isAtelier = theme.id === 'atelier' || activeStore.vertical === 'fashion';

  // Centralized scroll-lock: locks document scroll, handles mobile touch, and supports Escape key
  useScrollLock(isOpen, onClose);

  const [query, setQuery] = useState(initialQuery);

  const filteredProducts = useMemo(() => {
    return filterProductsByQuery(products, query);
  }, [products, query]);

  if (!isOpen) return null;

  const popularSearches = getPopularSearchTerms(activeStore.vertical, isAtelier);
  const placeholderText = getSearchPlaceholder(activeStore.vertical, isAtelier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-16 px-3 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-label={isAtelier ? 'Search fashion collections' : 'Search fresh products'}
    >
      <div
        className="fixed inset-0 bg-[#172126]/40 backdrop-blur-xs transition-opacity touch-none"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl bg-white rounded-[18px] sm:rounded-[22px] shadow-2xl border border-[#E7E7DF] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] sm:max-h-[85vh] flex flex-col">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-5 border-b border-[#E7E7DF] flex items-center gap-2.5 sm:gap-3 m-0 shrink-0">
          <Search className={`w-5 h-5 shrink-0 ${isAtelier ? 'text-[#181818]' : 'text-[#53B847]'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholderText}
            autoFocus
            className="w-full text-base sm:text-lg bg-transparent border-none outline-none text-[#172126] placeholder-[#626B69]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#626B69] hover:text-[#172126]"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#626B69] hover:text-[#172126] rounded-lg hover:bg-[#F2F3ED]"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Quick suggestions chips (Popular Searches) */}
        <div className="w-full shrink-0 bg-[#FAFAF6] border-b border-[#E7E7DF]/70">
          <div
            data-modal-scrollable="horizontal"
            className="w-full overflow-x-auto scrollbar-none touch-pan-x overscroll-x-contain py-2.5 sm:py-3"
          >
            <div className="flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 w-max min-w-full">
              <span className="text-[#626B69] shrink-0 text-xs font-medium select-none pr-0.5">Popular:</span>
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 bg-white hover:bg-[#F2F3ED] text-[#172126] rounded-lg border border-[#E7E7DF] text-xs font-medium shrink-0 transition-colors whitespace-nowrap shadow-xs active:scale-95"
                >
                  {tag}
                </button>
              ))}
              {/* End-of-row breathing room buffer */}
              <div className="w-3 sm:w-4 shrink-0 pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div
          data-modal-scrollable="true"
          className="p-3.5 sm:p-6 overflow-y-auto flex-1 min-h-0 overscroll-contain"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#626B69]">
              {query ? `Found ${filteredProducts.length} items` : (isAtelier ? 'Curated Selection' : 'Fresh Recommendations')}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-semibold text-[#172126]">
                No items match "{query}"
              </p>
              <p className="text-xs text-[#626B69] mt-1">
                {isAtelier
                  ? 'Try searching for "coat", "silk", "knitwear", or "trouser".'
                  : 'Try searching for "batter", "sevai", or "paneer".'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={getProductQuantityInCart(product, cartMap)}
                  cartMap={cartMap}
                  isWishlisted={wishlistSet.has(product.id)}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateQuantity}
                  onToggleWishlist={onToggleWishlist}
                  onNotifyMe={onNotifyMe}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
