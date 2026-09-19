import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialQuery?: string;
  cartMap: Record<string, number>;
  wishlistSet: Set<string>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, newQuantity: number) => void;
  onToggleWishlist: (product: Product) => void;
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
}) => {
  const [query, setQuery] = useState(initialQuery);

  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products.slice(0, 6);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tamilName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div
        className="fixed inset-0 bg-[#172126]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white rounded-[22px] shadow-2xl border border-[#E7E7DF] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E7E7DF] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#53B847] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fresh batters, millets, sevai, chapathi, paneer..."
            autoFocus
            className="w-full text-base sm:text-lg bg-transparent border-none outline-none text-[#172126] placeholder-[#626B69]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#626B69] hover:text-[#172126]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#626B69] hover:text-[#172126] rounded-lg hover:bg-[#F2F3ED]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick suggestions chips */}
        <div className="px-5 py-2.5 bg-[#FAFAF6] border-b border-[#E7E7DF]/70 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#626B69] shrink-0">Popular searches:</span>
          {['Dosa Batter', 'Idli Batter', 'Ragi Sevai', 'Chapathi', 'Fresh Paneer', 'Millet'].map(
            (tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 bg-white hover:bg-[#F2F3ED] text-[#172126] rounded-lg border border-[#E7E7DF] text-xs font-medium shrink-0 transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Results grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#626B69]">
              {query ? `Found ${filteredProducts.length} items` : 'Fresh Recommendations'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-semibold text-[#172126]">
                No items match "{query}"
              </p>
              <p className="text-xs text-[#626B69] mt-1">
                Try searching for "batter", "sevai", or "paneer".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={cartMap[product.id] || 0}
                  isWishlisted={wishlistSet.has(product.id)}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateQuantity}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
