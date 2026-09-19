import React from 'react';
import { HaaplyLogo } from './HaaplyLogo';

interface FooterProps {
  onLinkClick?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  const handleClick = (slug: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLinkClick) onLinkClick(slug);
  };

  return (
    <footer
      id="global-footer"
      className="w-full bg-white border-t border-[#E7E7DF] mt-16 sm:mt-20"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-10 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* BRAND COLUMN (2 cols on desktop) */}
          <div className="md:col-span-2">
            <HaaplyLogo width={125} />
            <p className="mt-3 text-[14px] text-[#626B69] max-w-sm leading-relaxed">
              Fresh food for your home. Stone-ground batters, heritage millets and wholesome ready-to-cook staples prepared fresh every morning in Coimbatore.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#626B69]">
              <span className="w-2 h-2 rounded-full bg-[#53B847]" />
              <span>Certified fresh delivery • FSSAI compliant</span>
            </div>
          </div>

          {/* SHOP COLUMN */}
          <div>
            <h4 className="text-[13px] font-bold text-[#172126] tracking-wider uppercase mb-3">
              Shop
            </h4>
            <ul className="space-y-2 text-[14px] text-[#626B69]">
              <li>
                <a
                  href="#shop-all"
                  onClick={handleClick('shop-all')}
                  className="hover:text-[#004B68] transition-colors"
                >
                  All products
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  onClick={handleClick('categories')}
                  className="hover:text-[#004B68] transition-colors"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#collections"
                  onClick={handleClick('collections')}
                  className="hover:text-[#004B68] transition-colors"
                >
                  Collections
                </a>
              </li>
              <li>
                <a
                  href="#fresh-today"
                  onClick={handleClick('fresh-today')}
                  className="hover:text-[#004B68] transition-colors"
                >
                  Fresh today
                </a>
              </li>
            </ul>
          </div>

          {/* HELP COLUMN */}
          <div>
            <h4 className="text-[13px] font-bold text-[#172126] tracking-wider uppercase mb-3">
              Help
            </h4>
            <ul className="space-y-2 text-[14px] text-[#626B69]">
              <li>
                <a
                  href="#contact"
                  onClick={handleClick('contact')}
                  className="hover:text-[#004B68] transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#delivery"
                  onClick={handleClick('delivery')}
                  className="hover:text-[#004B68] transition-colors"
                >
                  Delivery
                </a>
              </li>
              <li>
                <a
                  href="#orders"
                  onClick={handleClick('orders')}
                  className="hover:text-[#004B68] transition-colors"
                >
                  Orders
                </a>
              </li>
            </ul>
          </div>

          {/* POLICIES COLUMN */}
          <div>
            <h4 className="text-[13px] font-bold text-[#172126] tracking-wider uppercase mb-3">
              Policies
            </h4>
            <ul className="space-y-2 text-[14px] text-[#626B69]">
              <li>
                <a
                  href="#privacy"
                  onClick={handleClick('privacy')}
                  className="hover:text-[#004B68] transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={handleClick('terms')}
                  className="hover:text-[#004B68] transition-colors"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#refund"
                  onClick={handleClick('refund')}
                  className="hover:text-[#004B68] transition-colors"
                >
                  Refund & Cancellation
                </a>
              </li>
              <li>
                <a
                  href="#shipping"
                  onClick={handleClick('shipping')}
                  className="hover:text-[#004B68] transition-colors"
                >
                  Shipping & Delivery
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT ROW */}
        <div className="mt-10 pt-6 border-t border-[#E7E7DF] flex flex-col sm:flex-row items-center justify-between text-xs text-[#626B69] gap-3">
          <p>© 2026 Annaí Foods. All rights reserved.</p>
          <p>Handcrafted with care for healthy South Indian households.</p>
        </div>
      </div>
    </footer>
  );
};
