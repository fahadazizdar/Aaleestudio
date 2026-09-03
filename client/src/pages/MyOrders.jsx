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
        setOrders(data);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader label="Fetching your order history..." />;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">Pending Confirmation</span>;
      case 'Confirmed':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full">Order Confirmed</span>;
      case 'Shipped':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-1 rounded-full">Out For Delivery</span>;
      case 'Delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">Delivered</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
          CUSTOMER PORTAL
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          My Booked Orders
        </h1>
        <p className="text-xs text-stone-500">
          Real-time delivery status for account <strong>{user?.email}</strong>.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-4">
          <Package className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800">No Orders Placed Yet</h3>
          <p className="text-xs text-stone-500">Book your first Cash on Delivery order from our store catalog.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div key={ord._id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-100 pb-4 gap-2">
                <div>
                  <span className="text-xs font-bold text-stone-900">Order #{ord._id}</span>
                  <span className="text-[11px] text-stone-400 block">
                    Booked on {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>{getStatusBadge(ord.orderStatus)}</div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt={item.productName} className="w-12 h-14 object-cover rounded-lg bg-stone-100" />
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
                  <span className="font-serif font-bold text-base text-brand-700">Rs. {ord.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
