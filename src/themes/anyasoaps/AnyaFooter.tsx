import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { getAnyaClippedPolygon } from './AnyaCard';

interface AnyaFooterProps {
  onNavigate: (path: string) => void;
}

export const AnyaFooter: React.FC<AnyaFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2F2326] text-[#FFF4F6] pt-16 pb-12 border-t border-[#4A3B3E]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#4A3B3E]/80">
          {/* Col 1: Brand & Ethos (5 cols) */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <svg className="w-5 h-5 text-[#C97C89]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.7 22C7.5 17.5 10 13 18 10V8z" />
                <path d="M12 3C7 3 3 8 3 13c0 2.3.8 4.4 2.2 6.1C6.8 14 10.5 8 18 4.5 16.2 3.5 14.2 3 12 3z" />
              </svg>
              <span
                className="text-2xl font-semibold tracking-[0.16em] text-white uppercase"
                style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
              >
                ANYA SOAPS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#D8B4BC] leading-relaxed max-w-md">
              Small-batch cold-process artisan soaps and pure botanical skincare.
              Every bar is hand-poured, hand-cut, and cured for 4 weeks in Coimbatore, Tamil Nadu, preserving natural plant glycerin for healthy, glowing skin.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-[#D8B4BC]">
              <span className="w-2 h-2 rounded-full bg-[#C97C89]" />
              <span>100% Zero Palm Oil • Cruelty-Free • Biodegradable Packaging</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E39AA6] mb-4">
              Explore Soaps
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D8B4BC]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/shop')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Artisan Soaps
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/category/nourishing-hydrating')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Nourishing Goat Milk & Shea
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/category/clarifying-purifying')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Charcoal Detox & Tea Tree
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/category/brightening-tone')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Turmeric & Curcumin Glow
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/category/gentle-baby-safe')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Baby Safe & Unscented Mild
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Studio (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E39AA6] mb-4">
              Studio & Orders
            </h4>
            <div className="space-y-3 text-xs text-[#D8B4BC]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C97C89] shrink-0 mt-0.5 stroke-[1.5]" />
                <span>Thondamuthur Rd, near murugan temple, Sundapalayam, Coimbatore, Tamil Nadu 641007</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C97C89] shrink-0 stroke-[1.5]" />
                <span>+91 8220265266 (Mon–Sat, 9:30 AM – 6:30 PM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C97C89] shrink-0 stroke-[1.5]" />
                <span>hello@anyasoaps.com</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com/anyasoaps"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#4A3B3E] hover:bg-[#C97C89] hover:text-[#2F2326] flex items-center justify-center transition-colors text-white cursor-pointer"
                style={{ clipPath: getAnyaClippedPolygon(6) }}
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#4A3B3E] hover:bg-[#C97C89] hover:text-[#2F2326] flex items-center justify-center transition-colors text-white cursor-pointer"
                style={{ clipPath: getAnyaClippedPolygon(6) }}
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 stroke-[1.5]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8E7A7E]">
          <p>© {new Date().getFullYear()} Anya Soaps. All rights reserved. Handcrafted in India.</p>
          <div className="flex items-center gap-6">
            <span>Free Delivery Over ₹1,500</span>
            <span>•</span>
            <span>Express Insured Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
