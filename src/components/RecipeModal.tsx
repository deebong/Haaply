import React from 'react';
import { X, Clock, Users, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIngredients: () => void;
  paniyaramProduct?: Product;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  onAddIngredients,
  paniyaramProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#172126]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-[20px] shadow-2xl border border-[#E7E7DF] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E7DF]">
          <div>
            <span className="text-[11px] font-bold text-[#53B847] tracking-wider uppercase">
              From Our Kitchen
            </span>
            <h3 className="text-xl font-bold text-[#004B68]">
              15-minute Kuzhi Paniyaram
            </h3>
            <p className="tamil-text text-xs text-[#626B69]">
              குழி பணியாரம் செய்முறை
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#626B69] hover:text-[#172126] rounded-lg hover:bg-[#F2F3ED] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex items-center gap-6 text-xs text-[#626B69] bg-[#FAFAF6] p-3 rounded-xl border border-[#E7E7DF]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#53B847]" />
              <span>Prep & Cook: <strong className="text-[#172126]">15 mins</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#004B68]" />
              <span>Servings: <strong className="text-[#172126]">3–4 persons</strong></span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#172126] uppercase tracking-wide mb-2.5">
              Ingredients
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#172126]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#53B847]" />
                <span>Haaply Dosa / Paniyaram Batter (2 cups)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#53B847]" />
                <span>Finely chopped shallots / small onions (1/2 cup)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#53B847]" />
                <span>Finely minced green chilies (2 pcs)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#53B847]" />
                <span>Fresh curry leaves & mustard seeds for tempering</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#53B847]" />
                <span>Gingelly oil or ghee (2 tbsp)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#53B847]" />
                <span>Fresh grated coconut (optional, 2 tbsp)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#172126] uppercase tracking-wide mb-2.5">
              Simple Steps
            </h4>
            <ol className="space-y-2.5 text-xs text-[#626B69] leading-relaxed list-decimal list-inside">
              <li>
                <strong className="text-[#172126]">Temper:</strong> In a small pan, heat 1 tsp oil. Crackle mustard seeds, saute small onions, green chillies, and curry leaves until translucent.
              </li>
              <li>
                <strong className="text-[#172126]">Fold:</strong> Gently fold the tempered mixture into cold Haaply Dosa/Paniyaram batter.
              </li>
              <li>
                <strong className="text-[#172126]">Crisp:</strong> Heat the paniyaram chatti, add 2 drops of oil in each mould, pour the batter to 3/4th fullness. Cover and cook on medium flame for 2–3 mins.
              </li>
              <li>
                <strong className="text-[#172126]">Flip & Serve:</strong> Flip using wooden skewer, crisp for 1 more minute until golden. Serve hot with coconut and tomato chutney!
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAFAF6] border-t border-[#E7E7DF]">
          <div className="text-xs text-[#626B69]">
            {paniyaramProduct ? `Product: ${paniyaramProduct.name} (₹${paniyaramProduct.price})` : ''}
          </div>
          <button
            type="button"
            onClick={() => {
              onAddIngredients();
              onClose();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#53B847] hover:bg-[#469e3c] text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add Batter to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
