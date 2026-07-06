import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, Camera, MapPin, Plus, Trash2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import api from '../services/api';
import { Address } from '../types';
import { getImageUrl } from '../utils';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

type Tab = 'profile' | 'password' | 'addresses';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [updating, setUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const profileForm = useForm({ defaultValues: { name: user?.name || '', phone: user?.phone || '' } });
  const passwordForm = useForm<{ currentPassword: string; newPassword: string; confirmPassword: string }>();
  const newPass = passwordForm.watch('newPassword');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onUpdateProfile = async (data: { name: string; phone: string }) => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      if (avatarFile) formData.append('avatar', avatarFile);

      const updated = await adminService.updateProfile(formData);
      updateUser({ ...user!, ...updated });
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const onChangePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setUpdating(true);
    try {
      await api.put('/users/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setUpdating(false);
    }
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile Info', icon: User },
    { id: 'password' as Tab, label: 'Password', icon: Lock },
    { id: 'addresses' as Tab, label: 'Addresses', icon: MapPin },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-8">My Profile</h1>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--input-bg)] rounded-2xl w-fit mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[var(--bg-card)] text-[var(--text)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="card p-6 sm:p-8">
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-semibold text-[var(--text)] text-lg mb-6">Personal Information</h2>
            <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={avatarPreview || getImageUrl(user?.avatar || '')}
                    alt={user?.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary-200 dark:border-primary-800"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=3b82f6&color=fff&size=80`; }}
                  />
                  <label className="absolute bottom-0 right-0 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                    <Camera className="w-3.5 h-3.5 text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text)]">{user?.name}</p>
                  <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Click camera icon to change photo</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input {...profileForm.register('name', { required: true })} className="input pl-10" placeholder="Your name" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input {...profileForm.register('phone')} className="input pl-10" placeholder="+91 9876543210" />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input value={user?.email} disabled className="input pl-10 opacity-60 cursor-not-allowed" />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">Email cannot be changed</p>
              </div>

              <button type="submit" disabled={updating} className="btn btn-primary">
                {updating ? <LoadingSpinner size="sm" /> : <><Check className="w-4 h-4" />Save Changes</>}
              </button>
            </form>
          </motion.div>
        )}

        {activeTab === 'password' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-semibold text-[var(--text)] text-lg mb-6">Change Password</h2>
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-5 max-w-md">
              <div className="form-group">
                <label className="label">Current Password</label>
                <input
                  {...passwordForm.register('currentPassword', { required: true })}
                  type="password"
                  className="input"
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label className="label">New Password</label>
                <input
                  {...passwordForm.register('newPassword', { required: true, minLength: { value: 6, message: 'Min 6 characters' } })}
                  type="password"
                  className="input"
                  placeholder="At least 6 characters"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div className="form-group">
                <label className="label">Confirm New Password</label>
                <input
                  {...passwordForm.register('confirmPassword', {
                    required: true,
                    validate: (val) => val === newPass || 'Passwords do not match'
                  })}
                  type="password"
                  className="input"
                  placeholder="Repeat new password"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <button type="submit" disabled={updating} className="btn btn-primary">
                {updating ? <LoadingSpinner size="sm" /> : 'Update Password'}
              </button>
            </form>
          </motion.div>
        )}

        {activeTab === 'addresses' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-[var(--text)] text-lg">Saved Addresses</h2>
            </div>
            {user?.addresses?.length === 0 || !user?.addresses ? (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No addresses saved yet. Add one during checkout.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {user.addresses.map((addr, i) => (
                  <div key={addr._id || i} className={`p-4 rounded-2xl border-2 ${addr.isDefault ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-[var(--border)]'}`}>
                    {addr.isDefault && <span className="badge badge-blue mb-2">Default</span>}
                    <p className="font-semibold text-[var(--text)] text-sm">{addr.fullName}</p>
                    <p className="text-sm text-[var(--text-muted)]">{addr.phone}</p>
                    <p className="text-sm text-[var(--text-muted)]">{addr.addressLine1}</p>
                    <p className="text-sm text-[var(--text-muted)]">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-sm text-[var(--text-muted)]">{addr.country}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
