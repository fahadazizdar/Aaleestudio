import React from 'react';

export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 space-y-4">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      <p className="text-sm font-medium text-stone-600 tracking-wide">{label}</p>
    </div>
  );
}
