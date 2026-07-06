import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Globe, MessageCircle, Share2, Briefcase } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    shop: [
      { label: 'All Products', to: '/products' },
      { label: 'Electronics', to: '/products?category=electronics' },
      { label: 'Fashion', to: '/products?category=fashion' },
      { label: 'Home & Living', to: '/products?category=home-living' },
      { label: 'Sports & Fitness', to: '/products?category=sports-fitness' },
    ],
    account: [
      { label: 'My Profile', to: '/profile' },
      { label: 'My Orders', to: '/orders' },
      { label: 'Shopping Cart', to: '/cart' },
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
    ],
    company: [
      { label: 'About Us', to: '#' },
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
      { label: 'Refund Policy', to: '#' },
      { label: 'Contact Us', to: '#' },
    ],
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">ShopNest</span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-sm">
              Your premium online shopping destination. Discover thousands of products from top brands at the best prices.
            </p>
            <div className="space-y-2.5 text-sm">
              <a href="mailto:support@shopnest.com" className="flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors">
                <Mail className="w-4 h-4" />support@shopnest.com
              </a>
              <a href="tel:+918001234567" className="flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors">
                <Phone className="w-4 h-4" />+91 800 123 4567
              </a>
              <p className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />123 Commerce Street, Bangalore, KA 560001
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {links.shop.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-400 hover:text-primary-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">My Account</h3>
            <ul className="space-y-2.5">
              {links.account.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-400 hover:text-primary-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {links.company.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-400 hover:text-primary-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-slate-800 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-bold text-white mb-1">Stay in the loop</h3>
              <p className="text-sm text-slate-400">Get exclusive deals and latest updates in your inbox.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} ShopNest. All rights reserved. Built for CodeAlpha Internship.
          </p>
          <div className="flex items-center gap-3">
            {[Globe, MessageCircle, Share2, Briefcase].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all duration-200">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
