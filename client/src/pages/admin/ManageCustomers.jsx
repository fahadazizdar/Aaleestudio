import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Shield, Mail, Phone } from 'lucide-react';
import API from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/customers');
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const { data } = await API.put(`/admin/customers/${id}/status`);
      toast.success(data.message);
      fetchCustomers();
    } catch (err) {
      toast.error('Failed to update customer status');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-100">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
            USER ACCOUNT ACCESS CONTROL
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Manage Registered Customers
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Toggle account active/deactive status. Deactivated users cannot log in or place orders.
          </p>
        </div>

        {loading ? (
          <Loader label="Fetching customer directory..." />
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 uppercase font-bold text-[10px] text-stone-500">
                  <tr>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Access Control Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-700 font-bold flex items-center justify-center text-sm border border-stone-200">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 text-sm block">{c.name}</span>
                            <span className="text-[11px] text-stone-400">{c.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-xs text-stone-700">
                        {c.phone || 'N/A'}
                      </td>

                      <td className="p-4">
                        {c.isActive !== false ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                            <UserCheck className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold text-[11px]">
                            <UserX className="w-3.5 h-3.5" /> Deactive (Restricted)
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(c._id, c.isActive)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                            c.isActive !== false
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {c.isActive !== false ? 'Deactivate Account' : 'Activate Account'}
                        </button>
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
