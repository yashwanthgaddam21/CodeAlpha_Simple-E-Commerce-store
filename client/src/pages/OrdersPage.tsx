import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, RotateCcw } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { formatCurrency, formatDateShort, getOrderStatusColor } from '../utils';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = async (p = 1) => {
    setLoading(true);
    try {
      const result = await orderService.getMyOrders(p);
      setOrders(result.data);
      setPages(result.pages || 1);
      setTotal(result.total || 0);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(page); }, [page]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading orders..." />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--text)]">My Orders</h1>
          <p className="text-[var(--text-muted)] mt-1">{total} order{total !== 1 ? 's' : ''} placed</p>
        </div>
        <button onClick={() => fetchOrders(page)} className="btn btn-secondary btn-sm gap-2">
          <RotateCcw className="w-4 h-4" />Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-20 h-20 text-[var(--text-muted)] mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-semibold text-[var(--text)] mb-2">No orders yet</h3>
          <p className="text-[var(--text-muted)] mb-6">You haven't placed any orders. Start shopping!</p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-[var(--text)]">{order.orderNumber}</p>
                    <span className={getOrderStatusColor(order.orderStatus)}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Placed on {formatDateShort(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg text-primary-600">{formatCurrency(order.total)}</span>
                  <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm gap-2">
                    View <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1">
                {order.items.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 relative">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=60'}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
                    />
                    {item.quantity > 1 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    )}
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[var(--input-bg)] flex items-center justify-center text-xs text-[var(--text-muted)] font-medium">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                    p === page ? 'bg-primary-600 text-white' : 'btn btn-secondary'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
