import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, ClipboardList, Users, TrendingUp, ShieldAlert } from 'lucide-react';
import API from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/dashboard-stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-100">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
            Real-Time Analytics
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Admin Overview Dashboard
          </h1>
        </div>

        {loading ? (
          <Loader label="Computing store statistics..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-semibold uppercase">Total Revenue (COD)</span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="font-serif text-2xl font-bold text-stone-900">
                Rs. {stats?.totalRevenue?.toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-semibold uppercase">Total Orders Booked</span>
                <ClipboardList className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-serif text-2xl font-bold text-stone-900">
                {stats?.totalOrders}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-semibold uppercase">Pending Orders</span>
                <ShieldAlert className="w-5 h-5 text-amber-600" />
              </div>
              <p className="font-serif text-2xl font-bold text-stone-900">
                {stats?.pendingOrders}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-400">
                <span className="text-xs font-semibold uppercase">Registered Customers</span>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="font-serif text-2xl font-bold text-stone-900">
                {stats?.totalCustomers}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
