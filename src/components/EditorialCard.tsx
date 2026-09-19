import React from 'react';
import { ChefHat, ShoppingBag, BookOpen } from 'lucide-react';

interface EditorialCardProps {
  onViewRecipe: () => void;
  onShopIngredients: () => void;
}

export const EditorialCard: React.FC<EditorialCardProps> = ({
  onViewRecipe,
  onShopIngredients,
}) => {
  return (
    <section
      id="from-our-kitchen-section"
      className="w-full max-w-[1280px] mx-auto px-6 md:px-8 lg:px-10"
      aria-labelledby="from-our-kitchen-heading"
    >
      <div className="mb-6">
        <h2
          id="from-our-kitchen-heading"
          className="text-[26px] sm:text-[28px] font-bold text-[#004B68] tracking-tight leading-tight"
        >
          From our kitchen
        </h2>
        <p className="text-[14px] sm:text-[15px] text-[#626B69] mt-1">
          Simple recipes and traditional methods from our home cooks
        </p>
      </div>

      <div className="relative w-full rounded-[22px] bg-white border border-[#E7E7DF] overflow-hidden flex flex-col md:flex-row items-stretch shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        {/* LEFT COLUMN: Food Story & Actions (~52%) */}
        <div className="flex-1 p-8 sm:p-10 md:p-12 flex flex-col justify-center items-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F3ED] text-[#004B68] text-xs font-semibold tracking-wide mb-4">
            <ChefHat className="w-3.5 h-3.5 text-[#53B847]" />
            <span>Recipe Feature</span>
          </div>

          <h3 className="text-[32px] sm:text-[36px] font-bold text-[#172126] tracking-tight leading-tight">
            15-minute paniyaram
          </h3>

          <p className="tamil-text text-sm font-semibold text-[#004B68] mt-1">
            குழி பணியாரம் செய்முறை
          </p>

          <p className="mt-3 text-[15px] sm:text-[16px] text-[#626B69] leading-relaxed max-w-lg">
            Crispy outside, soft inside — made with Haaply Paniyaram Batter. Tempered with fresh mustard seeds, curry leaves, chopped shallots, and green chilies in a seasoned cast iron pan.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              id="view-recipe-btn"
              type="button"
              onClick={onViewRecipe}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#004B68] hover:bg-[#003950] text-white text-[14px] font-semibold rounded-xl transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004B68] shadow-2xs"
            >
              <BookOpen className="w-4 h-4 text-[#37B4A1]" />
              <span>View recipe</span>
            </button>

            <button
              id="shop-ingredients-btn"
              type="button"
              onClick={onShopIngredients}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F2F3ED] hover:bg-[#E7E7DF] text-[#172126] text-[14px] font-semibold rounded-xl transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#53B847]"
            >
              <ShoppingBag className="w-4 h-4 text-[#53B847]" />
              <span>Shop ingredients</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentic High-Res Food Photo (~48%) */}
        <div className="w-full md:w-[48%] h-64 md:h-auto min-h-[300px] relative overflow-hidden bg-[#F2F3ED]">
          <img
            src="https://images.unsplash.com/photo-1646398123647-695431536f7c?auto=format&fit=crop&w=1000&q=80"
            alt="Hot golden crispy kuzhi paniyaram prepared in traditional cast-iron pan served with coconut and tomato chutney"
            className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
            loading="lazy"
          />

          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-md text-[11px] font-semibold text-[#172126] border border-[#E7E7DF]/70">
            Prep time: <strong className="text-[#004B68]">15 mins</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
