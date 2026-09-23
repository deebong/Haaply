import React from 'react';
import { X, ShoppingBag, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react';
import { CartItem, Product, ProductVariant } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';
import { useTheme } from '../providers/ThemeProvider';
import { useActiveStore } from '../providers/StoreProvider';
import { AnyaButton } from '../themes/anyasoaps/AnyaButton';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (product: Product, newQuantity: number, variant?: ProductVariant) => void;
  onCheckout: () => void;
  onViewCart?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onCheckout,
  onViewCart,
}) => {
  const { theme } = useTheme();
  const { activeStore } = useActiveStore();
  const isAtelier = theme.id === 'atelier' || activeStore.vertical === 'fashion';
  const isAnya = theme.id === 'anyasoaps' || activeStore.vertical === 'beauty';

  // Centralized scroll-lock: locks document scroll, handles mobile touch, and supports Escape key
  useScrollLock(isOpen, onClose);

  if (!isOpen) return null;

  const isBag = theme.capabilities?.cartLabel === 'Bag' || isAtelier;
  const cartTitle = isAnya ? 'Your Artisan Bag' : isBag ? 'Your Shopping Bag' : 'Your Fresh Basket';

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.variant?.price ?? item.product.price) * item.quantity,
    0
  );

  const freeDeliveryThreshold = activeStore?.delivery?.freeDeliveryThreshold ?? (isAtelier ? 3000 : 199);
  const defaultFee = activeStore?.delivery?.standardDeliveryFee ?? (isAtelier ? 150 : 25);
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : defaultFee;
  const grandTotal = subtotal + deliveryFee;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={cartTitle}
    >
      {/* Backdrop with touch-none to prevent touch-drag bleeding */}
      <div
        className="fixed inset-0 bg-[#172126]/30 backdrop-blur-xs transition-opacity touch-none"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className={`w-screen max-w-full sm:max-w-md shadow-2xl flex flex-col ${
          isAnya ? 'bg-white border-l border-[#E7C8CF]' : 'bg-white border-l border-[#E7E7DF]'
        }`}>
          {/* Header */}
          <div className={`px-4 py-4 sm:px-6 sm:py-5 border-b flex items-center justify-between ${
            isAnya ? 'border-[#E7C8CF] bg-[#FFF4F6]/50' : 'border-[#E7E7DF]'
          }`}>
            <div className="flex items-center gap-2">
              <ShoppingBag className={`w-5 h-5 ${
                isAnya ? 'text-[#8FA08C]' : isAtelier ? 'text-[#181818]' : 'text-[var(--color-primary)]'
              }`} />
              <h3 className={`text-base sm:text-lg font-bold ${
                isAnya
                  ? 'text-[#2F2326] font-semibold'
                  : isAtelier
                  ? 'text-[#141414] font-serif tracking-tight'
                  : 'text-[#172126]'
              }`} style={isAnya ? { fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" } : undefined}>
                {cartTitle}
              </h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isAnya
                  ? 'bg-[#FDECEF] text-[#4A3B3E]'
                  : 'bg-[#F2F3ED] text-[#626B69]'
              }`}>
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} {isAtelier ? 'pieces' : isAnya ? 'bars' : 'items'}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isAnya
                  ? 'text-[#6F5B60] hover:text-[#2F2326] hover:bg-[#FDECEF]'
                  : 'text-[#626B69] hover:text-[#172126] hover:bg-[#F2F3ED]'
              }`}
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery progress banner */}
          <div className={`px-4 py-2.5 sm:px-6 border-b text-xs ${
            isAnya
              ? 'bg-[#FFF8FA] border-[#E7C8CF]/70'
              : 'bg-[#FAFAF6] border-[#E7E7DF]/70'
          }`}>
            {amountNeededForFreeDelivery === 0 ? (
              <p className={`font-semibold flex items-center gap-1.5 ${
                isAnya
                  ? 'text-[#8FA08C]'
                  : isAtelier
                  ? 'text-[#181818]'
                  : 'text-[#53B847]'
              }`}>
                <span>✓</span> {isAnya ? 'You qualify for Free Insured Studio Delivery!' : isAtelier ? 'You qualify for Complimentary Express Delivery!' : 'You qualify for Free Fresh Delivery!'}
              </p>
            ) : (
              <p className={isAnya ? 'text-[#6F5B60]' : 'text-[#626B69]'}>
                Add <strong className={isAnya ? 'text-[#2F2326]' : isAtelier ? 'text-[#181818]' : 'text-[#004B68]'}>₹{amountNeededForFreeDelivery}</strong> more for {isAnya ? 'free studio delivery' : isAtelier ? 'complimentary delivery' : 'free delivery'}
              </p>
            )}
            <div className={`w-full h-1.5 rounded-full mt-1.5 overflow-hidden ${
              isAnya ? 'bg-[#E7C8CF]/60' : 'bg-[#E7E7DF]'
            }`}>
              <div
                className={`h-full transition-all duration-300 ${
                  isAnya
                    ? 'bg-[#8FA08C]'
                    : isAtelier
                    ? 'bg-[#181818]'
                    : 'bg-[#53B847]'
                }`}
                style={{
                  width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div
            data-modal-scrollable="true"
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 overscroll-contain"
          >
            {cartItems.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isAnya ? 'bg-[#FDECEF] text-[#8FA08C]' : 'bg-[#F2F3ED] text-[#626B69]'
                }`}>
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className={`text-base font-bold ${
                  isAnya
                    ? 'text-[#2F2326]'
                    : isAtelier
                    ? 'text-[#141414] font-serif'
                    : 'text-[#172126]'
                }`} style={isAnya ? { fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" } : undefined}>
                  {isAnya ? 'Your artisan bag is empty' : isAtelier ? 'Your bag is empty' : 'Your basket is empty'}
                </h4>
                <p className={`text-xs mt-1 max-w-xs mx-auto ${isAnya ? 'text-[#6F5B60]' : 'text-[#626B69]'}`}>
                  {isAnya
                    ? 'Explore our small-batch cold-process soaps cured naturally with pure organic botanicals.'
                    : isAtelier
                    ? 'Explore contemporary tailored silhouettes, fine-knit layers, and luxury natural fabrics.'
                    : 'Add some freshly ground batters, wholesome millets, or fresh paneer to get started.'}
                </p>
                {isAnya ? (
                  <div className="mt-5">
                    <AnyaButton
                      variant="primary"
                      size="sm"
                      onClick={onClose}
                    >
                      Explore Artisan Soaps
                    </AnyaButton>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className={`mt-5 px-5 py-2.5 text-xs font-semibold rounded-[12px] transition-colors ${
                      isAtelier
                        ? 'bg-[#181818] text-white hover:bg-black'
                        : 'text-[#53B847] bg-[#53B847]/10 hover:bg-[#53B847]/20'
                    }`}
                  >
                    {isAtelier ? 'Explore Collection' : "Explore Today's Fresh Picks"}
                  </button>
                )}
              </div>
            ) : (
              cartItems.map((item) => {
                const { product, quantity, variant } = item;
                const unitPrice = variant?.price ?? product.price;
                const lineTotal = unitPrice * quantity;
                const packDisplay = variant?.options
                  ? Object.entries(variant.options).map(([k, v]) => `${k}: ${v}`).join(' • ')
                  : (variant?.packSize || variant?.label || product.packSize);
                const stockLimit = variant?.stockCount ?? product.stockCount;
                const isMaxStock = stockLimit !== undefined && quantity >= stockLimit;
                const itemKey = variant ? `${product.id}:${variant.id}` : product.id;

                return (
                  <div
                    key={itemKey}
                    className={`flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-[14px] border ${
                      isAnya
                        ? 'border-[#E7C8CF] bg-[#FFF8FA]/60 shadow-2xs'
                        : 'border-[#E7E7DF] bg-[#FAFAF6]/50'
                    }`}
                  >
                    <img
                      src={variant?.image || product.image}
                      alt={product.name}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[10px] object-cover shrink-0 border ${
                        isAnya ? 'border-[#E7C8CF] bg-[#FFF4F6]' : 'border-[#E7E7DF] bg-white'
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className={`text-sm font-semibold truncate ${
                        isAnya ? 'text-[#2F2326]' : 'text-[#172126]'
                      }`} style={isAnya ? { fontFamily: "'Urbanist', sans-serif" } : undefined}>
                        {product.name}
                      </h5>
                      <p className={`text-xs ${isAnya ? 'text-[#6F5B60]' : 'text-[#626B69]'}`}>
                        {product.tamilName ? `${product.tamilName} • ` : ''}
                        <span className={
                          isAnya
                            ? 'text-[#8FA08C] font-medium'
                            : isAtelier
                            ? 'text-[#8C7355] font-medium'
                            : 'text-[var(--color-accent)] font-medium'
                        }>
                          {packDisplay}
                        </span>
                      </p>
                      <div className={`text-sm font-bold mt-1 ${isAnya ? 'text-[#2F2326]' : 'text-[#172126]'}`}>
                        ₹{lineTotal}
                        {quantity > 1 && (
                          <span className={`text-xs font-normal ml-1 ${isAnya ? 'text-[#8E7A7E]' : 'text-[#626B69]'}`}>
                            (₹{unitPrice} each)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity adjustment */}
                    <div className={`flex items-center gap-1 border rounded-[10px] p-0.5 ${
                      isAnya
                        ? 'bg-white border-[#E7C8CF]'
                        : 'bg-white border-[#E7E7DF]'
                    }`}>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product, quantity - 1, variant)}
                        className={`w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center transition-colors ${
                          isAnya ? 'text-[#6F5B60] hover:text-[#2F2326]' : 'text-[#626B69] hover:text-[#172126]'
                        }`}
                        aria-label={`Decrease quantity of ${product.name} ${packDisplay}`}
                      >
                        {quantity === 1 ? (
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className={`w-6 text-center text-xs font-bold ${
                        isAnya ? 'text-[#2F2326]' : 'text-[#172126]'
                      }`}>
                        {quantity}
                      </span>
                      <button
                        type="button"
                        disabled={isMaxStock}
                        onClick={() => onUpdateQuantity(product, quantity + 1, variant)}
                        className={`w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                          isAnya ? 'text-[#6F5B60] hover:text-[#2F2326]' : 'text-[#626B69] hover:text-[#172126]'
                        }`}
                        aria-label={`Increase quantity of ${product.name} ${packDisplay}`}
                        title={isMaxStock ? `Only ${stockLimit} in stock` : 'Increase quantity'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with totals & checkout */}
          {cartItems.length > 0 && (
            <div className={`p-4 sm:p-6 border-t space-y-3 ${
              isAnya ? 'border-[#E7C8CF] bg-[#FFF8FA]' : 'border-[#E7E7DF] bg-[#FAFAF6]'
            }`}>
              <div className={`space-y-1.5 text-xs ${isAnya ? 'text-[#6F5B60]' : 'text-[#626B69]'}`}>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className={`font-semibold ${isAnya ? 'text-[#2F2326]' : 'text-[#172126]'}`}>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isAnya ? 'Studio Delivery' : isAtelier ? 'Express Delivery' : 'Fresh Delivery'}</span>
                  <span className={`font-semibold ${isAnya ? 'text-[#2F2326]' : 'text-[#172126]'}`}>
                    {deliveryFee === 0 ? (
                      <span className={isAnya ? 'text-[#8FA08C] font-bold' : isAtelier ? 'text-[#181818] font-bold' : 'text-[#53B847]'}>FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className={`flex justify-between text-sm font-bold pt-2 border-t ${
                  isAnya ? 'border-[#E7C8CF] text-[#2F2326]' : isAtelier ? 'border-[#E7E7DF] text-[#141414]' : 'border-[#E7E7DF] text-[#004B68]'
                }`}>
                  <span>Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {isAnya ? (
                <AnyaButton
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={onCheckout}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Proceed to Checkout
                </AnyaButton>
              ) : (
                <button
                  type="button"
                  onClick={onCheckout}
                  className={`w-full py-3.5 text-white text-sm font-bold rounded-[12px] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[44px] ${
                    isAtelier
                      ? 'bg-[#181818] hover:bg-black tracking-wider uppercase text-xs'
                      : 'bg-[#53B847] hover:bg-[#469e3c]'
                  }`}
                >
                  <span>{isAtelier ? 'Proceed to Checkout' : 'Proceed to Delivery Slot'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {onViewCart && (
                isAnya ? (
                  <AnyaButton
                    id="drawer-view-full-cart-btn"
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      onClose();
                      onViewCart();
                    }}
                  >
                    Review Artisan Bag
                  </AnyaButton>
                ) : (
                  <button
                    id="drawer-view-full-cart-btn"
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewCart();
                    }}
                    className={`w-full py-2.5 bg-white border text-xs font-bold rounded-[12px] transition-colors flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer ${
                      isAtelier
                        ? 'border-[#E7E7DF] text-[#181818] hover:border-[#181818]'
                        : 'border-[#E7E7DF] text-[#004B68]'
                    }`}
                  >
                    <span>{isAtelier ? 'Review Bag' : 'View Full Basket'}</span>
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

