import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowUpDown, Sparkles, ArrowRight } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';

interface CategoryPageProps {
  categorySlug: string;
  categories: Category[];
  products: Product[];
  cartMap: Record<string, number>;
  wishlistSet: Set<string>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, newQuantity: number) => void;
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
  const [freshOnly, setFreshOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const category = useMemo(() => {
    return categories.find((c) => c.slug === categorySlug);
  }, [categories, categorySlug]);

  const categoryProducts = useMemo(() => {
    return products
      .filter((p) => p.categorySlug === categorySlug)
      .filter((p) => (freshOnly ? p.isFreshToday : true))
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, categorySlug, freshOnly, sortBy]);

  if (!category) {
    return (
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-[#004B68]">Category Not Found</h1>
        <p className="text-sm text-[#626B69] mt-2">
          The requested category "{categorySlug}" does not exist in our fresh market catalog.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/shop')}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#53B847] text-white text-xs font-semibold rounded-xl hover:bg-[#469e3c] transition-colors shadow-2xs"
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
          className="hover:text-[#004B68] transition-colors focus:outline-none"
        >
          Home
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => onNavigate('/shop')}
          className="hover:text-[#004B68] transition-colors focus:outline-none"
        >
          Shop
        </button>
        <span>/</span>
        <span className="font-semibold text-[#172126]">{category.name}</span>
      </nav>

      {/* 2. CATEGORY HEADER HERO */}
      <div className="relative bg-white rounded-[20px] sm:rounded-[24px] border border-[#E7E7DF] p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#53B847] tracking-wider uppercase bg-[#F2F3ED] px-2 py-0.5 rounded-md">
                Category
              </span>
              <span className="text-xs text-[#626B69]">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'} available
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#004B68] tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-[#626B69] mt-1.5 leading-relaxed">
              {category.tagline}. Wholesomely prepared using traditional stone-ground techniques with no artificial preservatives.
            </p>
          </div>

          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-[#E7E7DF] shadow-xs">
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
              className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-[#F2F3ED] hover:bg-[#E7E7DF] text-[#172126] font-medium transition-colors"
            >
              All Shop ({products.length})
            </button>
            {categories
              .filter((c) => c.slug !== categorySlug)
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onNavigate(`/category/${c.slug}`)}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-[#E7E7DF] hover:border-[#37B4A1] text-[#626B69] hover:text-[#004B68] bg-white font-medium transition-colors"
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
                ? 'bg-[#53B847] text-white'
                : 'bg-[#F2F3ED] text-[#626B69] hover:text-[#172126]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${freshOnly ? 'bg-white' : 'bg-[#53B847]'}`} />
            <span>Fresh Today Only</span>
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
            className="bg-[#F2F3ED] text-[#172126] font-medium py-1.5 px-2.5 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-[#53B847] cursor-pointer text-xs"
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
            className="mt-3 text-xs font-semibold text-[#53B847] hover:underline"
          >
            Show all {category.name}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={cartMap[product.id] || 0}
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
