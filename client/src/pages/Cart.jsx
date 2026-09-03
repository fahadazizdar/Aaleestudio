import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, cartTotalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-stone-800">Your Cart is Currently Empty</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Explore our luxury lawn, embroidered silk, and ready-to-wear pret collections.
        </p>
        <Link
          to="/products"
          className="inline-block px-8 py-3.5 bg-stone-900 text-white font-semibold text-xs rounded-full shadow-lg hover:bg-brand-600 transition-all"
        >
          Explore Apparel Catalog
        </Link>
      </div>
    );
  }

  const handleProceedCheckout = () => {
    if (!user) {
      navigate('/login', { state: { message: 'Sign in or register your account to complete order booking.' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="font-serif text-3xl font-bold text-stone-900">
        Shopping Cart ({cartTotalItems} {cartTotalItems === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-20 h-24 object-cover rounded-xl bg-stone-100 flex-shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    {item.category}
                  </span>
                  <h4 className="font-serif font-semibold text-stone-900 text-sm">
                    {item.productName}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span>Color: <strong>{item.selectedColor}</strong></span>
                    <span>•</span>
                    <span>Size: <strong>{item.selectedSize}</strong></span>
                  </div>
                  <span className="font-serif font-bold text-stone-900 text-sm block pt-1">
                    Rs. {item.price?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="w-8 h-8 rounded border border-stone-300 font-bold flex items-center justify-center hover:bg-stone-100"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="w-8 h-8 rounded border border-stone-300 font-bold flex items-center justify-center hover:bg-stone-100"
                  >
                    +
                  </button>
                </div>

                <span className="font-serif font-bold text-stone-900 text-sm min-w-[80px] text-right">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>

                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-stone-400 hover:text-red-600 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-stone-900 text-lg border-b border-stone-200 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-stone-900 text-sm">Rs. {cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee (Distance-based)</span>
              <span className="text-stone-400">Calculated at Checkout</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode</span>
              <span className="font-semibold text-emerald-700">Cash on Delivery (COD)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-stone-900">
            <span className="font-serif font-bold text-base">Estimated Total</span>
            <span className="font-serif font-bold text-xl text-brand-700">
              Rs. {cartSubtotal.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleProceedCheckout}
            className="w-full py-3.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-brand-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-accent-gold" />
            <span>Proceed To Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!user && (
            <p className="text-[11px] text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200 text-center font-medium">
              Registration or Sign In is required to complete order checkout.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
