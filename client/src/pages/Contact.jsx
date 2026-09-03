import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const { siteSettings } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/admin/contact-messages', form);
      setSubmitted(true);
      toast.success('Thank you! Your message has been sent to our Admin support desk.');
    } catch (err) {
      toast.error('Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
          CUSTOMER CARE & INQUIRIES
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Contact Support Team
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light">
          Have questions regarding an order, size fitting, or delivery calculations? Reach out to us below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm">Phone Helpline</h4>
              <p className="text-xs text-stone-500 mt-1">{siteSettings?.contactPhone || '+92 300 1234567'}</p>
              <span className="text-[10px] text-stone-400 block mt-0.5">Mon - Sat (9am - 8pm PKT)</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm">Email Support</h4>
              <p className="text-xs text-stone-500 mt-1">{siteSettings?.contactEmail || 'support@aaleestudio.com'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900 text-sm">Headquarters & Flagship Store</h4>
              <p className="text-xs text-stone-500 mt-1">{siteSettings?.address || 'Main Boulevard, Gulberg III, Lahore, Pakistan'}</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-stone-800">Message Received!</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Our support desk has logged your inquiry. Our team will review your message in the Admin Portal and contact you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-full"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs text-stone-800">
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">Send Us A Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                  placeholder="+92 300 0000000"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Your Inquiry Message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                  placeholder="How can we help you today?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-all shadow-md flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
