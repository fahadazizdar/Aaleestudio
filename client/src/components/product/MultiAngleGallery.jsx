import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, ZoomIn } from 'lucide-react';

export default function MultiAngleGallery({ colorImages = [], images360 = [] }) {
  const allImages = [...new Set([...colorImages, ...images360])];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [colorImages]);

  const mainImage = allImages[activeImageIndex] || allImages[0] || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div className="relative aspect-[3/4] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-sm group">
        <AnimatePresence mode="wait">
          <motion.img
            key={mainImage}
            initial={{ opacity: 0.4, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.4 }}
            transition={{ duration: 0.3 }}
            src={mainImage}
            alt="Product multi-angle view"
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* 360 Angle Badge */}
        {images360?.length > 0 && (
          <div className="absolute top-4 right-4 bg-stone-900/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 shadow">
            <RotateCw className="w-3.5 h-3.5 text-accent-gold animate-spin-slow" />
            <span>360° MULTI-ANGLE VIEW</span>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                idx === activeImageIndex
                  ? 'border-brand-600 ring-2 ring-brand-600/30 scale-105 shadow-md'
                  : 'border-stone-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
