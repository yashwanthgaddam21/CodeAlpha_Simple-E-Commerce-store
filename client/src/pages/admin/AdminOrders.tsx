import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { adminOrderService } from '../../services/orderService';
import { Order } from '../../types';
import { formatCurrency, formatDateShort } from '../../utils';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await adminOrderService.getAllOrders(page, statusFilter || undefined);
      setOrders(result.data);
      setPages(result.pages || 1);
      setTotal(result.total || 0);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await adminOrderService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, orderStatus: updated.orderStatus } : o));
      toast.success(`Order status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text)]">Orders</h1>
          <p className="text-[var(--text-muted)]">{total} total orders</p>
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input min-w-[140px]"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button onClick={fetchOrders} className="btn btn-secondary btn-sm gap-2">
            <RotateCcw className="w-4 h-4" />Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]">
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Order</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Customer</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Date</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Items</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Total</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {orders.map((order) => (
                  <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-[var(--input-bg)] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-primary-600">{order.orderNumber}</p>
                      <p className="text-xs text-[var(--text-muted)] capitalize">{order.paymentMethod}</p>
                    </td>
                    <td className="px-5 py-4">
                      {typeof order.user === 'object' ? (
                        <div>
                          <p className="font-medium text-[var(--text)]">{order.user.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{order.user.email}</p>
                        </div>
                      ) : <span className="text-[var(--text-muted)]">N/A</span>}
                    </td>
                    <td className="px-5 py-4 text-[var(--text-muted)]">{formatDateShort(order.createdAt)}</td>
                    <td className="px-5 py-4 text-[var(--text-muted)]">{order.items.length} item(s)</td>
                    <td className="px-5 py-4 font-semibold text-[var(--text)]">{formatCurrency(order.total)}</td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id || order.orderStatus === 'cancelled'}
                          className={`text-xs font-semibold rounded-xl px-3 py-1.5 border-0 cursor-pointer focus:ring-2 focus:ring-primary-500 appearance-none pr-7 ${
                            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                            order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                            order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                          } disabled:cursor-not-allowed`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        {updatingId === order._id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <LoadingSpinner size="sm" />
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium ${p === page ? 'bg-primary-600 text-white' : 'btn btn-secondary'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
