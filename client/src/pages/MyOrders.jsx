import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import API from '../services/api';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my-orders');
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load user orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader label="Fetching your order history..." />;

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Confirmed':
      case 'Processing':
        return 2;
      case 'Shipped':
      case 'Dispatched':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const getStatusBadge = (status) => {
    const current = status || 'Pending';
    switch (current) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full">Pending Confirmation</span>;
      case 'Confirmed':
      case 'Processing':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-3 py-1 rounded-full">Order Confirmed</span>;
      case 'Shipped':
      case 'Dispatched':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-3 py-1 rounded-full">Out For Delivery</span>;
      case 'Delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full">Delivered</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-3 py-1 rounded-full">Cancelled</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-3 py-1 rounded-full">{current}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
          CUSTOMER PORTAL
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          My Booked Orders & Tracking
        </h1>
        <p className="text-xs text-stone-500">
          Real-time order tracking and delivery timeline for <strong>{user?.email}</strong>.
        </p>
      </div>

      {(Array.isArray(orders) ? orders : []).length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-4 shadow-sm">
          <Package className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800">No Orders Placed Yet</h3>
          <p className="text-xs text-stone-500">Book your first Cash on Delivery order from our store catalog.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(Array.isArray(orders) ? orders : []).map((ord) => {
            const currentStatus = ord.orderStatus || ord.status || 'Pending';
            const step = getStatusStep(currentStatus);
            const totalAmt = ord.totalAmount || ord.totalPrice || ord.totalCharges || 0;

            return (
              <div key={ord._id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-100 pb-4 gap-2">
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Order #{ord._id}</span>
                    <span className="text-[11px] text-stone-400 block">
                      Booked on {new Date(ord.createdAt || Date.now()).toLocaleString()}
                    </span>
                  </div>
                  <div>{getStatusBadge(currentStatus)}</div>
                </div>

                {/* Visual Tracker Timeline Stepper */}
                {currentStatus !== 'Cancelled' ? (
                  <div className="bg-stone-50/80 p-5 rounded-xl border border-stone-200/60 space-y-3">
                    <h5 className="text-[11px] font-bold text-stone-700 tracking-wider uppercase flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-brand-600" />
                      <span>Live Delivery Tracking Progress</span>
                    </h5>

                    <div className="relative pt-2 pb-1">
                      <div className="flex items-center justify-between relative z-10">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            step >= 1 ? 'bg-brand-600 text-white shadow-md' : 'bg-stone-200 text-stone-500'
                          }`}>
                            1
                          </div>
                          <span className="text-[10px] font-semibold mt-1.5 text-stone-700">Order Placed</span>
                        </div>

                        {/* Line 1 */}
                        <div className={`flex-grow h-1 mx-2 rounded transition-all ${step >= 2 ? 'bg-brand-600' : 'bg-stone-200'}`} />

                        {/* Step 2 */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            step >= 2 ? 'bg-brand-600 text-white shadow-md' : 'bg-stone-200 text-stone-500'
                          }`}>
                            2
                          </div>
                          <span className="text-[10px] font-semibold mt-1.5 text-stone-700">Confirmed</span>
                        </div>

                        {/* Line 2 */}
                        <div className={`flex-grow h-1 mx-2 rounded transition-all ${step >= 3 ? 'bg-brand-600' : 'bg-stone-200'}`} />

                        {/* Step 3 */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            step >= 3 ? 'bg-brand-600 text-white shadow-md' : 'bg-stone-200 text-stone-500'
                          }`}>
                            3
                          </div>
                          <span className="text-[10px] font-semibold mt-1.5 text-stone-700">Out For Delivery</span>
                        </div>

                        {/* Line 3 */}
                        <div className={`flex-grow h-1 mx-2 rounded transition-all ${step >= 4 ? 'bg-emerald-600' : 'bg-stone-200'}`} />

                        {/* Step 4 */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            step >= 4 ? 'bg-emerald-600 text-white shadow-md' : 'bg-stone-200 text-stone-500'
                          }`}>
                            4
                          </div>
                          <span className="text-[10px] font-semibold mt-1.5 text-stone-700">Delivered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>This order has been cancelled by customer request or store admin.</span>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3">
                  {(Array.isArray(ord.items) ? ord.items : []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img src={item.image || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'} alt={item.productName} className="w-12 h-14 object-cover rounded-lg bg-stone-100" />
                      <div className="flex-grow">
                        <h5 className="font-semibold text-stone-900">{item.productName}</h5>
                        <p className="text-[11px] text-stone-400">Color: {item.selectedColor} | Size: {item.selectedSize} × {item.quantity}</p>
                      </div>
                      <span className="font-bold text-stone-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Total */}
                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="text-stone-500">
                    <span>Shipping Address: </span>
                    <strong className="text-stone-800">{ord.shippingDetails?.address}, {ord.shippingDetails?.city}</strong>
                  </div>

                  <div className="text-right">
                    <span className="text-stone-400 block text-[10px]">Total Cash on Delivery</span>
                    <span className="font-serif font-bold text-base text-brand-700">Rs. {Number(totalAmt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
