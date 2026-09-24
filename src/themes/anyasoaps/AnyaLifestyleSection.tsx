import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import { AnyaCard, getAnyaClippedPolygon } from './AnyaCard';

export const AnyaLifestyleSection: React.FC = () => {
  const outcomes = [
    'Clean, nourished skin without the tight, stripped squeak of detergents',
    'Natural botanical barrier protection that retains all-day soft hydration',
    'Safe, gentle daily bathing for sensitive facial skin and reactive bodies',
    'A calming sensory aromatherapeutic moment to center your morning or evening',
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#E7C8CF]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT: LIFESTYLE IMAGE WITH FOUNDER NOTE */}
          <div className="lg:col-span-6 relative">
            <div
              className="relative overflow-hidden aspect-4/3 sm:aspect-16/11 shadow-lg border-2 border-[#E7C8CF]"
              style={{ clipPath: getAnyaClippedPolygon(16) }}
            >
              <img
                src="https://images.unsplash.com/photo-1607006633821-b8b0f6988295?auto=format&fit=crop&w=1200&q=80"
                alt="Anya Soaps everyday mindful skincare ritual"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#E39AA6]">
                  Mindful Self-Care Ritual
                </span>
                <p className="text-sm font-medium mt-1">
                  Transform everyday cleansing into a restorative sensory retreat.
                </p>
              </div>
            </div>

            {/* Founder Note Card with AnyaCard */}
            <div className="mt-6">
              <AnyaCard variant="blush" cutSize="md" className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                    alt="Anandhakumar, Founder of Anya Soaps"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div>
                    <p className="text-xs sm:text-sm text-[#2F2326] italic leading-relaxed">
                      “I started Anya Soaps because my own family struggled with sensitive skin. Commercial brands often disguise harsh surfactants under pretty 'herbal' labels. We craft every loaf with zero shortcuts, strictly using food-grade plant oils.”
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2F2326]">Anandhakumar</span>
                      <span className="text-[10px] text-[#8E7A7E] uppercase tracking-wider">Founder, Anya Soaps</span>
                    </div>
                  </div>
                </div>
              </AnyaCard>
            </div>
          </div>

          {/* RIGHT: TEXT & OUTCOMES */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C97C89] block mb-2">
              Everyday Wellness
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2F2326] tracking-tight leading-tight"
              style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
            >
              A Simple Ritual for{' '}
              <span
                className="italic font-normal text-[#C97C89] font-serif"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Healthier Skin
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#6F5B60] mt-4 leading-relaxed">
              Your skin is your body’s largest organ. When you wash with true cold-processed soap,
              natural glycerin stays on your skin rather than being extracted and sold to cosmetic companies.
            </p>

            {/* Outcome bullet list */}
            <div className="mt-6 space-y-3.5 w-full">
              {outcomes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FFF4F6] border border-[#E7C8CF] flex items-center justify-center text-[#C97C89] shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 fill-[#C97C89] text-white stroke-[1]" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#2F2326] font-medium leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Micro Badge with AnyaCard */}
            <div className="mt-8 w-full">
              <AnyaCard variant="cream" cutSize="sm" className="p-4">
                <div className="flex items-center gap-3 text-xs text-[#2F2326]">
                  <Sparkles className="w-4 h-4 text-[#C97C89] shrink-0" />
                  <span>100% biodegradable and packaged in tree-free recyclable cotton paper cartons.</span>
                </div>
              </AnyaCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
