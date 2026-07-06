import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X, CheckCircle } from 'lucide-react';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';
import { Product, Category } from '../../types';
import { formatCurrency, getImageUrl, formatDateShort } from '../../utils';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPercentage: '0',
    category: '', brand: '', stock: '', isFeatured: false,
    specifications: [{ key: '', value: '' }],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await productService.getProducts({ search, limit: 50 } as any);
      setProducts(result.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search]);
  useEffect(() => { adminService.getCategories().then(setCategories).catch(() => {}); }, []);

  const openNew = () => {
    setEditingProduct(null);
    setForm({ name: '', description: '', price: '', discountPercentage: '0', category: '', brand: '', stock: '', isFeatured: false, specifications: [{ key: '', value: '' }] });
    setImageFiles([]);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name, description: p.description, price: String(p.price),
      discountPercentage: String(p.discountPercentage), category: p.category._id,
      brand: p.brand, stock: String(p.stock), isFeatured: p.isFeatured,
      specifications: p.specifications?.length > 0 ? p.specifications : [{ key: '', value: '' }],
    });
    setImageFiles([]);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'specifications') formData.append(k, JSON.stringify(v));
        else if (k !== 'isFeatured') formData.append(k, String(v));
      });
      formData.append('isFeatured', String(form.isFeatured));
      imageFiles.forEach((f) => formData.append('images', f));

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, formData);
        toast.success('Product updated!');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const addSpec = () => setForm((f) => ({ ...f, specifications: [...f.specifications, { key: '', value: '' }] }));
  const removeSpec = (i: number) => setForm((f) => ({ ...f, specifications: f.specifications.filter((_, idx) => idx !== i) }));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) =>
    setForm((f) => ({ ...f, specifications: f.specifications.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text)]">Products</h1>
          <p className="text-[var(--text-muted)]">{products.length} products</p>
        </div>
        <button onClick={openNew} className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input pl-10"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]">
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Product</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Category</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Price</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Stock</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Featured</th>
                  <th className="text-right px-5 py-3 text-[var(--text-muted)] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {products.map((p) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-[var(--input-bg)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(p.images?.[0])}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=48'; }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--text)] truncate max-w-[200px]">{p.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[var(--text-muted)]">{p.category?.name}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[var(--text)]">{formatCurrency(p.discountPercentage > 0 ? p.discountPrice : p.price)}</p>
                      {p.discountPercentage > 0 && <p className="text-xs text-[var(--text-muted)] line-through">{formatCurrency(p.price)}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${p.stock > 10 ? 'badge-green' : p.stock > 0 ? 'badge-yellow' : 'badge-red'}`}>
                        {p.stock} left
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {p.isFeatured && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="btn-icon btn-ghost text-primary-600">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="btn-icon btn-ghost text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--bg-card)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)] sticky top-0 bg-[var(--bg-card)]">
              <h2 className="font-display text-xl font-bold text-[var(--text)]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowForm(false)} className="btn-icon btn-ghost">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Product Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Product name" required />
                </div>
                <div className="form-group">
                  <label className="label">Brand *</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input" placeholder="Brand name" required />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" rows={3} placeholder="Product description" required />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="label">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" placeholder="0" required min="0" />
                </div>
                <div className="form-group">
                  <label className="label">Discount %</label>
                  <input type="number" value={form.discountPercentage} onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} className="input" placeholder="0" min="0" max="100" />
                </div>
                <div className="form-group">
                  <label className="label">Stock *</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" placeholder="0" required min="0" />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input" required>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="featured" className="label mb-0 cursor-pointer">Mark as Featured</label>
              </div>
              <div className="form-group">
                <label className="label">Product Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  className="input"
                />
                {imageFiles.length > 0 && <p className="text-xs text-[var(--text-muted)] mt-1">{imageFiles.length} file(s) selected</p>}
                {editingProduct && editingProduct.images?.length > 0 && (
                  <p className="text-xs text-[var(--text-muted)] mt-1">Currently has {editingProduct.images.length} image(s). New files will be added.</p>
                )}
              </div>

              {/* Specifications */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="label mb-0">Specifications</label>
                  <button type="button" onClick={addSpec} className="btn btn-secondary btn-sm">+ Add</button>
                </div>
                <div className="space-y-2">
                  {form.specifications.map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={spec.key} onChange={(e) => updateSpec(i, 'key', e.target.value)} className="input w-2/5" placeholder="Key (e.g., Color)" />
                      <input value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} className="input flex-1" placeholder="Value" />
                      <button type="button" onClick={() => removeSpec(i)} className="btn-icon btn-ghost text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                  {submitting ? <LoadingSpinner size="sm" /> : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
