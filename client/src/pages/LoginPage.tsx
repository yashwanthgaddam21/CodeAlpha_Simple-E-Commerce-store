import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, Package, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const from = (location.state as any)?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setValue('email', 'admin@shopnest.com');
      setValue('password', 'Admin@123');
    } else {
      setValue('email', 'rahul@example.com');
      setValue('password', 'User@123');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold gradient-text">ShopNest</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-[var(--text)] mb-2">Welcome back</h1>
          <p className="text-[var(--text-muted)] mb-8">Sign in to your account to continue shopping</p>

          {/* Demo Credentials */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => fillDemo('user')} className="flex-1 btn btn-secondary btn-sm text-xs">
              Demo User
            </button>
            <button onClick={() => fillDemo('admin')} className="flex-1 btn btn-secondary btn-sm text-xs">
              Demo Admin
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-group">
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={`input pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('rememberMe')} type="checkbox" className="w-4 h-4 rounded border-[var(--border)] text-primary-600" />
                <span className="text-sm text-[var(--text-muted)]">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:underline">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
              {loading ? <LoadingSpinner size="sm" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-white blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white text-center z-10 max-w-md"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-4xl font-bold mb-4">Shop smarter, live better</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Discover thousands of products from top brands. Premium shopping experience with lightning-fast delivery.
          </p>
          <div className="flex justify-center gap-6 mt-10">
            {[['10K+', 'Products'], ['5K+', 'Reviews'], ['99%', 'Satisfied']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold">{val}</div>
                <div className="text-sm text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
