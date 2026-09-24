import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { Product } from '../../types';
import { AnyaButton } from './AnyaButton';
import { AnyaCard, getAnyaClippedPolygon } from './AnyaCard';
import { AnyaBadge } from './AnyaBadge';

interface AnyaSkinQuizSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onNavigate: (path: string) => void;
}

export const AnyaSkinQuizSection: React.FC<AnyaSkinQuizSectionProps> = ({
  products,
  onAddToCart,
  onNavigate,
}) => {
  const [skinType, setSkinType] = useState('dry');
  const [scent, setScent] = useState('floral');
  const [concerns, setConcerns] = useState<string[]>(['hydration']);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const toggleConcern = (val: string) => {
    setConcerns((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  // Find best match product
  const getRecommendation = () => {
    if (skinType === 'dry' || concerns.includes('hydration')) {
      return (
        products.find((p) => p.name.toLowerCase().includes('goat milk')) ||
        products.find((p) => p.name.toLowerCase().includes('shea')) ||
        products[0]
      );
    }
    if (skinType === 'oily' || concerns.includes('detox')) {
      return (
        products.find((p) => p.name.toLowerCase().includes('charcoal')) ||
        products.find((p) => p.name.toLowerCase().includes('neem')) ||
        products[1]
      );
    }
    if (skinType === 'baby' || scent === 'unscented') {
      return (
        products.find((p) => p.name.toLowerCase().includes('baby')) ||
        products.find((p) => p.name.toLowerCase().includes('calendula')) ||
        products[2]
      );
    }
    return (
      products.find((p) => p.name.toLowerCase().includes('rose')) ||
      products[0]
    );
  };

  const recommendedProduct = getRecommendation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="quiz" className="py-16 sm:py-24 bg-white border-b border-[#E7C8CF]">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 md:px-8">
        <AnyaCard
          variant="blush"
          cutSize="lg"
          className="p-7 sm:p-12 shadow-sm"
        >
          {/* Section Heading */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C97C89] block mb-2">
              Personalized Skin Analysis
            </span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#2F2326] tracking-tight"
              style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}
            >
              Find Your Skin’s Perfect Match
            </h2>
            <p className="text-xs sm:text-sm text-[#6F5B60] mt-2">
              Answer 3 quick questions and our apothecary logic will match the ideal botanical soap formulation for your skin type.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Question 1: Skin Type */}
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-[#2F2326] mb-2.5">
                  1. What is your primary skin type?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {[
                    { id: 'dry', label: 'Dry & Sensitive' },
                    { id: 'oily', label: 'Oily & Acne-Prone' },
                    { id: 'normal', label: 'Normal / Combo' },
                    { id: 'baby', label: 'Hyper-Reactive / Baby' },
                  ].map((opt) => (
                    <AnyaBadge
                      key={opt.id}
                      as="button"
                      type="button"
                      onClick={() => setSkinType(opt.id)}
                      active={skinType === opt.id}
                      variant="surface"
                      size="md"
                      className="w-full justify-center normal-case font-semibold min-h-[42px] text-center"
                    >
                      {opt.label}
                    </AnyaBadge>
                  ))}
                </div>
              </div>

              {/* Question 2: Scent Preference */}
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-[#2F2326] mb-2.5">
                  2. Your preferred sensory fragrance profile:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {[
                    { id: 'floral', label: 'Damask Rose & Floral' },
                    { id: 'unscented', label: '100% Unscented' },
                    { id: 'herbal', label: 'Cooling Wildflowers' },
                    { id: 'citrus', label: 'Warm Orange & Earth' },
                  ].map((opt) => (
                    <AnyaBadge
                      key={opt.id}
                      as="button"
                      type="button"
                      onClick={() => setScent(opt.id)}
                      active={scent === opt.id}
                      variant="surface"
                      size="md"
                      className="w-full justify-center normal-case font-semibold min-h-[42px] text-center"
                    >
                      {opt.label}
                    </AnyaBadge>
                  ))}
                </div>
              </div>

              {/* Question 3: Primary Skin Goal */}
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-[#2F2326] mb-2.5">
                  3. Key benefit you are seeking:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {[
                    { id: 'hydration', label: 'Deep Hydration' },
                    { id: 'detox', label: 'Pore Clarification' },
                    { id: 'glow', label: 'Even Tone & Glow' },
                    { id: 'calm', label: 'Anti-Redness Calm' },
                  ].map((opt) => {
                    const isSelected = concerns.includes(opt.id);
                    return (
                      <AnyaBadge
                        key={opt.id}
                        as="button"
                        type="button"
                        onClick={() => toggleConcern(opt.id)}
                        active={isSelected}
                        variant="surface"
                        size="md"
                        className="w-full justify-center normal-case font-semibold min-h-[42px] text-center"
                      >
                        {opt.label}
                      </AnyaBadge>
                    );
                  })}
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#2F2326] mb-1">
                    Your Name
                  </label>
                  <div
                    className="relative group focus-within:shadow-xs"
                    style={{ clipPath: getAnyaClippedPolygon(8) }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-[#E7C8CF] group-focus-within:bg-[#C97C89] transition-colors pointer-events-none"
                      style={{ clipPath: getAnyaClippedPolygon(8) }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-[1px] bg-white pointer-events-none"
                      style={{ clipPath: getAnyaClippedPolygon(7) }}
                    />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya"
                      className="relative z-10 w-full px-4 py-2.5 text-xs bg-transparent text-[#2F2326] placeholder-[#8E7A7E] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2F2326] mb-1">
                    Email Address
                  </label>
                  <div
                    className="relative group focus-within:shadow-xs"
                    style={{ clipPath: getAnyaClippedPolygon(8) }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-[#E7C8CF] group-focus-within:bg-[#C97C89] transition-colors pointer-events-none"
                      style={{ clipPath: getAnyaClippedPolygon(8) }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-[1px] bg-white pointer-events-none"
                      style={{ clipPath: getAnyaClippedPolygon(7) }}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. priya@example.com"
                      className="relative z-10 w-full px-4 py-2.5 text-xs bg-transparent text-[#2F2326] placeholder-[#8E7A7E] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 text-center">
                <AnyaButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={<Sparkles className="w-4 h-4 text-[#E39AA6]" />}
                  className="w-full sm:w-auto text-xs tracking-wider uppercase"
                >
                  Reveal My Custom Soap Prescription
                </AnyaButton>
              </div>
            </form>
          ) : (
            /* Result Box with AnyaCard */
            <AnyaCard variant="surface" cutSize="md" className="p-6 sm:p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF4F6] border border-[#E7C8CF] text-[#C97C89] mx-auto flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C97C89]">
                  Prescription for {name || 'You'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2F2326] mt-1" style={{ fontFamily: "'Urbanist', 'Playfair Display', Georgia, serif" }}>
                  We Recommend: {recommendedProduct?.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#6F5B60] max-w-md mx-auto mt-2 leading-relaxed">
                  {recommendedProduct?.description}
                </p>
              </div>

              {recommendedProduct && (
                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <AnyaButton
                    variant="primary"
                    size="md"
                    onClick={() => onAddToCart(recommendedProduct)}
                  >
                    Add {recommendedProduct.name} to Cart • ₹{recommendedProduct.price}
                  </AnyaButton>
                  <AnyaButton
                    variant="outline"
                    size="md"
                    onClick={() => onNavigate(`/product/${recommendedProduct.id}`)}
                  >
                    View Ingredients & Details
                  </AnyaButton>
                </div>
              )}

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-[11px] text-[#8E7A7E] underline hover:text-[#C97C89] block mx-auto pt-2 cursor-pointer"
              >
                Retake Skin Quiz
              </button>
            </AnyaCard>
          )}
        </AnyaCard>
      </div>
    </section>
  );
};
