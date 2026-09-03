import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold tracking-widest uppercase text-brand-600">
          ORDER CONFIRMED
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Thank You For Your Booking!
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Your Cash on Delivery order has been logged into our pipeline. Our logistics dispatch team will contact you before delivery.
        </p>
      </div>

      {order && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-left max-w-xl mx-auto space-y-4 text-xs text-stone-700">
          <div className="flex justify-between border-b border-stone-100 pb-3 font-bold text-stone-900">
            <span>Booking ID: #{order._id}</span>
            <span className="text-brand-600 uppercase font-semibold">{order.orderStatus || 'Pending'}</span>
          </div>

          <div className="space-y-1 text-stone-600">
            <p><strong>Recipient:</strong> {order.shippingDetails?.name}</p>
            <p><strong>Phone:</strong> {order.shippingDetails?.phone}</p>
            <p><strong>Address:</strong> {order.shippingDetails?.address}, {order.shippingDetails?.city}</p>
          </div>

          <div className="pt-2 border-t border-stone-100 flex justify-between font-bold text-stone-900 text-sm">
            <span>Total Amount (COD):</span>
            <span className="text-brand-700">Rs. {order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          to="/orders"
          className="px-8 py-3.5 rounded-full bg-stone-900 text-white font-semibold text-xs hover:bg-brand-600 transition-all flex items-center gap-2 shadow-lg"
        >
          <Package className="w-4 h-4" />
          <span>Track My Orders</span>
        </Link>
        <Link
          to="/products"
          className="px-6 py-3.5 rounded-full bg-stone-100 text-stone-800 font-semibold text-xs hover:bg-stone-200 transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
