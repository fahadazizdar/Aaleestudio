import React from 'react';
import { Sparkles, ShieldCheck, Award, Scissors, Heart, Shirt, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function About() {
  const { siteSettings } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" /> OUR APPAREL CRAFT & HERITAGE
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-tight">
          About {siteSettings?.storeName || 'Aaleestudio'}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-light">
          Aaleestudio is dedicated to bringing you premium handcrafted Pakistani apparel. From intricate chiffon threadwork and breathable pure lawn prints to sharp men's cotton kurtas and hypoallergenic kidswear, we blend timeless textile traditions with contemporary elegance.
        </p>
      </div>

      {/* Fabric & Craftsmanship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">Pure Fabrics & Premium Weaves</h3>
          <p className="text-xs text-stone-500 leading-relaxed font-light">
            We source 100% combed cotton, high-density lawn, velvet borders, and pure silk dupattas. Every batch undergoes strict quality checks for soft texture, color fastness, and durability.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
            <Scissors className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">Intricate Threadwork & Embroidery</h3>
          <p className="text-xs text-stone-500 leading-relaxed font-light">
            Our festive and pret dresses showcase detailed zari embroidery, digital prints, hand-stitched necklines, and tailored silhouettes crafted by skilled master artisans.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
            <Shirt className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">Vibrant Color Schemes & Fitting</h3>
          <p className="text-xs text-stone-500 leading-relaxed font-light">
            Choose from a rich palette of festive tones including Royal Maroon, Emerald Green, Powder Blue, and Off-White, offered across standardized fittings with full stock availability.
          </p>
        </div>
      </div>

      {/* Brand Promise Section */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
        <div className="max-w-3xl space-y-4">
          <h2 className="font-serif text-3xl font-bold text-white">Our Promise to Every Customer</h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
            Whether you are shopping for a wedding event, festive occasion, daily ready-to-wear pret, or junior wear, Aaleestudio guarantees high fabric standards, accurate multi-angle previews, and nationwide Cash on Delivery right to your doorstep.
          </p>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>100% Authentic Fabric & Quality Assurance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>Verified Customer Account Ordering</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>Distance-Based Transparent Delivery Fee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>7-Day Easy Exchange Policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
