import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Leaf, Droplets, ShieldCheck, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnyaButton } from './AnyaButton';
import { AnyaCard, getAnyaClippedPolygon } from './AnyaCard';
import { AnyaBadge } from './AnyaBadge';

interface AnyaHeroProps {
  onNavigate: (path: string) => void;
}

interface HeroSlide {
  id: string;
  image: string;
  caption: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'goat-milk',
    image: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=1800&q=85',
    caption: 'Farm-Fresh Goat Milk & Raw Shea Butter Bar',
    alt: 'Handcrafted artisan goat milk soap on wooden soap dish',
  },
  {
    id: 'rose-shea',
    image: 'https://images.unsplash.com/photo-1607006483224-73ce0729e22a?auto=format&fit=crop&w=1800&q=85',
    caption: 'Damask Rose Petal & French Pink Clay Bar',
    alt: 'Artisan rose and shea butter soap bar with delicate botanical lather',
  },
  {
    id: 'avarampoo-calm',
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=1800&q=85',
    caption: 'Wild Avarampoo & French Lavender Infusion',
    alt: 'Botanical wildflower soap cured with organic cold-pressed oils',
  },
  {
    id: 'turmeric-glow',
    image: 'https://images.unsplash.com/photo-1661185152130-4214a30ced36?auto=format&fit=crop&w=1800&q=85',
    caption: 'Wild Kasturi Turmeric & Sweet Orange Bar',
    alt: 'Natural brightening turmeric soap crafted in small batches',
  },
];

export const AnyaHero: React.FC<AnyaHeroProps> = ({ onNavigate }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Subtle auto-advance slider every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-[#FFF4F6] border-b border-[#E7C8CF] pt-8 sm:pt-14 pb-16 sm:pb-24 min-h-[580px] lg:min-h-[640px] flex items-center"
    >
      {/* 1. EDITORIAL BACKGROUND IMAGE SLIDER (3+ Authentic Anya Images) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERO_SLIDES.map((slide, index) => {
          const isCurrent = index === activeSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isCurrent ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              } transition-transform duration-7000 ease-out`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Ambient Gradient Overlay: Balanced to keep handcrafted soaps clearly recognizable while preserving crisp typography */}
        {/* Left-to-right gradient provides soft contrast for text on left while letting photographic richness show across center and right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF4F6]/90 via-[#FFF4F6]/60 to-[#FFF4F6]/20 lg:from-[#FFF4F6]/85 lg:via-[#FFF4F6]/45 lg:to-transparent pointer-events-none" />
        {/* Soft bottom vignette for clean transition into the content section */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF4F6]/80 via-transparent to-transparent pointer-events-none" />

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 max-w-[1440px] mx-auto px-4 sm:px-10 flex justify-between pointer-events-none opacity-20">
          <div className="w-px h-full bg-[#E7C8CF]" />
          <div className="hidden sm:block w-px h-full bg-[#E7C8CF]" />
          <div className="hidden md:block w-px h-full bg-[#E7C8CF]" />
          <div className="w-px h-full bg-[#E7C8CF]" />
        </div>
      </div>

      {/* 2. FOREGROUND CONTENT & EDITORIAL LAYOUT */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT: HERO COPY & CALLS TO ACTION */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Eyebrow badge with signature plum and pink accent dot */}
            <AnyaBadge
              variant="surface"
              size="sm"
              icon={<span className="w-1.5 h-1.5 rounded-full bg-[#C97C89] shadow-[0_0_0_2px_rgba(201,124,137,0.25)]" />}
              className="mb-5 shadow-2xs text-[#2F2326]"
            >
              Handmade Natural Skincare
            </AnyaBadge>

            {/* Display Headline */}
            <h1
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-semibold text-[#2F2326] leading-[1.08] tracking-[-0.03em] mb-6 max-w-2xl"
              style={{ fontFamily: "'Urbanist', sans-serif" }}
            >
              Handcrafted natural soaps for
              <span
                className="block text-[#C97C89] font-normal italic font-serif mt-1 sm:mt-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                radiant, healthy skin.
              </span>
            </h1>

            {/* Supporting Description with left accent border */}
            <p className="max-w-xl text-base sm:text-lg text-[#2F2326]/85 pl-4 border-l-2 border-[#C97C89] leading-[1.8] mb-8 font-normal">
              Gentle, earth-friendly, and beautifully made. We blend pure organic botanicals,
              natural clays, and rich cold-pressed butters so your daily cleanse feels like a nourishing, spa-like ritual.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-8 w-full sm:w-auto">
              <AnyaButton
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                iconPosition="right"
                onClick={() => onNavigate('/shop')}
                className="group w-full sm:w-auto min-h-[50px] shadow-sm uppercase tracking-wider text-xs"
              >
                Shop Collection
              </AnyaButton>

              <AnyaButton
                variant="outline"
                size="lg"
                onClick={() => {
                  const el = document.getElementById('standard');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onNavigate('/shop');
                  }
                }}
                className="w-full sm:w-auto min-h-[50px] uppercase tracking-wider text-xs"
              >
                Our Ingredients
              </AnyaButton>
            </div>

            {/* Trust Proof Bar */}
            <div className="flex items-center gap-3.5 pt-5 border-t border-[#E7C8CF] w-full max-w-md">
              <div className="flex items-center -space-x-2">
                <span className="w-7 h-7 rounded-full border-2 border-white bg-[#2F2326]" />
                <span className="w-7 h-7 rounded-full border-2 border-white bg-[#C97C89]" />
                <span className="w-7 h-7 rounded-full border-2 border-white bg-[#E39AA6]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6F5B60]">
                Loved by 10,000+ happy skin
              </span>
            </div>
          </div>

          {/* RIGHT: CLIPPED-CORNER QUALITY CARD & SLIDER CONTROLS */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end">
            <div className="relative w-full max-w-[420px]">
              {/* Signature Clipped-Corner Card for The Quality (Top-Left & Bottom-Right chamfers) */}
              <AnyaCard
                variant="surface"
                cutSize="lg"
                hoverEffect
                className="p-6 sm:p-7 shadow-[0_20px_50px_rgba(47,35,38,0.08)]"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C97C89]">
                    The Quality
                  </span>
                  <AnyaBadge variant="blush" size="xs" shape="rounded">
                    28-Day Cure
                  </AnyaBadge>
                </div>

                <h2
                  className="text-2xl sm:text-[25px] font-semibold text-[#2F2326] leading-tight tracking-tight mb-5"
                  style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
                >
                  Skincare that feels pure, soft, and intentional.
                </h2>

                <ul className="space-y-4 mb-6">
                  {/* Item 1 */}
                  <li className="grid grid-cols-[20px_1fr] gap-3 items-start pt-3 border-t border-[#E7C8CF]/70 first:pt-0 first:border-none">
                    <Leaf className="w-4 h-4 text-[#C97C89] mt-1 shrink-0 stroke-[1.5]" />
                    <div>
                      <strong className="block text-sm font-semibold text-[#2F2326] leading-snug">
                        100% Organic Extracts
                      </strong>
                      <span className="block text-xs text-[#6F5B60] mt-0.5 leading-relaxed">
                        Plant-based botanicals carefully selected to soothe and nourish naturally.
                      </span>
                    </div>
                  </li>

                  {/* Item 2 */}
                  <li className="grid grid-cols-[20px_1fr] gap-3 items-start pt-3 border-t border-[#E7C8CF]/70">
                    <Droplets className="w-4 h-4 text-[#C97C89] mt-1 shrink-0 stroke-[1.5]" />
                    <div>
                      <strong className="block text-sm font-semibold text-[#2F2326] leading-snug">
                        Cold-Pressed Oils
                      </strong>
                      <span className="block text-xs text-[#6F5B60] mt-0.5 leading-relaxed">
                        Deeply hydrating formulas using unrefined plant butters to lock moisture.
                      </span>
                    </div>
                  </li>

                  {/* Item 3 */}
                  <li className="grid grid-cols-[20px_1fr] gap-3 items-start pt-3 border-t border-[#E7C8CF]/70">
                    <ShieldCheck className="w-4 h-4 text-[#C97C89] mt-1 shrink-0 stroke-[1.5]" />
                    <div>
                      <strong className="block text-sm font-semibold text-[#2F2326] leading-snug">
                        Safe for Sensitive Skin
                      </strong>
                      <span className="block text-xs text-[#6F5B60] mt-0.5 leading-relaxed">
                        No harsh detergents or synthetic fillers — gentle for eczema and delicate skin.
                      </span>
                    </div>
                  </li>
                </ul>

                <div className="pt-4 border-t border-[#E7C8CF] flex items-center justify-between gap-3 text-xs">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8E7A7E]">
                    Small batch · Cruelty-free
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('standard');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onNavigate('/shop');
                      }
                    }}
                    className="inline-flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-[#2F2326] hover:text-[#C97C89] transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </div>
              </AnyaCard>

              {/* Slider Manual Navigation Bar & Photo Caption */}
              <div
                className="mt-4 px-3.5 py-2.5 bg-white/90 backdrop-blur-md border border-[#E7C8CF] flex items-center justify-between gap-3 shadow-2xs"
                style={{ clipPath: getAnyaClippedPolygon(8) }}
              >
                {/* Active photo indicator & caption */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C97C89] shrink-0" />
                  <span className="text-[11px] text-[#6F5B60] truncate font-medium">
                    {HERO_SLIDES[activeSlide].caption}
                  </span>
                </div>

                {/* Slider Dot Indicators & Prev/Next Arrows */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="p-1 rounded-md text-[#2F2326] hover:text-[#C97C89] hover:bg-[#FFF4F6] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {HERO_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === activeSlide ? 'w-4 bg-[#C97C89]' : 'w-1.5 bg-[#E7C8CF] hover:bg-[#E39AA6]'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="p-1 rounded-md text-[#2F2326] hover:text-[#C97C89] hover:bg-[#FFF4F6] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
