import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Zap, ChevronLeft, ChevronRight, Minus, Plus,
  Package, Truck, Shield, Star, MessageSquare, CheckCircle, AlertCircle
} from 'lucide-react';
import { productService } from '../services/productService';
import { adminService } from '../services/adminService';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getImageUrl, formatDate } from '../utils';
import StarRating from '../components/common/StarRating';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const { product: p, related: r } = await productService.getProductBySlug(slug);
        setProduct(p);
        setRelated(r);
        // Also fetch reviews separately for live updates
        const reviewData = await adminService.getReviews(p._id);
        setReviews(reviewData.data || []);
      } catch {
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    setSelectedImage(0);
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => addToCart(product!._id, quantity);

  const handleBuyNow = async () => {
    await addToCart(product!._id, quantity);
    navigate('/cart');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    if (!reviewForm.title || !reviewForm.comment) { toast.error('Please fill all fields'); return; }
    setSubmittingReview(true);
    try {
      const newReview = await adminService.addReview({ productId: product!._id, ...reviewForm });
      setReviews((prev) => [newReview, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" text="Loading product..." />
    </div>
  );

  if (!product) return null;

  const displayPrice = product.discountPercentage > 0 ? product.discountPrice : product.price;
  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-600">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category._id}`} className="hover:text-primary-600">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--text)] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Section */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square card overflow-hidden bg-slate-100 dark:bg-slate-800">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={getImageUrl(images[selectedImage])}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-contain p-4"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600'; }}
              />
            </AnimatePresence>
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 badge bg-red-500 text-white font-bold">
                -{product.discountPercentage}%
              </span>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 btn-icon btn-secondary shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn-icon btn-secondary shadow-md"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-primary-500 shadow-glow' : 'border-[var(--border)] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=80'; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-1">{product.brand}</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text)] leading-tight">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={product.ratings} size="lg" />
            <span className="font-bold text-[var(--text)]">{product.ratings.toFixed(1)}</span>
            <span className="text-[var(--text-muted)] text-sm">({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 p-4 bg-[var(--input-bg)] rounded-2xl">
            <span className="font-display text-3xl font-black text-[var(--text)]">{formatCurrency(displayPrice)}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-lg text-[var(--text-muted)] line-through">{formatCurrency(product.price)}</span>
                <span className="badge bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 font-bold">
                  Save {formatCurrency(product.price - displayPrice)}
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium text-sm">
                  In Stock{product.stock <= 10 ? ` — Only ${product.stock} left!` : ''}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-500 font-medium text-sm">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity + Actions */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[var(--text)]">Quantity:</span>
                <div className="flex items-center gap-2 border border-[var(--border)] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 hover:bg-[var(--input-bg)] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-[var(--text)]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2.5 hover:bg-[var(--input-bg)] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddToCart} className="btn btn-secondary flex-1 gap-2">
                  <ShoppingCart className="w-4 h-4" />Add to Cart
                </button>
                <button onClick={handleBuyNow} className="btn btn-primary flex-1 gap-2">
                  <Zap className="w-4 h-4" />Buy Now
                </button>
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border)]">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'Above ₹999' },
              { icon: Shield, label: 'Secure Pay', sub: 'Encrypted' },
              { icon: Package, label: 'Easy Returns', sub: '30 days' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 text-center p-3 bg-[var(--input-bg)] rounded-xl">
                <b.icon className="w-5 h-5 text-primary-600" />
                <span className="text-xs font-semibold text-[var(--text)]">{b.label}</span>
                <span className="text-xs text-[var(--text-muted)]">{b.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-10">
        <div className="flex border-b border-[var(--border)]">
          {(['description', 'specs', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${reviews.length})` : tab === 'specs' ? 'Specifications' : 'Description'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'description' && (
            <p className="text-[var(--text-muted)] leading-relaxed">{product.description}</p>
          )}

          {activeTab === 'specs' && (
            product.specifications?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-[var(--input-bg)] rounded-xl">
                    <span className="font-semibold text-[var(--text)] text-sm w-32 flex-shrink-0">{spec.key}:</span>
                    <span className="text-[var(--text-muted)] text-sm">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-muted)]">No specifications available.</p>
            )
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {user && (
                <form onSubmit={handleSubmitReview} className="card p-5 space-y-4 bg-[var(--input-bg)]">
                  <h3 className="font-semibold text-[var(--text)]">Write a Review</h3>
                  <div>
                    <label className="label">Your Rating</label>
                    <StarRating
                      rating={reviewForm.rating}
                      size="lg"
                      interactive
                      onRate={(r) => setReviewForm((f) => ({ ...f, rating: r }))}
                    />
                  </div>
                  <input
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Review title"
                    className="input"
                    required
                  />
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience with this product..."
                    rows={3}
                    className="input resize-none"
                    required
                  />
                  <button type="submit" disabled={submittingReview} className="btn btn-primary">
                    {submittingReview ? <LoadingSpinner size="sm" /> : 'Submit Review'}
                  </button>
                </form>
              )}

              {reviews.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                  <p className="text-[var(--text-muted)]">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="border-b border-[var(--border)] pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name)}&background=3b82f6&color=fff`}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-[var(--text)] text-sm">{review.user.name}</span>
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-xs text-[var(--text-muted)] ml-auto">{formatDate(review.createdAt)}</span>
                        </div>
                        <h4 className="font-medium text-[var(--text)] text-sm mb-1">{review.title}</h4>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
