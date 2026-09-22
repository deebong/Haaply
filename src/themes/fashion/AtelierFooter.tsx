import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface AtelierFooterProps {
  onNavigate?: (path: string) => void;
}

export const AtelierFooter: React.FC<AtelierFooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#141414] text-[#FBFBF9] border-t border-[#262626]">
      {/* 1. TOP NEWSLETTER & CLIENT REGISTRY */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 border-b border-[#262626]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#8C7355] font-medium">
              The Atelier Journal
            </span>
            <h3
              className="text-2xl sm:text-3xl font-normal font-serif text-[#FBFBF9]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Sign up for private collections & editorial previews
            </h3>
            <p className="text-xs sm:text-sm text-[#A8A8A8] font-light max-w-lg">
              Receive early invitations to limited fabric editions, seasonal lookbooks, and design essays directly from our studio.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 bg-[#262626] border border-[#3A3A3A] flex items-center gap-3 text-xs tracking-wider uppercase text-[#FBFBF9]">
                <Check className="w-4 h-4 text-[#8C7355]" />
                <span>Thank you. You have been enrolled in our private journal registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-[#1E1E1E] border border-[#3A3A3A] px-4 py-3.5 text-xs text-[#FBFBF9] placeholder:text-[#666] focus:outline-none focus:border-[#FBFBF9] transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#FBFBF9] text-[#141414] hover:bg-[#E8E6E1] text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="mt-3 text-[11px] text-[#666] font-light">
              By subscribing you agree to our Privacy Policy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* 2. FOOTER NAVIGATION & EDITORIAL PILLARS */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 text-xs">
        {/* Brand identity column */}
        <div className="col-span-2 space-y-4">
          <span
            className="text-2xl tracking-[0.25em] font-serif text-[#FBFBF9] block"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            ATELIER
          </span>
          <p className="text-[#A8A8A8] font-light max-w-sm leading-relaxed text-xs">
            An exploration of contemporary dress rooted in natural fibers, slow craftsmanship, and architectural restraint. Tailored with integrity for enduring utility.
          </p>
          <div className="pt-2 text-[11px] tracking-widest uppercase text-[#8C7355]">
            HAAPLY EDITIONS — VERTICAL PLATFORM
          </div>
        </div>

        {/* Column: Collection */}
        <div className="space-y-3">
          <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-[#FBFBF9]">
            Collection
          </p>
          <ul className="space-y-2 text-[#A8A8A8] font-light">
            <li>
              <button
                type="button"
                onClick={() => onNavigate?.('/shop')}
                className="hover:text-[#FBFBF9] transition-colors"
              >
                All Apparel
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate?.('/category/shirts-tops')}
                className="hover:text-[#FBFBF9] transition-colors"
              >
                Belgian Linen Shirts
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate?.('/category/trousers')}
                className="hover:text-[#FBFBF9] transition-colors"
              >
                Pleated Trousers
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate?.('/category/outerwear')}
                className="hover:text-[#FBFBF9] transition-colors"
              >
                Raglan Trenches
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate?.('/category/knitwear')}
                className="hover:text-[#FBFBF9] transition-colors"
              >
                Merino Knitwear
              </button>
            </li>
          </ul>
        </div>

        {/* Column: Client Care */}
        <div className="space-y-3">
          <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-[#FBFBF9]">
            Client Services
          </p>
          <ul className="space-y-2 text-[#A8A8A8] font-light">
            <li>
              <span className="hover:text-[#FBFBF9] cursor-pointer">Bespoke Fit Consultation</span>
            </li>
            <li>
              <span className="hover:text-[#FBFBF9] cursor-pointer">Complimentary Global Delivery</span>
            </li>
            <li>
              <span className="hover:text-[#FBFBF9] cursor-pointer">14-Day Returns & Exchanges</span>
            </li>
            <li>
              <span className="hover:text-[#FBFBF9] cursor-pointer">Garment Care Guide</span>
            </li>
            <li>
              <span className="hover:text-[#FBFBF9] cursor-pointer">Client Concierge</span>
            </li>
          </ul>
        </div>

        {/* Column: Studio */}
        <div className="space-y-3">
          <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-[#FBFBF9]">
            The Studio
          </p>
          <ul className="space-y-2 text-[#A8A8A8] font-light">
            <li>
              <span className="hover:text-[#FBFBF9] cursor-pointer">Slow Craft Philosophy</span>
            </li>
            <li>
              <span className="hover:text-[#FBFBF9] cursor-pointer">European Textile Mill Partners</span>
            </li>
            <li>
              <span className="hover:text-[#FBFBF9] cursor-pointer">Ethical Manufacturing</span>
            </li>
            <li>
              <span className="hover:text-[#FBFBF9] cursor-pointer">Sustainability Report 2026</span>
            </li>
            <li>
              <span className="hover:text-[#FBFBF9] cursor-pointer">Stockists & Showrooms</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. LEGAL & COPYRIGHT */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#666] font-light gap-4">
        <p>© 2026 Atelier by Haaply. All rights reserved.</p>
        <div className="flex gap-6 tracking-wider uppercase">
          <span className="hover:text-[#A8A8A8] cursor-pointer">Privacy Policy</span>
          <span className="hover:text-[#A8A8A8] cursor-pointer">Terms of Service</span>
          <span className="hover:text-[#A8A8A8] cursor-pointer">Cookie Preferences</span>
        </div>
      </div>
    </footer>
  );
};
