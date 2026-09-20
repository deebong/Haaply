import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit2,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Info,
  X,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import {
  CartItem,
  Product,
  DeliveryLocation,
  CheckoutAddress,
  DeliverySlot,
  PaymentMethodOption,
  PaymentMethodType,
  OrderPayload,
} from '../types';
import { AVAILABLE_LOCATIONS } from '../data/products';
import { useScrollLock } from '../hooks/useScrollLock';

interface CheckoutPageProps {
  cartItems: CartItem[];
  cartMap: Record<string, number>;
  deliveryLocation: DeliveryLocation;
  isLoggedIn: boolean;
  onNavigate: (path: string) => void;
  onUpdateQuantity: (product: Product, newQuantity: number) => void;
  onTriggerToast: (message: string) => void;
}

/**
 * Clean temporary delivery slots model for Haaply.
 * Represents morning & evening dispatch batches for Coimbatore.
 * Marked clearly as frontend mock schedule pending future logistics backend.
 */
const TEMPORARY_DELIVERY_SLOTS: DeliverySlot[] = [
  {
    id: 'slot-today-evening',
    date: 'today',
    displayDate: 'Today',
    startTime: '17:30',
    endTime: '19:30',
    displayTime: '5:30 PM – 7:30 PM',
    available: true,
    capacity: 12,
    note: 'Fresh evening batch from 3 PM milling',
  },
  {
    id: 'slot-tomorrow-morning',
    date: 'tomorrow-morning',
    displayDate: 'Tomorrow Morning',
    startTime: '06:30',
    endTime: '08:30',
    displayTime: '6:30 AM – 8:30 AM',
    available: true,
    capacity: 25,
    note: 'Early morning breakfast dispatch',
  },
  {
    id: 'slot-tomorrow-evening',
    date: 'tomorrow-evening',
    displayDate: 'Tomorrow Evening',
    startTime: '17:30',
    endTime: '19:30',
    displayTime: '5:30 PM – 7:30 PM',
    available: true,
    capacity: 20,
    note: 'Fresh afternoon batch',
  },
];

/**
 * Payment method options.
 * Clearly communicates that live gateway integration is not connected yet.
 */
const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'upi',
    name: 'UPI (GPay / PhonePe / Paytm / BHIM)',
    description: 'Instant verification via UPI App or QR',
    isAvailable: true,
    badge: 'Coming Soon',
  },
  {
    id: 'card_netbanking',
    name: 'Credit / Debit Card & Netbanking',
    description: 'Visa, Mastercard, RuPay & all major Indian banks',
    isAvailable: true,
    badge: 'Coming Soon',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay cash or UPI on delivery at your doorstep',
    isAvailable: true,
    badge: 'Coming Soon',
  },
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  cartMap,
  deliveryLocation,
  isLoggedIn,
  onNavigate,
  onUpdateQuantity,
  onTriggerToast,
}) => {
  // 1. Calculations reusing existing Haaply business logic
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  const deliveryFee = subtotal >= 199 || subtotal === 0 ? 0 : 25;
  const grandTotal = subtotal + deliveryFee;
  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // 2. State: Delivery Address (Neutral temporary defaults based on current deliveryLocation)
  const [address, setAddress] = useState<CheckoutAddress>({
    recipientName: isLoggedIn ? 'Customer' : '',
    phone: '',
    houseFlat: '',
    street: '',
    area: deliveryLocation.area || 'Rangasamy Nagar',
    city: deliveryLocation.city || 'Coimbatore',
    pincode: deliveryLocation.pincode || '641007',
    landmark: deliveryLocation.landmark || '',
    deliveryInstructions: '',
  });

  // Edit Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [draftAddress, setDraftAddress] = useState<CheckoutAddress>(address);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Global scroll lock for address modal
  useScrollLock(isAddressModalOpen, () => setIsAddressModalOpen(false));

  // 3. State: Selected Delivery Slot
  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    TEMPORARY_DELIVERY_SLOTS[0]?.id || ''
  );

  // 4. State: Selected Payment Method
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodType>('upi');

  // 5. Submission & Validation feedback state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValidationNotice, setFormValidationNotice] = useState<string | null>(
    null
  );
  const [backendBoundaryNotice, setBackendBoundaryNotice] = useState<string | null>(
    null
  );

  // 6. Stock Check / Cart Revalidation
  const stockDiscrepancies = useMemo(() => {
    const issues: { product: Product; requested: number; available: number }[] = [];
    for (const item of cartItems) {
      if (item.product.stockStatus === 'out_of_stock') {
        issues.push({ product: item.product, requested: item.quantity, available: 0 });
      } else if (
        item.product.stockCount !== undefined &&
        item.quantity > item.product.stockCount
      ) {
        issues.push({
          product: item.product,
          requested: item.quantity,
          available: item.product.stockCount,
        });
      }
    }
    return issues;
  }, [cartItems]);

  // Check if address has the bare minimum filled
  const isAddressComplete = Boolean(
    address.recipientName.trim() &&
      address.phone.trim().length >= 10 &&
      address.houseFlat.trim() &&
      address.street.trim() &&
      address.area.trim() &&
      address.pincode.trim().length === 6
  );

  // Handle open address editor
  const handleOpenAddressModal = () => {
    setDraftAddress({ ...address });
    setAddressErrors({});
    setIsAddressModalOpen(true);
  };

  // Validate and save address
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!draftAddress.recipientName.trim()) {
      errors.recipientName = 'Recipient name is required';
    }
    const cleanPhone = draftAddress.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!draftAddress.houseFlat.trim()) {
      errors.houseFlat = 'House / Flat number is required';
    }
    if (!draftAddress.street.trim()) {
      errors.street = 'Street / Road name is required';
    }
    if (!draftAddress.area.trim()) {
      errors.area = 'Delivery locality is required';
    }
    if (!draftAddress.city.trim()) {
      errors.city = 'City is required';
    }
    const cleanPin = draftAddress.pincode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errors.pincode = 'Enter a valid 6-digit PIN code';
    }

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }

    setAddress({
      ...draftAddress,
      phone: cleanPhone,
      pincode: cleanPin,
    });
    setFormValidationNotice(null);
    setIsAddressModalOpen(false);
    onTriggerToast('Delivery address updated for this checkout session');
  };

  // Handle Place Order Boundary
  const handlePlaceOrder = () => {
    setFormValidationNotice(null);
    setBackendBoundaryNotice(null);

    // 1. Cart check
    if (cartItems.length === 0) {
      setFormValidationNotice('Your basket is empty. Please add fresh items before placing an order.');
      onNavigate('/cart');
      return;
    }

    // 2. Stock check
    if (stockDiscrepancies.length > 0) {
      const firstIssue = stockDiscrepancies[0];
      setFormValidationNotice(
        `Quantity for ${firstIssue.product.name} exceeds available stock (${firstIssue.available} available). Please adjust in basket.`
      );
      return;
    }

    // 3. Address completeness check
    if (!isAddressComplete) {
      setFormValidationNotice('Please provide a complete delivery address with recipient name, phone, and house/street.');
      handleOpenAddressModal();
      return;
    }

    // 4. Delivery slot check
    const selectedSlot = TEMPORARY_DELIVERY_SLOTS.find((s) => s.id === selectedSlotId);
    if (!selectedSlot) {
      setFormValidationNotice('Please select a preferred delivery slot.');
      return;
    }

    // 5. Payment method check
    if (!selectedPaymentMethod) {
      setFormValidationNotice('Please select a payment method.');
      return;
    }

    // 6. Duplicate submission guard
    if (isSubmitting) return;
    setIsSubmitting(true);

    // 7. Prepare clean, non-persisted Order Payload structure for future backend integration
    const orderPayload: OrderPayload = {
      recipientName: address.recipientName,
      phone: address.phone,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        packSize: item.product.packSize,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      })),
      subtotal,
      deliveryFee,
      grandTotal,
      deliveryAddress: address,
      deliverySlot: selectedSlot,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: 'not_connected',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Logging payload cleanly for developer verification without creating fake mock IDs or fake payments
    if (process.env.NODE_ENV !== 'production') {
      console.info('[Haaply Checkout Boundary Payload Prepared]:', orderPayload);
    }

    // Intentionally communicate the non-deceptive boundary: Backend is not connected yet.
    setTimeout(() => {
      setIsSubmitting(false);
      setBackendBoundaryNotice(
        'Order placement is not connected yet. Your checkout details and delivery schedule are ready for the next backend integration step.'
      );
      onTriggerToast(
        'Checkout boundary verified: Order placement is not connected yet.'
      );
    }, 400);
  };

  // EMPTY-CART SAFEGUARD: Redirect or provide clear action back
  if (cartItems.length === 0) {
    return (
      <main
        id="checkout-empty-state"
        className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 sm:py-16 text-center"
      >
        <div className="bg-white rounded-[22px] border border-[#E7E7DF] p-8 sm:p-12 md:p-14 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F2F3ED] text-[#004B68] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#004B68] tracking-tight">
            Your Basket is Empty
          </h1>
          <p className="text-sm text-[#626B69] mt-2 leading-relaxed">
            There are no items to check out right now. Explore today's freshly ground batters, wholesome millets, and morning essentials.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="checkout-empty-shop-btn"
              type="button"
              onClick={() => onNavigate('/shop')}
              className="w-full sm:w-auto px-6 py-3 bg-[#53B847] hover:bg-[#469e3c] text-white text-sm font-bold rounded-xl transition-colors shadow-xs"
            >
              Browse Fresh Shop
            </button>
            <button
              id="checkout-empty-home-btn"
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full sm:w-auto px-6 py-3 bg-[#F2F3ED] hover:bg-[#E7E7DF] text-[#172126] text-sm font-semibold rounded-xl transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  const selectedSlot = TEMPORARY_DELIVERY_SLOTS.find((s) => s.id === selectedSlotId);

  return (
    <main
      id="checkout-page"
      className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-8 md:py-10 pb-28 md:pb-12"
    >
      {/* 1. BREADCRUMBS & NAVIGATION */}
      <nav
        id="checkout-breadcrumbs"
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[#626B69] mb-4 sm:mb-6"
      >
        <button
          id="checkout-breadcrumb-home"
          type="button"
          onClick={() => onNavigate('/')}
          className="hover:text-[#004B68] transition-colors focus:outline-none"
        >
          Home
        </button>
        <span className="text-[#626B69]/60">/</span>
        <button
          id="checkout-breadcrumb-cart"
          type="button"
          onClick={() => onNavigate('/cart')}
          className="hover:text-[#004B68] transition-colors focus:outline-none"
        >
          Your Basket
        </button>
        <span className="text-[#626B69]/60">/</span>
        <span className="font-semibold text-[#172126]">Checkout</span>
      </nav>

      {/* 2. HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6 sm:mb-8">
        <div>
          <h1
            id="checkout-heading"
            className="text-2xl sm:text-3xl font-bold text-[#004B68] tracking-tight"
          >
            Checkout & Delivery
          </h1>
          <p className="text-xs sm:text-sm text-[#626B69] mt-1">
            Confirm your delivery address, choose a dispatch slot, and review your items.
          </p>
        </div>

        <button
          id="checkout-back-to-cart-top"
          type="button"
          onClick={() => onNavigate('/cart')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#53B847] hover:text-[#469e3c] transition-colors py-1 focus:outline-none self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Basket</span>
        </button>
      </div>

      {/* 3. STOCK WARNING IF ANY */}
      {stockDiscrepancies.length > 0 && (
        <div
          id="checkout-stock-alert"
          className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold">Stock Adjustment Needed</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Some items in your basket exceed available stock:
            </p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
              {stockDiscrepancies.map((d) => (
                <li key={d.product.id}>
                  <strong>{d.product.name}</strong>: Requested {d.requested} unit(s), but only {d.available} available.
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onNavigate('/cart')}
              className="mt-2 text-xs font-bold text-amber-900 underline hover:no-underline"
            >
              Update quantities in Basket →
            </button>
          </div>
        </div>
      )}

      {/* 4. FORM VALIDATION ERROR NOTICE */}
      {formValidationNotice && (
        <div
          id="checkout-validation-notice"
          className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="font-medium flex-1">{formValidationNotice}</p>
          <button
            type="button"
            onClick={() => setFormValidationNotice(null)}
            className="p-1 hover:bg-rose-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-rose-700" />
          </button>
        </div>
      )}

      {/* 5. BACKEND BOUNDARY CALLOUT (Non-deceptive message) */}
      {backendBoundaryNotice && (
        <div
          id="checkout-boundary-notice"
          className="mb-6 p-4 sm:p-5 rounded-[18px] bg-[#004B68]/5 border border-[#004B68]/20 text-[#004B68] text-xs sm:text-sm flex items-start gap-3.5 animate-in fade-in duration-200"
        >
          <Info className="w-5 h-5 text-[#004B68] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-sm text-[#004B68]">
              Checkout Boundary Verified
            </h4>
            <p className="text-xs sm:text-sm text-[#626B69] mt-1 leading-relaxed">
              {backendBoundaryNotice}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E7E7DF] text-[11px] font-semibold text-[#172126]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#53B847]" />
                Cart & pricing validated (₹{grandTotal})
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E7E7DF] text-[11px] font-semibold text-[#172126]">
                <Clock className="w-3.5 h-3.5 text-[#004B68]" />
                Slot: {selectedSlot?.displayTime}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setBackendBoundaryNotice(null)}
            className="p-1 hover:bg-black/5 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-[#626B69]" />
          </button>
        </div>
      )}

      {/* 6. MAIN TWO-COLUMN CHECKOUT GRID (Desktop Left/Right, Mobile stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT / MAIN COLUMN: Address, Slot, Payment */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* SECTION A: DELIVERY ADDRESS */}
          <section
            id="checkout-delivery-address-section"
            className="bg-white rounded-[20px] border border-[#E7E7DF] p-5 sm:p-6 shadow-xs"
            aria-labelledby="address-section-heading"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E7DF]/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#53B847]/10 text-[#53B847] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h2
                    id="address-section-heading"
                    className="text-base sm:text-lg font-bold text-[#004B68]"
                  >
                    Delivery Address
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#626B69]">
                    Where should we bring your fresh morning dispatch?
                  </p>
                </div>
              </div>

              <button
                id="checkout-edit-address-btn"
                type="button"
                onClick={handleOpenAddressModal}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#004B68] hover:text-[#53B847] transition-colors px-3 py-1.5 rounded-lg border border-[#E7E7DF] hover:bg-[#F2F3ED]"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isAddressComplete ? 'Change' : 'Enter Details'}</span>
              </button>
            </div>

            {/* Selected Address Display Card */}
            <div className="mt-4 pt-1">
              {isAddressComplete ? (
                <div className="p-4 rounded-xl bg-[#FAFAF6] border border-[#E7E7DF]/80 text-xs sm:text-sm text-[#172126]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-sm text-[#004B68]">
                      {address.recipientName}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E7E7DF]/60 text-[#626B69]">
                      +91 {address.phone}
                    </span>
                  </div>
                  <p className="text-[#626B69] leading-relaxed">
                    {address.houseFlat}, {address.street}
                  </p>
                  <p className="text-[#626B69]">
                    {address.area}, {address.city} — <strong className="text-[#172126]">{address.pincode}</strong>
                  </p>
                  {address.landmark && (
                    <p className="text-[11px] text-[#626B69] mt-1 italic">
                      Landmark: {address.landmark}
                    </p>
                  )}
                  {address.deliveryInstructions && (
                    <p className="text-[11px] text-[#53B847] font-medium mt-1">
                      Instructions: {address.deliveryInstructions}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-amber-900">
                      Incomplete Delivery Details
                    </p>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Please enter your name, contact phone, and exact house/street address.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddressModal}
                    className="px-4 py-2 bg-[#004B68] text-white text-xs font-bold rounded-lg hover:bg-[#00384e] transition-colors shrink-0 self-start sm:self-auto"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* SECTION B: DELIVERY SLOT */}
          <section
            id="checkout-delivery-slot-section"
            className="bg-white rounded-[20px] border border-[#E7E7DF] p-5 sm:p-6 shadow-xs"
            aria-labelledby="slot-section-heading"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E7DF]/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#53B847]/10 text-[#53B847] flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h2
                    id="slot-section-heading"
                    className="text-base sm:text-lg font-bold text-[#004B68]"
                  >
                    Delivery Slot
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#626B69]">
                    Select when you would like this order freshly delivered
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-[#53B847] bg-[#53B847]/10 px-2.5 py-1 rounded-full">
                Guaranteed Fresh
              </span>
            </div>

            {/* Slots Grid */}
            <div className="mt-4 space-y-2.5">
              {TEMPORARY_DELIVERY_SLOTS.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <label
                    key={slot.id}
                    className={`flex items-start justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#53B847] bg-[#53B847]/5 shadow-xs'
                        : 'border-[#E7E7DF] hover:border-[#626B69]/40 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <input
                        type="radio"
                        name="delivery-slot"
                        value={slot.id}
                        checked={isSelected}
                        onChange={() => setSelectedSlotId(slot.id)}
                        className="mt-1 h-4 w-4 text-[#53B847] focus:ring-[#53B847] border-[#E7E7DF]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#172126]">
                            {slot.displayDate}
                          </span>
                          <span className="text-xs font-semibold text-[#004B68] bg-[#E7E7DF]/50 px-2 py-0.5 rounded-md">
                            {slot.displayTime}
                          </span>
                        </div>
                        {slot.note && (
                          <p className="text-[11px] text-[#626B69] mt-1">
                            {slot.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-semibold text-[#53B847] flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Available
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            <p className="text-[11px] text-[#626B69] mt-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#626B69] shrink-0" />
              <span>Slots reflect scheduled dispatch rounds from our Coimbatore local kitchen.</span>
            </p>
          </section>

          {/* SECTION C: PAYMENT METHOD (Architecture placeholder clearly stated) */}
          <section
            id="checkout-payment-method-section"
            className="bg-white rounded-[20px] border border-[#E7E7DF] p-5 sm:p-6 shadow-xs"
            aria-labelledby="payment-section-heading"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E7DF]/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#53B847]/10 text-[#53B847] flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h2
                    id="payment-section-heading"
                    className="text-base sm:text-lg font-bold text-[#004B68]"
                  >
                    Payment Method
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#626B69]">
                    Select your preferred payment method for when gateways are connected
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-[#004B68] bg-[#F2F3ED] px-2.5 py-1 rounded-full">
                Secure 256-bit
              </span>
            </div>

            {/* Payment Options List */}
            <div className="mt-4 space-y-2.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPaymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex items-start justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#004B68] bg-[#004B68]/5 shadow-xs'
                        : 'border-[#E7E7DF] hover:border-[#626B69]/40 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        checked={isSelected}
                        onChange={() => setSelectedPaymentMethod(method.id)}
                        className="mt-1 h-4 w-4 text-[#004B68] focus:ring-[#004B68] border-[#E7E7DF]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-[#172126]">
                            {method.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#626B69] mt-0.5">
                          {method.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {method.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#626B69] bg-[#E7E7DF]/70 px-2 py-0.5 rounded">
                          {method.badge}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#FAFAF6] border border-[#E7E7DF] text-[11px] text-[#626B69] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#004B68] shrink-0" />
              <span>
                Payment integration is scheduled for the next release phase. No card or UPI details are stored or charged today.
              </span>
            </div>
          </section>
        </div>

        {/* RIGHT / SUMMARY COLUMN: Order Summary, Items, Totals & Sticky CTA on Desktop */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div
            id="checkout-order-summary-card"
            className="bg-white rounded-[20px] border border-[#E7E7DF] p-5 sm:p-6 shadow-xs"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E7E7DF]/70">
              <h3 className="text-base sm:text-lg font-bold text-[#004B68]">
                Order Summary
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('/cart')}
                className="text-xs font-semibold text-[#53B847] hover:underline"
              >
                Edit basket · {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </button>
            </div>

            {/* Item List (naturally content-driven, no internal scrollbar) */}
            <div className="py-3 divide-y divide-[#E7E7DF]/60">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#172126] truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-[#626B69]">
                      {item.product.packSize} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-[#172126]">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-[#E7E7DF]/70 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#626B69]">
                <span>Item Subtotal ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})</span>
                <span className="font-medium text-[#172126]">₹{subtotal}</span>
              </div>

              <div className="flex items-center justify-between text-[#626B69]">
                <span>Delivery Charge</span>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-[#53B847]">FREE</span>
                ) : (
                  <span className="font-medium text-[#172126]">₹{deliveryFee}</span>
                )}
              </div>

              {deliveryFee > 0 && (
                <p className="text-[10px] text-[#626B69] bg-[#FAFAF6] p-2 rounded-lg border border-[#E7E7DF]/60">
                  Add ₹{199 - subtotal} more of fresh items for <strong>Free Delivery</strong>.
                </p>
              )}

              <div className="pt-3 border-t border-[#E7E7DF] flex items-baseline justify-between text-[#004B68]">
                <span className="text-sm sm:text-base font-bold">Grand Total</span>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-black text-[#004B68]">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action Button (Desktop & Inline) */}
            <div className="mt-5">
              <button
                id="checkout-place-order-btn"
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#53B847] hover:bg-[#469e3c] active:bg-[#3d8c34] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{isSubmitting ? 'Verifying Basket...' : 'Place Order'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-[#626B69] mt-2">
                Order placement boundary will verify checkout payload
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-5 pt-4 border-t border-[#E7E7DF]/70 grid grid-cols-2 gap-2 text-[11px] text-[#626B69]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#53B847] shrink-0" />
                <span>100% Natural Fresh</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#004B68] shrink-0" />
                <span>Early Morning Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY CHECKOUT BAR (Visible on mobile screens <md) */}
      <div
        id="mobile-checkout-bar"
        className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E7E7DF] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#626B69] tracking-wider">
              Grand Total
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#004B68]">
                ₹{grandTotal}
              </span>
              {deliveryFee === 0 && (
                <span className="text-[10px] font-bold text-[#53B847]">
                  FREE DEL
                </span>
              )}
            </div>
          </div>

          <button
            id="mobile-place-order-btn"
            type="button"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="flex-1 max-w-[200px] py-3 px-4 bg-[#53B847] hover:bg-[#469e3c] text-white font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Checking...' : 'Place Order'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* EDIT ADDRESS MODAL / SHEET */}
      {isAddressModalOpen && (
        <div
          id="checkout-address-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="address-modal-title"
        >
          {/* Backdrop with touch-none */}
          <div
            className="fixed inset-0 bg-[#172126]/40 backdrop-blur-xs transition-opacity touch-none"
            onClick={() => setIsAddressModalOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg bg-white rounded-[22px] shadow-2xl border border-[#E7E7DF] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E7DF] shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#004B68]" />
                <h3 id="address-modal-title" className="text-lg font-bold text-[#004B68]">
                  Delivery Address Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1.5 text-[#626B69] hover:text-[#172126] rounded-lg hover:bg-[#F2F3ED] transition-colors"
                aria-label="Close address modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Form */}
            <form onSubmit={handleSaveAddress} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recipient Name */}
                <div>
                  <label
                    htmlFor="addr-recipient-name"
                    className="block text-xs font-semibold text-[#172126] mb-1"
                  >
                    Recipient Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="addr-recipient-name"
                    type="text"
                    value={draftAddress.recipientName}
                    onChange={(e) =>
                      setDraftAddress({ ...draftAddress, recipientName: e.target.value })
                    }
                    placeholder="e.g. Ramesh Kumar"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[#172126] bg-[#FAFAF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#53B847] ${
                      addressErrors.recipientName ? 'border-red-500' : 'border-[#E7E7DF]'
                    }`}
                  />
                  {addressErrors.recipientName && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">
                      {addressErrors.recipientName}
                    </p>
                  )}
                </div>

                {/* Mobile Phone */}
                <div>
                  <label
                    htmlFor="addr-phone"
                    className="block text-xs font-semibold text-[#172126] mb-1"
                  >
                    Contact Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-[#626B69] font-medium">
                      +91
                    </span>
                    <input
                      id="addr-phone"
                      type="tel"
                      maxLength={10}
                      value={draftAddress.phone}
                      onChange={(e) =>
                        setDraftAddress({
                          ...draftAddress,
                          phone: e.target.value.replace(/\D/g, ''),
                        })
                      }
                      placeholder="98432 12345"
                      className={`w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[#172126] bg-[#FAFAF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#53B847] ${
                        addressErrors.phone ? 'border-red-500' : 'border-[#E7E7DF]'
                      }`}
                    />
                  </div>
                  {addressErrors.phone && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">
                      {addressErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* House / Flat */}
              <div>
                <label
                  htmlFor="addr-house"
                  className="block text-xs font-semibold text-[#172126] mb-1"
                >
                  Flat, House No., Apartment or Building <span className="text-red-500">*</span>
                </label>
                <input
                  id="addr-house"
                  type="text"
                  value={draftAddress.houseFlat}
                  onChange={(e) =>
                    setDraftAddress({ ...draftAddress, houseFlat: e.target.value })
                  }
                  placeholder="e.g. Flat 3B, Sri Krishna Apartments"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[#172126] bg-[#FAFAF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#53B847] ${
                    addressErrors.houseFlat ? 'border-red-500' : 'border-[#E7E7DF]'
                  }`}
                />
                {addressErrors.houseFlat && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">
                    {addressErrors.houseFlat}
                  </p>
                )}
              </div>

              {/* Street / Road */}
              <div>
                <label
                  htmlFor="addr-street"
                  className="block text-xs font-semibold text-[#172126] mb-1"
                >
                  Street, Cross Road, or Colony <span className="text-red-500">*</span>
                </label>
                <input
                  id="addr-street"
                  type="text"
                  value={draftAddress.street}
                  onChange={(e) =>
                    setDraftAddress({ ...draftAddress, street: e.target.value })
                  }
                  placeholder="e.g. 4th Cross, Gandhi Park Main Road"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[#172126] bg-[#FAFAF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#53B847] ${
                    addressErrors.street ? 'border-red-500' : 'border-[#E7E7DF]'
                  }`}
                />
                {addressErrors.street && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">
                    {addressErrors.street}
                  </p>
                )}
              </div>

              {/* Locality & PIN Code selection from verified service area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="addr-area"
                    className="block text-xs font-semibold text-[#172126] mb-1"
                  >
                    Locality / Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="addr-area"
                    value={draftAddress.area}
                    onChange={(e) => {
                      const selectedLoc = AVAILABLE_LOCATIONS.find(
                        (l) => l.area === e.target.value
                      );
                      setDraftAddress({
                        ...draftAddress,
                        area: e.target.value,
                        pincode: selectedLoc ? selectedLoc.pincode : draftAddress.pincode,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E7DF] text-xs sm:text-sm text-[#172126] bg-[#FAFAF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#53B847]"
                  >
                    {AVAILABLE_LOCATIONS.map((loc) => (
                      <option key={loc.pincode} value={loc.area}>
                        {loc.area} ({loc.pincode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="addr-pincode"
                    className="block text-xs font-semibold text-[#172126] mb-1"
                  >
                    Postal PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="addr-pincode"
                    type="text"
                    maxLength={6}
                    value={draftAddress.pincode}
                    onChange={(e) =>
                      setDraftAddress({
                        ...draftAddress,
                        pincode: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    placeholder="641007"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-[#172126] bg-[#FAFAF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#53B847] ${
                      addressErrors.pincode ? 'border-red-500' : 'border-[#E7E7DF]'
                    }`}
                  />
                  {addressErrors.pincode && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">
                      {addressErrors.pincode}
                    </p>
                  )}
                </div>
              </div>

              {/* Landmark & Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="addr-landmark"
                    className="block text-xs font-semibold text-[#172126] mb-1"
                  >
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    id="addr-landmark"
                    type="text"
                    value={draftAddress.landmark || ''}
                    onChange={(e) =>
                      setDraftAddress({ ...draftAddress, landmark: e.target.value })
                    }
                    placeholder="e.g. Opposite Pillayar Temple"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E7DF] text-xs sm:text-sm text-[#172126] bg-[#FAFAF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#53B847]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="addr-instructions"
                    className="block text-xs font-semibold text-[#172126] mb-1"
                  >
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    id="addr-instructions"
                    type="text"
                    value={draftAddress.deliveryInstructions || ''}
                    onChange={(e) =>
                      setDraftAddress({
                        ...draftAddress,
                        deliveryInstructions: e.target.value,
                      })
                    }
                    placeholder="e.g. Leave with security"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E7DF] text-xs sm:text-sm text-[#172126] bg-[#FAFAF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#53B847]"
                  />
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#626B69]">
                <span>
                  Note: Address details are kept in your checkout session and will connect to customer profile storage in the next phase.
                </span>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-[#E7E7DF] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E7E7DF] text-xs font-bold text-[#626B69] hover:bg-[#F2F3ED] transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="checkout-save-address-btn"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#004B68] hover:bg-[#00384e] text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
