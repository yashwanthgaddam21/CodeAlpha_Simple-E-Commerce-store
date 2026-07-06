import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Category } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const cats = await adminService.getCategories();
      setCategories(cats);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openNew = () => {
    setEditingCat(null);
    setForm({ name: '', description: '' });
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setForm({ name: cat.name, description: cat.description || '' });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      if (imageFile) fd.append('image', imageFile);

      if (editingCat) {
        const updated = await adminService.updateCategory(editingCat._id, fd);
        setCategories((prev) => prev.map((c) => c._id === editingCat._id ? updated : c));
        toast.success('Category updated!');
      } else {
        const created = await adminService.createCategory(fd);
        setCategories((prev) => [...prev, created]);
        toast.success('Category created!');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category? This will fail if it has associated products.')) return;
    try {
      await adminService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success('Category deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const CATEGORY_ICONS: Record<string, string> = { electronics: '💻', fashion: '👗', 'home-living': '🏠', 'sports-fitness': '⚽', books: '📚' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text)]">Categories</h1>
          <p className="text-[var(--text-muted)]">{categories.length} categories</p>
        </div>
        <button onClick={openNew} className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center text-3xl flex-shrink-0">
                {CATEGORY_ICONS[cat.slug] || '🛍️'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--text)]">{cat.name}</h3>
                <p className="text-xs text-[var(--text-muted)] truncate">{cat.description || 'No description'}</p>
                <p className="text-xs text-primary-600 mt-0.5">/{cat.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(cat)} className="btn-icon btn-ghost text-primary-600">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="btn-icon btn-ghost text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--bg-card)] rounded-2xl w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="font-display text-lg font-bold text-[var(--text)]">
                {editingCat ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setShowForm(false)} className="btn-icon btn-ghost"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="form-group">
                <label className="label">Category Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="e.g., Electronics" required />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" rows={2} placeholder="Category description" />
              </div>
              <div className="form-group">
                <label className="label">Category Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="input" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
                  {submitting ? <LoadingSpinner size="sm" /> : editingCat ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
