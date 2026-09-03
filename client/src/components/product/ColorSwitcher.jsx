import React from 'react';
import { Check } from 'lucide-react';

export default function ColorSwitcher({ colors, selectedColor, onSelectColor }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
        Select Color: <span className="text-brand-600 font-bold ml-1">{selectedColor}</span>
      </label>
      <div className="flex flex-wrap items-center gap-3">
        {colors.map((c) => {
          const isSelected = c.colorName === selectedColor;
          return (
            <button
              key={c.colorName}
              onClick={() => onSelectColor(c.colorName)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/60 text-brand-950 ring-2 ring-brand-600/30'
                  : 'border-stone-300 hover:border-stone-400 bg-white text-stone-700'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center text-white"
                style={{ backgroundColor: c.colorCode }}
              >
                {isSelected && <Check className="w-2.5 h-2.5" />}
              </span>
              <span>{c.colorName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
