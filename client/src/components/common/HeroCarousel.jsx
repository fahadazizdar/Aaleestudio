import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function HeroCarousel() {
  const { siteSettings } = useAuth();
  
  const slides = siteSettings?.heroSlides?.length > 0
    ? siteSettings.heroSlides
    : [
        {
          title: 'Festive Luxury Silk & Lawn Collection 2026',
          subtitle: 'Hand-embroidered traditional & modern couture crafted for grand celebrations.',
          image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1600&q=85',
          tag: 'SPRING FESTIVE'
        },
        {
          title: 'Contemporary Ready-To-Wear Pret',
          subtitle: 'Effortless co-ord sets, breathable tunics, and minimalist silhouettes for daily style.',
          image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
          tag: 'EVERYDAY ELEGANCE'
        },
        {
          title: 'Royal Men & Junior Apparel Edition',
          subtitle: 'Premium cotton kurtas, embroidered waistcoats, and designer kidswear.',
          image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1600&q=85',
          tag: 'ROYAL COLLECTION'
        }
      ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[580px] sm:h-[650px] overflow-hidden bg-stone-950">
      {/* Background Slideshow with Motion Pan/Zoom Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover object-center filter brightness-[0.68]"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay */}
      <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-8 flex flex-col justify-center text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl space-y-5"
          >
            {/* Tag Badge */}
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-600/90 text-white text-xs font-bold tracking-widest uppercase border border-brand-400/40 backdrop-blur-sm shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
              {slides[currentIndex].tag}
            </span>

            {/* Slide Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white drop-shadow-md">
              {slides[currentIndex].title}
            </h1>

            {/* Subtitle */}
            <p className="text-stone-200 text-sm sm:text-lg font-light leading-relaxed max-w-xl drop-shadow">
              {slides[currentIndex].subtitle}
            </p>

            {/* Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="px-7 py-3.5 rounded-full bg-white text-stone-900 hover:bg-brand-500 hover:text-white font-semibold text-sm shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="px-6 py-3.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white border border-stone-500/50 hover:border-white font-semibold text-sm backdrop-blur-sm transition-all duration-300"
              >
                Explore Story
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Slide Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/40 hover:bg-stone-900/80 text-white backdrop-blur-sm transition-colors border border-stone-700/50 hidden sm:block"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/40 hover:bg-stone-900/80 text-white backdrop-blur-sm transition-colors border border-stone-700/50 hidden sm:block"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-brand-500' : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
