import React from 'react';
import { ShoppingBag, Plus, Minus, ArrowRight, Trash2, ArrowLeft, Heart, ShieldCheck } from 'lucide-react';
import { CartItem, Product, ProductVariant } from '../types';
import { useTheme } from '../providers/ThemeProvider';
import { useActiveStore } from '../providers/StoreProvider';
import { AnyaButton } from '../themes/anyasoaps/AnyaButton';

interface CartPageProps {
  cartItems: CartItem[];
  cartMap: Record<string, number>;
  onAddToCart?: (product: Product, variant?: ProductVariant) => void;
  onUpdateQuantity: (product: Product, newQuantity: number, variant?: ProductVariant) => void;
  onToggleWishlist?: (product: Product) => void;
  wishlistSet?: Set<string>;
  onNavigate: (path: string) => void;
  onProceedToCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onToggleWishlist,
  wishlistSet,
  onNavigate,
  onProceedToCheckout,
}) => {
  const { theme } = useTheme();
  const { activeStore } = useActiveStore();
  const isAtelier = theme.id === 'atelier' || activeStore.vertical === 'fashion';
  const isAnya = theme.id === 'anyasoaps' || activeStore.vertical === 'beauty';

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.variant?.price ?? item.product.price) * item.quantity,
    0
  );

  const freeDeliveryThreshold = activeStore?.delivery?.freeDeliveryThreshold ?? (isAtelier ? 3000 : isAnya ? 1500 : 199);
  const defaultFee = activeStore?.delivery?.standardDeliveryFee ?? (isAtelier ? 150 : isAnya ? 80 : 25);
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : defaultFee;
  const grandTotal = subtotal + deliveryFee;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const pageTitle = isAnya ? 'Artisan Bag' : isAtelier ? 'Shopping Bag' : 'Your Basket';

  return (
    <main
      id="cart-page"
      className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10"
    >
      {/* 1. BREADCRUMBS */}
      <nav
        id="cart-breadcrumbs"
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[#626B69] mb-4 sm:mb-6"
      >
        <button
          id="cart-breadcrumb-home"
          type="button"
          onClick={() => onNavigate('/')}
          className={`hover:underline transition-colors focus:outline-none ${
            isAnya ? 'hover:text-[#2F2326]' : isAtelier ? 'hover:text-[#181818]' : 'hover:text-[#004B68]'
          }`}
        >
          Home
        </button>
        <span className="text-[#626B69]/60">/</span>
        <button
          id="cart-breadcrumb-shop"
          type="button"
          onClick={() => onNavigate('/shop')}
          className={`hover:underline transition-colors focus:outline-none ${
            isAnya ? 'hover:text-[#2F2326]' : isAtelier ? 'hover:text-[#181818]' : 'hover:text-[#004B68]'
          }`}
        >
          {isAnya ? 'Artisan Soaps' : isAtelier ? 'Collection' : 'Shop'}
        </button>
        <span className="text-[#626B69]/60">/</span>
        <span className={`font-semibold ${isAnya ? 'text-[#2F2326]' : 'text-[#172126]'}`}>{pageTitle}</span>
      </nav>

      {/* 2. HEADING & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6 sm:mb-8">
        <div>
          <h1
            id="cart-heading"
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isAnya ? 'text-[#2F2326] font-serif' : isAtelier ? 'text-[#141414] font-serif' : 'text-[#004B68]'
            }`}
            style={isAnya ? { fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" } : undefined}
          >
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#626B69] mt-1">
            {totalItemsCount > 0
              ? `${totalItemsCount} ${totalItemsCount === 1 ? (isAnya ? 'bar' : isAtelier ? 'piece' : 'item') : (isAnya ? 'bars' : isAtelier ? 'pieces' : 'items')} selected`
              : (isAnya ? 'Review your botanical soaps before proceeding to dispatch' : isAtelier ? 'Review pieces before proceeding to checkout' : 'Review items before proceeding to delivery slot')}
          </p>
        </div>

        {totalItemsCount > 0 && (
          <button
            id="cart-continue-shopping-top"
            type="button"
            onClick={() => onNavigate('/shop')}
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors focus:outline-none py-1 ${
              isAnya ? 'text-[#8FA08C] hover:text-[#6F5B60]' : isAtelier ? 'text-[#181818] hover:text-[#767676]' : 'text-[#53B847] hover:text-[#469e3c]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
        )}
      </div>

      {/* 3. EMPTY STATE */}
      {cartItems.length === 0 ? (
        <div
          id="cart-empty-state"
          className={`bg-white rounded-[22px] border p-8 sm:p-12 md:p-16 text-center max-w-2xl mx-auto shadow-xs my-6 ${
            isAnya ? 'border-[#E7C8CF]' : 'border-[#E7E7DF]'
          }`}
        >
          <div className={`w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center ${
            isAnya ? 'bg-[#FFF4F6] text-[#8FA08C]' : 'bg-[#F2F3ED] text-[#626B69]'
          }`}>
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>

          <h2 className={`text-xl sm:text-2xl font-bold ${
            isAnya ? 'text-[#2F2326] font-serif' : isAtelier ? 'text-[#141414] font-serif' : 'text-[#172126]'
          }`} style={isAnya ? { fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" } : undefined}>
            {isAnya ? 'Your artisan bag is empty' : isAtelier ? 'Your shopping bag is empty' : 'Your basket is empty'}
          </h2>
          <p className="text-sm text-[#626B69] mt-2 max-w-md mx-auto leading-relaxed">
            {isAnya
              ? 'Discover our handmade cold-process botanical soaps, pure herbal oils, and nourishing body balms crafted in small batches.'
              : isAtelier
              ? 'Discover contemporary tailored silhouettes, fine-knit layers, and luxury natural fabrics.'
              : 'Discover fresh foods prepared for your home. Stone-ground batters, organic millets, and daily dairy crafted with zero preservatives.'}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAnya ? (
              <AnyaButton
                id="cart-empty-explore-btn"
                variant="primary"
                size="md"
                onClick={() => onNavigate('/shop')}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Explore Artisan Soaps
              </AnyaButton>
            ) : (
              <button
                id="cart-empty-explore-btn"
                type="button"
                onClick={() => onNavigate('/shop')}
                className={`w-full sm:w-auto px-6 py-3 text-white text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[44px] ${
                  isAtelier
                    ? 'bg-[#181818] hover:bg-black uppercase tracking-wider text-xs rounded-xl'
                    : 'bg-[#53B847] hover:bg-[#469e3c] rounded-xl'
                }`}
              >
                <span>{isAtelier ? 'Explore Collection' : 'Explore Fresh Foods'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-[#E7E7DF] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#626B69]">
            <div className="flex items-center justify-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAnya ? 'bg-[#8FA08C]' : isAtelier ? 'bg-[#181818]' : 'bg-[#53B847]'}`} />
              <span>{isAnya ? '100% Plant-Based' : isAtelier ? 'Complimentary Courier' : 'Zero Preservatives'}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAnya ? 'bg-[#8FA08C]' : isAtelier ? 'bg-[#181818]' : 'bg-[#53B847]'}`} />
              <span>{isAnya ? 'Cold-Process Artisan' : isAtelier ? 'Artisanal Tailoring' : 'Stone-Ground Daily'}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAnya ? 'bg-[#8FA08C]' : isAtelier ? 'bg-[#181818]' : 'bg-[#53B847]'}`} />
              <span>{isAnya ? 'Studio Direct Dispatch' : isAtelier ? '14-Day Exchanges' : 'Doorstep Morning Slot'}</span>
            </div>
          </div>
        </div>
      ) : (
        /* 4. ACTIVE BASKET: 2-COLUMN LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT: Cart Items List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Free delivery qualification progress banner */}
            <div
              id="cart-free-delivery-banner"
              className={`p-4 rounded-2xl border text-xs ${
                isAnya ? 'bg-[#FFF8FA] border-[#E7C8CF]' : 'bg-[#FAFAF6] border-[#E7E7DF]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                {amountNeededForFreeDelivery === 0 ? (
                  <p className={`font-semibold flex items-center gap-1.5 text-xs sm:text-sm ${
                    isAnya ? 'text-[#8FA08C]' : isAtelier ? 'text-[#181818]' : 'text-[#53B847]'
                  }`}>
                    <span className="text-base">✓</span> {isAnya ? 'You qualify for Free Studio Delivery!' : isAtelier ? 'You qualify for Complimentary Express Delivery!' : 'You qualify for Free Fresh Morning Delivery!'}
                  </p>
                ) : (
                  <p className="text-[#626B69] text-xs sm:text-sm">
                    Add <strong className={isAnya ? 'text-[#2F2326]' : isAtelier ? 'text-[#181818]' : 'text-[#004B68]'}>₹{amountNeededForFreeDelivery}</strong> more to unlock <strong className={isAnya ? 'text-[#8FA08C]' : isAtelier ? 'text-[#181818]' : 'text-[#53B847]'}>{isAnya ? 'Free Studio Shipping' : isAtelier ? 'Complimentary Delivery' : 'Free Delivery'}</strong>
                  </p>
                )}
                <span className="text-[11px] font-medium text-[#626B69]">
                  {amountNeededForFreeDelivery === 0 ? 'Unlocked' : `Threshold: ₹${freeDeliveryThreshold}`}
                </span>
              </div>

              <div className="w-full h-2 bg-[#E7E7DF] rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isAnya ? 'bg-[#8FA08C]' : isAtelier ? 'bg-[#181818]' : 'bg-[#53B847]'
                  }`}
                  style={{
                    width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Cart Items Card */}
            <div
              id="cart-items-card"
              className={`bg-white rounded-[22px] border overflow-hidden shadow-xs divide-y ${
                isAnya ? 'border-[#E7C8CF] divide-[#E7C8CF]/60' : 'border-[#E7E7DF] divide-[#E7E7DF]'
              }`}
            >
              {cartItems.map((item) => {
                const { product, quantity, variant } = item;
                const unitPrice = variant?.price ?? product.price;
                const lineTotal = unitPrice * quantity;
                const packDisplay = variant?.options
                  ? Object.entries(variant.options).map(([k, v]) => `${k}: ${v}`).join(' • ')
                  : (variant?.packSize || variant?.label || product.packSize);
                const stockLimit = variant?.stockCount ?? product.stockCount;
                const isMaxStock = stockLimit !== undefined && quantity >= stockLimit;
                const isWishlisted = wishlistSet?.has(product.id);
                const itemKey = variant ? `${product.id}:${variant.id}` : product.id;

                return (
                  <div
                    key={itemKey}
                    id={`cart-item-${itemKey}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors hover:bg-[#FAFAF6]/40"
                  >
                    {/* Product Image */}
                    <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/product/${product.id}`)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 hover:opacity-90 transition-opacity focus:outline-none border ${
                          isAnya ? 'bg-[#FFF8FA] border-[#E7C8CF]' : 'bg-[#F2F3ED] border-[#E7E7DF]'
                        }`}
                        aria-label={`View details for ${product.name}`}
                      >
                        <img
                          src={variant?.image || product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </button>

                      <div className="flex-1 min-w-0">
                        <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                          isAnya ? 'text-[#8FA08C]' : isAtelier ? 'text-[#767676]' : 'text-[#53B847]'
                        }`}>
                          {product.category}
                        </span>
                        <h3 className={`text-sm sm:text-base font-semibold truncate transition-colors ${
                          isAnya ? 'text-[#2F2326] hover:text-[#8FA08C]' : 'text-[#172126] hover:text-[#004B68]'
                        }`}>
                          <button
                            type="button"
                            onClick={() => onNavigate(`/product/${product.id}`)}
                            className="text-left focus:outline-none"
                          >
                            {product.name}
                          </button>
                        </h3>
                        {product.tamilName && (
                          <p className={`tamil-text text-xs sm:text-sm mt-0.5 ${
                            isAnya ? 'text-[#6F5B60]' : isAtelier ? 'text-[#767676]' : 'text-[#004B68]'
                          }`}>
                            {product.tamilName}
                          </p>
                        )}
                        <p className="text-xs text-[#626B69] mt-0.5">
                          <span className={isAnya ? 'text-[#8FA08C] font-medium' : isAtelier ? 'text-[#8C7355] font-medium' : 'font-semibold text-[#004B68]'}>{packDisplay}</span> • ₹{unitPrice} each
                        </p>

                        {/* Stock warning notice */}
                        {isMaxStock && (
                          <p className="text-[11px] text-[#c05621] font-medium mt-1">
                            Maximum stock reached ({stockLimit} units)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls & Line Total */}
                    <div className={`flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 ${
                      isAnya ? 'border-[#E7C8CF]/60' : 'border-[#E7E7DF]/60'
                    }`}>
                      {/* Actions: Save for later & Remove */}
                      <div className="flex items-center gap-2">
                        {onToggleWishlist && (
                          <button
                            type="button"
                            onClick={() => onToggleWishlist(product)}
                            className={`p-2 rounded-lg transition-colors ${
                              isAnya
                                ? 'text-[#8E7A7E] hover:text-[#2F2326] hover:bg-[#FFF4F6]'
                                : isAtelier
                                ? 'text-[#626B69] hover:text-[#181818] hover:bg-[#F2F3ED]'
                                : 'text-[#626B69] hover:text-[#004B68] hover:bg-[#F2F3ED]'
                            }`}
                            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} for later`}
                            title={isWishlisted ? 'Saved in wishlist' : 'Save for later'}
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? (isAnya ? 'fill-[#8FA08C] text-[#8FA08C]' : isAtelier ? 'fill-[#181818] text-[#181818]' : 'fill-[#004B68] text-[#004B68]') : ''}`} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product, 0, variant)}
                          className="p-2 text-[#626B69] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={`Remove ${product.name} (${packDisplay}) from basket`}
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Stepper */}
                      <div className={`inline-flex items-center rounded-xl shadow-xs overflow-hidden h-[38px] sm:h-[40px] ${
                        isAnya
                          ? 'bg-[#2F2326] text-white rounded-[10px]'
                          : isAtelier
                          ? 'bg-[#181818] text-white'
                          : 'bg-[#53B847] text-white'
                      }`}>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product, quantity - 1, variant)}
                          className={`w-9 h-full flex items-center justify-center transition-colors focus:outline-none ${
                            isAnya ? 'hover:bg-[#4A3B3E]' : isAtelier ? 'hover:bg-black' : 'hover:bg-[#469e3c]'
                          }`}
                          aria-label={`Decrease quantity of ${product.name} ${packDisplay}`}
                        >
                          {quantity === 1 ? (
                            <Trash2 className="w-3.5 h-3.5" />
                          ) : (
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                        </button>
                        <span className="px-3 font-bold text-xs sm:text-sm min-w-[32px] text-center select-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          disabled={isMaxStock}
                          onClick={() => onUpdateQuantity(product, quantity + 1, variant)}
                          className={`w-9 h-full flex items-center justify-center transition-colors focus:outline-none ${
                            isMaxStock
                              ? 'opacity-40 cursor-not-allowed bg-black/50'
                              : (isAnya ? 'hover:bg-[#4A3B3E]' : isAtelier ? 'hover:bg-black' : 'hover:bg-[#469e3c]')
                          }`}
                          aria-label={`Increase quantity of ${product.name} ${packDisplay}`}
                          title={isMaxStock ? `Maximum available stock (${stockLimit}) reached` : 'Increase quantity'}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[70px]">
                        <span className={`text-base sm:text-lg font-bold ${
                          isAnya ? 'text-[#2F2326]' : isAtelier ? 'text-[#141414]' : 'text-[#004B68]'
                        }`}>
                          ₹{lineTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions: Continue Shopping */}
            <div className="pt-2 flex items-center justify-between">
              {isAnya ? (
                <AnyaButton
                  id="cart-continue-shopping-bottom"
                  variant="secondary"
                  size="md"
                  onClick={() => onNavigate('/shop')}
                  icon={<ArrowLeft className="w-4 h-4 text-[#8FA08C]" />}
                  iconPosition="left"
                >
                  Continue Shopping
                </AnyaButton>
              ) : (
                <button
                  id="cart-continue-shopping-bottom"
                  type="button"
                  onClick={() => onNavigate('/shop')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-white hover:bg-[#FAFAF6] text-xs sm:text-sm font-semibold transition-colors shadow-2xs ${
                    isAtelier ? 'border-[#E7E7DF] text-[#141414]' : 'border-[#E7E7DF] text-[#172126]'
                  }`}
                >
                  <ArrowLeft className={`w-4 h-4 ${
                    isAtelier ? 'text-[#181818]' : 'text-[#53B847]'
                  }`} />
                  <span>Continue Shopping</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Sticky Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div
              id="cart-order-summary-card"
              className={`bg-white rounded-[22px] border p-5 sm:p-6 shadow-xs space-y-5 ${
                isAnya ? 'border-[#E7C8CF]' : 'border-[#E7E7DF]'
              }`}
            >
              <h2 className={`text-base sm:text-lg font-bold border-b pb-3.5 ${
                isAnya
                  ? 'text-[#2F2326] font-serif border-[#E7C8CF]'
                  : isAtelier
                  ? 'text-[#141414] font-serif border-[#E7E7DF]'
                  : 'text-[#004B68] border-[#E7E7DF]'
              }`} style={isAnya ? { fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" } : undefined}>
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs sm:text-sm text-[#626B69]">
                <div className="flex justify-between">
                  <span>Item Subtotal ({totalItemsCount} {totalItemsCount === 1 ? (isAnya ? 'bar' : isAtelier ? 'piece' : 'item') : (isAnya ? 'bars' : isAtelier ? 'pieces' : 'items')})</span>
                  <span className={`font-semibold ${isAnya ? 'text-[#2F2326]' : 'text-[#172126]'}`}>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span>{isAnya ? 'Studio Express Shipping' : isAtelier ? 'Express Courier Shipping' : 'Fresh Morning Delivery'}</span>
                    <span className="text-[11px] text-[#626B69]/80">
                      {deliveryFee === 0 ? `Free above ₹${freeDeliveryThreshold}` : `Flat rate under ₹${freeDeliveryThreshold}`}
                    </span>
                  </div>
                  <span className="font-semibold text-[#172126]">
                    {deliveryFee === 0 ? (
                      <span className={isAnya ? 'text-[#8FA08C] font-bold' : isAtelier ? 'text-[#181818] font-bold' : 'text-[#53B847]'}>FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className={`pt-3 border-t flex items-baseline justify-between ${
                  isAnya ? 'border-[#E7C8CF]' : 'border-[#E7E7DF]'
                }`}>
                  <div>
                    <span className={`text-sm sm:text-base font-bold ${
                      isAnya ? 'text-[#2F2326]' : isAtelier ? 'text-[#141414]' : 'text-[#004B68]'
                    }`}>Total Amount</span>
                    <p className="text-[11px] text-[#626B69]">Inclusive of all taxes</p>
                  </div>
                  <span id="cart-grand-total" className={`text-xl sm:text-2xl font-bold ${
                    isAnya ? 'text-[#2F2326]' : isAtelier ? 'text-[#141414]' : 'text-[#004B68]'
                  }`}>
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Guarantee Notice */}
              <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs text-[#626B69] ${
                isAnya ? 'bg-[#FFF8FA] border-[#E7C8CF]' : 'bg-[#FAFAF6] border-[#E7E7DF]'
              }`}>
                <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${
                  isAnya ? 'text-[#8FA08C]' : isAtelier ? 'text-[#181818]' : 'text-[#53B847]'
                }`} />
                <div className="leading-snug">
                  <strong className={`font-semibold ${isAnya ? 'text-[#2F2326]' : 'text-[#172126]'}`}>
                    {isAnya ? 'Anya Botanical Guarantee: ' : isAtelier ? 'Atelier Quality Guarantee: ' : 'Fresh Morning Dispatch: '}
                  </strong>
                  {isAnya
                    ? '100% plant-based formulation, cure-tested for 4 weeks with zero synthetic foaming agents or harsh sulfates.'
                    : isAtelier
                    ? 'Premium natural fibers, expert craftsmanship, and complimentary 14-day exchanges.'
                    : 'Prepared each morning using stone grinding. Packed fresh with zero preservatives.'}
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              {isAnya ? (
                <AnyaButton
                  id="cart-proceed-checkout-btn"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={onProceedToCheckout}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Proceed to Checkout
                </AnyaButton>
              ) : (
                <button
                  id="cart-proceed-checkout-btn"
                  type="button"
                  onClick={onProceedToCheckout}
                  className={`w-full py-3.5 sm:py-4 text-white text-sm sm:text-base font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px] ${
                    isAtelier
                      ? 'bg-[#181818] hover:bg-black uppercase tracking-wider text-xs rounded-xl'
                      : 'bg-[#53B847] hover:bg-[#469e3c] rounded-xl'
                  }`}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <p className="text-[11px] text-center text-[#626B69]">
                {isAnya
                  ? 'Select delivery address and studio dispatch options in the next step'
                  : isAtelier
                  ? 'Select shipping destination and options in the next step'
                  : 'Select your preferred morning delivery slot in the next step'}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
