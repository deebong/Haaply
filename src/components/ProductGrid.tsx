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
}) => {
  return (
    <section
      id={id}
      className="w-full max-w-[1280px] mx-auto px-6 md:px-8 lg:px-10"
      aria-labelledby={`${id}-heading`}
    >
      {/* SECTION HEADER: Title, Subtitle, and 'See all →' */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2
            id={`${id}-heading`}
            className="text-[26px] sm:text-[28px] font-bold text-[#004B68] tracking-tight leading-tight"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-[14px] sm:text-[15px] text-[#626B69] mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {onViewAllClick && (
          <button
            id={`${id}-see-all`}
            type="button"
            onClick={onViewAllClick}
            className="group inline-flex items-center gap-1 text-[14px] font-semibold text-[#004B68] hover:text-[#53B847] transition-colors pb-0.5 focus:outline-none focus-visible:underline"
          >
            <span>{viewAllLinkText}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1 text-[#53B847]" />
          </button>
        )}
      </div>

      {/* 5-COLUMN RESPONSIVE PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 justify-items-center">
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
          />
        ))}
      </div>
    </section>
  );
};
