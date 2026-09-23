import React from 'react';
import { ArrowRight, Leaf, Droplets, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { AnyaButton } from './AnyaButton';

interface AnyaHeroProps {
  onNavigate: (path: string) => void;
}

export const AnyaHero: React.FC<AnyaHeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF4F6] via-[#FDECEF] to-[#F8DDE2] border-b border-[#E7C8CF]/70 pt-8 sm:pt-12 pb-16 sm:pb-24">
      {/* Background Ambient Botanical Glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#E39AA6]/20 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8FA08C]/15 rounded-full blur-3xl pointer-events-none -ml-28 -mb-28" />

      {/* Decorative vertical grid lines matching original Anya reference */}
      <div className="absolute inset-0 max-w-[1440px] mx-auto px-6 sm:px-10 flex justify-between pointer-events-none opacity-30">
        <div className="w-px h-full bg-gradient-to-b from-[#E7C8CF]/10 via-[#E7C8CF] to-transparent" />
        <div className="hidden sm:block w-px h-full bg-gradient-to-b from-[#E7C8CF]/10 via-[#E7C8CF] to-transparent" />
        <div className="hidden md:block w-px h-full bg-gradient-to-b from-[#E7C8CF]/10 via-[#E7C8CF] to-transparent" />
        <div className="w-px h-full bg-gradient-to-b from-[#E7C8CF]/10 via-[#E7C8CF] to-transparent" />
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT: HERO COPY (Exact match to anyasoaps_index.html) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Eyebrow badge with glowing accent dot */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-[10px] bg-white/80 backdrop-blur-md border border-[#E7C8CF] text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#6F5B60] mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#8FA08C] shadow-[0_0_0_4px_rgba(143,160,140,0.2)]" />
              <span>Handmade Natural Skincare</span>
            </div>

            {/* Display Headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-medium text-[#2F2326] leading-[1.05] tracking-[-0.04em] mb-6"
              style={{ fontFamily: "'Urbanist', sans-serif" }}
            >
              Handcrafted natural soaps for
              <span
                className="block text-[#8FA08C] font-normal italic font-serif mt-1 sm:mt-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                radiant, healthy skin.
              </span>
            </h1>

            {/* Supporting Description with left accent border */}
            <p className="max-w-xl text-base sm:text-lg text-[#2F2326]/80 pl-4 border-l border-[#8FA08C]/40 leading-[1.8] mb-8">
              Gentle, earth-friendly, and beautifully made. We blend pure organic botanicals,
              natural clays, and rich cold-pressed butters so your daily cleanse feels like a nourishing, spa-like ritual.
            </p>

            {/* Actions */}
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
            <div className="flex items-center gap-3.5 pt-5 border-t border-[#E7C8CF]/70 w-full max-w-md">
              <div className="flex items-center -space-x-2">
                <span className="w-7 h-7 rounded-full border-2 border-white bg-[#8E7A7E]" />
                <span className="w-7 h-7 rounded-full border-2 border-white bg-[#8FA08C]" />
                <span className="w-7 h-7 rounded-full border-2 border-white bg-[#E39AA6]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6F5B60]">
                Loved by 10,000+ happy skin
              </span>
            </div>
          </div>

          {/* RIGHT: FLOATING QUALITY CARD & HERO MEDIA (Exact match to anyasoaps_index.html) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px]">
              {/* Floating Quality Card */}
              <div className="p-6 sm:p-7 rounded-[18px] bg-gradient-to-b from-white to-[#FFF7F9] border border-[#E3B9C2] shadow-[0_20px_50px_rgba(120,60,70,0.12)] backdrop-blur-md">
                <span className="inline-block text-[10px] font-bold tracking-[0.18em] uppercase text-[#8FA08C] mb-3">
                  The Quality
                </span>

                <h2
                  className="text-2xl sm:text-[26px] font-semibold text-[#2F2326] leading-tight tracking-tight mb-5"
                  style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
                >
                  Skincare that feels pure, soft, and intentional.
                </h2>

                <ul className="space-y-4 mb-6">
                  {/* Item 1 */}
                  <li className="grid grid-cols-[20px_1fr] gap-3 items-start pt-3 border-t border-[#E7C8CF]/60 first:pt-0 first:border-none">
                    <Leaf className="w-4 h-4 text-[#8FA08C] mt-1 shrink-0" />
                    <div>
                      <strong className="block text-sm font-bold text-[#2F2326] leading-snug">
                        100% Organic Extracts
                      </strong>
                      <span className="block text-xs text-[#6F5B60] mt-0.5 leading-relaxed">
                        Plant-based botanicals carefully selected to soothe and nourish naturally.
                      </span>
                    </div>
                  </li>

                  {/* Item 2 */}
                  <li className="grid grid-cols-[20px_1fr] gap-3 items-start pt-3 border-t border-[#E7C8CF]/60">
                    <Droplets className="w-4 h-4 text-[#8FA08C] mt-1 shrink-0" />
                    <div>
                      <strong className="block text-sm font-bold text-[#2F2326] leading-snug">
                        Cold-Pressed Oils
                      </strong>
                      <span className="block text-xs text-[#6F5B60] mt-0.5 leading-relaxed">
                        Deeply hydrating formulas using natural butters to retain moisture all day.
                      </span>
                    </div>
                  </li>

                  {/* Item 3 */}
                  <li className="grid grid-cols-[20px_1fr] gap-3 items-start pt-3 border-t border-[#E7C8CF]/60">
                    <ShieldCheck className="w-4 h-4 text-[#8FA08C] mt-1 shrink-0" />
                    <div>
                      <strong className="block text-sm font-bold text-[#2F2326] leading-snug">
                        Safe for Sensitive Skin
                      </strong>
                      <span className="block text-xs text-[#6F5B60] mt-0.5 leading-relaxed">
                        No artificial fragrances or harsh chemicals, ensuring the gentlest touch.
                      </span>
                    </div>
                  </li>
                </ul>

                <div className="pt-4 border-t border-[#E7C8CF]/70 flex items-center justify-between gap-3 text-xs">
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
                    className="inline-flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-[#2F2326] hover:text-[#8FA08C] transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ambient botanical soap preview badge */}
              <div className="mt-4 p-3 rounded-xl bg-white/70 border border-[#E7C8CF] flex items-center justify-between gap-3 shadow-2xs">
                <span className="text-[11px] text-[#6F5B60]">
                  Fresh batch curing in Coimbatore
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8FA08C] bg-[#FFF4F6] px-2 py-0.5 rounded-md border border-[#E7C8CF]">
                  28-Day Cure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
