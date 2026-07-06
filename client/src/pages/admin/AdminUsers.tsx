import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Ban, CheckCircle, RotateCcw } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { formatDateShort, getImageUrl } from '../../utils';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getUsers(page);
      setUsers(result.data);
      setPages(result.pages || 1);
      setTotal(result.total || 0);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    setActionId(id);
    try {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionId(null);
    }
  };

  const handleToggleBlock = async (id: string) => {
    setActionId(id);
    try {
      const result = await adminService.toggleBlockUser(id);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: result.isBlocked } : u));
      toast.success(`User ${result.isBlocked ? 'blocked' : 'unblocked'}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text)]">Users</h1>
          <p className="text-[var(--text-muted)]">{total} registered users</p>
        </div>
        <button onClick={fetchUsers} className="btn btn-secondary btn-sm gap-2">
          <RotateCcw className="w-4 h-4" />Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--input-bg)]">
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">User</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Role</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Joined</th>
                  <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Status</th>
                  <th className="text-right px-5 py-3 text-[var(--text-muted)] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {users.map((user) => (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-[var(--input-bg)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(user.avatar || '')}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`; }}
                        />
                        <div>
                          <p className="font-medium text-[var(--text)]">{user.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={user.role === 'admin' ? 'badge badge-purple' : 'badge badge-gray'}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[var(--text-muted)]">
                      {user.createdAt ? formatDateShort(user.createdAt) : 'N/A'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={user.isBlocked ? 'badge badge-red' : 'badge badge-green'}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {user.role !== 'admin' && (
                        <div className="flex items-center justify-end gap-2">
                          {actionId === user._id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <button
                                onClick={() => handleToggleBlock(user._id)}
                                className={`btn-icon btn-ghost ${user.isBlocked ? 'text-green-500' : 'text-yellow-500'}`}
                                title={user.isBlocked ? 'Unblock user' : 'Block user'}
                              >
                                {user.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDelete(user._id, user.name)}
                                className="btn-icon btn-ghost text-red-500"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

export default AdminUsers;
