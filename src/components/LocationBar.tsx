import React, { useState } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { DeliveryLocation } from '../types';
import { AVAILABLE_LOCATIONS } from '../data/products';

interface LocationBarProps {
  location: DeliveryLocation;
  onLocationChange: (loc: DeliveryLocation) => void;
}

export const LocationBar: React.FC<LocationBarProps> = ({
  location,
  onLocationChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      id="delivery-location-row"
      className="w-full bg-[#FAFAF6] border-b border-[#E7E7DF]/70 text-[#626B69]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-2 flex items-center justify-between text-xs">
        <div className="relative flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[#53B847] shrink-0" />
          <span className="font-normal text-[#626B69] shrink-0">Delivering to</span>
          <button
            id="location-picker-btn"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="group inline-flex items-center gap-1 font-semibold text-[#172126] hover:text-[#004B68] transition-colors focus:outline-none focus-visible:underline ml-0.5 min-w-0"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span className="truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">
              {location.area}, {location.city}, {location.pincode}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#626B69] group-hover:text-[#004B68] transition-transform duration-200 shrink-0 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Compact Dropdown Popover */}
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsOpen(false)}
              />
              <div
                id="location-dropdown-menu"
                className="absolute left-0 top-full mt-2 w-72 max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-lg border border-[#E7E7DF] p-2 z-30 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-[#E7E7DF]/60">
                  <p className="text-[11px] font-semibold tracking-wider text-[#626B69] uppercase">
                    Choose Delivery Location
                  </p>
                  <p className="text-xs text-[#172126] mt-0.5">
                    Coimbatore Fresh Delivery Network
                  </p>
                </div>
                <div className="py-1 max-h-56 overflow-y-auto">
                  {AVAILABLE_LOCATIONS.map((loc) => {
                    const isSelected =
                      loc.area === location.area && loc.pincode === location.pincode;
                    return (
                      <button
                        key={loc.pincode}
                        type="button"
                        onClick={() => {
                          onLocationChange(loc);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors text-xs ${
                          isSelected
                            ? 'bg-[#F2F3ED] text-[#004B68] font-medium'
                            : 'hover:bg-[#FAFAF6] text-[#172126]'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{loc.area}</div>
                          <div className="text-[11px] text-[#626B69]">
                            {loc.city} — {loc.pincode}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#53B847] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Delivery Slot Status */}
        <div className="hidden sm:flex items-center gap-2 text-[#626B69]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#53B847]" />
          <span>Next delivery slot: <strong className="text-[#172126] font-medium">Today, 5:30 PM – 7:30 PM</strong></span>
        </div>
      </div>
    </div>
  );
};
