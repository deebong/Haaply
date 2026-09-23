import React from 'react';
import { Sparkles, Droplets, SunMedium, Clock } from 'lucide-react';

export const AnyaProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Source & Selection',
      subtitle: 'Pure Farm Actives',
      description:
        'We partner directly with local smallholders in Tamil Nadu for cold-pressed coconut and sesame oils, fresh farm goat milk, and sun-dried Kasturi turmeric flowers.',
      icon: Droplets,
    },
    {
      num: '02',
      title: 'Low-Heat Cold Process',
      subtitle: 'Retaining Vital Glycerin',
      description:
        'Lye is combined with nourishing oils without external boiling heat, preserving the biological antioxidants, plant ceramides, and vitamins in every batch.',
      icon: Sparkles,
    },
    {
      num: '03',
      title: 'Artisan Hand-Cutting',
      subtitle: 'Individual Inspection',
      description:
        'After saponifying in wooden molds for 48 hours, every soap loaf is hand-sliced with wire cutters, hand-beveled, and stamped with our studio seal.',
      icon: SunMedium,
    },
    {
      num: '04',
      title: '4-Week Slow Cure',
      subtitle: 'Mellow, Mild & Long-Lasting',
      description:
        'Bars rest on cedar curing racks for 28 to 35 days. Excess moisture evaporates naturally, yielding a firm, mild, long-lasting bar with luxurious velvet foam.',
      icon: Clock,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FFF4F6] border-b border-[#E7C8CF]/60 relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#8FA08C] block mb-2">
            TIME-TESTED APOTHECARY CRAFT
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2F2326] tracking-tight leading-tight"
            style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
          >
            How Anya Soaps{' '}
            <span className="italic font-normal text-[#8FA08C]">Are Made</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6F5B60] mt-3 leading-relaxed">
            We reject the industrial shortcut of melted pellets and synthetic extrusions.
            Our soap-making takes nearly a month from raw cold oils to the final packaged bar.
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-[#E7C8CF] shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-widest text-[#E39AA6]">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#FDECEF] flex items-center justify-center text-[#8FA08C]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[#2F2326]">
                    {step.title}
                  </h3>
                  <span className="text-[11px] font-medium text-[#8FA08C] uppercase tracking-wider block mt-0.5 mb-2.5">
                    {step.subtitle}
                  </span>
                  <p className="text-xs sm:text-sm text-[#6F5B60] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
