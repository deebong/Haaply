import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  id?: string;
  title: string;
  subtitle?: string;
  viewAllLinkText?: string;
  onViewAllClick?: () => void;
  products: Product[];
  cartMap: Record<string, number>;
  wishlistSet: Set<string>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, newQuantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  onNotifyMe?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  id,
  title,
  subtitle,
  viewAllLinkText = 'See all',
  onViewAllClick,
  products,
  cartMap,
  wishlistSet,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onNotifyMe,
  onProductClick,
}) => {
  return (
    <section
      id={id}
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10"
      aria-labelledby={`${id}-heading`}
    >
      {/* SECTION HEADER: Title, Subtitle, and 'See all →' */}
      <div className="flex items-end justify-between mb-4 sm:mb-6">
        <div>
          <h2
            id={`${id}-heading`}
            className="text-[22px] sm:text-[26px] md:text-[28px] font-bold text-[#004B68] tracking-tight leading-tight"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-[13px] sm:text-[14px] md:text-[15px] text-[#626B69] mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {onViewAllClick && (
          <button
            id={`${id}-see-all`}
            type="button"
            onClick={onViewAllClick}
            className="group inline-flex items-center gap-1 text-[13px] sm:text-[14px] font-semibold text-[#004B68] hover:text-[#53B847] transition-colors pb-0.5 focus:outline-none focus-visible:underline shrink-0"
          >
            <span>{viewAllLinkText}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1 text-[#53B847]" />
          </button>
        )}
      </div>

      {/* 2-col (mobile) -> 3-col (tablet) -> 4-col (laptop) -> 5-col (large desktop) RESPONSIVE PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantityInCart={cartMap[product.id] || 0}
            isWishlisted={wishlistSet.has(product.id)}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
            onToggleWishlist={onToggleWishlist}
            onNotifyMe={onNotifyMe}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </section>
  );
};
