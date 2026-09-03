import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

const getColorHexByName = (name) => {
  const map = {
    red: '#DC2626', maroon: '#800020', blue: '#2563EB', navy: '#1E3A8A',
    green: '#16A34A', emerald: '#047857', black: '#18181B', white: '#FAFAFA',
    pink: '#EC4899', purple: '#9333EA', yellow: '#CA8A04', orange: '#EA580C',
    brown: '#78350F', grey: '#52525B', gray: '#52525B', beige: '#D4B996',
    gold: '#D4AF37', silver: '#9CA3AF'
  };
  const lower = (name || '').toLowerCase().trim();
  for (const key in map) {
    if (lower.includes(key)) return map[key];
  }
  return '#78350F';
};

export default function ProductModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Ladies',
    basePrice: '',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
    colors: [
      {
        colorName: 'Royal Maroon',
        colorCode: '#800020',
        images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80'],
        stock: 10
      }
    ]
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Ladies',
        basePrice: '',
        sizes: ['S', 'M', 'L', 'XL'],
        featured: false,
        colors: [
          {
            colorName: 'Royal Maroon',
            colorCode: '#800020',
            images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80'],
            stock: 10
          }
        ]
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Auto sync hex code from name
    const finalColors = formData.colors.map((c) => ({
      ...c,
      colorCode: getColorHexByName(c.colorName)
    }));

    onSave({ ...formData, colors: finalColors });
  };

  const addColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          colorName: 'New Color',
          colorCode: '#800020',
          images: [],
          stock: 10
        }
      ]
    }));
  };

  const removeColor = (index) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const updateColorName = (index, name) => {
    setFormData((prev) => {
      const updated = [...prev.colors];
      updated[index].colorName = name;
      updated[index].colorCode = getColorHexByName(name);
      return { ...prev, colors: updated };
    });
  };

  const updateColorStock = (index, stock) => {
    setFormData((prev) => {
      const updated = [...prev.colors];
      updated[index].stock = Number(stock);
      return { ...prev, colors: updated };
    });
  };

  // Handle local file uploads from computer
  const handleFileUpload = (colorIndex, files) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setFormData((prev) => {
          const updated = [...prev.colors];
          updated[colorIndex].images = [...updated[colorIndex].images, base64Image];
          return { ...prev, colors: updated };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeColorImage = (colorIndex, imgIndex) => {
    setFormData((prev) => {
      const updated = [...prev.colors];
      updated[colorIndex].images = updated[colorIndex].images.filter((_, i) => i !== imgIndex);
      return { ...prev, colors: updated };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <h3 className="font-serif text-xl font-bold text-stone-900">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs text-stone-800">
          <div>
            <label className="block font-semibold mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
              placeholder="e.g. Embroidered Chiffon 3-Piece"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
              >
                <option value="Ladies">Ladies</option>
                <option value="Kids">Kids</option>
                <option value="Men">Men</option>
                <option value="Accessories">Accessories</option>
                <option value="Festive">Festive</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Base Price (PKR) *</label>
              <input
                type="number"
                required
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                placeholder="4999"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
              placeholder="Fabric details, print patterns, and style specifications..."
            />
          </div>

          {/* Color Variations with Direct Local File Upload */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-900 uppercase">Colors & System Image Upload</label>
              <button
                type="button"
                onClick={addColor}
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
              >
                <Plus className="w-4 h-4" /> Add Color Option
              </button>
            </div>

            {formData.colors.map((col, idx) => (
              <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 relative">
                {formData.colors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColor(idx)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Color Name (Text) *</label>
                    <input
                      type="text"
                      required
                      value={col.colorName}
                      onChange={(e) => updateColorName(idx, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                      placeholder="e.g. Red, Royal Blue, Maroon, Emerald"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Available Stock *</label>
                    <input
                      type="number"
                      required
                      value={col.stock}
                      onChange={(e) => updateColorStock(idx, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                      placeholder="10"
                    />
                  </div>
                </div>

                {/* Direct File Picker Image Upload */}
                <div>
                  <label className="block font-semibold mb-1">Upload Product Images From System *</label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 text-white font-semibold text-xs hover:bg-brand-600 transition-colors cursor-pointer w-full sm:w-auto">
                      <Upload className="w-4 h-4" />
                      <span>Select Images From Computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(idx, e.target.files)}
                      />
                    </label>
                    <span className="text-[11px] text-stone-400">Supports JPG, PNG, WEBP</span>
                  </div>

                  {/* Uploaded Images Thumbnails */}
                  {col.images && col.images.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1">
                      {col.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="relative w-16 h-20 rounded-lg overflow-hidden border border-stone-300 flex-shrink-0 group">
                          <img src={img} alt="Product upload preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeColorImage(idx, imgIdx)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 hover:scale-110 transition-all"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-brand-600 rounded"
            />
            <label htmlFor="featured" className="font-semibold text-stone-800">
              Display in Featured Home Collection
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-stone-300 font-semibold hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-stone-900 text-white font-semibold hover:bg-brand-600 transition-colors"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
