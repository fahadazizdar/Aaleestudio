import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, MapPin, Phone, Mail, Plus, Trash2 } from 'lucide-react';
import API from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function SiteSettings() {
  const { fetchSettings } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    storeName: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    ratePerKm: 15,
    baseCharge: 150,
    footerAboutText: '',
    rulesAndTerms: []
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/settings');
      setFormData(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await API.put('/admin/settings', formData);
      toast.success('Store Settings & Rules updated successfully!');
      fetchSettings();
    } catch (err) {
      toast.error('Failed to update settings');
    }
  };

  const addRule = () => {
    setFormData((prev) => ({
      ...prev,
      rulesAndTerms: [...prev.rulesAndTerms, 'New store policy rule...']
    }));
  };

  const updateRule = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.rulesAndTerms];
      updated[index] = value;
      return { ...prev, rulesAndTerms: updated };
    });
  };

  const removeRule = (index) => {
    setFormData((prev) => ({
      ...prev,
      rulesAndTerms: prev.rulesAndTerms.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-100">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
            POLICY & PARAMETERS
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Store Rules & Settings
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Customize rules, contact information, delivery calculation rates, and footer text displayed to customers.
          </p>
        </div>

        {loading ? (
          <Loader label="Loading configuration settings..." />
        ) : (
          <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-xs text-stone-800">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <h3 className="font-serif font-bold text-stone-900 text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-600" />
                <span>General Store Metadata</span>
              </h3>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-brand-600 transition-all flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Store Name *</label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Contact Phone *</label>
                <input
                  type="text"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Contact Email *</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Physical Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                />
              </div>
            </div>

            {/* Delivery Charge Parameters */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <h4 className="font-serif font-bold text-stone-900 text-base">
                Distance Delivery Calculation Parameters
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Base Charge (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.baseCharge}
                    onChange={(e) => setFormData({ ...formData, baseCharge: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Rate Per Km (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.ratePerKm}
                    onChange={(e) => setFormData({ ...formData, ratePerKm: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer text */}
            <div className="pt-4 border-t border-stone-200">
              <label className="block font-semibold mb-1">Footer About Text</label>
              <textarea
                rows={2}
                value={formData.footerAboutText}
                onChange={(e) => setFormData({ ...formData, footerAboutText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
              />
            </div>

            {/* Rules & Terms Editor */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  Store Rules & Terms Document
                </h4>
                <button
                  type="button"
                  onClick={addRule}
                  className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
                >
                  <Plus className="w-4 h-4" /> Add Rule Clause
                </button>
              </div>

              <div className="space-y-2">
                {formData.rulesAndTerms?.map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 font-bold text-stone-400 text-right">{idx + 1}.</span>
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => updateRule(idx, e.target.value)}
                      className="flex-grow px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeRule(idx)}
                      className="p-2 text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
