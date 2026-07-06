export const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
};

export const formatDateShort = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getImageUrl = (path: string): string => {
  if (!path) return 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${path}`;
};

export const truncate = (text: string, length = 100): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

export const getOrderStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'badge badge-yellow',
    processing: 'badge badge-blue',
    shipped: 'badge badge-purple',
    delivered: 'badge badge-green',
    cancelled: 'badge badge-red',
  };
  return colors[status] || 'badge badge-gray';
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
