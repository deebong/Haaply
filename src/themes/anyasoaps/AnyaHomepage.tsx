import React, { useState, useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product, ProductVariant, Category } from '../../types';
import { AnyaHero } from './AnyaHero';
import { AnyaProductCard } from './AnyaProductCard';
import { AnyaWhySection } from './AnyaWhySection';
import { AnyaProcessSection } from './AnyaProcessSection';
import { AnyaLifestyleSection } from './AnyaLifestyleSection';
import { AnyaTestimonialsSection } from './AnyaTestimonialsSection';
import { AnyaSkinQuizSection } from './AnyaSkinQuizSection';
import { AnyaFaqSection } from './AnyaFaqSection';
import { AnyaButton } from './AnyaButton';
import { getAnyaClippedPolygon } from './AnyaCard';

interface AnyaHomepageProps {
  products: Product[];
  categories: Category[];
  cartMap: Record<string, number>;
  wishlistSet: Set<string>;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onUpdateQuantity: (product: Product, newQuantity: number, variant?: ProductVariant) => void;
  onToggleWishlist: (product: Product) => void;
  onNavigate: (path: string) => void;
}

export const AnyaHomepage: React.FC<AnyaHomepageProps> = ({
  products,
  categories,
  cartMap,
  wishlistSet,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter((p) => p.categorySlug === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF4F6]/30">
      {/* 1. HERO SECTION */}
      <AnyaHero onNavigate={onNavigate} />

      {/* 2. SIGNATURE ARTISAN COLLECTION */}
      <section id="collection" className="py-16 sm:py-24 max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C97C89] block mb-2">
              SIGNATURE COLD-PROCESS RANGE
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2F2326] tracking-tight leading-tight"
              style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
            >
              Handcrafted Artisan{' '}
              <span
                className="italic font-normal text-[#C97C89] font-serif"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Botanical Soaps
              </span>
            </h2>
            <p className="text-sm text-[#6F5B60] mt-2 max-w-xl">
              Cured naturally for 28 days to create a long-lasting, velvety lather infused with pure essential oils and organic plant butters.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#2F2326] text-white shadow-xs'
                  : 'bg-white text-[#2F2326] border border-[#E7C8CF] hover:border-[#C97C89]'
              }`}
              style={{ clipPath: getAnyaClippedPolygon(6) }}
            >
              All Artisan Soaps ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.slug
                    ? 'bg-[#2F2326] text-white shadow-xs'
                    : 'bg-white text-[#2F2326] border border-[#E7C8CF] hover:border-[#C97C89]'
                }`}
                style={{ clipPath: getAnyaClippedPolygon(6) }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const qty = cartMap[product.id] || 0;
            const isWish = wishlistSet.has(product.id);
            return (
              <AnyaProductCard
                key={product.id}
                product={product}
                quantityInCart={qty}
                isWishlisted={isWish}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                onToggleWishlist={() => onToggleWishlist(product)}
                onProductClick={() => onNavigate(`/product/${product.id}`)}
              />
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <AnyaButton
            variant="outline"
            size="md"
            icon={<ArrowRight className="w-4 h-4 text-[#C97C89]" />}
            iconPosition="right"
            onClick={() => onNavigate('/shop')}
          >
            Explore Complete Soap Lookbook
          </AnyaButton>
        </div>
      </section>

      {/* 3. WHY ANYA / STANDARD OF CARE */}
      <AnyaWhySection onNavigate={onNavigate} />

      {/* 4. PROCESS SECTION */}
      <AnyaProcessSection />

      {/* 5. LIFESTYLE & FOUNDER NOTE */}
      <AnyaLifestyleSection />

      {/* 6. TESTIMONIALS */}
      <AnyaTestimonialsSection />

      {/* 7. SKIN QUIZ SECTION */}
      <AnyaSkinQuizSection
        products={products}
        onAddToCart={(p) => onAddToCart(p)}
        onNavigate={onNavigate}
      />

      {/* 8. FAQS */}
      <AnyaFaqSection />

      {/* 9. BOTTOM CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-[#2F2326] to-[#4A3B3E] text-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
          <Sparkles className="w-8 h-8 text-[#E39AA6] mx-auto mb-4" />
          <h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight"
            style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
          >
            Experience the Gentle Magic of True Cold-Process Soap
          </h2>
          <p className="text-sm sm:text-base text-[#D8B4BC] mt-3 max-w-xl mx-auto leading-relaxed">
            Free shipping on all orders over ₹1,500 across India. Handcrafted and shipped directly from our botanical studio in Coimbatore.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <AnyaButton
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('/shop')}
              className="font-semibold text-xs tracking-wider uppercase"
            >
              Shop The Entire Collection
            </AnyaButton>
          </div>
        </div>
      </section>
    </div>
  );
};
