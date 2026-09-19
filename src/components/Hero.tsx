import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onBrowseAllClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onBrowseAllClick,
}) => {
  return (
    <section
      id="editorial-hero"
      className="w-full max-w-[1280px] mx-auto px-6 md:px-8 lg:px-10 mt-6 sm:mt-8"
      aria-label="Welcome to Haaply"
    >
      <div className="relative w-full min-h-[410px] md:h-[430px] bg-white rounded-[22px] border border-[#E7E7DF] overflow-hidden flex flex-col md:flex-row items-stretch shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        {/* LEFT COLUMN: Editorial Text & Action CTAs (~52%) */}
        <div className="flex-1 p-8 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-center items-start z-10">
          {/* Subtle natural accent tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F3ED] text-[#004B68] text-xs font-semibold tracking-wide mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#53B847]" />
            <span>Stone Ground & Naturally Fermented</span>
          </div>

          <h1 className="text-[40px] sm:text-[46px] lg:text-[52px] leading-[1.12] font-bold text-[#004B68] tracking-tight max-w-xl">
            What are you making today?
          </h1>

          <p className="mt-4 text-[16px] sm:text-[17px] leading-relaxed text-[#626B69] max-w-md">
            Fresh batters, millet foods and everyday favourites, prepared for your home.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5 sm:gap-6">
            <button
              id="hero-primary-cta"
              type="button"
              onClick={onExploreClick}
              className="inline-flex items-center justify-center px-7 py-3.5 bg-[#53B847] hover:bg-[#469e3c] text-white text-[15px] font-semibold rounded-xl shadow-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004B68] focus-visible:ring-offset-2"
            >
              Explore fresh picks
            </button>

            <button
              id="hero-secondary-link"
              type="button"
              onClick={onBrowseAllClick}
              className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#004B68] hover:text-[#53B847] transition-colors py-2 focus:outline-none focus-visible:underline"
            >
              <span>Browse everything</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1 text-[#53B847]" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Large Food Photograph (~48%) */}
        <div className="w-full md:w-[48%] h-64 md:h-full relative overflow-hidden bg-[#F2F3ED]">
          <img
            src="https://haaply.com/images/hero-products.png?auto=format&fit=crop&w=1200&q=85"
            alt="Freshly crisped golden dosa, fluffy idlis and stone-ground batter on banana leaf"
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
            loading="eager"
          />

          {/* Gentle natural soft gradient overlay on the seam for editorial visual comfort */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />

          {/* Subtle culinary badge */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E7E7DF] text-xs font-medium text-[#172126] shadow-xs">
            Daily Batch: <span className="text-[#53B847] font-semibold">Morning 4:00 AM</span>
          </div>
        </div>
      </div>
    </section>
  );
};
