import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, getImageUrl, truncate } from '../../utils';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const displayPrice = product.discountPercentage > 0 ? product.discountPrice : product.price;
  const imageUrl = !imageError && product.images?.[0] ? getImageUrl(product.images[0]) : 
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="card-hover group flex flex-col"
    >
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="relative overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800">
        <img
          src={imageUrl}
          alt={product.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 badge bg-red-500 text-white font-bold text-xs px-2 py-1">
            -{product.discountPercentage}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="badge bg-slate-800 text-white text-sm px-3 py-1.5">Out of Stock</span>
          </div>
        )}
        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-[var(--bg-card)]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-[var(--text-muted)]'}`} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">{product.brand}</p>
            <Link to={`/products/${product.slug}`}>
              <h3 className="font-semibold text-[var(--text)] text-sm leading-snug mt-0.5 hover:text-primary-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(product.ratings)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-transparent text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[var(--text-muted)]">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-bold text-lg text-[var(--text)]">{formatCurrency(displayPrice)}</span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-[var(--text-muted)] line-through">{formatCurrency(product.price)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product._id)}
          disabled={product.stock === 0}
          className="btn btn-primary w-full mt-1 group/btn"
        >
          <ShoppingCart className="w-4 h-4 group-hover/btn:animate-bounce-slow" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
