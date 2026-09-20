import React from 'react';
import { ShoppingBag, Plus, Minus, ArrowRight, Trash2, ShieldCheck, ArrowLeft, Heart } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartPageProps {
  cartItems: CartItem[];
  cartMap: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, newQuantity: number) => void;
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
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 199 || subtotal === 0 ? 0 : 25;
  const grandTotal = subtotal + deliveryFee;
  const freeDeliveryThreshold = 199;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
          Shop
        </button>
        <span className="text-[#626B69]/60">/</span>
        <span className="font-semibold text-[#172126]">Your Basket</span>
      </nav>

      {/* 2. HEADING & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6 sm:mb-8">
        <div>
          <h1
            id="cart-heading"
            className="text-2xl sm:text-3xl font-bold text-[#004B68] tracking-tight"
          >
            Your Basket
          </h1>
          <p className="text-xs sm:text-sm text-[#626B69] mt-1">
            {totalItemsCount > 0
              ? `${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'} selected for fresh morning delivery`
              : 'Review items before proceeding to delivery slot'}
          </p>
        </div>

        {totalItemsCount > 0 && (
          <button
            id="cart-continue-shopping-top"
            type="button"
            onClick={() => onNavigate('/shop')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#53B847] hover:text-[#469e3c] transition-colors focus:outline-none py-1"
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
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#F2F3ED] flex items-center justify-center text-[#004B68]">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#172126]">
            Your basket is empty
          </h2>
          <p className="text-sm text-[#626B69] mt-2 max-w-md mx-auto leading-relaxed">
            Discover fresh foods prepared for your home. Stone-ground batters, organic millets, and daily dairy crafted with zero preservatives.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="cart-empty-explore-btn"
              type="button"
              onClick={() => onNavigate('/shop')}
              className="w-full sm:w-auto px-6 py-3 bg-[#53B847] hover:bg-[#469e3c] text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Explore Fresh Foods</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E7E7DF] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#626B69]">
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#53B847]" />
              <span>Zero Preservatives</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#53B847]" />
              <span>Stone-Ground Daily</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#53B847]" />
              <span>Doorstep Morning Slot</span>
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
                  <p className="text-[#53B847] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                    <span className="text-base">✓</span> You qualify for Free Fresh Morning Delivery!
                  </p>
                ) : (
                  <p className="text-[#626B69] text-xs sm:text-sm">
                    Add <strong className="text-[#004B68]">₹{amountNeededForFreeDelivery}</strong> more to unlock <strong className="text-[#53B847]">Free Delivery</strong>
                  </p>
                )}
                <span className="text-[11px] font-medium text-[#626B69]">
                  {amountNeededForFreeDelivery === 0 ? 'Unlocked' : `Threshold: ₹${freeDeliveryThreshold}`}
                </span>
              </div>

              <div className="w-full h-2 bg-[#E7E7DF] rounded-full mt-2.5 overflow-hidden">
                <div
                  className="h-full bg-[#53B847] transition-all duration-300 rounded-full"
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
              {cartItems.map(({ product, quantity }) => {
                const isMaxStock = product.stockCount !== undefined && quantity >= product.stockCount;
                const isWishlisted = wishlistSet?.has(product.id);

                return (
                  <div
                    key={product.id}
                    id={`cart-item-${product.id}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors hover:bg-[#FAFAF6]/40"
                  >
                    {/* Product Image */}
                    <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/product/${product.id}`)}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F2F3ED] border border-[#E7E7DF] shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#53B847]"
                        aria-label={`View details for ${product.name}`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </button>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#53B847] uppercase tracking-wider">
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
                        <p className="tamil-text text-xs sm:text-sm text-[#004B68] mt-0.5">
                          {product.tamilName}
                        </p>
                        <p className="text-xs text-[#626B69] mt-0.5">
                          Pack: <span className="font-medium text-[#172126]">{product.packSize}</span> • ₹{product.price} each
                        </p>

                        {/* Stock warning notice */}
                        {isMaxStock && (
                          <p className="text-[11px] text-[#c05621] font-medium mt-1">
                            Maximum stock reached ({product.stockCount} units)
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
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#004B68] text-[#004B68]' : ''}`} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product, 0)}
                          className="p-2 text-[#626B69] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={`Remove ${product.name} from basket`}
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Stepper */}
                      <div className="inline-flex items-center bg-[#53B847] text-white rounded-xl shadow-xs overflow-hidden h-[38px] sm:h-[40px]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product, quantity - 1)}
                          className="w-9 h-full flex items-center justify-center hover:bg-[#469e3c] transition-colors focus:outline-none"
                          aria-label={`Decrease quantity of ${product.name}`}
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
                          onClick={() => onUpdateQuantity(product, quantity + 1)}
                          className={`w-9 h-full flex items-center justify-center transition-colors focus:outline-none ${
                            isMaxStock
                              ? 'opacity-40 cursor-not-allowed bg-[#469e3c]/50'
                              : 'hover:bg-[#469e3c]'
                          }`}
                          aria-label={`Increase quantity of ${product.name}`}
                          title={isMaxStock ? `Maximum available stock (${product.stockCount}) reached` : 'Increase quantity'}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-base sm:text-lg font-bold text-[#004B68]">
                          ₹{product.price * quantity}
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
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E7E7DF] bg-white hover:bg-[#FAFAF6] text-xs sm:text-sm font-semibold text-[#004B68] transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-[#53B847]" />
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
              <h2 className="text-base sm:text-lg font-bold text-[#004B68] border-b border-[#E7E7DF] pb-3.5">
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs sm:text-sm text-[#626B69]">
                <div className="flex justify-between">
                  <span>Item Subtotal ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-[#172126]">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span>Fresh Morning Delivery</span>
                    <span className="text-[11px] text-[#626B69]/80">
                      {deliveryFee === 0 ? 'Free above ₹199' : 'Flat rate under ₹199'}
                    </span>
                  </div>
                  <span className="font-semibold text-[#172126]">
                    {deliveryFee === 0 ? (
                      <span className="text-[#53B847]">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E7E7DF] flex items-baseline justify-between">
                  <div>
                    <span className="text-sm sm:text-base font-bold text-[#004B68]">Total Amount</span>
                    <p className="text-[11px] text-[#626B69]">Inclusive of all taxes</p>
                  </div>
                  <span id="cart-grand-total" className="text-xl sm:text-2xl font-bold text-[#004B68]">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Stone-ground Fresh Daily Guarantee Notice */}
              <div className="p-3 bg-[#FAFAF6] rounded-xl border border-[#E7E7DF] flex items-start gap-2.5 text-xs text-[#626B69]">
                <ShieldCheck className="w-4 h-4 text-[#53B847] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong className="text-[#172126] font-semibold">Fresh Morning Dispatch: </strong>
                  Prepared each morning using stone grinding. Packed fresh with zero preservatives.
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                id="cart-proceed-checkout-btn"
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 sm:py-4 bg-[#53B847] hover:bg-[#469e3c] text-white text-sm sm:text-base font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#626B69]">
                Select your preferred morning delivery slot in the next step
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
