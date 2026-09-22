import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight, User } from 'lucide-react';

interface AtelierHeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount?: () => void;
  onNavigate: (path: string) => void;
  currentPath?: string;
  activePath?: string;
}

export const AtelierHeader: React.FC<AtelierHeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  onNavigate,
  currentPath = '/',
  activePath = '/',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'New Arrivals', path: '/shop' },
    { label: 'Shirts & Tops', path: '/category/shirts-tops' },
    { label: 'Trousers', path: '/category/trousers' },
    { label: 'Outerwear', path: '/category/outerwear' },
    { label: 'Knitwear', path: '/category/knitwear' },
    { label: 'Accessories', path: '/category/accessories' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-[#E8E6E1] transition-all">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#141414] text-[#FBFBF9] text-[11px] tracking-widest uppercase py-2 px-4 text-center font-medium">
        <span>Complimentary Express Worldwide Delivery on Orders Over ₹5,000</span>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 h-18 sm:h-20 flex items-center justify-between">
        {/* LEFT: Mobile Menu Button & Desktop Nav */}
        <div className="flex items-center gap-6 lg:w-1/3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-[#181818] hover:text-[#8C7355] transition-colors focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>

          <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-wider uppercase font-medium text-[#181818]">
            <button
              type="button"
              onClick={() => onNavigate('/shop')}
              className={`hover:text-[#8C7355] transition-colors pb-0.5 border-b ${
                activePath === '/shop' ? 'border-[#141414] text-[#141414]' : 'border-transparent text-[#181818]'
              }`}
            >
              Collection
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/category/shirts-tops')}
              className="hover:text-[#8C7355] transition-colors pb-0.5 border-b border-transparent text-[#767676] hover:text-[#181818]"
            >
              Apparel
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/category/outerwear')}
              className="hover:text-[#8C7355] transition-colors pb-0.5 border-b border-transparent text-[#767676] hover:text-[#181818]"
            >
              Outerwear
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/category/accessories')}
              className="hover:text-[#8C7355] transition-colors pb-0.5 border-b border-transparent text-[#767676] hover:text-[#181818]"
            >
              Objects
            </button>
          </nav>
        </div>

        {/* CENTER: EDITORIAL BRAND IDENTITY */}
        <div className="text-center lg:w-1/3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="group inline-flex flex-col items-center focus:outline-none cursor-pointer"
          >
            <span
              className="text-2xl sm:text-3xl font-normal tracking-[0.25em] text-[#141414] uppercase leading-none font-serif"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              ATELIER
            </span>
            <span className="text-[9px] tracking-[0.35em] text-[#767676] font-medium uppercase mt-1 group-hover:text-[#141414] transition-colors">
              HAAPLY EDITIONS
            </span>
          </button>
        </div>

        {/* RIGHT: SEARCH, WISHLIST, BAG */}
        <div className="flex items-center justify-end gap-3 sm:gap-5 lg:w-1/3">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 text-[#181818] hover:text-[#8C7355] transition-colors focus:outline-none flex items-center gap-1.5"
            aria-label="Search collection"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
            <span className="hidden md:inline text-[12px] tracking-wider uppercase font-medium text-[#767676]">
              Search
            </span>
          </button>

          {/* Account */}
          {onOpenAccount && (
            <button
              type="button"
              onClick={onOpenAccount}
              className="p-2 text-[#181818] hover:text-[#8C7355] transition-colors focus:outline-none flex items-center gap-1.5"
              aria-label="Account"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
            </button>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => onNavigate('/shop')}
            className="relative p-2 text-[#181818] hover:text-[#8C7355] transition-colors focus:outline-none flex items-center gap-1.5"
            aria-label={`Wishlist with ${wishlistCount} items`}
          >
            <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5] ${wishlistCount > 0 ? 'fill-[#141414] text-[#141414]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="text-[11px] font-medium text-[#181818]">({wishlistCount})</span>
            )}
          </button>

          {/* Shopping Bag (Editorial Fashion Terminology) */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 text-[#181818] hover:text-[#8C7355] transition-colors focus:outline-none flex items-center gap-2 group cursor-pointer"
            aria-label={`Shopping Bag with ${cartCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#141414] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-[12px] tracking-wider uppercase font-medium text-[#181818] group-hover:text-[#8C7355] transition-colors">
              Bag {cartCount > 0 ? `(${cartCount})` : ''}
            </span>
          </button>
        </div>
      </div>

      {/* 3. MOBILE EDITORIAL DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-[#FBFBF9] p-6 sm:p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E8E6E1]">
                <span
                  className="text-xl tracking-[0.2em] font-serif text-[#141414]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  ATELIER
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#767676] hover:text-[#181818]"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="mt-8 space-y-5">
                {navLinks.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate(item.path);
                    }}
                    className="w-full text-left py-2 text-base tracking-wider uppercase font-medium text-[#181818] hover:text-[#8C7355] flex items-center justify-between transition-colors border-b border-[#E8E6E1]/50"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#767676]" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E6E1] text-xs text-[#767676] space-y-2">
              <p className="tracking-widest uppercase font-medium text-[#181818]">Client Concierge</p>
              <p>client@atelier.haaply.com</p>
              <p>Mon – Sat, 9:00am – 7:00pm IST</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
