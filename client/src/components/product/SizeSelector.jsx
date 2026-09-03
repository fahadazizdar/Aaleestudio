import React from 'react';

export default function SizeSelector({ sizes, selectedSize, onSelectSize }) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
          Select Size: <span className="text-brand-600 font-bold ml-1">{selectedSize || 'Choose Size'}</span>
        </label>
        <span className="text-[11px] text-stone-400">Standard PKR Fitting</span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {sizes.map((sz) => {
          const isSelected = sz === selectedSize;
          return (
            <button
              key={sz}
              onClick={() => onSelectSize(sz)}
              className={`min-w-[48px] h-10 px-3 rounded-lg border font-semibold text-xs transition-all ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-105'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
              }`}
            >
              {sz}
            </button>
          );
        })}
      </div>
    </div>
  );
}
