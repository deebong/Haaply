import React from 'react';
import { ShoppingBag, Plus, Minus, ArrowRight, Trash2, ArrowLeft, Heart, ShieldCheck } from 'lucide-react';
import { CartItem, Product, ProductVariant } from '../types';
import { useTheme } from '../providers/ThemeProvider';

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
  const isAtelier = theme.id === 'atelier';

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.variant?.price ?? item.product.price) * item.quantity,
    0
  );

  const freeDeliveryThreshold = isAtelier ? 3000 : 199;
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : (isAtelier ? 150 : 25);
  const grandTotal = subtotal + deliveryFee;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const pageTitle = isAtelier ? 'Shopping Bag' : 'Your Basket';

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
          className="hover:text-[#004B68] transition-colors focus:outline-none"
        >
          Home
        </button>
        <span className="text-[#626B69]/60">/</span>
        <button
          id="cart-breadcrumb-shop"
          type="button"
          onClick={() => onNavigate('/shop')}
          className="hover:text-[#004B68] transition-colors focus:outline-none"
        >
          {isAtelier ? 'Collection' : 'Shop'}
        </button>
        <span className="text-[#626B69]/60">/</span>
        <span className="font-semibold text-[#172126]">{pageTitle}</span>
      </nav>

      {/* 2. HEADING & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6 sm:mb-8">
        <div>
          <h1
            id="cart-heading"
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isAtelier ? 'text-[#141414] font-serif' : 'text-[#004B68]'
            }`}
          >
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#626B69] mt-1">
            {totalItemsCount > 0
              ? `${totalItemsCount} ${totalItemsCount === 1 ? (isAtelier ? 'piece' : 'item') : (isAtelier ? 'pieces' : 'items')} selected`
              : (isAtelier ? 'Review pieces before proceeding to checkout' : 'Review items before proceeding to delivery slot')}
          </p>
        </div>

        {totalItemsCount > 0 && (
          <button
            id="cart-continue-shopping-top"
            type="button"
            onClick={() => onNavigate('/shop')}
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors focus:outline-none py-1 ${
              isAtelier ? 'text-[#181818] hover:text-[#767676]' : 'text-[#53B847] hover:text-[#469e3c]'
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
          className="bg-white rounded-[22px] border border-[#E7E7DF] p-8 sm:p-12 md:p-16 text-center max-w-2xl mx-auto shadow-xs my-6"
        >
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#F2F3ED] flex items-center justify-center text-[#626B69]">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>

          <h2 className={`text-xl sm:text-2xl font-bold ${isAtelier ? 'text-[#141414] font-serif' : 'text-[#172126]'}`}>
            {isAtelier ? 'Your shopping bag is empty' : 'Your basket is empty'}
          </h2>
          <p className="text-sm text-[#626B69] mt-2 max-w-md mx-auto leading-relaxed">
            {isAtelier
              ? 'Discover contemporary tailored silhouettes, fine-knit layers, and luxury natural fabrics.'
              : 'Discover fresh foods prepared for your home. Stone-ground batters, organic millets, and daily dairy crafted with zero preservatives.'}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="cart-empty-explore-btn"
              type="button"
              onClick={() => onNavigate('/shop')}
              className={`w-full sm:w-auto px-6 py-3 text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[44px] ${
                isAtelier ? 'bg-[#181818] hover:bg-black uppercase tracking-wider text-xs' : 'bg-[#53B847] hover:bg-[#469e3c]'
              }`}
            >
              <span>{isAtelier ? 'Explore Collection' : 'Explore Fresh Foods'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E7E7DF] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#626B69]">
            <div className="flex items-center justify-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAtelier ? 'bg-[#181818]' : 'bg-[#53B847]'}`} />
              <span>{isAtelier ? 'Complimentary Courier' : 'Zero Preservatives'}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAtelier ? 'bg-[#181818]' : 'bg-[#53B847]'}`} />
              <span>{isAtelier ? 'Artisanal Tailoring' : 'Stone-Ground Daily'}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isAtelier ? 'bg-[#181818]' : 'bg-[#53B847]'}`} />
              <span>{isAtelier ? '14-Day Exchanges' : 'Doorstep Morning Slot'}</span>
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
              className="p-4 bg-[#FAFAF6] rounded-2xl border border-[#E7E7DF] text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                {amountNeededForFreeDelivery === 0 ? (
                  <p className={`font-semibold flex items-center gap-1.5 text-xs sm:text-sm ${
                    isAtelier ? 'text-[#181818]' : 'text-[#53B847]'
                  }`}>
                    <span className="text-base">✓</span> {isAtelier ? 'You qualify for Complimentary Express Delivery!' : 'You qualify for Free Fresh Morning Delivery!'}
                  </p>
                ) : (
                  <p className="text-[#626B69] text-xs sm:text-sm">
                    Add <strong className={isAtelier ? 'text-[#181818]' : 'text-[#004B68]'}>₹{amountNeededForFreeDelivery}</strong> more to unlock <strong className={isAtelier ? 'text-[#181818]' : 'text-[#53B847]'}>{isAtelier ? 'Complimentary Delivery' : 'Free Delivery'}</strong>
                  </p>
                )}
                <span className="text-[11px] font-medium text-[#626B69]">
                  {amountNeededForFreeDelivery === 0 ? 'Unlocked' : `Threshold: ₹${freeDeliveryThreshold}`}
                </span>
              </div>

              <div className="w-full h-2 bg-[#E7E7DF] rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isAtelier ? 'bg-[#181818]' : 'bg-[#53B847]'
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
              className="bg-white rounded-[22px] border border-[#E7E7DF] divide-y divide-[#E7E7DF] overflow-hidden shadow-xs"
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
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F2F3ED] border border-[#E7E7DF] shrink-0 hover:opacity-90 transition-opacity focus:outline-none"
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
                          isAtelier ? 'text-[#767676]' : 'text-[#53B847]'
                        }`}>
                          {product.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-[#172126] truncate hover:text-[#004B68] transition-colors">
                          <button
                            type="button"
                            onClick={() => onNavigate(`/product/${product.id}`)}
                            className="text-left focus:outline-none"
                          >
                            {product.name}
                          </button>
                        </h3>
                        {product.tamilName && (
                          <p className="tamil-text text-xs sm:text-sm text-[#004B68] mt-0.5">
                            {product.tamilName}
                          </p>
                        )}
                        <p className="text-xs text-[#626B69] mt-0.5">
                          <span className={isAtelier ? 'text-[#8C7355] font-medium' : 'font-semibold text-[#004B68]'}>{packDisplay}</span> • ₹{unitPrice} each
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
                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E7E7DF]/60">
                      {/* Actions: Save for later & Remove */}
                      <div className="flex items-center gap-2">
                        {onToggleWishlist && (
                          <button
                            type="button"
                            onClick={() => onToggleWishlist(product)}
                            className="p-2 text-[#626B69] hover:text-[#004B68] hover:bg-[#F2F3ED] rounded-lg transition-colors"
                            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} for later`}
                            title={isWishlisted ? 'Saved in wishlist' : 'Save for later'}
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? (isAtelier ? 'fill-[#181818] text-[#181818]' : 'fill-[#004B68] text-[#004B68]') : ''}`} />
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
                        isAtelier ? 'bg-[#181818] text-white' : 'bg-[#53B847] text-white'
                      }`}>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product, quantity - 1, variant)}
                          className={`w-9 h-full flex items-center justify-center transition-colors focus:outline-none ${
                            isAtelier ? 'hover:bg-black' : 'hover:bg-[#469e3c]'
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
                              : (isAtelier ? 'hover:bg-black' : 'hover:bg-[#469e3c]')
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
                          isAtelier ? 'text-[#141414]' : 'text-[#004B68]'
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
              <button
                id="cart-continue-shopping-bottom"
                type="button"
                onClick={() => onNavigate('/shop')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E7E7DF] bg-white hover:bg-[#FAFAF6] text-xs sm:text-sm font-semibold text-[#172126] transition-colors shadow-2xs"
              >
                <ArrowLeft className={`w-4 h-4 ${isAtelier ? 'text-[#181818]' : 'text-[#53B847]'}`} />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Sticky Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div
              id="cart-order-summary-card"
              className="bg-white rounded-[22px] border border-[#E7E7DF] p-5 sm:p-6 shadow-xs space-y-5"
            >
              <h2 className={`text-base sm:text-lg font-bold border-b border-[#E7E7DF] pb-3.5 ${
                isAtelier ? 'text-[#141414] font-serif' : 'text-[#004B68]'
              }`}>
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs sm:text-sm text-[#626B69]">
                <div className="flex justify-between">
                  <span>Item Subtotal ({totalItemsCount} {totalItemsCount === 1 ? 'piece' : 'pieces'})</span>
                  <span className="font-semibold text-[#172126]">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span>{isAtelier ? 'Express Courier Shipping' : 'Fresh Morning Delivery'}</span>
                    <span className="text-[11px] text-[#626B69]/80">
                      {deliveryFee === 0 ? `Free above ₹${freeDeliveryThreshold}` : `Flat rate under ₹${freeDeliveryThreshold}`}
                    </span>
                  </div>
                  <span className="font-semibold text-[#172126]">
                    {deliveryFee === 0 ? (
                      <span className={isAtelier ? 'text-[#181818] font-bold' : 'text-[#53B847]'}>FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E7E7DF] flex items-baseline justify-between">
                  <div>
                    <span className={`text-sm sm:text-base font-bold ${isAtelier ? 'text-[#141414]' : 'text-[#004B68]'}`}>Total Amount</span>
                    <p className="text-[11px] text-[#626B69]">Inclusive of all taxes</p>
                  </div>
                  <span id="cart-grand-total" className={`text-xl sm:text-2xl font-bold ${isAtelier ? 'text-[#141414]' : 'text-[#004B68]'}`}>
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Guarantee Notice */}
              <div className="p-3 bg-[#FAFAF6] rounded-xl border border-[#E7E7DF] flex items-start gap-2.5 text-xs text-[#626B69]">
                <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${isAtelier ? 'text-[#181818]' : 'text-[#53B847]'}`} />
                <div className="leading-snug">
                  <strong className="text-[#172126] font-semibold">
                    {isAtelier ? 'Atelier Quality Guarantee: ' : 'Fresh Morning Dispatch: '}
                  </strong>
                  {isAtelier
                    ? 'Premium natural fibers, expert craftsmanship, and complimentary 14-day exchanges.'
                    : 'Prepared each morning using stone grinding. Packed fresh with zero preservatives.'}
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                id="cart-proceed-checkout-btn"
                type="button"
                onClick={onProceedToCheckout}
                className={`w-full py-3.5 sm:py-4 text-white text-sm sm:text-base font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px] ${
                  isAtelier
                    ? 'bg-[#181818] hover:bg-black uppercase tracking-wider text-xs'
                    : 'bg-[#53B847] hover:bg-[#469e3c]'
                }`}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#626B69]">
                {isAtelier
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
