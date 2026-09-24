import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, User, Sparkles, Heart } from 'lucide-react';
import { getAnyaClippedPolygon } from './AnyaCard';

interface AnyaHeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount?: () => void;
  onNavigate: (path: string) => void;
  currentPath?: string;
  activePath?: string;
}

export const AnyaHeader: React.FC<AnyaHeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  onNavigate,
  activePath = '/',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Collection', path: '/shop' },
    { label: 'Nourishing', path: '/category/nourishing-hydrating' },
    { label: 'Clarifying', path: '/category/clarifying-purifying' },
    { label: 'Soothing', path: '/category/soothing-calming' },
    { label: 'Skin Quiz', path: '/#quiz' },
  ];

  const handleNavClick = (path: string) => {
    if (path.startsWith('/#')) {
      const targetId = path.replace('/#', '');
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        onNavigate('/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF4F6]/95 backdrop-blur-md border-b border-[#E7C8CF] transition-all font-sans">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#2F2326] text-[#FFF4F6] text-[10px] sm:text-[11px] tracking-wider py-2 px-3 sm:px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#E39AA6] shrink-0" />
        <span className="truncate">100% Natural Botanicals & Cold-Pressed Oils • Free Delivery Over ₹1,500</span>
      </div>

      {/* 2. MAIN HEADER BAR (Anya Layout: [ LOGO LEFT ] [ NAV CENTER ] [ ACTIONS RIGHT ]) */}
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* LEFT: BRAND IDENTITY & MOBILE MENU TRIGGER */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 sm:p-2 -ml-1 text-[#2F2326] hover:text-[#C97C89] transition-colors focus:outline-none shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Brand Logo Mark (Left Aligned on Desktop & Mobile) */}
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="group inline-flex items-center gap-2 sm:gap-2.5 focus:outline-none cursor-pointer text-left py-1"
          >
            {/* Botanical Leaf Emblem in Anya Primary Pink */}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#C97C89] transition-transform group-hover:scale-105 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" opacity="0.1" />
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.7 22C7.5 17.5 10 13 18 10V8z" />
              <path d="M12 3C7 3 3 8 3 13c0 2.3.8 4.4 2.2 6.1C6.8 14 10.5 8 18 4.5 16.2 3.5 14.2 3 12 3z" />
            </svg>
            <span
              className="text-lg xs:text-xl sm:text-2xl font-semibold tracking-[0.16em] sm:tracking-[0.18em] text-[#2F2326] uppercase leading-none"
              style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
            >
              ANYA SOAPS
            </span>
          </button>
        </div>

        {/* CENTER: PRIMARY NAVIGATION (Visual Center of Header on Desktop) */}
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-[13px] tracking-wide font-medium text-[#2F2326] flex-1 max-w-2xl px-4">
          {navLinks.map((item) => {
            const isActive = activePath === item.path;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.path)}
                className={`transition-colors pb-1 border-b-2 font-medium cursor-pointer ${
                  isActive
                    ? 'border-[#C97C89] text-[#2F2326] font-semibold'
                    : 'border-transparent text-[#6F5B60] hover:text-[#C97C89]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: SEARCH, ACCOUNT, WISHLIST, ARTISAN CART */}
        <div className="flex items-center justify-end gap-1.5 xs:gap-2 sm:gap-3.5 shrink-0">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-1.5 sm:p-2 text-[#2F2326] hover:text-[#C97C89] transition-colors focus:outline-none flex items-center gap-1.5 shrink-0"
            aria-label="Search soaps and skincare"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
            <span className="hidden md:inline text-[12px] tracking-wide font-medium text-[#6F5B60]">
              Search
            </span>
          </button>

          {/* Account */}
          {onOpenAccount && (
            <button
              type="button"
              onClick={onOpenAccount}
              className="p-1.5 sm:p-2 text-[#2F2326] hover:text-[#C97C89] transition-colors focus:outline-none flex items-center gap-1.5 shrink-0"
              aria-label="Account"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
            </button>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => onNavigate('/shop')}
            className="relative p-1.5 sm:p-2 text-[#2F2326] hover:text-[#C97C89] transition-colors focus:outline-none flex items-center gap-1 shrink-0"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5] ${wishlistCount > 0 ? 'fill-[#C97C89] text-[#C97C89]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#E39AA6] text-[#2F2326] text-[9.5px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Artisan Bag / Cart (Signature Anya Clipped Corner Geometry) */}
          <button
            id="anya-cart-header-btn"
            type="button"
            onClick={onOpenCart}
            className="relative group p-0 text-[#2F2326] focus:outline-none cursor-pointer shrink-0 z-10 transition-transform active:scale-95"
            aria-label={`View Artisan Cart with ${cartCount} items`}
            style={{
              clipPath: getAnyaClippedPolygon(7),
            }}
          >
            {/* Outer border layer */}
            <div
              className="absolute inset-0 bg-[#E7C8CF] group-hover:bg-[#C97C89] transition-colors pointer-events-none"
              style={{ clipPath: getAnyaClippedPolygon(7) }}
            />
            {/* Inner fill layer */}
            <div
              className="relative m-[1px] px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-[#FFF8FA] group-hover:bg-white transition-colors flex items-center gap-1.5 sm:gap-2"
              style={{ clipPath: getAnyaClippedPolygon(6) }}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5] text-[#C97C89]" />
                {cartCount > 0 && (
                  <span className="sm:hidden absolute -top-1.5 -right-2 bg-[#2F2326] text-[#FFF4F6] text-[8.5px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-[12px] font-semibold text-[#2F2326] tracking-wide whitespace-nowrap">
                <span className="hidden sm:inline">Bag </span>
                <span>({cartCount})</span>
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-OUT MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[85vw] max-w-xs bg-[#FFF8FA] p-6 shadow-2xl flex flex-col justify-between border-r border-[#E7C8CF] z-50 animate-in slide-in-from-left duration-200">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-5 border-b border-[#E7C8CF]">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#C97C89]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.7 22C7.5 17.5 10 13 18 10V8z" />
                    <path d="M12 3C7 3 3 8 3 13c0 2.3.8 4.4 2.2 6.1C6.8 14 10.5 8 18 4.5 16.2 3.5 14.2 3 12 3z" />
                  </svg>
                  <span
                    className="font-semibold text-lg tracking-[0.16em] uppercase text-[#2F2326]"
                    style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
                  >
                    Anya Soaps
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#2F2326] hover:text-[#C97C89] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Navigation links */}
              <div className="py-5 flex flex-col gap-1 text-sm font-medium text-[#2F2326]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/');
                  }}
                  className="text-left py-2.5 px-2 hover:text-[#C97C89] hover:bg-[#FFF4F6] rounded-md transition-colors border-b border-[#E7C8CF]/40"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/shop');
                  }}
                  className="text-left py-2.5 px-2 hover:text-[#C97C89] hover:bg-[#FFF4F6] rounded-md transition-colors border-b border-[#E7C8CF]/40"
                >
                  All Artisan Soaps
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/category/nourishing-hydrating');
                  }}
                  className="text-left py-2.5 px-2 hover:text-[#C97C89] hover:bg-[#FFF4F6] rounded-md transition-colors border-b border-[#E7C8CF]/40"
                >
                  Nourishing & Hydrating
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/category/clarifying-purifying');
                  }}
                  className="text-left py-2.5 px-2 hover:text-[#C97C89] hover:bg-[#FFF4F6] rounded-md transition-colors border-b border-[#E7C8CF]/40"
                >
                  Clarifying & Purifying
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/category/soothing-calming');
                  }}
                  className="text-left py-2.5 px-2 hover:text-[#C97C89] hover:bg-[#FFF4F6] rounded-md transition-colors border-b border-[#E7C8CF]/40"
                >
                  Soothing Wildflowers
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/category/gentle-baby-safe');
                  }}
                  className="text-left py-2.5 px-2 hover:text-[#C97C89] hover:bg-[#FFF4F6] rounded-md transition-colors border-b border-[#E7C8CF]/40"
                >
                  Gentle Baby Safe
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavClick('/#quiz');
                  }}
                  className="text-left py-2.5 px-2 hover:text-[#C97C89] hover:bg-[#FFF4F6] rounded-md transition-colors"
                >
                  Skin Type Quiz
                </button>
              </div>
            </div>

            {/* Bottom info */}
            <div className="pt-5 border-t border-[#E7C8CF] text-xs text-[#8E7A7E] space-y-2">
              <p>Handmade with organic botanicals & cold-pressed oils in Coimbatore, Tamil Nadu.</p>
              <p className="font-semibold text-[#2F2326]">Support: +91 8220265266</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
