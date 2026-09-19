import React from 'react';
import { X, ShoppingBag, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (product: Product, newQuantity: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 199 || subtotal === 0 ? 0 : 25;
  const grandTotal = subtotal + deliveryFee;
  const freeDeliveryThreshold = 199;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#172126]/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#E7E7DF] flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E7E7DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#53B847]" />
              <h3 className="text-lg font-bold text-[#004B68]">
                Your Fresh Basket
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F2F3ED] text-[#626B69]">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#626B69] hover:text-[#172126] rounded-lg hover:bg-[#F2F3ED] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery progress banner */}
          <div className="px-6 py-2.5 bg-[#FAFAF6] border-b border-[#E7E7DF]/70 text-xs">
            {amountNeededForFreeDelivery === 0 ? (
              <p className="text-[#53B847] font-semibold flex items-center gap-1.5">
                <span>✓</span> You qualify for Free Fresh Delivery!
              </p>
            ) : (
              <p className="text-[#626B69]">
                Add <strong className="text-[#004B68]">₹{amountNeededForFreeDelivery}</strong> more for free delivery
              </p>
            )}
            <div className="w-full h-1.5 bg-[#E7E7DF] rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-[#53B847] transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F2F3ED] flex items-center justify-center text-[#626B69]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-[#172126]">
                  Your basket is empty
                </h4>
                <p className="text-xs text-[#626B69] mt-1 max-w-xs mx-auto">
                  Add some freshly ground batters, wholesome millets, or fresh paneer to get started.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 px-5 py-2 text-xs font-semibold text-[#53B847] bg-[#53B847]/10 hover:bg-[#53B847]/20 rounded-lg transition-colors"
                >
                  Explore Today's Fresh Picks
                </button>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3.5 p-3 rounded-xl border border-[#E7E7DF] bg-[#FAFAF6]/50"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-white shrink-0 border border-[#E7E7DF]"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-[#172126] truncate">
                      {product.name}
                    </h5>
                    <p className="tamil-text text-xs text-[#626B69]">
                      {product.tamilName} • {product.packSize}
                    </p>
                    <div className="text-sm font-bold text-[#172126] mt-1">
                      ₹{product.price * quantity}
                    </div>
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-1 bg-white border border-[#E7E7DF] rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product, quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#626B69] hover:text-[#172126] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      {quantity === 1 ? (
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#172126]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product, quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#626B69] hover:text-[#172126] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals & checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#E7E7DF] bg-[#FAFAF6] space-y-3">
              <div className="space-y-1.5 text-xs text-[#626B69]">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-[#172126]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fresh Delivery</span>
                  <span className="font-semibold text-[#172126]">
                    {deliveryFee === 0 ? (
                      <span className="text-[#53B847]">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#004B68] pt-2 border-t border-[#E7E7DF]">
                  <span>Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onCheckout}
                className="w-full py-3.5 bg-[#53B847] hover:bg-[#469e3c] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Proceed to Delivery Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
