import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function WhatsAppButton() {
  const { siteSettings } = useAuth();
  
  const rawPhone = siteSettings?.contactPhone || '+92 300 1234567';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(
    'Hello, I need help with my order details'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 border border-emerald-500 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-gold rounded-full animate-ping" />
      </div>
      <span className="hidden sm:inline font-bold text-xs tracking-wide">
        Chat On WhatsApp
      </span>
    </a>
  );
}
