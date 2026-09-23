import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles, Check, X, ArrowRight } from 'lucide-react';
import { Product, ProductVariant, Category } from '../types';
import { ProductCard } from './ProductCard';
import { SortDropdown, SortOption } from './SortDropdown';
import { getProductQuantityInCart } from '../utils/productUtils';
import { useTheme } from '../providers/ThemeProvider';
import { useActiveStore } from '../providers/StoreProvider';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  cartMap: Record<string, number>;
  wishlistSet: Set<string>;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onUpdateQuantity: (product: Product, newQuantity: number, variant?: ProductVariant) => void;
  onToggleWishlist: (product: Product) => void;
  onNotifyMe?: (product: Product) => void;
  onNavigate: (path: string) => void;
  initialCategory?: string;
  initialSearchQuery?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categories,
  cartMap,
  wishlistSet,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onNotifyMe,
  onNavigate,
  initialCategory,
  initialSearchQuery,
}) => {
  const { theme } = useTheme();
  const { activeStore } = useActiveStore();
  const isAtelier = theme.id === 'atelier' || activeStore.vertical === 'fashion';
  const isAnya = theme.id === 'anyasoaps' || activeStore.vertical === 'beauty';

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialCategory || 'all');
  const [freshOnly, setFreshOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategorySlug !== 'all' && product.categorySlug !== selectedCategorySlug) {
          return false;
        }
        // Vertical-specific quick toggle
        if (freshOnly) {
          if (isAtelier) {
            const hasNewSeason = product.tags?.some((t) => t.toLowerCase().includes('new') || t.toLowerCase().includes('season'));
            if (!hasNewSeason) return false;
          } else if (isAnya) {
            const isBotanical = product.tags?.some((t) => t.toLowerCase().includes('signature') || t.toLowerCase().includes('natural') || t.toLowerCase().includes('bestseller'));
            if (!isBotanical) return false;
          } else {
            if (!product.isFreshToday) return false;
          }
        }
        // In Stock filter
        if (inStockOnly && product.stockStatus === 'out_of_stock') {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchTamil = product.tamilName ? product.tamilName.includes(q) : false;
          const matchCategory = product.category.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          if (!matchName && !matchTamil && !matchCategory && !matchDesc) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0; // featured retains original catalog order
      });
  }, [products, selectedCategorySlug, freshOnly, inStockOnly, searchQuery, sortBy, isAtelier, isAnya]);

  const activeFilterCount = (freshOnly ? 1 : 0) + (inStockOnly ? 1 : 0) + (selectedCategorySlug !== 'all' ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategorySlug('all');
    setFreshOnly(false);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const currentCategoryObj = categories.find((c) => c.slug === selectedCategorySlug);

  return (
    <main
      id="shop-page"
      className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-4 sm:pt-6 md:pt-7 pb-8 sm:pb-10 md:pb-12"
    >
      {/* 1. BREADCRUMBS & HEADING */}
      <div className="mb-4 sm:mb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#626B69] mb-1.5 sm:mb-2">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className={`transition-colors focus:outline-none ${
              isAnya
                ? 'hover:text-[#2F2326]'
                : isAtelier
                ? 'hover:text-[#181818] tracking-wider uppercase font-medium text-[11px]'
                : 'hover:text-[#004B68]'
            }`}
          >
            {isAnya ? 'Anya Soaps' : isAtelier ? 'Atelier' : 'Home'}
          </button>
          <span>/</span>
          <span className={`font-semibold ${
            isAnya ? 'text-[#2F2326]' : isAtelier ? 'text-[#181818] tracking-wider uppercase text-[11px]' : 'text-[#172126]'
          }`}>
            {isAnya ? 'Artisans' : isAtelier ? 'Collection' : 'Shop'}
          </span>
          {currentCategoryObj && (
            <>
              <span>/</span>
              <span className={`font-medium ${
                isAnya ? 'text-[#8FA08C]' : isAtelier ? 'text-[#8C7355] tracking-wider uppercase text-[11px]' : 'text-[#004B68]'
              }`}>
                {currentCategoryObj.name}
              </span>
            </>
          )}
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
          <div>
            <span
              className={`inline-block text-[11px] font-bold uppercase tracking-wider mb-0.5 sm:mb-1 ${
                isAnya
                  ? 'text-[#8FA08C]'
                  : isAtelier
                  ? 'text-[#8C7355] tracking-[0.2em] font-medium'
                  : 'text-[#53B847]'
              }`}
            >
              {isAnya ? 'Small-Batch Botanical Workshop' : isAtelier ? "Autumn / Winter '25 Edition" : 'Complete Fresh Market'}
            </span>
            <h1
              className={`tracking-tight ${
                isAnya
                  ? 'text-3xl sm:text-4xl md:text-5xl font-bold text-[#2F2326] font-serif'
                  : isAtelier
                  ? 'text-3xl sm:text-4xl md:text-5xl font-light text-[#141414] font-serif'
                  : 'text-2xl sm:text-3xl md:text-4xl font-bold text-[#004B68]'
              }`}
              style={isAnya ? { fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" } : isAtelier ? { fontFamily: "'Playfair Display', Georgia, serif" } : undefined}
            >
              {isAnya ? 'All Handcrafted Soaps & Elixirs' : isAtelier ? 'All Garments & Objects' : 'Shop All Foods'}
            </h1>
            <p className={`text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed ${isAnya ? 'text-[#6F5B60]' : isAtelier ? 'text-[#767676]' : 'text-[#626B69]'}`}>
              {isAnya
                ? 'Hand-stirred cold-process soaps, pure herbal bathing powders, and rich plant-butter balms crafted with zero chemicals.'
                : isAtelier
                ? 'Curated contemporary silhouettes crafted from certified Belgian linen, Japanese selvedge twill, and Australian fine merino wool.'
                : 'Everyday batters, heirloom millets, fresh sevai, and staples prepared fresh every morning in Coimbatore.'}
            </p>
          </div>

          {/* Quick link to dedicated Category page if a category is selected */}
          {currentCategoryObj && (
            <button
              type="button"
              onClick={() => onNavigate(`/category/${currentCategoryObj.slug}`)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold self-start md:self-auto py-1 transition-colors ${
                isAnya
                  ? 'text-[#2F2326] hover:text-[#8FA08C]'
                  : isAtelier
                  ? 'text-[#181818] hover:text-[#8C7355] uppercase tracking-wider text-[11px]'
                  : 'text-[#004B68] hover:text-[#53B847]'
              }`}
            >
              <span>View {currentCategoryObj.name} collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="relative mb-4 sm:mb-5">
        <div className="relative flex items-center w-full max-w-2xl">
          <Search className={`w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 pointer-events-none ${
            isAnya ? 'text-[#8FA08C]' : 'text-[#626B69]'
          }`} />
          <input
            id="shop-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAnya
                ? 'Search botanical soaps, ingredients (e.g. red wine, charcoal, goat milk)...'
                : isAtelier
                ? 'Search collection (e.g. linen overshirt, wool gabardine, trousers)...'
                : 'Search all products (e.g. dosa batter, paneer, ragi, chapathi)...'
            }
            className={`w-full pl-10 sm:pl-11 pr-10 py-2.5 sm:py-3 text-sm bg-white rounded-xl border text-[#172126] placeholder-[#626B69] shadow-xs focus:outline-none transition-all ${
              isAnya
                ? 'border-[#E7C8CF] focus:border-[#8FA08C] focus:ring-1 focus:ring-[#8FA08C]'
                : isAtelier
                ? 'border-[#E7E7DF] focus:border-[#141414] focus:ring-1 focus:ring-[#141414]'
                : 'border-[#E7E7DF] focus:border-[#53B847] focus:ring-1 focus:ring-[#53B847]'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 text-[#626B69] hover:text-[#172126] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION */}
      <div className="mb-4 sm:mb-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
          {/* All Button */}
          <button
            type="button"
            onClick={() => setSelectedCategorySlug('all')}
            className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 min-h-[40px] flex items-center gap-1.5 focus:outline-none ${
              selectedCategorySlug === 'all'
                ? isAnya
                  ? 'bg-[#2F2326] text-white shadow-xs'
                  : isAtelier
                  ? 'bg-[#181818] text-white shadow-xs'
                  : 'bg-[#004B68] text-white shadow-xs'
                : isAnya
                ? 'bg-white text-[#6F5B60] hover:text-[#2F2326] border border-[#E7C8CF] hover:border-[#8FA08C]'
                : 'bg-white text-[#626B69] hover:text-[#172126] border border-[#E7E7DF] hover:border-[#141414]'
            }`}
          >
            <span>{isAnya ? 'All Artisans' : isAtelier ? 'All Pieces' : 'All Items'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategorySlug === 'all'
                  ? 'bg-white/20 text-white'
                  : isAnya
                  ? 'bg-[#FFF4F6] text-[#8FA08C]'
                  : 'bg-[#F2F3ED] text-[#626B69]'
              }`}
            >
              {products.length}
            </span>
          </button>

          {/* Category Chips */}
          {categories.map((cat) => {
            const isSelected = selectedCategorySlug === cat.slug;
            const catItemCount = products.filter((p) => p.categorySlug === cat.slug).length;

            return (
              <button
                key={cat.id}
                id={`shop-cat-${cat.slug}`}
                type="button"
                onClick={() => setSelectedCategorySlug(isSelected ? 'all' : cat.slug)}
                className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 min-h-[40px] flex items-center gap-1.5 focus:outline-none ${
                  isSelected
                    ? isAnya
                      ? 'bg-[#2F2326] text-white shadow-xs'
                      : isAtelier
                      ? 'bg-[#181818] text-white shadow-xs'
                      : 'bg-[#004B68] text-white shadow-xs'
                    : isAnya
                    ? 'bg-white text-[#6F5B60] hover:text-[#2F2326] border border-[#E7C8CF] hover:border-[#8FA08C]'
                    : 'bg-white text-[#626B69] hover:text-[#172126] border border-[#E7E7DF] hover:border-[#141414]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isAnya
                      ? 'bg-[#FFF4F6] text-[#8FA08C]'
                      : 'bg-[#F2F3ED] text-[#626B69]'
                  }`}
                >
                  {catItemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. FILTER & SORT CONTROLS BAR */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-white rounded-2xl border mb-5 sm:mb-6 shadow-xs ${
        isAnya ? 'border-[#E7C8CF]' : 'border-[#E7E7DF]'
      }`}>
        {/* Row 1 on mobile / Left group on desktop: Quick Filter Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Season / Fresh Toggle */}
          <button
            type="button"
            onClick={() => setFreshOnly(!freshOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus:outline-none min-h-[36px] sm:min-h-0 ${
              freshOnly
                ? isAnya
                  ? 'bg-[#2F2326] text-white'
                  : isAtelier
                  ? 'bg-[#181818] text-white'
                  : 'bg-[#53B847] text-white'
                : isAnya
                ? 'bg-[#FFF4F6] text-[#6F5B60] hover:text-[#2F2326]'
                : 'bg-[#F2F3ED] text-[#626B69] hover:text-[#172126] hover:bg-[#E7E7DF]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                freshOnly ? 'bg-white' : isAnya ? 'bg-[#8FA08C]' : isAtelier ? 'bg-[#8C7355]' : 'bg-[#53B847]'
              }`}
            />
            <span className="whitespace-nowrap">{isAnya ? 'Signature Soaps' : isAtelier ? 'New Season' : 'Fresh Today'}</span>
          </button>

          {/* In Stock Toggle */}
          <button
            type="button"
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus:outline-none min-h-[36px] sm:min-h-0 ${
              inStockOnly
                ? isAnya
                  ? 'bg-[#2F2326] text-white'
                  : isAtelier
                  ? 'bg-[#181818] text-white'
                  : 'bg-[#004B68] text-white'
                : isAnya
                ? 'bg-[#FFF4F6] text-[#6F5B60] hover:text-[#2F2326]'
                : 'bg-[#F2F3ED] text-[#626B69] hover:text-[#172126] hover:bg-[#E7E7DF]'
            }`}
          >
            <span className="whitespace-nowrap">In Stock Only</span>
          </button>

          {/* Active Filter Clear */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-[#c05621] hover:underline px-2 py-1 font-medium focus:outline-none whitespace-nowrap min-h-[36px] sm:min-h-0 flex items-center"
            >
              Reset filters ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Row 2 on mobile / Right group on desktop: Count & Sort */}
        <div className={`flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 ${
          isAnya ? 'border-[#E7C8CF]/70' : 'border-[#E7E7DF]/70'
        }`}>
          <span className={`text-xs whitespace-nowrap ${isAnya ? 'text-[#6F5B60]' : 'text-[#626B69]'}`}>
            Showing <strong className={isAnya ? 'text-[#2F2326]' : 'text-[#172126]'}>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? (isAnya ? 'soap' : 'item') : (isAnya ? 'soaps' : 'items')}
          </span>

          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* 5. COMPLETE PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className={`text-center py-16 px-4 bg-white rounded-2xl border my-4 ${
          isAnya ? 'border-[#E7C8CF]' : 'border-[#E7E7DF]'
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
            isAnya ? 'bg-[#FFF4F6] text-[#8FA08C]' : 'bg-[#F2F3ED] text-[#626B69]'
          }`}>
            <Search className="w-6 h-6" />
          </div>
          <h3 className={`text-base sm:text-lg font-bold ${isAnya ? 'text-[#2F2326]' : 'text-[#172126]'}`}>No products found</h3>
          <p className={`text-xs sm:text-sm mt-1 max-w-md mx-auto ${isAnya ? 'text-[#6F5B60]' : 'text-[#626B69]'}`}>
            {searchQuery
              ? `We couldn't find any products matching "${searchQuery}". Try a different search term or reset filters.`
              : 'No products match the selected filters.'}
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className={`mt-4 px-4 py-2 text-xs font-semibold text-white rounded-xl transition-colors focus:outline-none ${
              isAnya ? 'bg-[#2F2326] hover:bg-[#4A3B3E] rounded-[10px]' : isAtelier ? 'bg-[#181818] hover:bg-black' : 'bg-[#53B847] hover:bg-[#469e3c]'
            }`}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div
          className={
            isAtelier
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-7 sm:gap-y-12'
              : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5'
          }
        >
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
              onProductClick={(p) => onNavigate(`/product/${p.id}`)}
            />
          ))}
        </div>
      )}
    </main>
  );
};
