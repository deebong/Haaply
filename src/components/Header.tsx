import React, { useState } from 'react';
import { Search, Heart, User, ShoppingBag, X } from 'lucide-react';
import { HaaplyLogo } from './HaaplyLogo';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const navItems = [
    { id: 'shop', label: 'Shop' },
    { id: 'collections', label: 'Collections' },
    { id: 'fresh-today', label: 'Fresh Today' },
    { id: 'recipes', label: 'Recipes' },
  ];

  return (
    <header
      id="global-header"
      className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E7E7DF] transition-colors duration-200"
      style={{ height: '76px' }}
    >
      <div className="max-w-[1280px] h-full mx-auto px-6 md:px-8 lg:px-10 flex items-center justify-between gap-6">
        {/* LEFT: Haaply Brand Logo */}
        <div className="flex items-center">
          <button
            id="header-brand-link"
            type="button"
            onClick={() => onNavClick('home')}
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] rounded-md py-1"
            aria-label="Haaply Homepage"
          >
            <HaaplyLogo width={120} />
          </button>
        </div>

        {/* CENTER: Primary Navigation */}
        <nav id="primary-navigation" className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                type="button"
                onClick={() => onNavClick(item.id)}
                className={`relative py-2 text-[15px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] rounded-sm ${
                  isActive
                    ? 'text-[#004B68] font-semibold'
                    : 'text-[#626B69] hover:text-[#172126]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#53B847] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Utility Controls (Search, Wishlist, Account, Cart) */}
        <div id="header-utilities" className="flex items-center gap-2 sm:gap-4">
          {/* Search Toggle / Input */}
          <div className="relative flex items-center">
            {isSearchExpanded ? (
              <div className="relative flex items-center animate-in fade-in zoom-in-95 duration-150">
                <input
                  id="header-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search batters, sevai, paneer..."
                  autoFocus
                  className="w-48 sm:w-64 pl-9 pr-8 py-1.5 text-sm bg-[#F2F3ED] text-[#172126] placeholder-[#626B69] rounded-lg border border-[#E7E7DF] focus:outline-none focus:border-[#53B847] focus:bg-white transition-all"
                />
                <Search className="w-4 h-4 text-[#626B69] absolute left-2.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded(false)}
                  className="absolute right-2 p-1 text-[#626B69] hover:text-[#172126]"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="header-search-btn"
                type="button"
                onClick={() => {
                  setIsSearchExpanded(true);
                  onOpenSearch();
                }}
                className="p-2 text-[#172126] hover:text-[#004B68] hover:bg-[#F2F3ED] rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847]"
                aria-label="Search items"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Wishlist */}
          <button
            id="header-wishlist-btn"
            type="button"
            onClick={() => onNavClick('wishlist')}
            className="relative p-2 text-[#172126] hover:text-[#004B68] hover:bg-[#F2F3ED] rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847]"
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

          {/* Account */}
          <button
            id="header-account-btn"
            type="button"
            onClick={onOpenAccount}
            className="p-2 text-[#172126] hover:text-[#004B68] hover:bg-[#F2F3ED] rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] flex items-center gap-1.5"
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

          {/* Cart */}
          <button
            id="header-cart-btn"
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-2 text-[#172126] hover:text-[#004B68] hover:bg-[#F2F3ED] rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847]"
            aria-label={`Cart with ${cartCount} items`}
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 ? (
              <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[11px] font-bold text-white bg-[#53B847] rounded-full">
                {cartCount}
              </span>
            ) : (
              <span className="text-xs font-medium text-[#626B69]">Cart</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
