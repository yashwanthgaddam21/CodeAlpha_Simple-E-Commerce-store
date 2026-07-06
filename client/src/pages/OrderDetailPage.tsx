import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, MapPin, CreditCard, XCircle, Clock, CheckCircle, Truck } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { formatCurrency, formatDateTime, getOrderStatusColor, getImageUrl } from '../utils';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  processing: <Package className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        const o = await orderService.getOrderById(id);
        setOrder(o);
      } catch {
        toast.error('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleCancel = async () => {
    if (!order || !window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(order._id, 'Cancelled by customer');
      setOrder(updated);
      toast.success('Order cancelled successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading order details..." />
    </div>
  );

  if (!order) return (
    <div className="text-center py-20">
      <p className="text-[var(--text-muted)]">Order not found.</p>
      <Link to="/orders" className="btn btn-primary mt-4">Back to Orders</Link>
    </div>
  );

  const canCancel = ['pending', 'processing'].includes(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/orders" className="text-sm text-primary-600 hover:underline mb-2 block">← Back to Orders</Link>
          <h1 className="font-display text-2xl font-bold text-[var(--text)]">{order.orderNumber}</h1>
          <p className="text-[var(--text-muted)] text-sm">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`${getOrderStatusColor(order.orderStatus)} px-3 py-1`}>
            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
          </span>
          {canCancel && (
            <button onClick={handleCancel} disabled={cancelling} className="btn btn-danger btn-sm">
              {cancelling ? <LoadingSpinner size="sm" /> : <><XCircle className="w-4 h-4" />Cancel</>}
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="card p-5">
            <h2 className="font-semibold text-[var(--text)] mb-4">Order Items ({order.items.length})</h2>
            <div className="divide-y divide-[var(--border)]">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=80'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text)] text-sm truncate">{item.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <span className="font-semibold text-[var(--text)]">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Timeline */}
          {order.statusHistory?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-[var(--text)] mb-4">Order Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[var(--border)]" />
                <div className="space-y-4">
                  {order.statusHistory.map((s, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${
                        i === order.statusHistory.length - 1
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)]'
                      }`}>
                        {STATUS_ICONS[s.status] || <Package className="w-4 h-4" />}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-semibold text-[var(--text)] capitalize">{s.status}</p>
                        {s.note && <p className="text-xs text-[var(--text-muted)]">{s.note}</p>}
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDateTime(s.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {/* Price Summary */}
          <div className="card p-5">
            <h2 className="font-semibold text-[var(--text)] mb-4">Price Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Shipping</span><span className={order.shippingCost === 0 ? 'text-green-600' : ''}>{order.shippingCost === 0 ? 'FREE' : formatCurrency(order.shippingCost)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Tax</span><span>{formatCurrency(order.tax)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-[var(--border)] pt-3 mt-2">
                <span>Total</span><span className="text-primary-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary-600" />
              <h2 className="font-semibold text-[var(--text)]">Shipping Address</h2>
            </div>
            <div className="text-sm text-[var(--text-muted)] space-y-0.5">
              <p className="font-medium text-[var(--text)]">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-primary-600" />
              <h2 className="font-semibold text-[var(--text)]">Payment</h2>
            </div>
            <div className="text-sm space-y-1">
              <p className="text-[var(--text-muted)]">Method: <span className="text-[var(--text)] font-medium uppercase">{order.paymentMethod}</span></p>
              <p className="text-[var(--text-muted)]">Status: <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
