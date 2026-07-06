import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, getImageUrl } from '../utils';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TAX_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

const CartPage: React.FC = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const subtotal = cart?.totalPrice || 0;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const total = subtotal + tax + shippingCost;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading cart..." />
    </div>
  );

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="font-display text-3xl font-bold text-[var(--text)] mb-3">Your cart is empty</h2>
        <p className="text-[var(--text-muted)] mb-8">Looks like you haven't added anything to your cart yet. Start shopping and discover great products!</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          <ShoppingBag className="w-5 h-5" />Start Shopping
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-8">
        Shopping Cart <span className="text-[var(--text-muted)] font-normal text-xl">({items.length} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="card p-4"
              >
                <div className="flex gap-4 items-start">
                  <Link to={`/products/${typeof item.product === 'string' ? '' : (item.product as any).slug || ''}`} className="flex-shrink-0">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl bg-slate-100 dark:bg-slate-800"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=100'; }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text)] text-sm leading-snug mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-primary-600 font-bold text-lg">{formatCurrency(item.price)}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 hover:bg-[var(--input-bg)] transition-colors disabled:opacity-40"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold text-[var(--text)] min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-2 hover:bg-[var(--input-bg)] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[var(--text)]">{formatCurrency(item.price * item.quantity)}</span>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="btn-icon text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue Shopping */}
          <Link to="/products" className="btn btn-secondary w-full sm:w-auto gap-2">
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-24 space-y-4">
            <h2 className="font-semibold text-[var(--text)] text-lg">Order Summary</h2>

            {/* Promo */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input type="text" placeholder="Promo code" className="input pl-10" />
              </div>
              <button className="btn btn-secondary btn-sm">Apply</button>
            </div>

            <div className="space-y-3 pt-3 border-t border-[var(--border)]">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span className="text-[var(--text)]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-medium' : 'text-[var(--text)]'}>
                  {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Tax (18% GST)</span>
                <span className="text-[var(--text)]">{formatCurrency(tax)}</span>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-xs text-primary-700 dark:text-primary-300">
                  Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping!
                </div>
              )}
            </div>

            <div className="flex justify-between font-bold text-lg pt-3 border-t border-[var(--border)]">
              <span className="text-[var(--text)]">Total</span>
              <span className="text-primary-600">{formatCurrency(total)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary w-full btn-lg"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-xs text-center text-[var(--text-muted)]">
              🔒 Secure checkout powered by industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
