import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Layers } from 'lucide-react';
import API from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ProductModal from '../../components/admin/ProductModal';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, formData);
        toast.success('Product updated successfully!');
      } else {
        await API.post('/products', formData);
        toast.success('New product added to catalog!');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to save product details.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-100">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
              CATALOG MANAGER
            </span>
            <h1 className="font-serif text-3xl font-bold text-stone-900">
              Manage Products & Inventory
            </h1>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-brand-600 transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Outfit</span>
          </button>
        </div>

        {loading ? (
          <Loader label="Loading product table..." />
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 uppercase font-bold text-[10px] text-stone-500">
                  <tr>
                    <th className="p-4">Outfit</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (PKR)</th>
                    <th className="p-4">Colors</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => {
                    const firstImage = p.colors?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80';
                    return (
                      <tr key={p._id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={firstImage}
                              alt={p.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80';
                              }}
                              className="w-12 h-14 object-cover rounded-lg bg-stone-100"
                            />
                            <div>
                              <span className="font-bold text-stone-900 text-sm block">{p.name}</span>
                              <span className="text-[11px] text-stone-400 line-clamp-1">{p.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-stone-100 font-semibold text-stone-800">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-serif font-bold text-stone-900">
                          Rs. {p.basePrice?.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            {p.colors?.map((c, i) => (
                              <span
                                key={i}
                                className="w-4 h-4 rounded-full border border-stone-300 inline-block"
                                style={{ backgroundColor: c.colorCode }}
                                title={c.colorName}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          {p.featured ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">YES</span>
                          ) : (
                            <span className="text-stone-400">NO</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-2 text-stone-600 hover:text-brand-600 transition-colors"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ProductModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={editingProduct}
        />
      </main>
    </div>
  );
}
