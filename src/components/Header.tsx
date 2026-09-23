import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Heart, User, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { HaaplyLogo } from './HaaplyLogo';
import { useConfig } from '../providers/ConfigProvider';
import { useActiveStore } from '../providers/StoreProvider';
import { Product, ProductVariant } from '../types';
import { filterProductsByQuery, getPopularSearchTerms, getSearchPlaceholder } from '../utils/searchUtils';

interface HeaderProps {
  activeNav: string;
  onNavClick: (nav: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  isLoggedIn: boolean;
  products?: Product[];
  onNavigate?: (path: string) => void;
  onAddToCart?: (product: Product, variant?: ProductVariant) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  onNavClick,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  isLoggedIn,
  products = [],
  onNavigate,
  onAddToCart,
}) => {
  const { isFeatureEnabled } = useConfig();
  const { activeStore } = useActiveStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside or pressing Escape
  useEffect(() => {
    if (!isSearchExpanded) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchExpanded]);

  // Focus input when expanding
  useEffect(() => {
    if (isSearchExpanded) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchExpanded]);

  const navItems = [
    { id: 'shop', label: 'Shop', href: '/shop', enabled: isFeatureEnabled('catalog') },
    { id: 'collections', label: 'Collections', href: '/shop', enabled: isFeatureEnabled('catalog') },
    { id: 'fresh-today', label: 'Fresh Today', href: '/', enabled: true },
    { id: 'recipes', label: 'Recipes', enabled: isFeatureEnabled('recipes') },
  ].filter((item) => item.enabled);

  // Scoped search results from the active Store Instance catalog
  const searchResults = useMemo(() => {
    if (!products || products.length === 0) return [];
    return filterProductsByQuery(products, searchQuery, 6);
  }, [products, searchQuery]);

  const popularSearches = useMemo(() => {
    return getPopularSearchTerms(activeStore.vertical);
  }, [activeStore.vertical]);

  const placeholderText = useMemo(() => {
    return getSearchPlaceholder(activeStore.vertical);
  }, [activeStore.vertical]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    setIsSearchExpanded(false);
    if (onNavigate) {
      if (q) {
        onNavigate(`/shop?q=${encodeURIComponent(q)}`);
      } else {
        onNavigate('/shop');
      }
    }
  };

  const handleProductSelect = (product: Product) => {
    setIsSearchExpanded(false);
    setSearchQuery('');
    if (onNavigate) {
      onNavigate(`/product/${product.id}`);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleClearQuery = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  return (
    <header
      id="global-header"
      className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E7E7DF] transition-all duration-200 h-[64px] sm:h-[72px] md:h-[76px]"
    >
      <div className="max-w-[1280px] h-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between gap-3 sm:gap-6 relative">
        {/* LEFT: Haaply Brand Logo */}
        <div className="flex items-center shrink-0">
          <a
            id="header-brand-link"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavClick('home');
            }}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] rounded-md py-1"
            aria-label="Haaply Homepage"
          >
            <span className="sm:hidden">
              <HaaplyLogo width={105} />
            </span>
            <span className="hidden sm:inline-block">
              <HaaplyLogo width={120} />
            </span>
          </a>
        </div>

        {/* CENTER: Primary Navigation (Desktop only) */}
        <nav id="primary-navigation" className="hidden md:flex items-center gap-6 lg:gap-10" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <a
                key={item.id}
                id={`nav-item-${item.id}`}
                href={item.href || '#'}
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(item.id);
                }}
                className={`relative py-2 text-[14px] lg:text-[15px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] rounded-sm ${
                  isActive
                    ? 'text-[#004B68] font-semibold'
                    : 'text-[#626B69] hover:text-[#172126]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#53B847] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* RIGHT: Utility Controls (Search, Wishlist, Account, Cart) */}
        <div id="header-utilities" className="flex items-center gap-1 sm:gap-3 lg:gap-4">
          {/* Search Toggle / Input */}
          <div ref={searchContainerRef} className="relative flex items-center">
            {isSearchExpanded ? (
              <div className="relative flex items-center animate-in fade-in duration-150">
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex items-center w-56 sm:w-64 md:w-72 lg:w-80 transition-all duration-200"
                >
                  <Search className="w-4 h-4 text-[#53B847] absolute left-3 pointer-events-none" />
                  <input
                    ref={inputRef}
                    id="header-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={placeholderText}
                    autoFocus
                    className="w-full pl-9 pr-16 py-1.5 sm:py-2 text-sm bg-[#F2F3ED] text-[#172126] placeholder-[#626B69] rounded-xl border border-[#E7E7DF] focus:outline-none focus:border-[#53B847] focus:bg-white shadow-xs transition-all"
                  />
                  <div className="absolute right-2 flex items-center gap-0.5">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearQuery}
                        className="p-1 text-[#626B69] hover:text-[#172126] rounded-md transition-colors"
                        aria-label="Clear search query"
                        title="Clear"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      id="header-search-close-btn"
                      type="button"
                      onClick={handleCloseSearch}
                      className="p-1 text-[#626B69] hover:text-[#172126] rounded-md hover:bg-[#E7E7DF]/60 transition-colors"
                      aria-label="Close search"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* EXPANDING SEARCH LIVE DROPDOWN RESULTS */}
                <div
                  id="header-search-dropdown"
                  className="absolute right-0 top-full mt-2 w-[320px] sm:w-[380px] md:w-[420px] bg-white rounded-2xl shadow-xl border border-[#E7E7DF] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {/* If query has text: show live search results */}
                  {searchQuery.trim() ? (
                    <div className="flex flex-col max-h-[420px]">
                      <div className="px-3.5 py-2 bg-[#FAFAF6] border-b border-[#E7E7DF] flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#004B68]">
                          {searchResults.length > 0
                            ? `Found ${searchResults.length} fresh ${searchResults.length === 1 ? 'item' : 'items'}`
                            : 'No matching items'}
                        </span>
                        <span className="text-[11px] text-[#626B69]">
                          Press Enter to view all
                        </span>
                      </div>

                      {searchResults.length > 0 ? (
                        <div className="overflow-y-auto divide-y divide-[#E7E7DF]/60 p-1.5 max-h-[300px]">
                          {searchResults.map((product) => {
                            const defaultVariant = product.variants?.[0];
                            const displayPrice = defaultVariant ? defaultVariant.price : product.price;
                            const packLabel = defaultVariant?.label || product.packSize;
                            const isOutOfStock = product.stockStatus === 'out_of_stock';

                            return (
                              <div
                                key={product.id}
                                onClick={() => handleProductSelect(product)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F3ED] transition-colors cursor-pointer group"
                              >
                                <div className="w-11 h-11 rounded-lg bg-[#F2F3ED] overflow-hidden shrink-0 border border-[#E7E7DF]">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-1.5">
                                    <h4 className="text-xs sm:text-sm font-semibold text-[#172126] truncate group-hover:text-[#004B68]">
                                      {product.name}
                                    </h4>
                                    {product.tamilName && (
                                      <span className="text-[11px] text-[#626B69] font-normal truncate hidden sm:inline">
                                        ({product.tamilName})
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#626B69]">
                                    <span className="font-bold text-[#004B68]">₹{displayPrice}</span>
                                    {packLabel && (
                                      <span className="text-[11px] text-[#626B69]">· {packLabel}</span>
                                    )}
                                    {isOutOfStock && (
                                      <span className="text-[10px] text-[#D9383A] font-semibold">Out of Stock</span>
                                    )}
                                  </div>
                                </div>
                                {!isOutOfStock && onAddToCart && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleQuickAdd(e, product)}
                                    className="px-2.5 py-1 text-xs font-semibold text-[#53B847] hover:bg-[#53B847] hover:text-white border border-[#53B847]/40 rounded-lg transition-colors shrink-0"
                                    aria-label={`Add ${product.name} to basket`}
                                  >
                                    Add
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-sm font-medium text-[#172126]">
                            No items match "{searchQuery}"
                          </p>
                          <p className="text-xs text-[#626B69] mt-1">
                            Try searching for dosa batter, fresh paneer, or ragi sevai.
                          </p>
                        </div>
                      )}

                      {/* Bottom Footer: Submit / View All in Shop */}
                      <div className="p-2.5 bg-[#FAFAF6] border-t border-[#E7E7DF] text-center">
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="w-full py-2 px-3 bg-[#53B847] hover:bg-[#469e3c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>View all search results</span>
                          <span className="text-[11px] opacity-90">({searchQuery.trim()})</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* When query is empty: Show Popular Searches + Quick Tips */
                    <div className="p-3.5 space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-[#004B68] uppercase tracking-wider mb-2">
                          Popular Searches
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {popularSearches.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setSearchQuery(tag);
                                inputRef.current?.focus();
                              }}
                              className="px-2.5 py-1 bg-[#F2F3ED] hover:bg-[#E7E7DF] text-[#172126] text-xs font-medium rounded-lg border border-[#E7E7DF] transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                      {products && products.length > 0 && (
                        <div className="pt-2 border-t border-[#E7E7DF]/60">
                          <div className="text-xs font-semibold text-[#626B69] mb-2">
                            Fresh Recommendations
                          </div>
                          <div className="space-y-1.5">
                            {products.slice(0, 3).map((product) => (
                              <div
                                key={product.id}
                                onClick={() => handleProductSelect(product)}
                                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#F2F3ED] cursor-pointer text-xs transition-colors"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-8 h-8 rounded-md object-cover shrink-0 border border-[#E7E7DF]"
                                  />
                                  <span className="font-medium text-[#172126] truncate">{product.name}</span>
                                </div>
                                <span className="font-bold text-[#004B68] shrink-0">₹{product.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                id="header-search-btn"
                type="button"
                onClick={() => {
                  if (window.innerWidth < 640) {
                    onOpenSearch();
                  } else {
                    setIsSearchExpanded(true);
                  }
                }}
                className="p-2 sm:p-2.5 text-[#172126] hover:text-[#004B68] hover:bg-[#F2F3ED] rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Search items"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Wishlist */}
          {isFeatureEnabled('wishlist') && (
            <button
              id="header-wishlist-btn"
              type="button"
              onClick={() => onNavClick('wishlist')}
              className="relative p-2 sm:p-2.5 text-[#172126] hover:text-[#004B68] hover:bg-[#F2F3ED] rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label={`Wishlist with ${wishlistCount} saved items`}
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-[#004B68] text-[#004B68]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-[#004B68] rounded-full ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* Account (hidden on mobile, provided in bottom nav; visible on tablet/desktop) */}
          {isFeatureEnabled('customerAccounts') && (
            <button
              id="header-account-btn"
              type="button"
              onClick={onOpenAccount}
              className="hidden md:flex p-2.5 text-[#172126] hover:text-[#004B68] hover:bg-[#F2F3ED] rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] items-center gap-1.5 min-h-[40px]"
              aria-label={isLoggedIn ? 'Account Profile' : 'Sign in to your account'}
              title={isLoggedIn ? 'Karthik (Account)' : 'Sign In'}
            >
              <User className="w-5 h-5" />
              {isLoggedIn && (
                <span className="hidden xl:inline-block text-xs font-medium text-[#172126]">
                  Account
                </span>
              )}
            </button>
          )}

          {/* Cart */}
          <button
            id="header-cart-btn"
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-[#172126] hover:text-[#004B68] hover:bg-[#F2F3ED] rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] min-h-[40px]"
            aria-label={`Cart with ${cartCount} items`}
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 ? (
              <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[11px] font-bold text-white bg-[#53B847] rounded-full">
                {cartCount}
              </span>
            ) : (
              <span className="hidden sm:inline-block text-xs font-medium text-[#626B69]">Cart</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
