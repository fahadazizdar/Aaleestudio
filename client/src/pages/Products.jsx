import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');

  const categories = ['All', 'Ladies', 'Kids', 'Men', 'Accessories', 'Festive'];

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = `/products?`;
      if (category !== 'All') query += `category=${encodeURIComponent(category)}&`;
      if (search) query += `search=${encodeURIComponent(search)}&`;

      const { data } = await API.get(query);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products catalog:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
          Aaleestudio Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Shop Apparel & Couture
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light max-w-xl">
          Browse handcrafted Pakistani embroidered formals, casual tunics, and luxury pret wear with multi-angle previews and dynamic color selection.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-grow w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by outfit title, fabric type, or style..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 outline-none text-xs sm:text-sm transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <Loader label="Loading products..." />
      ) : (Array.isArray(products) ? products : []).length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-3">
          <SlidersHorizontal className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800">No Outfits Found</h3>
          <p className="text-xs text-stone-500">Try adjusting your search query or selecting a different category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Array.isArray(products) ? products : []).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
