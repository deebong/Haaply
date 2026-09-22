import React, { useState } from 'react';
import { Search, Heart, User, ShoppingBag, X } from 'lucide-react';
import { HaaplyLogo } from './HaaplyLogo';
import { useConfig } from '../providers/ConfigProvider';

interface HeaderProps {
  activeNav: string;
  onNavClick: (nav: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  isLoggedIn: boolean;
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
}) => {
  const { isFeatureEnabled } = useConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const navItems = [
    { id: 'shop', label: 'Shop', href: '/shop', enabled: isFeatureEnabled('catalog') },
    { id: 'collections', label: 'Collections', href: '/shop', enabled: isFeatureEnabled('catalog') },
    { id: 'fresh-today', label: 'Fresh Today', href: '/', enabled: true },
    { id: 'recipes', label: 'Recipes', enabled: isFeatureEnabled('recipes') },
  ].filter((item) => item.enabled);

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
          <div className="relative flex items-center">
            {isSearchExpanded ? (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 z-50 flex items-center bg-white sm:bg-transparent p-1 sm:p-0 rounded-xl shadow-lg sm:shadow-none border sm:border-0 border-[#E7E7DF] animate-in fade-in zoom-in-95 duration-150">
                <div className="relative flex items-center">
                  <input
                    id="header-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search batters, paneer..."
                    autoFocus
                    className="w-48 sm:w-56 md:w-64 pl-9 pr-8 py-2 sm:py-1.5 text-sm bg-[#F2F3ED] text-[#172126] placeholder-[#626B69] rounded-lg border border-[#E7E7DF] focus:outline-none focus:border-[#53B847] focus:bg-white transition-all"
                  />
                  <Search className="w-4 h-4 text-[#626B69] absolute left-2.5 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(false)}
                    className="absolute right-2 p-1.5 text-[#626B69] hover:text-[#172126]"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
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
