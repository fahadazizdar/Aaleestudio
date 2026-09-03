import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { siteSettings } = useAuth();

  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto border-t border-stone-800">
      {/* Top Value Proposition Grid */}
      <div className="border-b border-stone-800 bg-stone-950/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-stone-900/50 border border-stone-800/80">
            <Truck className="w-8 h-8 text-brand-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm">Nationwide COD & Distance Fee</h4>
              <p className="text-xs text-stone-400 mt-0.5">Calculated dynamically based on km distance</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-stone-900/50 border border-stone-800/80">
            <ShieldCheck className="w-8 h-8 text-brand-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm">Verified Registered Accounts</h4>
              <p className="text-xs text-stone-400 mt-0.5">Required authentication for order placement</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-stone-900/50 border border-stone-800/80">
            <RefreshCw className="w-8 h-8 text-brand-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm">7-Day Easy Exchange</h4>
              <p className="text-xs text-stone-400 mt-0.5">Seamless claims on unused apparel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Story */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-serif font-bold text-lg">
                A
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-wide">
                {siteSettings?.storeName || 'AALEESTUDIO'}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {siteSettings?.footerAboutText ||
                'Aaleestudio delivers premium Pakistani formal and casual clothing with multi-angle previews, dynamic color selection, and nationwide Cash on Delivery.'}
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-brand-400 transition-colors">All Apparel Collection</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">About Our Brand</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Customer Care</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-brand-400 transition-colors">Store Rules & Policies</Link>
              </li>
            </ul>
          </div>

          {/* Customer Portal */}
          <div>
            <h4 className="font-serif font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/login" className="hover:text-brand-400 transition-colors">Sign In Account</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-400 transition-colors">Create New Account</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-400 transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-brand-400 transition-colors">Track My Orders</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (Admin Managed) */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Headquarters & Support
            </h4>
            <div className="flex items-start gap-3 text-xs text-stone-400">
              <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <span>{siteSettings?.address || 'Main Boulevard, Gulberg III, Lahore, Pakistan'}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>{siteSettings?.contactPhone || '+92 300 1234567'}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>{siteSettings?.contactEmail || 'support@aaleestudio.com'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {siteSettings?.storeName || 'Aaleestudio'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-stone-300">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-stone-300">Store Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
