import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TermsRules() {
  const { siteSettings } = useAuth();

  const rules = siteSettings?.rulesAndTerms || [
    'All orders are processed under Cash on Delivery (COD) mode.',
    'Customers must have a verified registered account before placing orders.',
    'Returns & Exchanges are valid within 7 days of delivery with tag intact.',
    'Delivery charges are dynamically computed based on your delivery distance from store hub.',
    'Deactivated customer accounts are restricted from ordering.'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
          <FileText className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Store Rules & Regulations
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light max-w-lg mx-auto">
          Official store policies governing customer order booking, account verification, and cash-on-delivery services.
        </p>
      </div>

      {/* Rules Card */}
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-4 text-stone-900 font-bold font-serif text-lg">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <span>General Code of Rules & Terms</span>
        </div>

        <div className="space-y-4">
          {(Array.isArray(rules) ? rules : []).map((rule, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
              <span className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                  {rule}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Account Requirement Notice */}
      <div className="p-6 bg-brand-900 text-white rounded-2xl flex items-start gap-4 shadow-md">
        <AlertCircle className="w-6 h-6 text-accent-gold flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm">
          <h4 className="font-bold font-serif text-base">Account Registration Mandatory</h4>
          <p className="text-stone-300 font-light leading-relaxed">
            In compliance with store regulations, customers must sign up and authenticate their account before confirming order bookings. Unregistered users can browse and add items to cart but will be prompted to log in upon checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
