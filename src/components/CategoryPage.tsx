import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowUpDown, Sparkles, ArrowRight } from 'lucide-react';
import { Product, ProductVariant, Category } from '../types';
import { ProductCard } from './ProductCard';
import { getProductQuantityInCart } from '../utils/productUtils';
import { useTheme } from '../providers/ThemeProvider';

interface CategoryPageProps {
  categorySlug: string;
  categories: Category[];
  products: Product[];
  cartMap: Record<string, number>;
  wishlistSet: Set<string>;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onUpdateQuantity: (product: Product, newQuantity: number, variant?: ProductVariant) => void;
  onToggleWishlist: (product: Product) => void;
  onNotifyMe?: (product: Product) => void;
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  categories,
  products,
  cartMap,
  wishlistSet,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onNotifyMe,
  onNavigate,
}) => {
  const { theme } = useTheme();
  const isAtelier = theme.id === 'atelier';

  const [freshOnly, setFreshOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const category = useMemo(() => {
    return categories.find((c) => c.slug === categorySlug);
  }, [categories, categorySlug]);

  const categoryProducts = useMemo(() => {
    return products
      .filter((p) => p.categorySlug === categorySlug)
      .filter((p) => {
        if (!freshOnly) return true;
        if (isAtelier) {
          return p.tags?.some((t) => t.toLowerCase().includes('new') || t.toLowerCase().includes('season'));
        }
        return p.isFreshToday;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, categorySlug, freshOnly, sortBy, isAtelier]);

  if (!category) {
    return (
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 py-12 text-center">
        <h1 className={`text-2xl font-bold ${isAtelier ? 'text-[#141414] font-serif' : 'text-[#004B68]'}`}>
          Category Not Found
        </h1>
        <p className="text-sm text-[#626B69] mt-2">
          The requested category "{categorySlug}" does not exist in our catalog.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/shop')}
          className={`mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs ${
            isAtelier ? 'bg-[#181818] hover:bg-black' : 'bg-[#53B847] hover:bg-[#469e3c]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </button>
      </main>
    );
  }

  return (
    <main id="category-page" className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10">
      {/* 1. BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#626B69] mb-4 sm:mb-6">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className={`transition-colors focus:outline-none ${
            isAtelier ? 'hover:text-[#181818] uppercase tracking-wider text-[11px]' : 'hover:text-[#004B68]'
          }`}
        >
          {isAtelier ? 'Atelier' : 'Home'}
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => onNavigate('/shop')}
          className={`transition-colors focus:outline-none ${
            isAtelier ? 'hover:text-[#181818] uppercase tracking-wider text-[11px]' : 'hover:text-[#004B68]'
          }`}
        >
          {isAtelier ? 'Collection' : 'Shop'}
        </button>
        <span>/</span>
        <span className={`font-semibold ${isAtelier ? 'text-[#181818] uppercase tracking-wider text-[11px]' : 'text-[#172126]'}`}>
          {category.name}
        </span>
      </nav>

      {/* 2. CATEGORY HEADER HERO */}
      <div className="relative bg-white rounded-[20px] sm:rounded-[24px] border border-[#E7E7DF] p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                  isAtelier ? 'bg-[#F4F1EA] text-[#8C7355]' : 'bg-[#F2F3ED] text-[#53B847]'
                }`}
              >
                {isAtelier ? 'Edition' : 'Category'}
              </span>
              <span className="text-xs text-[#626B69]">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'piece' : 'pieces'} available
              </span>
            </div>
            <h1
              className={`tracking-tight ${
                isAtelier
                  ? 'text-3xl sm:text-4xl md:text-5xl font-light text-[#141414] font-serif'
                  : 'text-2xl sm:text-3xl md:text-4xl font-bold text-[#004B68]'
              }`}
              style={isAtelier ? { fontFamily: "'Playfair Display', Georgia, serif" } : undefined}
            >
              {category.name}
            </h1>
            <p className={`text-sm sm:text-base mt-1.5 leading-relaxed ${isAtelier ? 'text-[#767676]' : 'text-[#626B69]'}`}>
              {category.tagline}
              {!isAtelier && '. Wholesomely prepared using traditional stone-ground techniques with no artificial preservatives.'}
            </p>
          </div>

          <div
            className={`overflow-hidden shrink-0 border border-[#E7E7DF] shadow-xs ${
              isAtelier ? 'w-24 h-32 sm:w-32 sm:h-40 rounded-xl' : 'w-20 h-20 sm:w-28 sm:h-28 rounded-2xl'
            }`}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Quick Category Hopping Rail */}
        <div className="mt-6 pt-4 border-t border-[#E7E7DF]/70">
          <div className="text-[11px] font-semibold text-[#626B69] uppercase tracking-wider mb-2">
            Other categories:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => onNavigate('/shop')}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                isAtelier ? 'bg-[#F4F1EA] hover:bg-[#E8E4DA] text-[#181818]' : 'bg-[#F2F3ED] hover:bg-[#E7E7DF] text-[#172126]'
              }`}
            >
              All {isAtelier ? 'Collection' : 'Shop'} ({products.length})
            </button>
            {categories
              .filter((c) => c.slug !== categorySlug)
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onNavigate(`/category/${c.slug}`)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border border-[#E7E7DF] bg-white font-medium transition-colors ${
                    isAtelier ? 'hover:border-[#141414] text-[#181818]' : 'hover:border-[#37B4A1] text-[#626B69] hover:text-[#004B68]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* 3. FILTERS & SORT */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-[#E7E7DF] mb-6 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFreshOnly(!freshOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus:outline-none ${
              freshOnly
                ? isAtelier
                  ? 'bg-[#181818] text-white'
                  : 'bg-[#53B847] text-white'
                : 'bg-[#F2F3ED] text-[#626B69] hover:text-[#172126]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                freshOnly ? 'bg-white' : isAtelier ? 'bg-[#8C7355]' : 'bg-[#53B847]'
              }`}
            />
            <span>{isAtelier ? 'New Season Only' : 'Fresh Today Only'}</span>
          </button>
          {freshOnly && (
            <button
              type="button"
              onClick={() => setFreshOnly(false)}
              className="text-xs text-[#c05621] hover:underline px-1 font-medium"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#626B69]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`bg-[#F2F3ED] text-[#172126] font-medium py-1.5 px-2.5 rounded-lg border-none focus:outline-none cursor-pointer text-xs ${
              isAtelier ? 'focus:ring-1 focus:ring-[#141414]' : 'focus:ring-1 focus:ring-[#53B847]'
            }`}
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 4. PRODUCT GRID */}
      {categoryProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E7DF]">
          <p className="text-sm text-[#626B69]">No products found with active filters.</p>
          <button
            type="button"
            onClick={() => setFreshOnly(false)}
            className={`mt-3 text-xs font-semibold hover:underline ${
              isAtelier ? 'text-[#181818]' : 'text-[#53B847]'
            }`}
          >
            Show all {category.name}
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
          {categoryProducts.map((product) => (
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
