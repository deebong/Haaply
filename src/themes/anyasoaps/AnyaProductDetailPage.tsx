import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  CheckCircle,
  Leaf,
  ShieldCheck,
  Droplets,
  Star,
  Share2,
} from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { AnyaProductCard } from './AnyaProductCard';
import { AnyaButton } from './AnyaButton';

interface AnyaProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  onProductClick: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  allProducts: Product[];
}

export const AnyaProductDetailPage: React.FC<AnyaProductDetailPageProps> = ({
  product,
  onBack,
  onAddToCart,
  onProductClick,
  onToggleWishlist,
  isWishlisted,
  allProducts,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'usage' | 'care'>('benefits');

  const variants = product.variants || [];
  const activeVariant = variants[selectedVariantIndex] || variants[0];

  const currentPrice = activeVariant?.price ?? product.price;
  const originalPrice = activeVariant?.originalPrice ?? product.originalPrice;

  const images = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [product]);

  const beautyAttrs = product.verticalAttributes as Record<string, any> | undefined;

  // Filter ONLY Anya products for related section
  const relatedAnyaProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.id !== product.id && p.id.startsWith('anya-'))
      .slice(0, 3);
  }, [allProducts, product.id]);

  const handleAddToCart = () => {
    onAddToCart(product, activeVariant, quantity);
  };

  return (
    <main className="flex-1 bg-[#FFF4F6]/20 pt-6 pb-16 sm:pb-24">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Back navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#2F2326] hover:text-[#8FA08C] transition-colors py-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Anya Collection</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#8E7A7E]">
            <span>Home</span>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="font-semibold text-[#2F2326]">{product.name}</span>
          </div>
        </div>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-3xl border border-[#E7C8CF] p-6 sm:p-10 shadow-xs">
          {/* LEFT: IMAGE GALLERY (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Large Image */}
            <div className="relative aspect-4/3 sm:aspect-16/11 w-full rounded-2xl overflow-hidden bg-[#FFF4F6] border border-[#E7C8CF]">
              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />

              {originalPrice && originalPrice > currentPrice && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#E39AA6] text-[#2F2326] shadow-xs">
                  Save ₹{originalPrice - currentPrice}
                </span>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isWishlisted
                    ? 'bg-[#E39AA6] text-[#2F2326]'
                    : 'bg-white/90 text-[#2F2326] hover:bg-white hover:text-[#8FA08C]'
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#2F2326] ring-2 ring-[#2F2326]/10'
                        : 'border-[#E7C8CF] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E7C8CF]/60 text-center">
              <div className="p-3 rounded-xl bg-[#FFF4F6] border border-[#E7C8CF]/50">
                <Leaf className="w-4 h-4 text-[#8FA08C] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#2F2326] block">Cold-Process</span>
                <span className="text-[10px] text-[#8E7A7E]">4 Weeks Natural Cure</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF4F6] border border-[#E7C8CF]/50">
                <Droplets className="w-4 h-4 text-[#8FA08C] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#2F2326] block">Natural Glycerin</span>
                <span className="text-[10px] text-[#8E7A7E]">Retains Vital Moisture</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF4F6] border border-[#E7C8CF]/50">
                <ShieldCheck className="w-4 h-4 text-[#8FA08C] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#2F2326] block">Zero Sulfates</span>
                <span className="text-[10px] text-[#8E7A7E]">Pure Plant Formulation</span>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS & PURCHASING (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold tracking-widest uppercase text-[#8FA08C]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-[#E09A55]">
                  <div className="flex gap-0.5">
                    {'★'.repeat(5)}
                  </div>
                  <span className="font-bold text-[#2F2326]">5.0 (42 verified reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#2F2326] tracking-tight leading-tight"
                style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
              >
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#2F2326]">
                  ₹{currentPrice}
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <span className="text-base text-[#8E7A7E] line-through">
                    ₹{originalPrice}
                  </span>
                )}
                <span className="text-xs text-[#8FA08C] font-semibold">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-[#6F5B60] leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selector if multiple exist */}
              {variants.length > 1 && (
                <div className="mt-6">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#2F2326] mb-2.5">
                    Select Pack Size / Weight:
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {variants.map((v, idx) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          selectedVariantIndex === idx
                            ? 'bg-[#FDECEF] border-[#8FA08C] ring-1 ring-[#8FA08C]'
                            : 'bg-white border-[#E7C8CF] hover:border-[#8FA08C]'
                        }`}
                      >
                        <span className="block text-xs font-bold text-[#2F2326]">{v.label}</span>
                        <span className="text-[11px] text-[#8E7A7E] mt-0.5">₹{v.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Skin Type tags */}
              {beautyAttrs?.skinType && (
                <div className="mt-5">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8E7A7E] mb-2">
                    Ideal For Skin Types:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(beautyAttrs.skinType as string[]).map((st) => (
                      <span
                        key={st}
                        className="px-2.5 py-1 rounded-lg text-xs bg-[#FFF4F6] text-[#2F2326] border border-[#E7C8CF]"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart Row */}
              <div className="mt-8 pt-6 border-t border-[#E7C8CF]/70 space-y-4">
                <div className="flex items-center gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center bg-[#FFF4F6] border border-[#E7C8CF] rounded-xl px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#2F2326] transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-[#2F2326]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#2F2326] transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <AnyaButton
                    variant="primary"
                    size="lg"
                    icon={<ShoppingBag className="w-4 h-4" />}
                    onClick={handleAddToCart}
                    className="flex-1 uppercase tracking-wider text-xs py-3.5"
                  >
                    Add to Cart • ₹{currentPrice * quantity}
                  </AnyaButton>
                </div>

                {/* Delivery perk note */}
                <p className="text-[11px] text-[#8E7A7E] text-center">
                  ✨ Orders placed before 1 PM dispatch the same day from our Coimbatore studio.
                </p>
              </div>
            </div>

            {/* TABS: Ingredients, Benefits, Usage, Care */}
            <div className="mt-8 pt-6 border-t border-[#E7C8CF]/70">
              <div className="flex border-b border-[#E7C8CF] text-xs font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setActiveTab('benefits')}
                  className={`pb-2.5 mr-5 border-b-2 transition-colors ${
                    activeTab === 'benefits'
                      ? 'border-[#2F2326] text-[#2F2326]'
                      : 'border-transparent text-[#8E7A7E] hover:text-[#2F2326]'
                  }`}
                >
                  Benefits
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-2.5 mr-5 border-b-2 transition-colors ${
                    activeTab === 'ingredients'
                      ? 'border-[#2F2326] text-[#2F2326]'
                      : 'border-transparent text-[#8E7A7E] hover:text-[#2F2326]'
                  }`}
                >
                  Ingredients
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('usage')}
                  className={`pb-2.5 mr-5 border-b-2 transition-colors ${
                    activeTab === 'usage'
                      ? 'border-[#2F2326] text-[#2F2326]'
                      : 'border-transparent text-[#8E7A7E] hover:text-[#2F2326]'
                  }`}
                >
                  Ritual Usage
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('care')}
                  className={`pb-2.5 border-b-2 transition-colors ${
                    activeTab === 'care'
                      ? 'border-[#2F2326] text-[#2F2326]'
                      : 'border-transparent text-[#8E7A7E] hover:text-[#2F2326]'
                  }`}
                >
                  Soap Care
                </button>
              </div>

              <div className="pt-4 text-xs sm:text-sm text-[#6F5B60] leading-relaxed min-h-[90px]">
                {activeTab === 'benefits' && (
                  <ul className="space-y-1.5 list-disc list-inside">
                    {beautyAttrs?.benefits ? (
                      (beautyAttrs.benefits as string[]).map((b, i) => (
                        <li key={i} className="text-[#2F2326] font-medium">{b}</li>
                      ))
                    ) : (
                      <li>Deep gentle cleanse that protects delicate skin lipids</li>
                    )}
                  </ul>
                )}
                {activeTab === 'ingredients' && (
                  <div>
                    <p className="font-medium text-[#2F2326] mb-1.5">Pure Key Actives:</p>
                    <p className="leading-relaxed">
                      {beautyAttrs?.ingredients
                        ? (beautyAttrs.ingredients as string[]).join(', ')
                        : 'Cold-Pressed Virgin Coconut Oil, Farm-Fresh Goat Milk, Raw Shea Butter, Essential Oils.'}
                    </p>
                  </div>
                )}
                {activeTab === 'usage' && (
                  <p>
                    {beautyAttrs?.usageInstructions ||
                      'Work up a rich, velvety lather between damp hands or a sisal washcloth. Massage over face and body in circular strokes, then rinse clean with lukewarm water.'}
                  </p>
                )}
                {activeTab === 'care' && (
                  <p>
                    {beautyAttrs?.careInstructions ||
                      'Because our cold-process soaps contain high natural glycerin and zero chemical hardeners, keep them on a well-draining wooden or ceramic dish away from direct water spray between uses.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED ANYA SOAPS ONLY */}
        {relatedAnyaProducts.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#8FA08C] block mb-1">
                  COMPLEMENTARY FORMULATIONS
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-semibold text-[#2F2326] tracking-tight"
                  style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
                >
                  Other Handcrafted Soaps You’ll Love
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onBack()}
                className="text-xs font-bold tracking-wider uppercase text-[#2F2326] hover:text-[#8FA08C] transition-colors"
              >
                View All Soaps →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedAnyaProducts.map((p) => (
                <AnyaProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={false}
                  onAddToCart={(prod, v) => onAddToCart(prod, v)}
                  onToggleWishlist={() => onToggleWishlist(p.id)}
                  onProductClick={() => onProductClick(p.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
