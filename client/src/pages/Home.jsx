import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, Truck, RefreshCw, Star } from 'lucide-react';
import API from '../services/api';
import HeroCarousel from '../components/common/HeroCarousel';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { siteSettings } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products?featured=true');
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { title: 'Ladies Apparel', desc: 'Lawn, Chiffon & Silk Formals', img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=600&q=80', cat: 'Ladies' },
    { title: 'Men Couture', desc: 'Cotton Kurtas & Waistcoats', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', cat: 'Men' },
    { title: 'Junior Edition', desc: 'Soft hypoallergenic kidswear', img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80', cat: 'Kids' }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Animated Hero Carousel Section */}
      <HeroCarousel />

      {/* 2. Category Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
            Curated Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Explore By Department
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-light">
            Discover tailored collections featuring multi-color swatches, 360 multi-angle galleries, and premium fabric blends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link
                to={`/products?category=${c.cat}`}
                className="group relative h-96 rounded-2xl overflow-hidden block border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-400">
                    EXPLORE COLLECTION
                  </span>
                  <h3 className="font-serif text-2xl font-bold">{c.title}</h3>
                  <p className="text-xs text-stone-300 font-light">{c.desc}</p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-brand-400 group-hover:text-white transition-colors">
                    <span>View All Outfits</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-stone-200 pb-5 mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
              Handpicked Essentials
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
              Featured Trending Collections
            </h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 text-xs font-bold text-stone-900 hover:text-brand-600 transition-colors"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader label="Fetching luxury catalog..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Store Rules & Regulations Banner (Admin Controlled) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-900 via-brand-950 to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
            <ShieldAlert className="w-96 h-96 text-white" />
          </div>

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-600/80 text-xs font-bold tracking-widest uppercase border border-brand-400/40">
              <CheckCircle2 className="w-4 h-4 text-accent-gold" />
              CUSTOMER ORDER & TRANSPARENCY RULES
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Store Ordering & Account Policies
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {(siteSettings?.rulesAndTerms || []).slice(0, 4).map((rule, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-stone-900/60 p-4 rounded-xl border border-stone-800">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-200 leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                to="/terms"
                className="px-6 py-3 rounded-full bg-white text-stone-900 font-semibold text-xs hover:bg-brand-500 hover:text-white transition-all shadow-md"
              >
                Read Complete Rules Document
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
