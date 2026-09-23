import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ANYA_FAQS } from '../../data/anyaSoapsData';

export const AnyaFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FFF4F6] border-b border-[#E7C8CF]/60">
      <div className="max-w-[840px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#8FA08C] block mb-2">
            COMMON INQUIRIES
          </span>
          <h2
            className="text-3xl sm:text-4xl font-semibold text-[#2F2326] tracking-tight"
            style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
          >
            Frequently Asked{' '}
            <span className="italic font-normal text-[#8FA08C]">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6F5B60] mt-2">
            Everything you need to know about our cold-process formulation, storage, and natural ingredients.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {ANYA_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E7C8CF] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#2F2326]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#FFF4F6] border border-[#E7C8CF] flex items-center justify-center text-[#2F2326] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#FDECEF]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-[#6F5B60] leading-relaxed border-t border-[#E7C8CF]/50 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
