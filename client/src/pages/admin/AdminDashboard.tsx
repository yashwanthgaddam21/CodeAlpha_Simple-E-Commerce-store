import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Package, ShoppingBag, DollarSign,
  TrendingUp, ArrowRight, Clock
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminStats } from '../../types';
import { formatCurrency, formatDateShort, getOrderStatusColor } from '../../utils';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ icon: Icon, label, value, color, sub }: { icon: any; label: string; value: string | number; color: string; sub?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card p-5"
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-sm text-[var(--text-muted)]">{label}</p>
        <p className="font-display text-2xl font-bold text-[var(--text)] mt-1">{value}</p>
        {sub && <p className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
      <TrendingUp className="w-3 h-3" />
      <span>Active</span>
    </div>
  </motion.div>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <LoadingSpinner size="lg" text="Loading dashboard..." />
    </div>
  );

  if (!stats) return <p className="text-[var(--text-muted)]">Failed to load stats.</p>;

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: 'bg-blue-500', sub: 'Registered customers' },
    { icon: Package, label: 'Total Products', value: stats.totalProducts.toLocaleString(), color: 'bg-purple-500', sub: 'Active listings' },
    { icon: ShoppingBag, label: 'Total Orders', value: stats.totalOrders.toLocaleString(), color: 'bg-orange-500', sub: 'All time orders' },
    { icon: DollarSign, label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: 'bg-green-500', sub: 'Excluding cancelled' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text)]">Dashboard</h1>
        <p className="text-[var(--text-muted)]">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <motion.div key={card.label} style={{ animationDelay: `${i * 100}ms` }}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Status breakdown */}
      {stats.ordersByStatus.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-[var(--text)] mb-4">Orders by Status</h2>
          <div className="flex flex-wrap gap-3">
            {stats.ordersByStatus.map((s) => (
              <div key={s._id} className="flex items-center gap-2 bg-[var(--input-bg)] px-4 py-2.5 rounded-xl">
                <span className={getOrderStatusColor(s._id)}>{s._id.charAt(0).toUpperCase() + s._id.slice(1)}</span>
                <span className="font-bold text-[var(--text)]">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-[var(--text)]">Recent Orders</h2>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]">
                <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Order</th>
                <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Customer</th>
                <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Date</th>
                <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Status</th>
                <th className="text-right px-5 py-3 text-[var(--text-muted)] font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-[var(--input-bg)] transition-colors">
                  <td className="px-5 py-3">
                    <Link to={`/admin/orders`} className="font-medium text-primary-600 hover:underline">{order.orderNumber}</Link>
                  </td>
                  <td className="px-5 py-3 text-[var(--text-muted)]">
                    {typeof order.user === 'object' ? order.user.name : 'N/A'}
                  </td>
                  <td className="px-5 py-3 text-[var(--text-muted)]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateShort(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={getOrderStatusColor(order.orderStatus)}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-[var(--text)]">
                    {formatCurrency(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Products', desc: 'Add, edit or remove products', to: '/admin/products', icon: Package, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
          { label: 'View Orders', desc: 'Process and update order status', to: '/admin/orders', icon: ShoppingBag, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' },
          { label: 'Manage Users', desc: 'View and manage customers', to: '/admin/users', icon: Users, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="card p-5 hover:-translate-y-0.5 transition-all duration-200 group">
            <div className={`w-10 h-10 rounded-xl ${link.color} flex items-center justify-center mb-3`}>
              <link.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[var(--text)] text-sm group-hover:text-primary-600 transition-colors">{link.label}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
