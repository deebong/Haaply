import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick: (category: Category) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onClick,
}) => {
  return (
    <button
      id={`category-card-${category.slug}`}
      type="button"
      onClick={() => onClick(category)}
      className={`group w-[138px] min-w-[138px] sm:w-auto sm:min-w-0 shrink-0 sm:shrink text-left bg-white rounded-[16px] border p-2.5 sm:p-3 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847] snap-start ${
        isSelected
          ? 'border-[#53B847] shadow-[0_4px_16px_rgba(83,184,71,0.12)]'
          : 'border-[#E7E7DF] hover:border-[#37B4A1] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* Food Imagery area */}
      <div className="w-full h-24 sm:h-28 md:h-32 rounded-[12px] overflow-hidden bg-[#F2F3ED] mb-2 sm:mb-3 relative">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {/* Subtle count indicator */}
        <span className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-[#172126] rounded-md border border-[#E7E7DF]/60">
          {category.itemCount} items
        </span>
      </div>

      {/* Category Name & Short Supporting Phrase */}
      <div className="px-0.5 sm:px-1">
        <h3 className="text-[13px] sm:text-[15px] font-bold text-[#172126] group-hover:text-[#004B68] transition-colors leading-snug truncate">
          {category.name}
        </h3>
        <p className="text-[11px] sm:text-[12px] text-[#626B69] mt-0.5 line-clamp-1">
          {category.tagline}
        </p>
      </div>
    </button>
  );
};
