import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { LocationBar } from './components/LocationBar';
import { Hero } from './components/Hero';
import { CategoryCard } from './components/CategoryCard';
import { ProductGrid } from './components/ProductGrid';
import { ProductCard } from './components/ProductCard';
import { IntentCard } from './components/IntentCard';
import { EditorialCard } from './components/EditorialCard';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartDrawer } from './components/CartDrawer';
import { RecipeModal } from './components/RecipeModal';
import { AccountModal } from './components/AccountModal';
import { SearchModal } from './components/SearchModal';
import { ShopPage } from './components/ShopPage';
import { CategoryPage } from './components/CategoryPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { useRouter } from './router';
import {
  PRODUCTS,
  CATEGORIES,
  MEAL_INTENTS,
  DEFAULT_DELIVERY_LOCATION,
  TODAY_FRESH_PICKS_IDS,
  EVERYDAY_FAVOURITES_IDS,
} from './data/products';
import { Product, Category, MealIntent, DeliveryLocation, CartItem } from './types';
import { ArrowRight, Sparkles, Filter, X } from 'lucide-react';

export default function App() {
  // Routing hook
  const { currentPath, route, navigate } = useRouter();

  // Navigation & User State
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to logged-in to show repeat customer fidelity, with 1-click toggle to guest
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation>(
    DEFAULT_DELIVERY_LOCATION
  );

  // Cart & Wishlist State
  const [cartMap, setCartMap] = useState<Record<string, number>>({
    'prod-dosa-paniyaram': 2, // Pre-loaded with 2 batters to immediately showcase State 2 [ − 2 + ] in Today's Fresh Picks!
  });
  const [wishlistSet, setWishlistSet] = useState<Set<string>>(
    new Set(['prod-idli-batter', 'prod-fresh-paneer']) // Pre-loaded to showcase State 5 (Wishlist active filled heart)!
  );

  // Category & Intent Filter State (Homepage Context)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<MealIntent | null>(null);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Determine active header navigation ID based on current route
  const activeNav = useMemo(() => {
    if (route.type === 'shop') return 'shop';
    if (route.type === 'category') return 'shop';
    if (route.type === 'product') return 'shop';
    if (route.type === 'cart') return 'cart';
    return 'home';
  }, [route]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    if (product.stockStatus === 'out_of_stock' || (product.stockCount !== undefined && product.stockCount <= 0)) {
      triggerToast(`${product.name} is currently out of stock`);
      return;
    }
    const currentQty = cartMap[product.id] || 0;
    if (product.stockCount !== undefined && currentQty >= product.stockCount) {
      triggerToast(`Only ${product.stockCount} units available in stock`);
      return;
    }
    setCartMap((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
    triggerToast(`Added ${product.name} to basket`);
  };

  const handleUpdateQuantity = (product: Product, newQuantity: number) => {
    if (product.stockCount !== undefined && newQuantity > product.stockCount) {
      triggerToast(`Maximum available stock reached (${product.stockCount})`);
      return;
    }
    setCartMap((prev) => {
      const next = { ...prev };
      if (newQuantity <= 0) {
        delete next[product.id];
      } else {
        next[product.id] = newQuantity;
      }
      return next;
    });
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistSet((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        triggerToast(`Removed from wishlist`);
      } else {
        next.add(product.id);
        triggerToast(`Saved to wishlist`);
      }
      return next;
    });
  };

  const handleNotifyMe = (product: Product) => {
    triggerToast(`You will be notified when ${product.name} is back in stock.`);
  };

  // Derive cart items
  const cartItems: CartItem[] = useMemo(() => {
    return Object.entries(cartMap)
      .map(([id, quantity]) => {
        const product = PRODUCTS.find((p) => p.id === id);
        return product ? { product, quantity } : null;
      })
      .filter((item): item is CartItem => item !== null);
  }, [cartMap]);

  const totalCartCount = useMemo(() => {
    return Object.values(cartMap).reduce((sum, count) => sum + count, 0);
  }, [cartMap]);

  // Curated Lists for Homepage
  const todayFreshPicks = useMemo(() => {
    return TODAY_FRESH_PICKS_IDS.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean);
  }, []);

  const everydayFavourites = useMemo(() => {
    return EVERYDAY_FAVOURITES_IDS.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean);
  }, []);

  const displayedCategoryProducts = useMemo(() => {
    if (!selectedCategory) return null;
    return PRODUCTS.filter((p) => p.categorySlug === selectedCategory.slug);
  }, [selectedCategory]);

  const paniyaramProduct = PRODUCTS.find((p) => p.id === 'prod-dosa-paniyaram');

  const scrollToFreshPicks = () => {
    if (route.type !== 'home') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('todays-fresh-picks-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }
    const el = document.getElementById('todays-fresh-picks-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF6] text-[#172126] overflow-x-hidden">
      {/* 1. GLOBAL HEADER */}
      <Header
        activeNav={activeNav}
        onNavClick={(nav) => {
          if (nav === 'home') {
            navigate('/');
          } else if (nav === 'shop' || nav === 'collections') {
            navigate('/shop');
          } else if (nav === 'fresh-today') {
            scrollToFreshPicks();
          } else if (nav === 'recipes') {
            setIsRecipeOpen(true);
          } else if (nav === 'wishlist') {
            triggerToast(`Wishlist contains ${wishlistSet.size} items`);
          }
        }}
        cartCount={totalCartCount}
        wishlistCount={wishlistSet.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        isLoggedIn={isLoggedIn}
      />

      {/* 2. DELIVERY LOCATION */}
      <LocationBar
        location={deliveryLocation}
        onLocationChange={(newLoc) => {
          setDeliveryLocation(newLoc);
          triggerToast(`Delivery location set to ${newLoc.area}, ${newLoc.city}`);
        }}
      />

      {/* ROUTE-BASED MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col pb-20 md:pb-0">
        {route.type === 'shop' && (
          <ShopPage
            products={PRODUCTS}
            categories={CATEGORIES}
            cartMap={cartMap}
            wishlistSet={wishlistSet}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onToggleWishlist={handleToggleWishlist}
            onNotifyMe={handleNotifyMe}
            onNavigate={navigate}
            initialCategory={route.initialCategory}
          />
        )}

        {route.type === 'category' && (
          <CategoryPage
            categorySlug={route.categorySlug}
            categories={CATEGORIES}
            products={PRODUCTS}
            cartMap={cartMap}
            wishlistSet={wishlistSet}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onToggleWishlist={handleToggleWishlist}
            onNotifyMe={handleNotifyMe}
            onNavigate={navigate}
          />
        )}

        {route.type === 'product' && (
          <ProductDetailPage
            productId={route.productId}
            products={PRODUCTS}
            categories={CATEGORIES}
            cartMap={cartMap}
            wishlistSet={wishlistSet}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onToggleWishlist={handleToggleWishlist}
            onNotifyMe={handleNotifyMe}
            onNavigate={navigate}
          />
        )}

        {/* DEDICATED CART PAGE */}
        {route.type === 'cart' && (
          <CartPage
            cartItems={cartItems}
            cartMap={cartMap}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onToggleWishlist={handleToggleWishlist}
            wishlistSet={wishlistSet}
            onNavigate={navigate}
            onProceedToCheckout={() => {
              triggerToast('Proceeding to delivery schedule and checkout slot...');
            }}
          />
        )}

        {/* CHECKOUT BOUNDARY PLACEHOLDER */}
        {route.type === 'checkout' && (
          <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 text-center">
            <div className="bg-white rounded-[22px] border border-[#E7E7DF] p-8 sm:p-12 max-w-xl mx-auto shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#004B68]">
                Checkout & Delivery Slot
              </h1>
              <p className="text-sm text-[#626B69] mt-2 leading-relaxed">
                Slot selection and checkout are scheduled for the next phase. Your basket items are safe.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="px-5 py-2.5 bg-[#53B847] hover:bg-[#469e3c] text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
                >
                  Return to Basket
                </button>
              </div>
            </div>
          </main>
        )}

        {/* DEFAULT: HOMEPAGE (All original sections preserved) */}
        {route.type === 'home' && (
          <main className="flex-1 space-y-10 sm:space-y-14 md:space-y-16 lg:space-y-20">
            {/* 3. HERO / PRIMARY DISCOVERY */}
            <Hero
              onExploreClick={scrollToFreshPicks}
              onBrowseAllClick={() => navigate('/shop')}
            />

            {/* 4. SHOP BY WHAT YOU NEED */}
            <section
              id="shop-by-need-section"
              className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10"
              aria-labelledby="shop-by-need-heading"
            >
              <div className="flex items-end justify-between mb-4 sm:mb-6">
                <div>
                  <h2
                    id="shop-by-need-heading"
                    className="text-[22px] sm:text-[26px] md:text-[28px] font-bold text-[#004B68] tracking-tight leading-tight"
                  >
                    Shop by what you need
                  </h2>
                  <p className="text-[13px] sm:text-[14px] md:text-[15px] text-[#626B69] mt-1">
                    Freshly prepared staples grouped for your everyday pantry
                  </p>
                </div>

                <button
                  id="shop-by-need-see-all"
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="group inline-flex items-center gap-1 text-[13px] sm:text-[14px] font-semibold text-[#004B68] hover:text-[#53B847] transition-colors pb-0.5 focus:outline-none focus-visible:underline shrink-0"
                >
                  <span>See all</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1 text-[#53B847]" />
                </button>
              </div>

              {/* Category Cards: Horizontal scrollable rail on mobile, 3-col on tablet, 6-col on desktop */}
              <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible pb-3 sm:pb-0 gap-3 sm:gap-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x sm:grid-cols-3 lg:grid-cols-6">
                {CATEGORIES.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    isSelected={selectedCategory?.id === cat.id}
                    onClick={(category) => {
                      navigate(`/category/${category.slug}`);
                    }}
                  />
                ))}
              </div>

              {/* Contextual Filter Banner when a category is selected */}
              {selectedCategory && (
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-[20px] border border-[#37B4A1] shadow-xs">
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div>
                      <span className="text-xs font-semibold text-[#53B847] uppercase tracking-wider">
                        Selected Category
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[#004B68]">
                        {selectedCategory.name} ({displayedCategoryProducts?.length || 0} items)
                      </h3>
                      <p className="text-xs text-[#626B69] mt-0.5">
                        {selectedCategory.tagline}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#626B69] hover:text-[#172126] bg-[#F2F3ED] rounded-lg hover:bg-[#E7E7DF] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Clear Filter</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                    {displayedCategoryProducts?.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantityInCart={cartMap[product.id] || 0}
                        isWishlisted={wishlistSet.has(product.id)}
                        onAddToCart={handleAddToCart}
                        onUpdateQuantity={handleUpdateQuantity}
                        onToggleWishlist={handleToggleWishlist}
                        onNotifyMe={handleNotifyMe}
                        onProductClick={(p) => navigate(`/product/${p.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 5. TODAY'S FRESH PICKS */}
            <ProductGrid
              id="todays-fresh-picks-section"
              title="Today's fresh picks"
              subtitle="Prepared for today"
              viewAllLinkText="See all"
              onViewAllClick={() => navigate('/shop')}
              products={todayFreshPicks}
              cartMap={cartMap}
              wishlistSet={wishlistSet}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onToggleWishlist={handleToggleWishlist}
              onNotifyMe={handleNotifyMe}
              onProductClick={(p) => navigate(`/product/${p.id}`)}
            />

            {/* 6. WHAT ARE YOU MAKING TODAY? (Editorial Intent Section) */}
            <section
              id="what-are-you-making-today-section"
              className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10"
              aria-labelledby="meal-intent-heading"
            >
              <div className="flex items-end justify-between mb-4 sm:mb-6">
                <div>
                  <h2
                    id="meal-intent-heading"
                    className="text-[22px] sm:text-[26px] md:text-[28px] font-bold text-[#004B68] tracking-tight leading-tight"
                  >
                    What are you making today?
                  </h2>
                  <p className="text-[13px] sm:text-[14px] md:text-[15px] text-[#626B69] mt-1">
                    Choose an idea and we'll show you what goes with it.
                  </p>
                </div>
              </div>

              {/* 4 Intent Cards: horizontal scrollable on mobile, 2-col on tablet, 4-col on desktop */}
              <div className="flex sm:grid overflow-x-auto sm:overflow-x-visible pb-3 sm:pb-0 gap-3.5 sm:gap-5 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x sm:grid-cols-2 lg:grid-cols-4">
                {MEAL_INTENTS.map((intent) => (
                  <IntentCard
                    key={intent.id}
                    intent={intent}
                    onClick={(item) => {
                      setSelectedIntent((curr) => (curr?.id === item.id ? null : item));
                      triggerToast(`Showing recommendations for ${item.title}`);
                    }}
                  />
                ))}
              </div>

              {/* Contextual Intent Recommendation Box */}
              {selectedIntent && (
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-[22px] border border-[#E7E7DF] shadow-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div>
                      <span className="text-xs font-semibold text-[#53B847] uppercase tracking-wider">
                        Recommended for {selectedIntent.title}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[#004B68]">
                        Ingredients for "{selectedIntent.subtitle}"
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedIntent(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#626B69] hover:text-[#172126] bg-[#F2F3ED] rounded-lg hover:bg-[#E7E7DF] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Close recommendations</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                    {selectedIntent.featuredProductIds.map((id) => {
                      const product = PRODUCTS.find((p) => p.id === id);
                      if (!product) return null;
                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          quantityInCart={cartMap[product.id] || 0}
                          isWishlisted={wishlistSet.has(product.id)}
                          onAddToCart={handleAddToCart}
                          onUpdateQuantity={handleUpdateQuantity}
                          onToggleWishlist={handleToggleWishlist}
                          onNotifyMe={handleNotifyMe}
                          onProductClick={(p) => navigate(`/product/${p.id}`)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* 7. BUY AGAIN / POPULAR FAVOURITES */}
            <ProductGrid
              id="buy-again-popular-favourites-section"
              title={isLoggedIn ? 'Buy again' : 'Everyday favourites'}
              subtitle={
                isLoggedIn
                  ? "Things you've ordered before"
                  : 'Popular with Haaply customers'
              }
              viewAllLinkText="See all"
              onViewAllClick={() => navigate('/shop')}
              products={everydayFavourites}
              cartMap={cartMap}
              wishlistSet={wishlistSet}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onToggleWishlist={handleToggleWishlist}
              onNotifyMe={handleNotifyMe}
              onProductClick={(p) => navigate(`/product/${p.id}`)}
            />

            {/* 8. FROM OUR KITCHEN (Editorial Brand Story) */}
            <EditorialCard
              onViewRecipe={() => setIsRecipeOpen(true)}
              onShopIngredients={() => {
                if (paniyaramProduct) {
                  handleAddToCart(paniyaramProduct);
                }
                setIsCartOpen(true);
              }}
            />
          </main>
        )}
      </div>

      {/* 9. FOOTER */}
      <Footer
        onLinkClick={(slug) => {
          if (slug === '/shop') {
            navigate('/shop');
          } else if (slug === 'fresh-today') {
            scrollToFreshPicks();
          } else {
            navigate(slug.startsWith('/') ? slug : `/${slug}`);
          }
        }}
      />

      {/* 10. MOBILE BOTTOM NAVIGATION BAR (Visible on mobile screens <md) */}
      <MobileBottomNav
        activeNav={activeNav}
        onNavClick={(nav) => {
          if (nav === 'home') {
            navigate('/');
            setSelectedCategory(null);
            setSelectedIntent(null);
          } else if (nav === 'shop') {
            navigate('/shop');
          }
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        isLoggedIn={isLoggedIn}
      />

      {/* SUPPORTING DIALOGS & OVERLAYS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onViewCart={() => navigate('/cart')}
        onCheckout={() => {
          triggerToast('Proceeding to delivery schedule...');
          setIsCartOpen(false);
        }}
      />

      <RecipeModal
        isOpen={isRecipeOpen}
        onClose={() => setIsRecipeOpen(false)}
        paniyaramProduct={paniyaramProduct}
        onAddIngredients={() => {
          if (paniyaramProduct) {
            handleAddToCart(paniyaramProduct);
          }
        }}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        isLoggedIn={isLoggedIn}
        onToggleLogin={() => {
          setIsLoggedIn(!isLoggedIn);
          triggerToast(
            isLoggedIn
              ? 'Logged out — now viewing guest state ("Everyday favourites")'
              : 'Welcome back, Karthik! Viewing personalized repeat orders ("Buy again")'
          );
        }}
        userPhone="9843210980"
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        initialQuery={searchQuery}
        cartMap={cartMap}
        wishlistSet={wishlistSet}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onToggleWishlist={handleToggleWishlist}
        onNotifyMe={handleNotifyMe}
        onProductClick={(p) => {
          setIsSearchOpen(false);
          navigate(`/product/${p.id}`);
        }}
      />

      {/* Toast Notification (positioned above mobile nav on phones) */}
      {toastMessage && (
        <div
          id="haaply-toast"
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-[#004B68] text-white px-4 py-2.5 rounded-xl shadow-lg border border-white/20 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-[calc(100vw-32px)]"
        >
          <span className="w-2 h-2 rounded-full bg-[#53B847] shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
