import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const activeColor = product.colors?.[selectedColorIndex] || product.colors?.[0];
  const primaryImage = activeColor?.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-stone-900/80 text-stone-100 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm">
          {product.category}
        </span>

        {/* Quick View overlay button */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <Link
            to={`/products/${product._id}`}
            className="px-5 py-2.5 bg-white text-stone-900 font-semibold text-xs rounded-full shadow-lg hover:bg-stone-900 hover:text-white transition-all transform group-hover:translate-y-0 translate-y-2 duration-300 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Details & Angles</span>
          </Link>
        </div>
      </div>

      {/* Details section */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <h3 className="font-serif font-semibold text-stone-900 text-base line-clamp-1 group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 font-light leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-medium text-stone-400">Colors:</span>
            <div className="flex items-center gap-1.5">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`w-4 h-4 rounded-full border border-stone-300 transition-transform ${
                    idx === selectedColorIndex ? 'ring-2 ring-brand-600 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.colorCode }}
                  title={c.colorName}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Price & Link */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block">PKR</span>
            <span className="font-serif text-lg font-bold text-stone-900">
              Rs. {product.basePrice?.toLocaleString()}
            </span>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="p-2.5 rounded-full bg-stone-100 text-stone-800 hover:bg-brand-600 hover:text-white transition-colors"
            title="View Product"
          >
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
