import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCw, CheckCircle2, Lock } from 'lucide-react';
import API from '../services/api';
import MultiAngleGallery from '../components/product/MultiAngleGallery';
import ColorSwitcher from '../components/product/ColorSwitcher';
import SizeSelector from '../components/product/SizeSelector';
import Loader from '../components/common/Loader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0].colorName);
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
        toast.error('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader label="Loading outfit specifications..." />;
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-800">Outfit Not Found</h2>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-full">
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Active Color object
  const activeColorObj = product.colors?.find((c) => c.colorName === selectedColor) || product.colors?.[0];
  const colorImages = activeColorObj?.images || [];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select your size before adding to cart.');
      return;
    }
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleBookNow = () => {
    if (!selectedSize) {
      toast.error('Please select your size.');
      return;
    }
    addToCart(product, selectedColor, selectedSize, quantity);

    if (!user) {
      toast.error('Please register or sign in to book your order.');
      navigate('/login', { state: { message: 'Sign in or register your account to complete your order booking.' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: 360° & Multi-Angle Image Gallery */}
        <MultiAngleGallery colorImages={colorImages} images360={product.images360} />

        {/* Right Column: Specifications & Actions */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-stone-100 text-stone-800 text-[10px] font-bold uppercase tracking-widest rounded-full">
              {product.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Pricing & Stock */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-400 block font-medium">Price (COD Nationwide)</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Rs. {product.basePrice?.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In Stock ({activeColorObj?.stock || 10} available)
              </span>
            </div>
          </div>

          {/* Color Switcher */}
          <ColorSwitcher
            colors={product.colors}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />

          {/* Size Selector */}
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Quantity:
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-lg border border-stone-300 font-bold hover:bg-stone-100 flex items-center justify-center text-stone-700"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-lg border border-stone-300 font-bold hover:bg-stone-100 flex items-center justify-center text-stone-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-xl border-2 border-stone-900 text-stone-900 font-semibold text-xs hover:bg-stone-100 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Cart</span>
              </button>

              <button
                onClick={handleBookNow}
                className="w-full py-4 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-accent-gold" />
                <span>Book Order Now (COD)</span>
              </button>
            </div>

            {/* Auth Notice */}
            {!user && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Note:</strong> Customer account registration is required to book or place orders.
                </span>
              </div>
            )}
          </div>

          {/* Delivery & Policy guarantee banner */}
          <div className="pt-6 border-t border-stone-200 grid grid-cols-2 gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <span>Distance-Based COD Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <span>Verified Customer Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
