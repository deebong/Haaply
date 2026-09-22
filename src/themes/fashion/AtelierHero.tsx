import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AtelierHeroProps {
  onShopClick: () => void;
  onExploreLookbook?: () => void;
}

export const AtelierHero: React.FC<AtelierHeroProps> = ({
  onShopClick,
  onExploreLookbook,
}) => {
  return (
    <section className="relative w-full bg-[#1A1A1A] text-[#FBFBF9] overflow-hidden">
      {/* Background Editorial Image with subtle dark scrim */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
          alt="Atelier Autumn/Winter Campaign"
          className="w-full h-full object-cover object-center opacity-70 filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 min-h-[70vh] sm:min-h-[75vh] lg:min-h-[82vh] flex flex-col justify-end pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl space-y-6">
          {/* Subtitle / Season label */}
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#FBFBF9]/60" />
            <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#FBFBF9]/90 font-medium">
              Autumn / Winter 2026 Edition
            </span>
          </div>

          {/* Editorial Display Heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FBFBF9] leading-[1.1] font-serif"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Architecture of Slow Silhouettes
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#FBFBF9]/80 font-light leading-relaxed max-w-xl">
            Understated garments sculpted from certified Belgian flax linen, high-twist wool gabardine, and 13.5oz Japanese selvedge denim. Designed for quiet confidence and enduring wear.
          </p>

          {/* Editorial Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onShopClick}
              className="px-7 py-3.5 bg-[#FBFBF9] text-[#141414] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#E8E6E1] transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {onExploreLookbook && (
              <button
                type="button"
                onClick={onExploreLookbook}
                className="px-7 py-3.5 border border-[#FBFBF9]/50 text-[#FBFBF9] text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/10 hover:border-white transition-all cursor-pointer"
              >
                View Lookbook
              </button>
            )}
          </div>
        </div>

        {/* Editorial Footnote */}
        <div className="mt-12 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between text-[11px] tracking-widest uppercase text-[#FBFBF9]/60 font-light">
          <span>Photographed on 35mm in Copenhagen</span>
          <span>Certified European Textiles</span>
          <span>Complimentary Delivery & Returns</span>
        </div>
      </div>
    </section>
  );
};
