import React, { useState, useMemo } from 'react';
import { ArrowLeft, Heart, ChevronRight, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { AtelierProductCard } from './AtelierProductCard';

export interface AtelierProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  onProductClick?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  allProducts?: Product[];
}

export const AtelierProductDetailPage: React.FC<AtelierProductDetailPageProps> = ({
  product,
  onBack,
  onAddToCart,
  onProductClick,
  onToggleWishlist,
  isWishlisted = false,
  allProducts = [],
}) => {
  // Gallery image selection
  const imageList = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant selection (color & size)
  const variants = product.variants ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(() => {
    return variants.find((v) => v.isDefault)?.id || variants[0]?.id;
  });

  const activeVariant = useMemo(() => {
    return variants.find((v) => v.id === selectedVariantId) || variants[0];
  }, [variants, selectedVariantId]);

  // Extract available colors and sizes
  const availableColors = useMemo<string[]>(() => {
    const colorSet = new Set<string>();
    variants.forEach((v) => {
      if (v.options?.color) colorSet.add(v.options.color);
    });
    if (colorSet.size > 0) return Array.from(colorSet);
    const fAttr = product.verticalAttributes as { colors?: string[] } | undefined;
    if (fAttr?.colors && Array.isArray(fAttr.colors)) {
      return fAttr.colors;
    }
    return [];
  }, [variants, product]);

  const availableSizes = useMemo<string[]>(() => {
    const sizeSet = new Set<string>();
    variants.forEach((v) => {
      if (v.options?.size) sizeSet.add(v.options.size);
    });
    if (sizeSet.size > 0) return Array.from(sizeSet);
    const fAttr = product.verticalAttributes as { sizes?: string[] } | undefined;
    if (fAttr?.sizes && Array.isArray(fAttr.sizes)) {
      return fAttr.sizes;
    }
    return [];
  }, [variants, product]);

  const [selectedColor, setSelectedColor] = useState<string>(() => {
    return activeVariant?.options?.color || availableColors[0] || '';
  });

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return activeVariant?.options?.size || availableSizes[0] || '';
  });

  // Handle color change: update active variant
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    const match = variants.find((v) => v.options?.color === color && (selectedSize ? v.options?.size === selectedSize : true));
    if (match) {
      setSelectedVariantId(match.id);
    } else {
      const anyColorMatch = variants.find((v) => v.options?.color === color);
      if (anyColorMatch) {
        setSelectedVariantId(anyColorMatch.id);
        if (anyColorMatch.options?.size) {
          setSelectedSize(anyColorMatch.options.size);
        }
      }
    }
  };

  // Handle size change: update active variant
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    const match = variants.find((v) => v.options?.size === size && (selectedColor ? v.options?.color === selectedColor : true));
    if (match) {
      setSelectedVariantId(match.id);
    } else {
      const anySizeMatch = variants.find((v) => v.options?.size === size);
      if (anySizeMatch) {
        setSelectedVariantId(anySizeMatch.id);
      }
    }
  };

  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const currentPrice = activeVariant?.price ?? product.price;
  const originalPrice = activeVariant?.originalPrice ?? product.originalPrice;
  const hasDiscount = originalPrice && originalPrice > currentPrice;

  const handleAddToCart = () => {
    onAddToCart(product, activeVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  // Fashion vertical attributes
  const attrs = product.verticalAttributes as Record<string, unknown> | undefined;
  const fabric = typeof attrs?.fabric === 'string' ? attrs.fabric : null;
  const material = typeof attrs?.material === 'string' ? attrs.material : null;
  const fit = typeof attrs?.fit === 'string' ? attrs.fit : null;
  const careInstructions = Array.isArray(attrs?.careInstructions) ? (attrs.careInstructions as string[]) : null;

  // Curated recommendations (excluding current product)
  const recommendations = useMemo(() => {
    return allProducts
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product.id]);

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#181818] pb-24">
      {/* 1. BREADCRUMBS & BACK BUTTON */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-5 flex items-center justify-between border-b border-[#E8E6E1]/60">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs tracking-wider uppercase font-medium text-[#767676] hover:text-[#181818] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collection</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-[11px] tracking-widest uppercase text-[#767676]">
          <span>Atelier</span>
          <ChevronRight className="w-3 h-3 text-[#A8A8A8]" />
          <span>{product.category}</span>
          <ChevronRight className="w-3 h-3 text-[#A8A8A8]" />
          <span className="text-[#181818] font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* 2. MAIN PRODUCT VIEW (EDITORIAL SPLIT LAYOUT) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* LEFT: MULTI-IMAGE GALLERY (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnail Strip (Desktop) */}
            {imageList.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[750px] scrollbar-none shrink-0">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 md:w-20 md:h-26 shrink-0 bg-[#F2F1ED] overflow-hidden border transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#141414] ring-1 ring-[#141414]'
                        : 'border-[#E8E6E1] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Primary Main Image (3:4 High-Resolution Portrait) */}
            <div className="relative flex-grow aspect-[3/4] bg-[#F2F1ED] overflow-hidden">
              <img
                src={imageList[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />

              {/* Wishlist Button on Primary Image */}
              <button
                type="button"
                onClick={() => onToggleWishlist?.(product.id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/85 hover:bg-white backdrop-blur-xs flex items-center justify-center text-[#181818] transition-all shadow-sm focus:outline-none"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart
                  className={`w-5 h-5 stroke-[1.5] ${
                    isWishlisted ? 'fill-[#141414] text-[#141414]' : 'text-[#181818]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* RIGHT: EDITORIAL INFORMATION PANEL (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-7">
            {/* Category & Title */}
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-[#767676] font-medium">
                {product.category}
              </span>
              <h1
                className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-normal text-[#141414] leading-tight font-serif"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-xl sm:text-2xl font-medium text-[#141414] tracking-tight">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-sm sm:text-base text-[#767676] line-through font-light">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-[#767676] tracking-wider uppercase font-light">
                  Inclusive of all taxes
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#4A4A4A] font-light leading-relaxed">
              {product.description}
            </p>

            {/* COLOR SELECTION */}
            {availableColors.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[#E8E6E1]">
                <div className="flex items-center justify-between text-xs tracking-wider uppercase font-medium">
                  <span className="text-[#181818]">Color:</span>
                  <span className="text-[#767676] font-normal">{selectedColor || 'Select Color'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={`px-3.5 py-2 text-xs tracking-wider uppercase font-medium border transition-all ${
                          isSelected
                            ? 'border-[#141414] bg-[#141414] text-[#FBFBF9]'
                            : 'border-[#E8E6E1] bg-white text-[#181818] hover:border-[#141414]'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SIZE SELECTION */}
            {availableSizes.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs tracking-wider uppercase font-medium">
                  <span className="text-[#181818]">Select Size</span>
                  <button
                    type="button"
                    className="text-[#767676] hover:text-[#181818] underline underline-offset-4 text-[11px] normal-case"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeSelect(size)}
                        className={`h-11 flex items-center justify-center text-xs tracking-wider uppercase font-medium border transition-all ${
                          isSelected
                            ? 'border-[#141414] bg-[#141414] text-[#FBFBF9]'
                            : 'border-[#E8E6E1] bg-white text-[#181818] hover:border-[#141414]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUANTITY & ADD TO BAG */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center border border-[#E8E6E1] bg-white h-12 px-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-base text-[#767676] hover:text-[#181818] px-2"
                  >
                    –
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-[#181818]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-base text-[#767676] hover:text-[#181818] px-2"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-grow h-12 bg-[#141414] hover:bg-[#2E2E2E] text-[#FBFBF9] text-xs tracking-[0.2em] uppercase font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <span>Add to Bag</span>
                  )}
                </button>
              </div>

              {/* Secondary Wishlist Action */}
              <button
                type="button"
                onClick={() => onToggleWishlist?.(product.id)}
                className="w-full h-11 border border-[#E8E6E1] bg-white hover:border-[#141414] text-xs tracking-[0.15em] uppercase font-medium text-[#181818] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#141414]' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* MATERIAL, FABRIC & CARE SPECIFICATIONS */}
            <div className="pt-6 border-t border-[#E8E6E1] space-y-4">
              <h3 className="text-xs tracking-[0.2em] uppercase font-medium text-[#181818]">
                Material & Composition
              </h3>

              <dl className="grid grid-cols-1 gap-2 text-xs">
                {fabric && (
                  <div className="flex justify-between py-1 border-b border-[#E8E6E1]/50">
                    <dt className="text-[#767676] uppercase tracking-wider">Fabric</dt>
                    <dd className="font-medium text-[#181818] text-right">{fabric}</dd>
                  </div>
                )}
                {material && (
                  <div className="flex justify-between py-1 border-b border-[#E8E6E1]/50">
                    <dt className="text-[#767676] uppercase tracking-wider">Hardware</dt>
                    <dd className="font-medium text-[#181818] text-right">{material}</dd>
                  </div>
                )}
                {fit && (
                  <div className="flex justify-between py-1 border-b border-[#E8E6E1]/50">
                    <dt className="text-[#767676] uppercase tracking-wider">Silhouette & Fit</dt>
                    <dd className="font-medium text-[#181818] text-right">{fit}</dd>
                  </div>
                )}
              </dl>

              {careInstructions && careInstructions.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] tracking-wider uppercase text-[#767676] font-medium mb-1.5">
                    Garment Care
                  </p>
                  <ul className="space-y-1 text-xs text-[#4A4A4A] list-disc list-inside font-light">
                    {careInstructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ASSURANCES & LOGISTICS */}
            <div className="pt-4 border-t border-[#E8E6E1] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#767676]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#181818] shrink-0" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#181818] shrink-0" />
                <span>14-Day Free Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#181818] shrink-0" />
                <span>Ethically Sourced</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CURATED RECOMMENDATIONS: YOU MAY ALSO ADMIRE */}
        {recommendations.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#E8E6E1]">
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
              <h2
                className="text-2xl sm:text-3xl font-normal text-[#141414] font-serif"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                You May Also Admire
              </h2>
              <span className="text-xs tracking-[0.2em] uppercase text-[#767676] mt-2 sm:mt-0">
                Curated Wardrobe Pairings
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {recommendations.map((rec) => (
                <AtelierProductCard
                  key={rec.id}
                  product={rec}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
