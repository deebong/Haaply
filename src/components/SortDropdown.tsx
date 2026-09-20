import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export interface SortOptionItem {
  value: SortOption;
  label: string;
}

const SORT_OPTIONS: SortOptionItem[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const currentOption = SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];

  // Sync highlighted index when value or open state changes
  useEffect(() => {
    const idx = SORT_OPTIONS.findIndex((opt) => opt.value === value);
    if (idx !== -1) {
      setHighlightedIndex(idx);
    }
  }, [value, isOpen]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % SORT_OPTIONS.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length);
        break;
      case 'Home':
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setHighlightedIndex(SORT_OPTIONS.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onChange(SORT_OPTIONS[highlightedIndex].value);
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (val: SortOption) => {
    onChange(val);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      id="shop-sort-dropdown-container"
      className="relative inline-block text-left"
      onKeyDown={handleKeyDown}
    >
      {/* TRIGGER BUTTON */}
      <button
        ref={triggerRef}
        id="shop-sort-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={`Sort products, currently sorted by ${currentOption.label}`}
        className={`inline-flex items-center justify-between gap-2 px-3 py-1.5 sm:py-2 bg-[#F2F3ED] hover:bg-[#E7E7DF] active:bg-[#E1E2D8] text-xs text-[#172126] font-medium rounded-xl border transition-all duration-150 cursor-pointer min-h-[36px] sm:min-h-[34px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004B68] ${
          isOpen
            ? 'border-[#004B68] ring-2 ring-[#004B68]/15 bg-[#E7E7DF]'
            : 'border-[#E7E7DF]'
        }`}
      >
        <span className="flex items-center gap-1">
          <span className="text-[#626B69] font-normal">Sort:</span>
          <span className="font-semibold text-[#172126] whitespace-nowrap">
            {currentOption.label}
          </span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#626B69] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#004B68]' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-label="Sort products by"
          className="absolute right-0 top-full mt-1.5 w-48 sm:w-52 bg-white rounded-xl border border-[#E7E7DF] shadow-lg shadow-black/5 py-1 z-30 focus:outline-none animate-in fade-in zoom-in-95 duration-100 max-w-[calc(100vw-32px)]"
          tabIndex={-1}
        >
          {SORT_OPTIONS.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option.value}
                id={`sort-option-${option.value}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full text-left px-3 py-2.5 sm:py-2 text-xs flex items-center gap-2 cursor-pointer transition-colors select-none ${
                  isSelected
                    ? 'bg-[#F2F3ED] font-semibold text-[#004B68]'
                    : isHighlighted
                    ? 'bg-[#F2F3ED]/60 text-[#172126]'
                    : 'text-[#172126] hover:bg-[#F2F3ED]/60'
                }`}
              >
                {/* Left checkmark indicator consistent with Haaply spec */}
                <span className="w-4 h-4 flex items-center justify-center shrink-0" aria-hidden="true">
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#53B847]" strokeWidth={2.5} />}
                </span>
                <span className="flex-1 truncate">{option.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
