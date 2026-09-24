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
  const isAnya = theme.id === 'anyasoaps' || activeStore.vertical === 'beauty';

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
      aria-label={isAnya ? 'Search artisan soaps' : isAtelier ? 'Search fashion collections' : 'Search fresh products'}
    >
      <div
        className="fixed inset-0 bg-[#172126]/40 backdrop-blur-xs transition-opacity touch-none"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`relative w-full max-w-4xl bg-white rounded-[18px] sm:rounded-[22px] shadow-2xl border overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] sm:max-h-[85vh] flex flex-col ${
        isAnya ? 'border-[#E7C8CF]' : 'border-[#E7E7DF]'
      }`}>
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className={`p-3.5 sm:p-5 border-b flex items-center gap-2.5 sm:gap-3 m-0 shrink-0 ${
          isAnya ? 'border-[#E7C8CF] bg-[#FFF4F6]/30' : 'border-[#E7E7DF]'
        }`}>
          <Search className={`w-5 h-5 shrink-0 ${
            isAnya ? 'text-[#C97C89]' : isAtelier ? 'text-[#181818]' : 'text-[#53B847]'
          }`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholderText}
            autoFocus
            className={`w-full text-base sm:text-lg bg-transparent border-none outline-none placeholder-[#8E7A7E] ${
              isAnya ? 'text-[#2F2326]' : 'text-[#172126]'
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className={`p-1 ${isAnya ? 'text-[#6F5B60] hover:text-[#2F2326]' : 'text-[#626B69] hover:text-[#172126]'}`}
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg ${
              isAnya
                ? 'text-[#6F5B60] hover:text-[#2F2326] hover:bg-[#FDECEF]'
                : 'text-[#626B69] hover:text-[#172126] hover:bg-[#F2F3ED]'
            }`}
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Quick suggestions chips (Popular Searches) */}
        <div className={`w-full shrink-0 border-b ${
          isAnya ? 'bg-[#FFF8FA] border-[#E7C8CF]/70' : 'bg-[#FAFAF6] border-[#E7E7DF]/70'
        }`}>
          <div
            data-modal-scrollable="horizontal"
            className="w-full overflow-x-auto scrollbar-none touch-pan-x overscroll-x-contain py-2.5 sm:py-3"
          >
            <div className="flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 w-max min-w-full">
              <span className={`shrink-0 text-xs font-medium select-none pr-0.5 ${
                isAnya ? 'text-[#6F5B60]' : 'text-[#626B69]'
              }`}>Popular:</span>
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className={`px-3 py-1.5 text-xs font-medium shrink-0 transition-colors whitespace-nowrap shadow-xs active:scale-95 ${
                    isAnya
                      ? 'bg-white hover:bg-[#FFF4F6] text-[#2F2326] rounded-[8px] border border-[#E7C8CF] hover:border-[#C97C89]'
                      : 'bg-white hover:bg-[#F2F3ED] text-[#172126] rounded-lg border border-[#E7E7DF]'
                  }`}
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
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isAnya ? 'text-[#C97C89]' : 'text-[#626B69]'
            }`}>
              {query ? `Found ${filteredProducts.length} items` : (isAnya ? 'Artisan Recommendations' : isAtelier ? 'Curated Selection' : 'Fresh Recommendations')}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-sm font-semibold ${isAnya ? 'text-[#2F2326]' : 'text-[#172126]'}`}>
                No items match "{query}"
              </p>
              <p className={`text-xs mt-1 ${isAnya ? 'text-[#6F5B60]' : 'text-[#626B69]'}`}>
                {isAnya
                  ? 'Try searching for "goat milk", "shea butter", "turmeric", or "charcoal".'
                  : isAtelier
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
