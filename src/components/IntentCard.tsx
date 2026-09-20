import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { MealIntent } from '../types';

interface IntentCardProps {
  intent: MealIntent;
  onClick: (intent: MealIntent) => void;
}

export const IntentCard: React.FC<IntentCardProps> = ({ intent, onClick }) => {
  return (
    <div
      id={`intent-card-${intent.id}`}
      onClick={() => onClick(intent)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(intent);
        }
      }}
      className="group relative flex flex-col justify-end w-[250px] xs:w-[270px] sm:w-auto shrink-0 sm:shrink h-[260px] sm:h-[300px] md:h-[320px] rounded-[20px] sm:rounded-[22px] overflow-hidden p-5 sm:p-6 cursor-pointer border border-[#E7E7DF] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#37B4A1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] snap-start"
    >
      {/* Editorial Food Photography Background */}
      <img
        src={intent.image}
        alt={intent.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />

      {/* Gentle Editorial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#004B68]/90 via-[#004B68]/45 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

      {/* Prep Time Tag */}
      <div className="relative z-10 mb-auto">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#004B68] border border-white/40">
          <Clock className="w-3 h-3 text-[#53B847]" />
          <span>{intent.prepTime}</span>
        </span>
      </div>

      {/* Intent Content: Title, Subtitle, CTA */}
      <div className="relative z-10 text-white">
        <span className="text-[11px] font-bold tracking-widest text-[#37B4A1] uppercase block mb-1">
          MEAL INSPIRATION
        </span>
        <h3 className="text-[24px] sm:text-[26px] font-bold tracking-tight text-white leading-tight">
          {intent.title}
        </h3>
        <p className="text-[13px] sm:text-[14px] text-white/80 mt-1 line-clamp-1">
          {intent.subtitle}
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#53B847] transition-colors">
          <span>{intent.ctaText}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};
