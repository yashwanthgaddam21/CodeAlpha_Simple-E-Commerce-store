import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div className="font-display text-9xl font-black gradient-text mb-4">404</div>
      <h1 className="font-display text-2xl font-bold text-[var(--text)] mb-3">Page not found</h1>
      <p className="text-[var(--text-muted)] mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => window.history.back()} className="btn btn-secondary gap-2">
          <ArrowLeft className="w-4 h-4" />Go Back
        </button>
        <Link to="/" className="btn btn-primary gap-2">
          <Home className="w-4 h-4" />Home
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFoundPage;
