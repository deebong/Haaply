import React, { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Plus, Minus, Bell, Clock, ShieldCheck } from 'lucide-react';
import { Product, ProductVariant, Category } from '../types';
import { ProductCard } from './ProductCard';
import {
  hasMultipleVariants,
  getDefaultVariant,
  getVariantQuantityInCart,
  getProductQuantityInCart,
} from '../utils/productUtils';
import { useTheme } from '../providers/ThemeProvider';
import { AtelierProductDetailPage } from '../themes/fashion/AtelierProductDetailPage';
import { AnyaProductDetailPage } from '../themes/anyasoaps/AnyaProductDetailPage';

interface ProductDetailPageProps {
  productId: string;
  products: Product[];
  categories: Category[];
  cartMap: Record<string, number>;
  wishlistSet: Set<string>;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onUpdateQuantity: (product: Product, newQuantity: number, variant?: ProductVariant) => void;
  onToggleWishlist: (product: Product) => void;
  onNotifyMe?: (product: Product) => void;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  products,
  categories,
  cartMap,
  wishlistSet,
  onAddToCart,
  onUpdateQuantity,
  onToggleWishlist,
  onNotifyMe,
  onNavigate,
}) => {
  const { theme } = useTheme();

  const product = useMemo(() => {
    return products.find((p) => p.id === productId);
  }, [products, productId]);

  // If active theme uses editorial fashion PDP, render AtelierProductDetailPage
  if (product && (theme.id === 'atelier' || (theme.capabilities?.pdpStyle === 'editorial-gallery' && theme.id !== 'anyasoaps'))) {
    return (
      <AtelierProductDetailPage
        product={product}
        onBack={() => onNavigate('/shop')}
        onAddToCart={(prod, v, qty = 1) => {
          for (let i = 0; i < qty; i++) {
            onAddToCart(prod, v);
          }
        }}
        onProductClick={(pId) => onNavigate(`/product/${pId}`)}
        onToggleWishlist={(pId) => {
          const found = products.find((p) => p.id === pId);
          if (found) onToggleWishlist(found);
        }}
        isWishlisted={wishlistSet.has(product.id)}
        allProducts={products}
      />
    );
  }

  // If active theme is Anya Soaps, render AnyaProductDetailPage
  if (product && theme.id === 'anyasoaps') {
    return (
      <AnyaProductDetailPage
        product={product}
        onBack={() => onNavigate('/shop')}
        onAddToCart={(prod, v, qty = 1) => {
          for (let i = 0; i < qty; i++) {
            onAddToCart(prod, v);
          }
        }}
        onProductClick={(pId) => onNavigate(`/product/${pId}`)}
        onToggleWishlist={(pId) => {
          const found = products.find((p) => p.id === pId);
          if (found) onToggleWishlist(found);
        }}
        isWishlisted={wishlistSet.has(product.id)}
        allProducts={products}
      />
    );
  }

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  useEffect(() => {
    if (product) {
      const defaultVariant = getDefaultVariant(product);
      setSelectedVariantId(defaultVariant.id);
    }
  }, [product]);

  const category = useMemo(() => {
    return categories.find((c) => c.slug === product?.categorySlug);
  }, [categories, product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  if (!product) {
    return (
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-[#004B68]">Product Not Found</h1>
        <p className="text-sm text-[#626B69] mt-2">
          The requested item is not available in our catalog.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/shop')}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#53B847] text-white text-xs font-semibold rounded-xl hover:bg-[#469e3c] transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Products</span>
        </button>
      </main>
    );
  }

  const currentVariant: ProductVariant = useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      const found = product.variants.find((v) => v.id === selectedVariantId);
      if (found) return found;
      return getDefaultVariant(product);
    }
    return getDefaultVariant(product);
  }, [product, selectedVariantId]);

  const isMultiVariant = hasMultipleVariants(product);
  const quantityInCart = getVariantQuantityInCart(
    cartMap,
    product.id,
    currentVariant.id,
    currentVariant.isDefault
  );
  const isWishlisted = wishlistSet.has(product.id);
  const effectiveStockStatus = currentVariant.stockStatus || product.stockStatus;
  const effectiveStockCount = currentVariant.stockCount ?? product.stockCount;
  const isOutOfStock = effectiveStockStatus === 'out_of_stock';
  const isLowStock = effectiveStockStatus === 'low_stock';
  const isMaxStockReached = effectiveStockCount !== undefined && quantityInCart >= effectiveStockCount;
  const categoryDisplayName = category?.name || product.category;

  return (
    <main id="product-detail-page" className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10">
      {/* 1. BREADCRUMBS */}
      <nav id="pdp-breadcrumbs" aria-label="Breadcrumb" className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[#626B69] mb-4 sm:mb-6">
        <button
          id="pdp-breadcrumb-home"
          type="button"
          onClick={() => onNavigate('/')}
          className="hover:text-[#004B68] transition-colors focus:outline-none"
        >
          Home
        </button>
        <span className="text-[#626B69]/60">/</span>
        <button
          id="pdp-breadcrumb-shop"
          type="button"
          onClick={() => onNavigate('/shop')}
          className="hover:text-[#004B68] transition-colors focus:outline-none"
        >
          Shop
        </button>
        <span className="text-[#626B69]/60">/</span>
        <button
          id="pdp-breadcrumb-category"
          type="button"
          onClick={() => onNavigate(`/category/${product.categorySlug}`)}
          className="hover:text-[#004B68] transition-colors focus:outline-none"
        >
          {categoryDisplayName}
        </button>
        <span className="text-[#626B69]/60">/</span>
        <span
          className="font-semibold text-[#172126] truncate max-w-[140px] xs:max-w-[200px] sm:max-w-xs md:max-w-md"
          title={product.name}
        >
          {product.name}
        </span>
      </nav>

      {/* 2. PRODUCT MAIN CARD */}
      <div className="bg-white rounded-[22px] border border-[#E7E7DF] p-4 sm:p-6 md:p-8 lg:p-10 mb-10 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 lg:gap-12 items-start">
          {/* LEFT: Product Imagery */}
          <div className="md:col-span-6 lg:col-span-5 relative">
            <div id="pdp-image-container" className="relative w-full aspect-square max-w-[460px] mx-auto rounded-[18px] overflow-hidden bg-[#F2F3ED] border border-[#E7E7DF]/70">
              <img
                id="pdp-product-image"
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
              />

              {product.isFreshToday && !isOutOfStock && (
                <div id="pdp-fresh-badge" className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#004B68] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-[#E7E7DF] shadow-xs">
                  FRESH TODAY
                </div>
              )}

              {isOutOfStock && (
                <div id="pdp-out-of-stock-overlay" className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center p-4">
                  <span className="bg-[#172126] text-white text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-md shadow-xs">
                    OUT OF STOCK
                  </span>
                </div>
              )}

              <button
                id="pdp-wishlist-heart-btn"
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors duration-150 min-w-[36px] min-h-[36px] flex items-center justify-center ${
                  isWishlisted
                    ? 'bg-white text-[#004B68] shadow-xs'
                    : 'bg-white/80 hover:bg-white text-[#626B69] hover:text-[#004B68]'
                }`}
                aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#004B68] text-[#004B68]' : ''}`} />
              </button>
            </div>
          </div>

          {/* RIGHT: Product Details & Controls */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => onNavigate(`/category/${product.categorySlug}`)}
                  className="text-xs font-bold text-[#53B847] hover:underline uppercase tracking-wider"
                >
                  {categoryDisplayName}
                </button>
                {isLowStock && !isOutOfStock && (
                  <span id="pdp-low-stock-badge" className="text-[10px] font-semibold text-[#c05621] bg-[#feebc8]/80 px-2 py-0.5 rounded">
                    Only {effectiveStockCount || 4} units left
                  </span>
                )}
              </div>

              {/* Title & Tamil */}
              <h1 id="pdp-product-name" className="text-2xl sm:text-3xl font-bold text-[#172126] tracking-tight break-words">
                {product.name}
              </h1>
              <p id="pdp-product-tamil-name" className="tamil-text text-base sm:text-lg text-[#004B68] font-medium mt-1 break-words">
                {product.tamilName}
              </p>

              {/* Pack Size & Preparation Time */}
              <div className="flex items-center gap-4 mt-3 text-xs sm:text-sm text-[#626B69]">
                <span>
                  Selected Pack: <strong className="text-[#172126]">{currentVariant.packSize || currentVariant.label}</strong>
                </span>
                {product.prepTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#53B847]" />
                    <span>{product.prepTime}</span>
                  </div>
                )}
              </div>

              {/* Price Row */}
              <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mt-4 pt-4 border-t border-[#E7E7DF]">
                <span id="pdp-price" className="text-2xl sm:text-3xl font-bold text-[#004B68]">
                  ₹{currentVariant.price}
                </span>
                {currentVariant.originalPrice && currentVariant.originalPrice > currentVariant.price && (
                  <span className="text-base text-[#626B69] line-through">
                    ₹{currentVariant.originalPrice}
                  </span>
                )}
                <span className="text-xs text-[#626B69] whitespace-nowrap">Inclusive of all taxes</span>
              </div>

              {/* VARIANT SELECTION: Rendered cleanly for products with multiple variants */}
              {isMultiVariant && product.variants && (
                <div id="pdp-variant-selector" className="mt-4 pt-4 border-t border-[#E7E7DF]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#172126] uppercase tracking-wider">
                      Select Size: <span className="text-[#004B68] font-semibold normal-case">{currentVariant.label}</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((variant) => {
                      const isSelected = variant.id === currentVariant.id;
                      const isVariantOutOfStock = variant.stockStatus === 'out_of_stock';
                      const variantQty = getVariantQuantityInCart(cartMap, product.id, variant.id, variant.isDefault);

                      return (
                        <button
                          key={variant.id}
                          id={`variant-btn-${variant.id}`}
                          type="button"
                          onClick={() => setSelectedVariantId(variant.id)}
                          disabled={isVariantOutOfStock}
                          className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 focus:outline-none ${
                            isSelected
                              ? 'bg-[#004B68] text-white border-[#004B68] shadow-xs ring-2 ring-[#004B68]/20'
                              : isVariantOutOfStock
                              ? 'bg-[#F2F3ED] text-[#626B69]/50 border-[#E7E7DF] line-through cursor-not-allowed'
                              : 'bg-white text-[#172126] border-[#E7E7DF] hover:border-[#37B4A1] hover:text-[#004B68]'
                          }`}
                        >
                          <span className="font-bold">{variant.label}</span>
                          {variantQty > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#53B847]/15 text-[#53B847]'
                            }`}>
                              {variantQty}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <p id="pdp-description" className="text-sm text-[#172126]/80 mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Ingredients (Rendered cleanly only when present in real product data) */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E7E7DF]">
                  <h3 className="text-xs font-bold text-[#172126] uppercase tracking-wider mb-1.5">Ingredients</h3>
                  <p className="text-xs text-[#626B69] leading-relaxed">
                    {product.ingredients.join(', ')}
                  </p>
                </div>
              )}

              {/* Freshness & Storage Note */}
              <div id="pdp-freshness-note" className="mt-4 p-3.5 bg-[#FAFAF6] rounded-xl border border-[#E7E7DF] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#53B847] shrink-0 mt-0.5" />
                <div className="text-xs text-[#626B69] leading-snug">
                  <strong className="text-[#172126] font-semibold">100% Fresh Daily Batch: </strong>
                  Prepared each morning using stone grinding. Zero preservatives, artificial flavors, or soda. Keep refrigerated at 4°C.
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div id="pdp-action-area" className="mt-6 pt-5 border-t border-[#E7E7DF]">
              {/* Primary Action Controls Row */}
              <div className="flex flex-wrap items-center gap-3">
                {isOutOfStock ? (
                  <button
                    id="pdp-notify-btn"
                    type="button"
                    onClick={() => onNotifyMe && onNotifyMe(product)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-[#004B68] bg-[#F2F3ED] hover:bg-[#E7E7DF] rounded-xl transition-colors h-[44px]"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notify when back in stock</span>
                  </button>
                ) : quantityInCart > 0 ? (
                  <div className="inline-flex items-center bg-[#53B847] text-white rounded-xl shadow-xs overflow-hidden h-[44px]">
                    <button
                      id="pdp-cart-decrease-btn"
                      type="button"
                      onClick={() => onUpdateQuantity(product, quantityInCart - 1, currentVariant)}
                      className="w-11 h-full flex items-center justify-center hover:bg-[#469e3c] transition-colors focus:outline-none"
                      aria-label={`Decrease quantity of ${product.name} ${currentVariant.label}`}
                    >
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <span id="pdp-cart-quantity" className="px-4 font-bold text-sm min-w-[36px] text-center select-none">
                      {quantityInCart} in basket
                    </span>
                    <button
                      id="pdp-cart-increase-btn"
                      type="button"
                      disabled={isMaxStockReached}
                      onClick={() => onUpdateQuantity(product, quantityInCart + 1, currentVariant)}
                      className={`w-11 h-full flex items-center justify-center transition-colors focus:outline-none ${
                        isMaxStockReached
                          ? 'opacity-40 cursor-not-allowed bg-[#469e3c]/50'
                          : 'hover:bg-[#469e3c]'
                      }`}
                      aria-label={`Increase quantity of ${product.name} ${currentVariant.label}`}
                      title={isMaxStockReached ? `Maximum available stock (${effectiveStockCount}) reached` : 'Increase quantity'}
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                ) : (
                  <button
                    id="pdp-add-to-cart-btn"
                    type="button"
                    onClick={() => onAddToCart(product, currentVariant)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#53B847] hover:bg-[#469e3c] text-white font-bold text-sm rounded-xl shadow-xs transition-colors h-[44px]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {currentVariant.label} to Basket</span>
                  </button>
                )}

                <button
                  id="pdp-save-for-later-btn"
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold transition-colors h-[44px] ${
                    isWishlisted
                      ? 'border-[#004B68] text-[#004B68] bg-[#004B68]/5'
                      : 'border-[#E7E7DF] text-[#626B69] hover:text-[#172126] bg-white'
                  }`}
                  aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} for later`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#004B68] text-[#004B68]' : ''}`} />
                  <span>{isWishlisted ? 'Saved in Wishlist' : 'Save for Later'}</span>
                </button>
              </div>

              {/* Stock Limit Feedback Message */}
              {isMaxStockReached && (
                <div id="pdp-stock-limit-feedback" className="mt-2.5 flex items-center gap-1.5 text-xs text-[#c05621] font-medium" aria-live="polite">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c05621] shrink-0" />
                  <span>Maximum stock reached for {currentVariant.label} ({effectiveStockCount} units)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section id="pdp-related-products" className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#004B68]">
              More from {categoryDisplayName}
            </h2>
            <button
              id="pdp-see-all-category-btn"
              type="button"
              onClick={() => onNavigate(`/category/${product.categorySlug}`)}
              className="text-xs font-semibold text-[#53B847] hover:underline"
            >
              See all {categoryDisplayName} →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                quantityInCart={getProductQuantityInCart(p, cartMap)}
                cartMap={cartMap}
                isWishlisted={wishlistSet.has(p.id)}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                onToggleWishlist={onToggleWishlist}
                onNotifyMe={onNotifyMe}
                onProductClick={(clicked) => onNavigate(`/product/${clicked.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
