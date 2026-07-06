import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, User, Search, Menu, X, Sun, Moon,
  Package, Heart, LogOut, Settings, LayoutDashboard, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[var(--bg-card)]/95 backdrop-blur-lg shadow-lg border-b border-[var(--border)]' 
               : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-200">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold gradient-text hidden sm:block">ShopNest</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--input-bg)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="btn-icon btn-ghost text-[var(--text-muted)] hover:text-[var(--text)]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="btn-icon btn-ghost text-[var(--text-muted)] hover:text-[var(--text)]"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart */}
            <Link to="/cart" className="btn-icon btn-ghost relative text-[var(--text-muted)] hover:text-[var(--text)]">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[var(--input-bg)] transition-all duration-200"
                >
                  <img
                    src={getImageUrl(user.avatar || '')}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`;
                    }}
                  />
                  <span className="hidden md:block text-sm font-medium text-[var(--text)] max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] hidden md:block transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 card z-50 py-2 shadow-xl"
                      >
                        <div className="px-4 py-3 border-b border-[var(--border)]">
                          <p className="text-sm font-semibold text-[var(--text)] truncate">{user.name}</p>
                          <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                        </div>
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--input-bg)] hover:text-primary-600 transition-colors">
                            <LayoutDashboard className="w-4 h-4" />Admin Dashboard
                          </Link>
                        )}
                        <Link to="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)] transition-colors">
                          <User className="w-4 h-4" />My Profile
                        </Link>
                        <Link to="/orders" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--input-bg)] hover:text-[var(--text)] transition-colors">
                          <Package className="w-4 h-4" />My Orders
                        </Link>
                        <button
                          onClick={() => { logout(); setProfileOpen(false); navigate('/'); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <LogOut className="w-4 h-4" />Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn btn-primary text-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden btn-icon btn-ghost"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[var(--border)] bg-[var(--bg-card)] py-4 space-y-1"
            >
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'text-[var(--text-muted)]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {!user && (
                <div className="flex gap-2 px-4 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn btn-secondary text-sm">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn btn-primary text-sm">Sign Up</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
            >
              <form onSubmit={handleSearch} className="card p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, categories..."
                    className="flex-1 bg-transparent text-[var(--text)] placeholder-[var(--text-muted)] text-lg outline-none"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="btn-icon btn-ghost">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-3 ml-8">Press Enter to search</p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
