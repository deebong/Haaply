import React from 'react';
import { Home, Compass, Search, User, ShoppingBag } from 'lucide-react';
import { useConfig } from '../providers/ConfigProvider';
import { useTheme } from '../providers/ThemeProvider';
import { useActiveStore } from '../providers/StoreProvider';

interface MobileBottomNavProps {
  activeNav: string;
  onNavClick: (nav: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  isLoggedIn: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeNav,
  onNavClick,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  isLoggedIn,
}) => {
  const { isFeatureEnabled } = useConfig();
  const { theme } = useTheme();
  const { activeStore } = useActiveStore();
  const isAtelier = theme.id === 'atelier' || activeStore.vertical === 'fashion';
  const isAnya = theme.id === 'anyasoaps' || activeStore.vertical === 'beauty';

  const activeColor = isAnya
    ? 'text-[#2F2326] font-semibold'
    : isAtelier
    ? 'text-[#181818] font-semibold'
    : 'text-[#004B68] font-semibold';

  const badgeColor = isAnya
    ? 'bg-[#C97C89]'
    : isAtelier
    ? 'bg-[#181818]'
    : 'bg-[#53B847]';

  return (
    <nav
      id="mobile-bottom-nav"
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)] ${
        isAnya ? 'border-[#E7C8CF]' : 'border-[#E7E7DF]'
      }`}
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {/* 1. Home */}
        <a
          id="mobile-nav-home"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('home');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] rounded-lg transition-colors duration-150 focus:outline-none ${
            activeNav === 'home'
              ? activeColor
              : 'text-[#626B69] hover:text-[#172126]'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </a>

        {/* 2. Shop */}
        {isFeatureEnabled('catalog') && (
          <a
            id="mobile-nav-shop"
            href="/shop"
            onClick={(e) => {
              e.preventDefault();
              onNavClick('shop');
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] rounded-lg transition-colors duration-150 focus:outline-none ${
              activeNav === 'shop' || activeNav === 'category' || activeNav === 'product'
                ? activeColor
                : 'text-[#626B69] hover:text-[#172126]'
            }`}
            aria-label="Shop complete catalog"
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{isAnya ? 'Artisans' : isAtelier ? 'Pieces' : 'Shop'}</span>
          </a>
        )}

        {/* 3. Search */}
        {isFeatureEnabled('search') && (
          <button
            id="mobile-nav-search"
            type="button"
            onClick={onOpenSearch}
            className="flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] text-[#626B69] hover:text-[#172126] rounded-lg transition-colors duration-150 focus:outline-none"
            aria-label="Search items"
          >
            <Search className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Search</span>
          </button>
        )}

        {/* 4. Account */}
        {isFeatureEnabled('customerAccounts') && (
          <button
            id="mobile-nav-account"
            type="button"
            onClick={onOpenAccount}
            className="flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] text-[#626B69] hover:text-[#172126] rounded-lg transition-colors duration-150 focus:outline-none"
            aria-label={isLoggedIn ? 'Account profile' : 'Sign in'}
          >
            <div className="relative">
              <User className="w-5 h-5 mb-0.5" />
              {isLoggedIn && (
                <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${badgeColor}`} />
              )}
            </div>
            <span className="text-[10px] tracking-tight">
              {isLoggedIn ? 'Account' : 'Sign in'}
            </span>
          </button>
        )}

        {/* 5. Cart */}
        <button
          id="mobile-nav-cart"
          type="button"
          onClick={onOpenCart}
          className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] rounded-lg transition-colors duration-150 focus:outline-none relative ${
            isAnya ? 'text-[#2F2326] hover:text-[#C97C89]' : isAtelier ? 'text-[#181818] hover:text-[#767676]' : 'text-[#004B68] hover:text-[#53B847]'
          }`}
          aria-label={`Cart with ${cartCount} items`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-2.5 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white rounded-full ring-2 ring-white ${badgeColor}`}>
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight">{isAnya || isAtelier ? 'Bag' : 'Cart'}</span>
        </button>
      </div>
    </nav>
  );
};
