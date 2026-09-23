import React from 'react';
import { Leaf, Sparkles, ShieldCheck, Droplets, Check, ArrowRight } from 'lucide-react';

interface AnyaWhySectionProps {
  onNavigate?: (path: string) => void;
}

export const AnyaWhySection: React.FC<AnyaWhySectionProps> = ({ onNavigate }) => {
  const pillars = [
    {
      num: '01',
      badge: 'Natural',
      icon: Leaf,
      title: '100% Natural Ingredients',
      description:
        'Every bar is crafted with pure plant-based botanicals, rich natural clays, and nourishing essential oils.',
      checks: ['Organic extracts', 'Real herbs and florals'],
    },
    {
      num: '02',
      badge: 'Crafted',
      icon: Sparkles,
      title: 'Handmade in Small Batches',
      description:
        'We hand-pour and cut every batch in our artisan studio to ensure perfect quality, freshness, and attention to detail.',
      checks: ['Artisan cold-process', 'Meticulous quality checks'],
    },
    {
      num: '03',
      badge: 'Pure',
      icon: ShieldCheck,
      title: 'No Harsh Chemicals',
      description:
        'Completely free from parabens, sulfates, artificial foaming agents, and synthetic fragrances.',
      checks: ['Zero toxic preservatives', 'Earth-friendly and biodegradable'],
    },
    {
      num: '04',
      badge: 'Gentle',
      icon: Droplets,
      title: 'Safe for Daily Use',
      description:
        'Expertly balanced to cleanse effectively without stripping your skin’s natural moisture barrier.',
      checks: ['Perfect for sensitive skin', 'Locks in deep hydration'],
    },
  ];

  return (
    <section id="standard" className="py-20 sm:py-28 bg-gradient-to-b from-[#FFF4F6] via-[#FFF8FA] to-[#FFF4F6] border-y border-[#E7C8CF]/70 relative">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Head Row matching anyasoaps_index.html */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#2F2326] tracking-[-0.04em] leading-tight"
              style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
            >
              Why Anya Soaps.
            </h2>
            <p className="text-sm sm:text-base text-[#2F2326]/75 mt-3 leading-relaxed">
              Every bar is crafted with intention, using only the finest organic ingredients to ensure the experience feels as refined as the result.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onNavigate) {
                onNavigate('/shop');
              } else {
                const el = document.getElementById('collection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2F2326] hover:text-[#8FA08C] transition-colors self-start md:self-auto cursor-pointer group"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Standard of Care Cards matching anyasoaps_index.html */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <article
                key={idx}
                className="p-6 sm:p-7 rounded-[18px] bg-gradient-to-b from-white to-[#FFF7F9] border border-[#E3B9C2] hover:border-[#8FA08C] transition-all duration-300 shadow-[0_10px_24px_rgba(120,60,70,0.04)] hover:shadow-[0_14px_30px_rgba(120,60,70,0.08)] hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Badge & Index Row */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-[#8FA08C]/12 border border-[#8FA08C]/25 text-[#6F7F6D] text-xs font-bold">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.badge}</span>
                    </div>
                    <span className="text-xs font-bold tracking-widest text-[#8E7A7E]">
                      {item.num}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3
                    className="text-xl sm:text-[22px] font-semibold text-[#2F2326] mb-3 leading-tight"
                    style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
                  >
                    {item.title}
                  </h3>

                  {/* Card Text */}
                  <p className="text-xs sm:text-sm text-[#2F2326]/75 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Card Checklist */}
                <ul className="space-y-2 pt-4 border-t border-[#E7C8CF]/60 text-xs text-[#2F2326]/85 font-medium">
                  {item.checks.map((chk, cIdx) => (
                    <li key={cIdx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#8FA08C] shrink-0 stroke-[2.5]" />
                      <span>{chk}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
