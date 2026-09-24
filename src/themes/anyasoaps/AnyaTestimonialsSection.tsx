import React from 'react';
import { Star } from 'lucide-react';
import { ANYA_TESTIMONIALS } from '../../data/anyaSoapsData';
import { AnyaCard } from './AnyaCard';
import { AnyaBadge } from './AnyaBadge';

export const AnyaTestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FFF4F6] border-b border-[#E7C8CF]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C97C89] block mb-2">
            Community Experiences
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2F2326] tracking-tight leading-tight"
            style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
          >
            Stories from Our{' '}
            <span
              className="italic font-normal text-[#C97C89] font-serif"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Happy Community
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#6F5B60] mt-3 leading-relaxed">
            Read how switching to cold-processed botanical soaps restored calm, comfort, and natural radiance for our customers.
          </p>
        </div>

        {/* Testimonials 3-Column Grid with Clipped-Corner Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ANYA_TESTIMONIALS.map((t) => (
            <AnyaCard
              key={t.id}
              variant="surface"
              cutSize="md"
              hoverEffect
              className="shadow-[0_4px_16px_rgba(47,35,38,0.03)] flex flex-col justify-between"
            >
              <div className="p-7 flex flex-col justify-between h-full">
                <div>
                  {/* Header with Star Rating */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex text-[#E09A55] gap-0.5">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#E09A55] text-[#E09A55]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-[#8E7A7E] tracking-wider uppercase">
                      {t.customerSince}
                    </span>
                  </div>

                  {/* Quote Text */}
                  <p className="text-sm text-[#2F2326] leading-relaxed italic">
                    {t.quote}
                    {t.accentQuote && (
                      <span className="font-semibold text-[#C97C89] not-italic underline decoration-[#E39AA6]">
                        {t.accentQuote}
                      </span>
                    )}
                    {t.accentQuote ? '”' : ''}
                  </p>
                </div>

                {/* Author Footer */}
                <div className="mt-6 pt-4 border-t border-[#E7C8CF]/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FFF4F6] border border-[#E7C8CF] flex items-center justify-center text-xs font-bold text-[#2F2326]">
                      {t.initials}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#2F2326]">
                        {t.name}
                      </h4>
                      <span className="text-[11px] text-[#8E7A7E]">
                        {t.location} • Verified Buyer
                      </span>
                    </div>
                  </div>

                  <AnyaBadge variant="blush" size="xs">
                    {t.product}
                  </AnyaBadge>
                </div>
              </div>
            </AnyaCard>
          ))}
        </div>
      </div>
    </section>
  );
};
