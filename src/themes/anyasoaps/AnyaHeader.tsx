import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, User, Sparkles, Heart } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-40 bg-[#FFF4F6]/95 backdrop-blur-md border-b border-[#E7C8CF] transition-all font-sans">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#2F2326] text-[#FFF4F6] text-[11px] tracking-wider py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#E39AA6]" />
        <span>100% Natural Botanicals & Cold-Pressed Oils • Free Insured Delivery Over ₹1,500</span>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 h-18 sm:h-20 flex items-center justify-between">
        {/* LEFT: Mobile Menu Button & Desktop Nav */}
        <div className="flex items-center gap-6 lg:w-1/3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-[#2F2326] hover:text-[#8FA08C] transition-colors focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-[13px] tracking-wide font-medium text-[#2F2326]">
            {navLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (item.path.startsWith('/#')) {
                    if (window.location.pathname !== '/' && window.location.pathname !== '') {
                      onNavigate('/');
                      setTimeout(() => {
                        const el = document.getElementById(item.path.replace('/#', ''));
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      const el = document.getElementById(item.path.replace('/#', ''));
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    onNavigate(item.path);
                  }
                }}
                className={`hover:text-[#8FA08C] transition-colors pb-0.5 border-b ${
                  activePath === item.path ? 'border-[#8FA08C] text-[#2F2326] font-semibold' : 'border-transparent text-[#6F5B60]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* CENTER: ANYA SOAPS BRAND IDENTITY */}
        <div className="text-center lg:w-1/3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="group inline-flex items-center gap-2.5 focus:outline-none cursor-pointer py-1"
          >
            {/* Botanical Leaf Emblem */}
            <svg className="w-5 h-5 text-[#8FA08C]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" opacity="0.1" />
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.7 22C7.5 17.5 10 13 18 10V8z" />
              <path d="M12 3C7 3 3 8 3 13c0 2.3.8 4.4 2.2 6.1C6.8 14 10.5 8 18 4.5 16.2 3.5 14.2 3 12 3z" />
            </svg>
            <span
              className="text-2xl sm:text-3xl font-semibold tracking-[0.18em] text-[#2F2326] uppercase leading-none"
              style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
            >
              ANYA SOAPS
            </span>
          </button>
        </div>

        {/* RIGHT: SEARCH, ACCOUNT, WISHLIST, CART */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 lg:w-1/3">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 text-[#2F2326] hover:text-[#8FA08C] transition-colors focus:outline-none flex items-center gap-1.5"
            aria-label="Search soaps and skincare"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.75]" />
            <span className="hidden md:inline text-[12px] tracking-wide font-medium text-[#6F5B60]">
              Search
            </span>
          </button>

          {/* Account */}
          {onOpenAccount && (
            <button
              type="button"
              onClick={onOpenAccount}
              className="p-2 text-[#2F2326] hover:text-[#8FA08C] transition-colors focus:outline-none flex items-center gap-1.5"
              aria-label="Account"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.75]" />
            </button>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => onNavigate('/shop')}
            className="relative p-2 text-[#2F2326] hover:text-[#8FA08C] transition-colors focus:outline-none flex items-center gap-1.5"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.75]" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E39AA6] text-[#2F2326] text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 text-[#2F2326] hover:text-[#8FA08C] transition-colors focus:outline-none flex items-center gap-2 bg-[#FDECEF] hover:bg-[#F8DEE3] px-3.5 py-2 rounded-full border border-[#E7C8CF]"
            aria-label={`View Cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.75] text-[#2F2326]" />
            <span className="text-[12px] font-semibold text-[#2F2326]">
              Cart ({cartCount})
            </span>
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
          <div className="fixed inset-y-0 left-0 w-[290px] bg-[#FFF4F6] p-6 shadow-2xl flex flex-col justify-between border-r border-[#E7C8CF] z-50">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E7C8CF]">
                <span className="font-semibold text-lg tracking-wider uppercase text-[#2F2326]">
                  Anya Soaps
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#2F2326] hover:text-[#8FA08C]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 flex flex-col gap-4 text-sm font-medium text-[#2F2326]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/');
                  }}
                  className="text-left py-2 hover:text-[#8FA08C] border-b border-[#E7C8CF]/40"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/shop');
                  }}
                  className="text-left py-2 hover:text-[#8FA08C] border-b border-[#E7C8CF]/40"
                >
                  All Artisan Soaps
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/category/nourishing-hydrating');
                  }}
                  className="text-left py-2 hover:text-[#8FA08C] border-b border-[#E7C8CF]/40"
                >
                  Nourishing & Hydrating
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/category/clarifying-purifying');
                  }}
                  className="text-left py-2 hover:text-[#8FA08C] border-b border-[#E7C8CF]/40"
                >
                  Clarifying & Detox
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/category/soothing-calming');
                  }}
                  className="text-left py-2 hover:text-[#8FA08C] border-b border-[#E7C8CF]/40"
                >
                  Soothing Wildflowers
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/category/gentle-baby-safe');
                  }}
                  className="text-left py-2 hover:text-[#8FA08C] border-b border-[#E7C8CF]/40"
                >
                  Gentle Baby Safe
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const el = document.getElementById('quiz');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-left py-2 hover:text-[#8FA08C]"
                >
                  Skin Type Quiz
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E7C8CF] text-xs text-[#8E7A7E] space-y-2">
              <p>Handmade with organic botanicals & cold-pressed oils in Coimbatore, Tamil Nadu.</p>
              <p className="font-medium text-[#2F2326]">Support: +91 8220265266</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
