import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag, ArrowRight, Truck, Shield, RefreshCw, HeadphonesIcon,
  Star, ChevronDown, Zap, Award, TrendingUp, Users
} from 'lucide-react';
import { productService } from '../services/productService';
import { adminService } from '../services/adminService';
import { Product, Category } from '../types';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getImageUrl } from '../utils';

const CATEGORY_ICONS: Record<string, string> = {
  electronics: '💻',
  fashion: '👗',
  'home-living': '🏠',
  'sports-fitness': '⚽',
  books: '📚',
};

const HomePage: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredData, categoriesData] = await Promise.all([
          productService.getFeaturedProducts(),
          adminService.getCategories(),
        ]);
        setFeatured(featuredData);
        setCategories(categoriesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const testimonials = [
    { name: 'Ananya Krishnan', role: 'Fashion Blogger', rating: 5, text: 'ShopNest has completely changed how I shop online. The quality is incredible and delivery is always on time!', avatar: 'https://ui-avatars.com/api/?name=Ananya+K&background=7c3aed&color=fff' },
    { name: 'Rahul Mehta', role: 'Tech Enthusiast', rating: 5, text: 'Amazing selection of electronics at the best prices. The return policy is hassle-free and customer support is excellent.', avatar: 'https://ui-avatars.com/api/?name=Rahul+M&background=2563eb&color=fff' },
    { name: 'Priya Sharma', role: 'Home Decorator', rating: 5, text: 'Found my dream furniture pieces here! The product descriptions are accurate and shipping was faster than expected.', avatar: 'https://ui-avatars.com/api/?name=Priya+S&background=059669&color=fff' },
  ];

  const faqs = [
    { q: 'How long does delivery take?', a: 'Standard delivery takes 3-7 business days. Express delivery is available for select pincodes and takes 1-2 business days.' },
    { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy. Simply initiate a return from your order history and we will arrange a pickup.' },
    { q: 'Are the products genuine?', a: 'Absolutely! We source all our products directly from authorized distributors and brands. Every product comes with original warranty.' },
    { q: 'Do you offer Cash on Delivery?', a: 'Yes! We offer Cash on Delivery for all orders. You can also pay by card or UPI at checkout.' },
    { q: 'How can I track my order?', a: 'Once your order is shipped, you will receive an SMS and email with tracking details. You can also track it from the My Orders section.' },
  ];

  const reasons = [
    { icon: Truck, title: 'Free Shipping', desc: 'Free delivery on all orders above ₹999', color: 'from-blue-500 to-cyan-500' },
    { icon: Shield, title: 'Secure Payments', desc: 'Your payment information is always safe', color: 'from-green-500 to-emerald-500' },
    { icon: RefreshCw, title: '30-Day Returns', desc: 'Easy hassle-free returns and exchanges', color: 'from-orange-500 to-amber-500' },
    { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Round the clock customer assistance', color: 'from-purple-500 to-violet-500' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="badge bg-primary-900/60 text-primary-300 border border-primary-700/50 backdrop-blur-sm px-3 py-1.5">
                  🎉 New arrivals every week
                </span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                Shop the{' '}
                <span className="gradient-text">Future</span>{' '}
                Today
              </h1>
              <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
                Discover thousands of premium products from top brands. Unbeatable prices, lightning-fast delivery, and a seamless shopping experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="btn btn-primary btn-lg group">
                  <ShoppingBag className="w-5 h-5" />
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products?sort=-ratings" className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5" />
                  Trending Now
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-white">{val}</div>
                    <div className="text-sm text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=300',
                  'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300',
                  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
                  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=300',
                ].map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={`rounded-2xl overflow-hidden ${i === 0 ? 'aspect-square' : i === 1 ? 'aspect-video' : i === 2 ? 'aspect-video' : 'aspect-square'} glass`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover opacity-80" />
                  </motion.div>
                ))}
              </div>
              {/* Floating badge */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 text-white"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-xs text-white/70">Today's Deal</p>
                    <p className="font-bold text-sm">Up to 30% OFF</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== REASONS / WHY US ===== */}
      <section className="py-16 bg-[var(--bg-card)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <r.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)] text-sm">{r.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Shop by <span className="gradient-text">Category</span>
          </motion.h2>
          <p className="section-subtitle mt-3">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/products?category=${cat._id}`}
                className="group flex flex-col items-center gap-4 p-6 card-hover text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {CATEGORY_ICONS[cat.slug] || '🛍️'}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)] text-sm group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-20 bg-[var(--input-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.h2 className="section-title" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                Featured <span className="gradient-text">Products</span>
              </motion.h2>
              <p className="section-subtitle">Handpicked selections just for you</p>
            </div>
            <Link to="/products" className="btn btn-secondary hidden sm:flex gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size="lg" text="Loading products..." /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 8).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/products" className="btn btn-primary btn-lg">
              Explore All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-accent-600 p-10 sm:p-16">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Award className="w-6 h-6" />
                <span className="font-semibold text-white/90">Special Offer</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">Get 20% off your first order</h2>
              <p className="text-white/80 text-lg mb-8">Use code <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">WELCOME20</span> at checkout</p>
              <Link to="/register" className="btn btn-lg bg-white text-primary-700 hover:bg-white/90 shadow-xl font-bold">
                Claim Your Discount
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-[var(--input-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              What our customers <span className="gradient-text">say</span>
            </motion.h2>
            <p className="section-subtitle">Trusted by thousands of happy shoppers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-6"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-[var(--text)] text-sm">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
          <p className="section-subtitle">Got a question? We've got answers.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-[var(--text)] text-sm">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] flex-shrink-0 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-5 text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-4"
                >
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 bg-gradient-to-b from-[var(--bg)] to-slate-900 dark:to-slate-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-4">
              Ready to start shopping?
            </h2>
            <p className="text-slate-400 text-lg mb-8">Join thousands of satisfied customers. Create your free account today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary btn-lg">
                <Users className="w-5 h-5" />Get Started Free
              </Link>
              <Link to="/products" className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm">
                <ShoppingBag className="w-5 h-5" />Browse Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
