import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, Grid, List } from 'lucide-react';
import { productService } from '../services/productService';
import { adminService } from '../services/adminService';
import { Product, Category } from '../types';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'discountPrice', label: 'Price: Low to High' },
  { value: '-discountPrice', label: 'Price: High to Low' },
  { value: '-ratings', label: 'Top Rated' },
  { value: '-numReviews', label: 'Most Reviewed' },
];

const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="skeleton aspect-square" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-8 w-full rounded-xl" />
    </div>
  </div>
);

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter state derived from URL params
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  const page = parseInt(searchParams.get('page') || '1');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';

  // Local state for price inputs (not committed until Apply)
  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await productService.getProducts({
        search, category, sort, page,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        rating: rating ? Number(rating) : undefined,
      });
      setProducts(result.data);
      setTotal(result.total || 0);
      setPages(result.pages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page, minPrice, maxPrice, rating]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    adminService.getCategories().then(setCategories).catch(() => {});
  }, []);

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceMin('');
    setPriceMax('');
  };

  const hasFilters = search || category || minPrice || maxPrice || rating;

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (priceMin) params.set('minPrice', priceMin); else params.delete('minPrice');
    if (priceMax) params.set('maxPrice', priceMax); else params.delete('maxPrice');
    params.delete('page');
    setSearchParams(params);
    setSidebarOpen(false);
  };

  const Filters = () => (
    <aside className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-[var(--text)] mb-3 text-sm uppercase tracking-wide">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('category', '')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
              !category ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 font-medium' : 'text-[var(--text-muted)] hover:bg-[var(--input-bg)]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateParam('category', cat._id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                category === cat._id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 font-medium' : 'text-[var(--text-muted)] hover:bg-[var(--input-bg)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-[var(--text)] mb-3 text-sm uppercase tracking-wide">Price Range</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="input w-full"
          />
          <span className="text-[var(--text-muted)]">—</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="input w-full"
          />
        </div>
        <button onClick={applyPriceFilter} className="btn btn-primary w-full mt-3 btn-sm">Apply</button>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-[var(--text)] mb-3 text-sm uppercase tracking-wide">Min Rating</h3>
        <div className="space-y-1">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => updateParam('rating', rating === String(r) ? '' : String(r))}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors ${
                rating === String(r) ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 font-medium' : 'text-[var(--text-muted)] hover:bg-[var(--input-bg)]'
              }`}
            >
              <span className="text-yellow-400">{'★'.repeat(r)}</span>
              <span>& above</span>
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearAllFilters} className="btn btn-danger w-full btn-sm">
          <X className="w-4 h-4" />Clear All Filters
        </button>
      )}
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-2">
          {search ? `Results for "${search}"` : category ? categories.find(c => c._id === category)?.name || 'Products' : 'All Products'}
        </h1>
        <p className="text-[var(--text-muted)]">{total} product{total !== 1 ? 's' : ''} found</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = (e.target as HTMLFormElement).q.value;
            updateParam('search', q);
          }}
          className="flex items-center gap-2 flex-1 max-w-md"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              name="q"
              defaultValue={search}
              type="text"
              placeholder="Search products..."
              className="input pl-10"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden btn btn-secondary btn-sm gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {hasFilters && <span className="w-2 h-2 bg-primary-600 rounded-full" />}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="input pr-8 appearance-none cursor-pointer text-sm min-w-[160px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-60 flex-shrink-0">
          <div className="card p-5 sticky top-24">
            <Filters />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                className="fixed left-0 top-0 bottom-0 w-72 card z-50 p-5 overflow-y-auto lg:hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-[var(--text)]">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)} className="btn-icon btn-ghost">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <Filters />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-2">No products found</h3>
              <p className="text-[var(--text-muted)] mb-6">Try adjusting your filters or search term</p>
              <button onClick={clearAllFilters} className="btn btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => updateParam('page', String(Math.max(1, page - 1)))}
                    disabled={page === 1}
                    className="btn btn-secondary btn-sm disabled:opacity-40"
                  >
                    ←
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParam('page', String(p))}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                        p === page ? 'bg-primary-600 text-white' : 'btn btn-secondary'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => updateParam('page', String(Math.min(pages, page + 1)))}
                    disabled={page === pages}
                    className="btn btn-secondary btn-sm disabled:opacity-40"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
