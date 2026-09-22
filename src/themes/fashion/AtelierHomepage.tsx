import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { AtelierHero } from './AtelierHero';
import { AtelierProductCard } from './AtelierProductCard';
import { FASHION_CATEGORIES, FASHION_PRODUCTS, FASHION_NEW_ARRIVALS_IDS, FASHION_BESTSELLERS_IDS } from '../../data/fashionDemoData';

interface AtelierHomepageProps {
  onNavigate: (path: string) => void;
  onProductClick: (productId: string) => void;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistIds?: string[];
}

export const AtelierHomepage: React.FC<AtelierHomepageProps> = ({
  onNavigate,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
}) => {
  const newArrivals = FASHION_PRODUCTS.filter((p) => FASHION_NEW_ARRIVALS_IDS.includes(p.id));
  const bestsellers = FASHION_PRODUCTS.filter((p) => FASHION_BESTSELLERS_IDS.includes(p.id));

  return (
    <div className="bg-[#FBFBF9] text-[#181818] min-h-screen">
      {/* 1. EDITORIAL HERO BANNER */}
      <AtelierHero
        onShopClick={() => onNavigate('/shop')}
        onExploreLookbook={() => onNavigate('/shop')}
      />

      {/* 2. PHILOSOPHY / CURATOR'S NOTE */}
      <section className="py-20 sm:py-28 max-w-[1000px] mx-auto px-6 text-center">
        <span className="text-xs tracking-[0.3em] uppercase text-[#8C7355] font-medium block mb-4">
          A Study in Quiet Forms
        </span>
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#141414] leading-relaxed font-serif"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          &ldquo;We design for the deliberate wardrobe. Understated tailoring sculpted in European flax linen, virgin wool, and raw cotton — devoid of seasonal noise.&rdquo;
        </h2>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs tracking-widest uppercase text-[#767676]">
          <span>Atelier Editions</span>
          <span>·</span>
          <span>Autumn 2026 Archive</span>
        </div>
      </section>

      {/* 3. CURATED DEPARTMENT ENTRY POINTS */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pb-20 sm:pb-28">
        <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-[#E8E6E1]">
          <h2
            className="text-2xl sm:text-3xl font-normal text-[#141414] font-serif"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Explore Departments
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('/shop')}
            className="text-xs tracking-[0.2em] uppercase font-medium text-[#767676] hover:text-[#141414] transition-colors flex items-center gap-1.5"
          >
            <span>All Apparel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {FASHION_CATEGORIES.slice(0, 4).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/category/${cat.slug}`)}
              className="group relative aspect-[3/4] bg-[#F2F1ED] overflow-hidden cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-5 inset-x-5 text-white">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/70 font-medium block">
                  Department
                </span>
                <h3
                  className="mt-1 text-lg sm:text-xl font-normal font-serif text-white group-hover:translate-x-1 transition-transform"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {cat.name}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] tracking-widest uppercase font-medium text-white/90">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NEW ARRIVALS GRID */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pb-24 sm:pb-32">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-[#E8E6E1]">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#8C7355] font-medium block">
              Recent Releases
            </span>
            <h2
              className="text-2xl sm:text-3xl font-normal text-[#141414] font-serif mt-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              New In Collection
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/shop')}
            className="mt-3 sm:mt-0 text-xs tracking-[0.2em] uppercase font-medium text-[#767676] hover:text-[#141414] transition-colors flex items-center gap-1.5"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {newArrivals.map((product) => (
            <AtelierProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      </section>

      {/* 5. FULL-BLEED LOOKBOOK EDITORIAL BANNER */}
      <section className="w-full bg-[#181818] text-[#FBFBF9] py-20 sm:py-28 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs tracking-[0.3em] uppercase text-[#8C7355] font-medium">
                The Lookbook
              </span>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-normal font-serif leading-tight text-[#FBFBF9]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                The Raw Linen & Indigo Series
              </h2>
              <p className="text-sm text-[#B0B0B0] font-light leading-relaxed">
                Documenting slow textures, unstructured silhouettes, and unwashed Japanese selvedge denim under shifting autumn light. Every piece designed to breathe, soften, and mold to the wearer over decades.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/shop')}
                  className="px-8 py-3.5 bg-[#FBFBF9] text-[#141414] hover:bg-[#E8E6E1] text-xs uppercase tracking-[0.2em] font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore The Lookbook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="aspect-[3/4] bg-[#242424] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
                  alt="Editorial Look 01"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] bg-[#242424] overflow-hidden mt-6 sm:mt-10">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
                  alt="Editorial Look 02"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BESTSELLERS / WARDROBE STAPLES */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-24 sm:py-32">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-[#E8E6E1]">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-[#8C7355] font-medium block">
              Enduring Utility
            </span>
            <h2
              className="text-2xl sm:text-3xl font-normal text-[#141414] font-serif mt-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              The Foundation Pieces
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/shop')}
            className="mt-3 sm:mt-0 text-xs tracking-[0.2em] uppercase font-medium text-[#767676] hover:text-[#141414] transition-colors flex items-center gap-1.5"
          >
            <span>Explore All Staples</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {bestsellers.map((product) => (
            <AtelierProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      </section>

      {/* 7. PHILOSOPHY PILLARS */}
      <section className="border-t border-[#E8E6E1] bg-[#F5F4F0] py-20 sm:py-24">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            <div className="space-y-3">
              <span className="text-xs tracking-[0.3em] uppercase text-[#8C7355] font-semibold">
                01 / Pure Fibers
              </span>
              <h3
                className="text-xl font-normal text-[#141414] font-serif"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Honest Natural Textiles
              </h3>
              <p className="text-xs sm:text-sm text-[#666] font-light leading-relaxed">
                Certified Belgian flax linen, extra-fine Australian merino wool, and selvedge Japanese cotton spun on vintage looms. Zero synthetic compromise.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs tracking-[0.3em] uppercase text-[#8C7355] font-semibold">
                02 / Architectural Tailoring
              </span>
              <h3
                className="text-xl font-normal text-[#141414] font-serif"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Constructed for Decades
              </h3>
              <p className="text-xs sm:text-sm text-[#666] font-light leading-relaxed">
                French-seamed interiors, genuine horn and shell buttoning, and reinforced stress points designed to endure frequent wear and graceful aging.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs tracking-[0.3em] uppercase text-[#8C7355] font-semibold">
                03 / Responsible Pace
              </span>
              <h3
                className="text-xl font-normal text-[#141414] font-serif"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Measured Small Batches
              </h3>
              <p className="text-xs sm:text-sm text-[#666] font-light leading-relaxed">
                We produce in disciplined micro-runs to prevent textile surplus. Each garment is numbered and backed by our complimentary repair warranty.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
