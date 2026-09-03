import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import API from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function ManageInquiries() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/contact-messages');
      setMessages(data);
    } catch (err) {
      console.error('Failed to load contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer message?')) return;
    try {
      await API.delete(`/admin/contact-messages/${id}`);
      toast.success('Message deleted successfully');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-100">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
            CUSTOMER HELP DESK
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Contact Messages & Inquiries ({messages.length})
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            View customer messages submitted via the Contact Us page.
          </p>
        </div>

        {loading ? (
          <Loader label="Fetching customer inquiries..." />
        ) : messages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 space-y-3">
            <MessageSquare className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-stone-800">No Customer Inquiries Yet</h3>
            <p className="text-xs text-stone-500">Messages submitted by users on Contact Us page will show up here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m._id}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3 relative group"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-100 pb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center">
                      {m.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{m.name}</h4>
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-stone-400" /> {m.email}</span>
                        {m.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-stone-400" /> {m.phone}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <p className="text-xs text-stone-700 leading-relaxed font-light whitespace-pre-wrap">
                    "{m.message}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
