import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Phone, ShieldCheck, CheckCircle2, Lock, Navigation } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    distanceKm: 5,
    baseCharge: 150,
    ratePerKm: 15,
    variableCharge: 75,
    totalCharges: 225
  });

  const [shippingDetails, setShippingDetails] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: 'House 12, Street 5, Block C, Johar Town',
    city: 'Lahore',
    latitude: 31.4697,
    longitude: 74.2728
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleCalculateDistanceFee = async (lat, lng) => {
    try {
      const { data } = await API.post('/delivery/calculate', { lat, lng });
      setDeliveryInfo(data);
    } catch (err) {
      console.error('Failed to calculate delivery charges:', err);
    }
  };

  useEffect(() => {
    handleCalculateDistanceFee(shippingDetails.latitude, shippingDetails.longitude);
  }, [shippingDetails.latitude, shippingDetails.longitude]);

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setShippingDetails((prev) => ({ ...prev, latitude: lat, longitude: lng }));
          toast.success(`Location updated! Distance calculated from store hub.`);
        },
        () => {
          toast.error('Unable to fetch GPS location. Default distance used.');
        }
      );
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Account authentication required.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: cartItems,
        shippingDetails
      };

      const { data } = await API.post('/orders', payload);
      toast.success('Order booked successfully via Cash on Delivery!');
      clearCart();
      navigate(`/order-success`, { state: { order: data } });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Order booking failed.';
      toast.error(msg);
      if (status === 401) {
        toast.error('Session expired or user account not found. Please Sign In to complete your order.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const grandTotal = cartSubtotal + deliveryInfo.totalCharges;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
          SECURE CHECKOUT
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Complete Your Order (Cash on Delivery)
        </h1>
        <p className="text-xs text-stone-500">
          Logged in as <strong>{user?.name}</strong> ({user?.email}).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Shipping Details Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h3 className="font-serif font-bold text-stone-900 text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" />
              <span>Shipping Address & Delivery Distance</span>
            </h3>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-200"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Auto-Detect Location GPS</span>
            </button>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs text-stone-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={shippingDetails.name}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Contact Phone Number *</label>
                <input
                  type="text"
                  required
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                  placeholder="+92 300 0000000"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Full Street Address *</label>
              <input
                type="text"
                required
                value={shippingDetails.address}
                onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                placeholder="House/Apartment #, Street, Sector/Block"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={shippingDetails.city}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Latitude (for Distance calculation)</label>
                <input
                  type="number"
                  step="any"
                  value={shippingDetails.latitude}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, latitude: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Longitude (for Distance calculation)</label>
                <input
                  type="number"
                  step="any"
                  value={shippingDetails.longitude}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, longitude: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                />
              </div>
            </div>

            {/* Distance Calculation Breakdown Card */}
            <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-200 space-y-2 mt-4">
              <div className="flex items-center justify-between text-brand-950 font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-600" />
                  <span>Distance Calculation Formula</span>
                </span>
                <span>{deliveryInfo.distanceKm} km from Hub</span>
              </div>
              <p className="text-[11px] text-stone-600">
                Base Fee (Rs. {deliveryInfo.baseCharge}) + Distance Rate ({deliveryInfo.distanceKm} km × Rs. {deliveryInfo.ratePerKm}/km) = <strong>Rs. {deliveryInfo.totalCharges}</strong>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-all shadow-xl flex items-center justify-center gap-2 mt-6"
            >
              <CheckCircle2 className="w-4 h-4 text-accent-gold" />
              <span>{loading ? 'Processing Order...' : 'Confirm & Book Order (Cash on Delivery)'}</span>
            </button>
          </form>
        </div>

        {/* Order Summary Column */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-stone-900 text-lg border-b border-stone-200 pb-3">
            Cart Breakdown
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="flex items-center gap-3 text-xs">
                <img src={item.image} alt={item.productName} className="w-12 h-14 object-cover rounded-lg bg-stone-100" />
                <div className="flex-grow">
                  <h5 className="font-semibold text-stone-800 line-clamp-1">{item.productName}</h5>
                  <p className="text-[11px] text-stone-400">{item.selectedColor} | {item.selectedSize} × {item.quantity}</p>
                </div>
                <span className="font-bold text-stone-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-stone-900">Rs. {cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Distance Delivery Charge ({deliveryInfo.distanceKm} km)</span>
              <span className="font-semibold text-stone-900">Rs. {deliveryInfo.totalCharges}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-stone-900">
            <span className="font-serif font-bold text-base">Grand Total (COD)</span>
            <span className="font-serif font-bold text-2xl text-brand-700">
              Rs. {grandTotal.toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cash on Delivery Guarantee</span>
            </div>
            <p>Pay cash directly to our courier upon doorstep parcel verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
