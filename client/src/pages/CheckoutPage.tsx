import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { CheckCircle, MapPin, ShoppingBag, CreditCard, Package, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { Address } from '../types';
import { formatCurrency, getImageUrl } from '../utils';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const TAX_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

const STEPS = ['Address', 'Summary', 'Payment', 'Confirmation'];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'upi'>('cod');
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<Address>();

  const items = cart?.items || [];
  const subtotal = cart?.totalPrice || 0;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const total = subtotal + tax + shippingCost;

  if (items.length === 0 && step < 3) {
    navigate('/cart');
    return null;
  }

  const onAddressSubmit = (data: Address) => {
    setShippingAddress(data);
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) return;
    setPlacing(true);
    try {
      const order = await orderService.placeOrder({ shippingAddress, paymentMethod });
      setOrderId(order._id);
      setOrderNumber(order.orderNumber);
      await clearCart();
      setStep(3);
      toast.success('Order placed successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-12">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-primary-600 text-white ring-4 ring-primary-200 dark:ring-primary-900' :
                'bg-[var(--input-bg)] text-[var(--text-muted)] border border-[var(--border)]'
              }`}>
                {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-primary-600' : 'text-[var(--text-muted)]'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-green-500' : 'bg-[var(--border)]'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Address */}
        {step === 0 && (
          <motion.div key="address" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--text)]">Shipping Address</h2>
                  <p className="text-sm text-[var(--text-muted)]">Where should we deliver?</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Full Name</label>
                    <input {...register('fullName', { required: 'Full name is required' })} className={`input ${errors.fullName ? 'border-red-500' : ''}`} placeholder="John Doe" />
                    {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="label">Phone Number</label>
                    <input {...register('phone', { required: 'Phone is required' })} className={`input ${errors.phone ? 'border-red-500' : ''}`} placeholder="+91 9876543210" />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Address Line 1</label>
                  <input {...register('addressLine1', { required: 'Address is required' })} className={`input ${errors.addressLine1 ? 'border-red-500' : ''}`} placeholder="House no, Street, Colony" />
                  {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1.message}</p>}
                </div>
                <div className="form-group">
                  <label className="label">Address Line 2 <span className="text-[var(--text-muted)]">(optional)</span></label>
                  <input {...register('addressLine2')} className="input" placeholder="Landmark, Area" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="label">City</label>
                    <input {...register('city', { required: 'City is required' })} className={`input ${errors.city ? 'border-red-500' : ''}`} placeholder="Mumbai" />
                    {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="label">State</label>
                    <input {...register('state', { required: 'State is required' })} className={`input ${errors.state ? 'border-red-500' : ''}`} placeholder="Maharashtra" />
                    {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="label">Postal Code</label>
                    <input {...register('postalCode', { required: 'Postal code is required' })} className={`input ${errors.postalCode ? 'border-red-500' : ''}`} placeholder="400001" />
                    {errors.postalCode && <p className="text-red-500 text-xs">{errors.postalCode.message}</p>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Country</label>
                  <input {...register('country')} defaultValue="India" className="input" />
                </div>
                <button type="submit" className="btn btn-primary w-full btn-lg mt-4">
                  Continue to Summary <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Step 1: Summary */}
        {step === 1 && (
          <motion.div key="summary" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--text)]">Order Summary</h2>
                  <p className="text-sm text-[var(--text-muted)]">Review your order before payment</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4 items-center p-3 bg-[var(--input-bg)] rounded-xl">
                    <img src={getImageUrl(item.image)} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{item.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-[var(--text)]">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-[var(--border)] pt-4 mb-6">
                <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Shipping</span><span className={shippingCost === 0 ? 'text-green-600' : ''}>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">Tax (18% GST)</span><span>{formatCurrency(tax)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t border-[var(--border)] pt-3 mt-3">
                  <span>Total</span><span className="text-primary-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="bg-[var(--input-bg)] rounded-xl p-4 mb-6">
                <h4 className="text-sm font-semibold text-[var(--text)] mb-2">Shipping to:</h4>
                <p className="text-sm text-[var(--text-muted)]">{shippingAddress?.fullName}</p>
                <p className="text-sm text-[var(--text-muted)]">{shippingAddress?.addressLine1}{shippingAddress?.addressLine2 ? `, ${shippingAddress.addressLine2}` : ''}</p>
                <p className="text-sm text-[var(--text-muted)]">{shippingAddress?.city}, {shippingAddress?.state} - {shippingAddress?.postalCode}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn btn-secondary flex-1">← Back</button>
                <button onClick={() => setStep(2)} className="btn btn-primary flex-1">Continue to Payment →</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <motion.div key="payment" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--text)]">Payment Method</h2>
                  <p className="text-sm text-[var(--text-muted)]">Choose how you'd like to pay</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                  { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay (Simulated)', icon: '💳' },
                  { value: 'upi', label: 'UPI Payment', desc: 'PhonePe, GPay, Paytm (Simulated)', icon: '📱' },
                ].map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setPaymentMethod(m.value as any)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      paymentMethod === m.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-[var(--border)] hover:border-primary-300'
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--text)] text-sm">{m.label}</p>
                      <p className="text-xs text-[var(--text-muted)]">{m.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === m.value ? 'border-primary-600' : 'border-[var(--border)]'
                    }`}>
                      {paymentMethod === m.value && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 bg-[var(--input-bg)] rounded-2xl mb-4">
                  <input className="input" placeholder="Card number (simulated)" defaultValue="4111 1111 1111 1111" readOnly />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input" placeholder="MM/YY" defaultValue="12/28" readOnly />
                    <input className="input" placeholder="CVV" defaultValue="123" readOnly />
                  </div>
                  <input className="input" placeholder="Cardholder name" defaultValue="Demo User" readOnly />
                  <p className="text-xs text-[var(--text-muted)]">⚠️ This is a simulated payment — no real charges will be made.</p>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="p-4 bg-[var(--input-bg)] rounded-2xl mb-4">
                  <input className="input" placeholder="UPI ID" defaultValue="demo@upi" readOnly />
                  <p className="text-xs text-[var(--text-muted)] mt-2">⚠️ This is a simulated payment — no real charges will be made.</p>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total to Pay</span><span className="text-primary-600">{formatCurrency(total)}</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn btn-secondary flex-1">← Back</button>
                <button onClick={handlePlaceOrder} disabled={placing} className="btn btn-primary flex-1">
                  {placing ? <><LoadingSpinner size="sm" /> Placing Order...</> : 'Place Order 🎉'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="card p-10 sm:p-14">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-[var(--text)] mb-2">Order Placed! 🎉</h2>
              {orderNumber && (
                <p className="text-[var(--text-muted)] mb-1">Order Number: <span className="font-bold text-[var(--text)]">{orderNumber}</span></p>
              )}
              <p className="text-[var(--text-muted)] mb-8">
                Thank you for your purchase! We'll send you an update when your order ships.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => navigate('/orders')} className="btn btn-primary btn-lg">
                  <Package className="w-5 h-5" />View My Orders
                </button>
                <button onClick={() => navigate('/products')} className="btn btn-secondary btn-lg">
                  Continue Shopping
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;
