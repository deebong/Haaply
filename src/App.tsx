import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import { CheckoutPage } from './components/CheckoutPage';
import { useRouter } from './router';
import { useTheme } from './providers/ThemeProvider';
import { useActiveStore } from './providers/StoreProvider';
import { AtelierHeader } from './themes/fashion/AtelierHeader';
import { AtelierHomepage } from './themes/fashion/AtelierHomepage';
import { AtelierFooter } from './themes/fashion/AtelierFooter';
import { AnyaHeader } from './themes/anyasoaps/AnyaHeader';
import { AnyaHomepage } from './themes/anyasoaps/AnyaHomepage';
import { AnyaFooter } from './themes/anyasoaps/AnyaFooter';
import { FASHION_PRODUCTS, FASHION_CATEGORIES } from './data/fashionDemoData';
import { ANYA_PRODUCTS, ANYA_CATEGORIES } from './data/anyaSoapsData';
import {
  PRODUCTS,
  CATEGORIES,
  MEAL_INTENTS,
  DEFAULT_DELIVERY_LOCATION,
  TODAY_FRESH_PICKS_IDS,
  EVERYDAY_FAVOURITES_IDS,
} from './data/products';
import { Product, ProductVariant, Category, MealIntent, DeliveryLocation, CartItem } from './types';
import { ArrowRight, Sparkles, Filter, X } from 'lucide-react';
import { useConfig } from './providers/ConfigProvider';
import { useDataProvider, useDataService } from './providers/DataProvider';
import {
  getCartKey,
  parseCartKey,
  getDefaultVariant,
  getProductQuantityInCart,
  hasMultipleVariants,
} from './utils/productUtils';

export default function App() {
  const { store: activeStore, setStoreId, availableStores } = useActiveStore();
  const { isFeatureEnabled } = useConfig();
  const dataService = useDataService();
  const { provider } = useDataProvider();
  const { theme, setThemeId } = useTheme();
  const isAtelier = activeStore.vertical === 'fashion' || activeStore.id === 'store-atelier';
  const isAnya = activeStore.vertical === 'beauty' || activeStore.id === 'store-anyasoaps';

  // Load catalog scoped strictly to active StoreInstance
  const [products, setProducts] = useState<Product[]>(() => {
    if (activeStore.id === 'store-atelier') return FASHION_PRODUCTS;
    if (activeStore.id === 'store-anyasoaps') return ANYA_PRODUCTS;
    return PRODUCTS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    if (activeStore.id === 'store-atelier') return FASHION_CATEGORIES;
    if (activeStore.id === 'store-anyasoaps') return ANYA_CATEGORIES;
    return CATEGORIES;
  });
  const [mealIntents, setMealIntents] = useState<MealIntent[]>(() => {
    return activeStore.id === 'store-haaply' ? MEAL_INTENTS : [];
  });

  // Active products, categories, and catalog are strictly the active store's data
  const activeProducts = products;
  const activeCategories = categories;
  const allCatalogProducts = products;

  useEffect(() => {
    let isMounted = true;
    // Immediate seed update when active store changes
    if (activeStore.id === 'store-atelier') {
      setProducts(FASHION_PRODUCTS);
      setCategories(FASHION_CATEGORIES);
      setMealIntents([]);
    } else if (activeStore.id === 'store-anyasoaps') {
      setProducts(ANYA_PRODUCTS);
      setCategories(ANYA_CATEGORIES);
      setMealIntents([]);
    } else {
      setProducts(PRODUCTS);
      setCategories(CATEGORIES);
      setMealIntents(MEAL_INTENTS);
    }

    dataService.products.getProducts().then((list) => {
      if (isMounted && list.length > 0) setProducts(list);
    }).catch(console.error);
    dataService.products.getCategories().then((cats) => {
      if (isMounted && cats.length > 0) setCategories(cats);
    }).catch(console.error);
    dataService.products.getMealIntents().then((intents) => {
      if (isMounted) setMealIntents(intents);
    }).catch(console.error);
    return () => {
      isMounted = false;
    };
  }, [dataService, activeStore.id]);

  // Routing hook
  const { currentPath, route, navigate } = useRouter();

  // Navigation & User State
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to logged-in to show repeat customer fidelity, with 1-click toggle to guest
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation>(
    DEFAULT_DELIVERY_LOCATION
  );

  // Cart & Wishlist State scoped strictly by storeId to prevent cross-tenant contamination
  const [cartByStore, setCartByStore] = useState<Record<string, Record<string, number>>>({
    'store-haaply': {
      'prod-dosa-paniyaram:prod-dosa-paniyaram-1kg': 2, // Pre-loaded with 2 batters to immediately showcase State 2 [ − 2 + ] in Today's Fresh Picks!
    },
    'store-atelier': {
      'atelier-linen-overshirt:linen-overshirt-sand-m': 1, // Pre-loaded fashion item
    },
    'store-anyasoaps': {
      'anya-goat-milk-soap:anya-goat-milk-100g': 1, // Pre-loaded Anya artisan soap
    },
  });
  const [wishlistByStore, setWishlistByStore] = useState<Record<string, Set<string>>>({
    'store-haaply': new Set(['prod-idli-batter', 'prod-fresh-paneer']),
    'store-atelier': new Set(['atelier-linen-overshirt', 'atelier-silk-shirt']),
    'store-anyasoaps': new Set(['anya-goat-milk-soap', 'anya-rose-shea-butter']),
  });

  const cartMap = useMemo(() => {
    return cartByStore[activeStore.id] || {};
  }, [cartByStore, activeStore.id]);

  const setCartMap = useCallback((updaterOrVal: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => {
    setCartByStore((prevByStore) => {
      const prevCart = prevByStore[activeStore.id] || {};
      const newCart = typeof updaterOrVal === 'function' ? updaterOrVal(prevCart) : updaterOrVal;
      return {
        ...prevByStore,
        [activeStore.id]: newCart,
      };
    });
  }, [activeStore.id]);

  const wishlistSet = useMemo(() => {
    return wishlistByStore[activeStore.id] || new Set<string>();
  }, [wishlistByStore, activeStore.id]);

  const setWishlistSet = useCallback((updaterOrVal: Set<string> | ((prev: Set<string>) => Set<string>)) => {
    setWishlistByStore((prevByStore) => {
      const prevWishlist = prevByStore[activeStore.id] || new Set<string>();
      const newWishlist = typeof updaterOrVal === 'function' ? updaterOrVal(prevWishlist) : updaterOrVal;
      return {
        ...prevByStore,
        [activeStore.id]: newWishlist,
      };
    });
  }, [activeStore.id]);

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
    if (route.type === 'cart' || route.type === 'checkout') return 'cart';
    return 'home';
  }, [route]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, selectedVariant?: ProductVariant) => {
    const variant = selectedVariant || getDefaultVariant(product);
    const effectiveStockStatus = variant.stockStatus ?? product.stockStatus;
    const effectiveStockCount = variant.stockCount ?? product.stockCount;

    if (effectiveStockStatus === 'out_of_stock' || (effectiveStockCount !== undefined && effectiveStockCount <= 0)) {
      triggerToast(
        hasMultipleVariants(product)
          ? `${product.name} (${variant.label}) is currently out of stock`
          : `${product.name} is currently out of stock`
      );
      return;
    }
    const cartKey = getCartKey(product.id, variant.id);
    const currentQty = cartMap[cartKey] || 0;
    if (effectiveStockCount !== undefined && currentQty >= effectiveStockCount) {
      triggerToast(`Only ${effectiveStockCount} units available for ${variant.label}`);
      return;
    }
    setCartMap((prev) => ({
      ...prev,
      [cartKey]: (prev[cartKey] || 0) + 1,
    }));
    triggerToast(
      hasMultipleVariants(product)
        ? `Added ${product.name} (${variant.label}) to basket`
        : `Added ${product.name} to basket`
    );
  };

  const handleUpdateQuantity = (
    product: Product,
    newQuantity: number,
    selectedVariant?: ProductVariant
  ) => {
    const variant = selectedVariant || getDefaultVariant(product);
    const cartKey = getCartKey(product.id, variant.id);
    const effectiveStockCount = variant.stockCount ?? product.stockCount;

    if (effectiveStockCount !== undefined && newQuantity > effectiveStockCount) {
      triggerToast(`Maximum available stock reached (${effectiveStockCount})`);
      return;
    }
    setCartMap((prev) => {
      const next = { ...prev };
      if (newQuantity <= 0) {
        delete next[cartKey];
        if (cartKey !== product.id && next[product.id] !== undefined) {
          delete next[product.id];
        }
      } else {
        next[cartKey] = newQuantity;
        if (cartKey !== product.id && next[product.id] !== undefined) {
          delete next[product.id];
        }
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
      .map(([cartKey, quantity]) => {
        if (quantity <= 0) return null;
        const { productId, variantId } = parseCartKey(cartKey);
        const product = allCatalogProducts.find((p) => p.id === productId);
        if (!product) return null;

        let variant: ProductVariant | undefined;
        if (variantId && product.variants && product.variants.length > 0) {
          variant = product.variants.find((v) => v.id === variantId);
        }
        if (!variant) {
          variant = getDefaultVariant(product);
        }

        return { product, variant, quantity };
      })
      .filter((item): item is CartItem => item !== null);
  }, [cartMap, allCatalogProducts]);

  const totalCartCount = useMemo(() => {
    return Object.values(cartMap).reduce((sum, count) => sum + count, 0);
  }, [cartMap]);

  // Curated Lists for Homepage
  const todayFreshPicks = useMemo(() => {
    return TODAY_FRESH_PICKS_IDS.map((id) => products.find((p) => p.id === id)!).filter(Boolean);
  }, [products]);

  const everydayFavourites = useMemo(() => {
    return EVERYDAY_FAVOURITES_IDS.map((id) => products.find((p) => p.id === id)!).filter(Boolean);
  }, [products]);

  const displayedCategoryProducts = useMemo(() => {
    if (!selectedCategory) return null;
    return products.filter((p) => p.categorySlug === selectedCategory.slug);
  }, [selectedCategory, products]);

  const paniyaramProduct = products.find((p) => p.id === 'prod-dosa-paniyaram');

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
      {/* 1. GLOBAL HEADER & LOCATION */}
      {isAtelier ? (
        <AtelierHeader
          cartCount={totalCartCount}
          wishlistCount={wishlistSet.size}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
          onNavigate={navigate}
          currentPath={currentPath}
        />
      ) : isAnya ? (
        <AnyaHeader
          cartCount={totalCartCount}
          wishlistCount={wishlistSet.size}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
          onNavigate={navigate}
          currentPath={currentPath}
        />
      ) : (
        <>
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
            products={activeProducts}
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
          />

          {/* 2. DELIVERY LOCATION (Grocery only) */}
          <LocationBar
            location={deliveryLocation}
            onLocationChange={(newLoc) => {
              setDeliveryLocation(newLoc);
              triggerToast(`Delivery location set to ${newLoc.area}, ${newLoc.city}`);
            }}
          />
        </>
      )}

      {/* ROUTE-BASED MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col pb-20 md:pb-0">
        {route.type === 'shop' && (
          <ShopPage
            products={activeProducts}
            categories={activeCategories}
            cartMap={cartMap}
            wishlistSet={wishlistSet}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onToggleWishlist={handleToggleWishlist}
            onNotifyMe={handleNotifyMe}
            onNavigate={navigate}
            initialCategory={route.initialCategory}
            initialSearchQuery={route.initialSearchQuery}
          />
        )}

        {route.type === 'category' && (
          <CategoryPage
            categorySlug={route.categorySlug}
            categories={activeCategories}
            products={activeProducts}
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
            products={allCatalogProducts}
            categories={activeCategories}
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
              navigate('/checkout');
            }}
          />
        )}

        {/* REAL CHECKOUT PAGE */}
        {route.type === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            cartMap={cartMap}
            deliveryLocation={deliveryLocation}
            isLoggedIn={isLoggedIn}
            onNavigate={navigate}
            onUpdateQuantity={handleUpdateQuantity}
            onTriggerToast={triggerToast}
          />
        )}

        {/* NOT FOUND ROUTE */}
        {route.type === 'not-found' && (
          <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-16 text-center">
            <div className="bg-white rounded-[22px] border border-[#E7E7DF] p-8 sm:p-12 max-w-md mx-auto shadow-xs">
              <span className="inline-block px-3 py-1 bg-[#F3F4F1] text-[#004B68] text-xs font-bold rounded-full mb-3">
                Page Not Found
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#004B68]">
                We couldn't find this page
              </h1>
              <p className="text-sm text-[#626B69] mt-2 leading-relaxed">
                The food or category you're looking for might have moved or the link is outdated.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-5 py-2.5 bg-[#53B847] hover:bg-[#469e3c] text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
                >
                  Back to Haaply Home
                </button>
              </div>
            </div>
          </main>
        )}

        {/* HOMEPAGE: ATELIER FASHION STOREFRONT */}
        {route.type === 'home' && isAtelier && (
          <main className="flex-1">
            <AtelierHomepage
              onNavigate={navigate}
              onProductClick={(pId) => navigate(`/product/${pId}`)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={(pId) => {
                const found = allCatalogProducts.find((p) => p.id === pId);
                if (found) handleToggleWishlist(found);
              }}
              wishlistIds={Array.from(wishlistSet)}
            />
          </main>
        )}

        {/* HOMEPAGE: ANYA SOAPS BEAUTY STOREFRONT */}
        {route.type === 'home' && isAnya && (
          <main className="flex-1">
            <AnyaHomepage
              products={activeProducts}
              categories={activeCategories}
              cartMap={cartMap}
              wishlistSet={wishlistSet}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onToggleWishlist={handleToggleWishlist}
              onNavigate={navigate}
            />
          </main>
        )}

        {/* DEFAULT: HOMEPAGE (All original sections preserved for Grocery) */}
        {route.type === 'home' && !isAtelier && !isAnya && (
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
                {categories.map((cat) => (
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
                        quantityInCart={getProductQuantityInCart(product, cartMap)}
                        cartMap={cartMap}
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
            {isFeatureEnabled('mealIntents') && (
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
                  {mealIntents.map((intent) => (
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
                        const product = products.find((p) => p.id === id);
                        if (!product) return null;
                        return (
                          <ProductCard
                            key={product.id}
                            product={product}
                            quantityInCart={getProductQuantityInCart(product, cartMap)}
                            cartMap={cartMap}
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
            )}

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
            {isFeatureEnabled('recipes') && (
              <EditorialCard
                onViewRecipe={() => setIsRecipeOpen(true)}
                onShopIngredients={() => {
                  if (paniyaramProduct) {
                    handleAddToCart(paniyaramProduct);
                  }
                  setIsCartOpen(true);
                }}
              />
            )}
          </main>
        )}
      </div>

      {/* 9. FOOTER */}
      {isAtelier ? (
        <AtelierFooter onNavigate={navigate} />
      ) : isAnya ? (
        <AnyaFooter onNavigate={navigate} />
      ) : (
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
      )}

      {/* 10. MOBILE BOTTOM NAVIGATION BAR (Visible on mobile screens <md for Grocery) */}
      {!isAtelier && !isAnya && (
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
      )}

      {/* SUPPORTING DIALOGS & OVERLAYS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onViewCart={() => navigate('/cart')}
        onCheckout={() => {
          setIsCartOpen(false);
          navigate('/checkout');
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
        products={activeProducts}
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

      {/* FLOATING STORE INSTANCE SWITCHER (Allows instantaneous live verification between Haaply and Atelier store boundaries) */}
      <div
        id="store-instance-switcher"
        className="fixed bottom-3 left-3 z-40 bg-white/95 backdrop-blur-md border border-[#E7E7DF] shadow-md rounded-full px-2.5 py-1.5 flex items-center gap-2 text-xs font-sans text-[#172126]"
      >
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#626B69] pl-1">Store:</span>
        {availableStores.map((st) => {
          const isActive = st.id === activeStore.id;
          return (
            <button
              key={st.id}
              type="button"
              id={`switch-to-${st.id}`}
              onClick={() => {
                setStoreId(st.id);
                // Also reset route to '/' if in category/product to prevent missing item across store catalogs
                if (route.type === 'category' || route.type === 'product') {
                  navigate('/');
                }
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                isActive
                  ? (st.id === 'store-atelier'
                      ? 'bg-[#181818] text-white shadow-xs'
                      : st.id === 'store-anyasoaps'
                      ? 'bg-[#2F2326] text-white shadow-xs'
                      : 'bg-[#53B847] text-white shadow-xs')
                  : 'hover:bg-[#F2F3ED] text-[#626B69]'
              }`}
            >
              {st.name} ({st.vertical === 'grocery' ? 'Grocery' : st.vertical === 'beauty' ? 'Beauty' : 'Fashion'})
            </button>
          );
        })}
      </div>

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
