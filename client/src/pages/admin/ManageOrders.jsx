import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Clock, Truck, Filter } from 'lucide-react';
import API from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-100">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
            LOGISTICS CONTROL
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Manage Orders Pipeline
          </h1>
        </div>

        {loading ? (
          <Loader label="Fetching customer orders..." />
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 uppercase font-bold text-[10px] text-stone-500">
                  <tr>
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer & Address</th>
                    <th className="p-4">Items Summary</th>
                    <th className="p-4">Total COD Amount</th>
                    <th className="p-4">Current Pipeline Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-stone-900 block">#{o._id}</span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(o.createdAt).toLocaleString()}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-stone-900 block">
                          {o.shippingDetails?.name || o.customer?.name}
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          Phone: {o.shippingDetails?.phone}
                        </span>
                        <span className="text-[10px] text-stone-400 line-clamp-1">
                          {o.shippingDetails?.address}, {o.shippingDetails?.city}
                        </span>
                      </td>

                      <td className="p-4 space-y-1">
                        {o.items?.map((it, idx) => (
                          <div key={idx} className="text-[11px] text-stone-600">
                            • {it.productName} ({it.selectedColor}, {it.selectedSize}) × {it.quantity}
                          </div>
                        ))}
                      </td>

                      <td className="p-4 font-serif font-bold text-stone-900 text-sm">
                        Rs. {o.totalAmount?.toLocaleString()}
                      </td>

                      <td className="p-4">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-semibold text-xs focus:ring-2 focus:ring-brand-600 outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
