require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Cart = require('../models/Cart');

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronic devices', image: '' },
  { name: 'Fashion', slug: 'fashion', description: 'Trendy clothing and accessories', image: '' },
  { name: 'Home & Living', slug: 'home-living', description: 'Beautiful home decor and furniture', image: '' },
  { name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Sports equipment and fitness gear', image: '' },
  { name: 'Books', slug: 'books', description: 'Best sellers and educational books', image: '' },
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@shopnest.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '+91 9876543210',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'User@123',
    role: 'user',
    phone: '+91 9876543211',
  },
  {
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'User@123',
    role: 'user',
    phone: '+91 9876543212',
  },
];

const getProducts = (categoryMap) => [
  // Electronics
  {
    name: 'Apple iPhone 15 Pro',
    description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and a stunning 48MP camera system. Experience the future of smartphones.',
    price: 134900,
    discountPercentage: 8,
    category: categoryMap['electronics'],
    brand: 'Apple',
    stock: 45,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600',
    ],
    specifications: [
      { key: 'Display', value: '6.1-inch Super Retina XDR' },
      { key: 'Chip', value: 'A17 Pro' },
      { key: 'Camera', value: '48MP Main + 12MP Ultra Wide' },
      { key: 'Storage', value: '256GB' },
      { key: 'Battery', value: 'Up to 23 hours video' },
      { key: 'OS', value: 'iOS 17' },
    ],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Redefine what a smartphone can do with Galaxy AI, a built-in S Pen, and an epic 200MP camera. The ultimate Android experience.',
    price: 129999,
    discountPercentage: 10,
    category: categoryMap['electronics'],
    brand: 'Samsung',
    stock: 38,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
    ],
    specifications: [
      { key: 'Display', value: '6.8-inch QHD+ Dynamic AMOLED' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { key: 'Camera', value: '200MP Main + 12MP Ultra Wide' },
      { key: 'RAM', value: '12GB' },
      { key: 'Storage', value: '256GB' },
      { key: 'S Pen', value: 'Built-in' },
    ],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with 8 microphones and Auto NC Optimizer. Up to 30 hours battery life with quick charge.',
    price: 29990,
    discountPercentage: 15,
    category: categoryMap['electronics'],
    brand: 'Sony',
    stock: 60,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600',
    ],
    specifications: [
      { key: 'Driver', value: '30mm Dynamic' },
      { key: 'Frequency Response', value: '4Hz-40000Hz' },
      { key: 'Battery Life', value: '30 hours' },
      { key: 'Quick Charge', value: '3 min = 3 hours' },
      { key: 'Weight', value: '250g' },
      { key: 'Connectivity', value: 'Bluetooth 5.2, NFC' },
    ],
  },
  {
    name: 'MacBook Pro 14-inch M3',
    description: 'Supercharged by M3 Pro or M3 Max, MacBook Pro takes an enormous leap forward in performance. The most advanced Mac laptop.',
    price: 189900,
    discountPercentage: 5,
    category: categoryMap['electronics'],
    brand: 'Apple',
    stock: 20,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
    ],
    specifications: [
      { key: 'Chip', value: 'Apple M3 Pro' },
      { key: 'Display', value: '14.2-inch Liquid Retina XDR' },
      { key: 'RAM', value: '18GB Unified Memory' },
      { key: 'Storage', value: '512GB SSD' },
      { key: 'Battery', value: 'Up to 18 hours' },
      { key: 'Camera', value: '12MP Center Stage' },
    ],
  },
  {
    name: 'iPad Air M2',
    description: 'Supercharged by the M2 chip, the new iPad Air comes in two sizes for the first time, with the brilliant Liquid Retina display.',
    price: 74900,
    discountPercentage: 0,
    category: categoryMap['electronics'],
    brand: 'Apple',
    stock: 35,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
    ],
    specifications: [
      { key: 'Chip', value: 'Apple M2' },
      { key: 'Display', value: '11-inch Liquid Retina' },
      { key: 'Storage', value: '128GB' },
      { key: 'Camera', value: '12MP Wide' },
      { key: 'Connectivity', value: 'Wi-Fi 6E, Bluetooth 5.3' },
    ],
  },
  // Fashion
  {
    name: 'Premium Slim Fit Blazer',
    description: 'Crafted from high-quality Italian fabric, this slim-fit blazer is perfect for both formal and smart-casual occasions.',
    price: 4999,
    discountPercentage: 20,
    category: categoryMap['fashion'],
    brand: 'StyleCraft',
    stock: 80,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',
    ],
    specifications: [
      { key: 'Material', value: '70% Wool, 30% Polyester' },
      { key: 'Fit', value: 'Slim Fit' },
      { key: 'Sizes', value: 'S, M, L, XL, XXL' },
      { key: 'Care', value: 'Dry Clean Only' },
    ],
  },
  {
    name: 'Classic White Sneakers',
    description: 'Timeless white leather sneakers with a cushioned sole for all-day comfort. Perfect for any casual outfit.',
    price: 3499,
    discountPercentage: 12,
    category: categoryMap['fashion'],
    brand: 'UrbanStep',
    stock: 120,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
    ],
    specifications: [
      { key: 'Material', value: 'Genuine Leather Upper' },
      { key: 'Sole', value: 'Rubber Outsole' },
      { key: 'Sizes', value: '6-12 UK' },
      { key: 'Colors', value: 'White, Off-White' },
    ],
  },
  {
    name: 'Designer Tote Bag',
    description: 'Elegant vegan leather tote bag with spacious interior and multiple pockets. Ideal for work or weekend outings.',
    price: 2299,
    discountPercentage: 25,
    category: categoryMap['fashion'],
    brand: 'LuxeCarry',
    stock: 55,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
    ],
    specifications: [
      { key: 'Material', value: 'Premium Vegan Leather' },
      { key: 'Dimensions', value: '40cm x 35cm x 12cm' },
      { key: 'Pockets', value: '3 Interior + 1 Exterior' },
      { key: 'Colors', value: 'Black, Brown, Beige' },
    ],
  },
  // Home & Living
  {
    name: 'Smart LED Floor Lamp',
    description: 'App-controlled smart floor lamp with 16 million colors, dimmable, and compatible with Alexa and Google Home.',
    price: 5499,
    discountPercentage: 18,
    category: categoryMap['home-living'],
    brand: 'GlowSmart',
    stock: 70,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
    ],
    specifications: [
      { key: 'Bulb Type', value: 'LED' },
      { key: 'Wattage', value: '15W' },
      { key: 'Colors', value: 'RGB + White' },
      { key: 'Control', value: 'App / Voice / Touch' },
      { key: 'Height', value: '160cm' },
    ],
  },
  {
    name: 'Minimalist Coffee Table',
    description: 'Scandinavian-style solid wood coffee table with clean lines and a walnut finish. Perfect for modern living rooms.',
    price: 12999,
    discountPercentage: 10,
    category: categoryMap['home-living'],
    brand: 'NordicHome',
    stock: 25,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
    ],
    specifications: [
      { key: 'Material', value: 'Solid Walnut Wood' },
      { key: 'Dimensions', value: '120cm x 60cm x 45cm' },
      { key: 'Finish', value: 'Natural Walnut' },
      { key: 'Weight Capacity', value: '50 kg' },
    ],
  },
  {
    name: 'Aromatherapy Diffuser Set',
    description: 'Premium ultrasonic diffuser with 10 essential oils. Creates a relaxing ambiance with color-changing LED lights.',
    price: 1999,
    discountPercentage: 30,
    category: categoryMap['home-living'],
    brand: 'ZenAroma',
    stock: 90,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600',
    ],
    specifications: [
      { key: 'Tank Capacity', value: '300ml' },
      { key: 'Runtime', value: 'Up to 8 hours' },
      { key: 'Noise Level', value: '< 35dB' },
      { key: 'Essential Oils', value: '10 x 10ml included' },
    ],
  },
  // Sports & Fitness
  {
    name: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbells from 5 to 25kg. Replace 15 pairs of dumbbells with a single compact set.',
    price: 15999,
    discountPercentage: 20,
    category: categoryMap['sports-fitness'],
    brand: 'PowerFit',
    stock: 40,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600',
    ],
    specifications: [
      { key: 'Weight Range', value: '5kg - 25kg' },
      { key: 'Increments', value: '2.5kg per adjustment' },
      { key: 'Material', value: 'Cast Iron + ABS' },
      { key: 'Includes', value: '2 Dumbbells + Storage Tray' },
    ],
  },
  {
    name: 'Yoga Mat Pro',
    description: 'Eco-friendly non-slip yoga mat with alignment lines. 6mm thickness for superior joint support and comfort.',
    price: 2499,
    discountPercentage: 15,
    category: categoryMap['sports-fitness'],
    brand: 'ZenFlex',
    stock: 100,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
    ],
    specifications: [
      { key: 'Material', value: 'Natural Rubber + TPE' },
      { key: 'Thickness', value: '6mm' },
      { key: 'Dimensions', value: '183cm x 61cm' },
      { key: 'Features', value: 'Non-slip, Alignment Lines' },
    ],
  },
  {
    name: 'Fitness Resistance Bands Set',
    description: 'Set of 5 progressive resistance bands for full-body training. Perfect for home workouts, physiotherapy, and stretching.',
    price: 899,
    discountPercentage: 0,
    category: categoryMap['sports-fitness'],
    brand: 'FlexBand',
    stock: 150,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600',
    ],
    specifications: [
      { key: 'Set Includes', value: '5 Bands (X-Light to X-Heavy)' },
      { key: 'Material', value: '100% Natural Latex' },
      { key: 'Max Resistance', value: '40+ lbs' },
    ],
  },
  // Books
  {
    name: 'Atomic Habits - James Clear',
    description: 'The #1 New York Times bestseller. An easy & proven way to build good habits & break bad ones. Tiny changes, remarkable results.',
    price: 499,
    discountPercentage: 25,
    category: categoryMap['books'],
    brand: 'Penguin Books',
    stock: 200,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    ],
    specifications: [
      { key: 'Author', value: 'James Clear' },
      { key: 'Pages', value: '320' },
      { key: 'Language', value: 'English' },
      { key: 'Format', value: 'Paperback' },
      { key: 'Published', value: '2018' },
    ],
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. One of the most important finance books ever written.',
    price: 399,
    discountPercentage: 20,
    category: categoryMap['books'],
    brand: 'Jaico Publishing',
    stock: 180,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600',
    ],
    specifications: [
      { key: 'Author', value: 'Morgan Housel' },
      { key: 'Pages', value: '256' },
      { key: 'Language', value: 'English' },
      { key: 'Format', value: 'Paperback' },
      { key: 'Published', value: '2020' },
    ],
  },
  {
    name: 'Deep Work - Cal Newport',
    description: 'Rules for focused success in a distracted world. Learn how to cultivate deep work as a skill and transform your professional life.',
    price: 449,
    discountPercentage: 10,
    category: categoryMap['books'],
    brand: 'Grand Central',
    stock: 160,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=600',
    ],
    specifications: [
      { key: 'Author', value: 'Cal Newport' },
      { key: 'Pages', value: '296' },
      { key: 'Language', value: 'English' },
      { key: 'Format', value: 'Paperback' },
    ],
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0];
    console.log(`✅ Created ${createdUsers.length} users`);
    console.log(`   Admin: admin@shopnest.com / Admin@123`);

    // Create categories
    const createdCategories = await Category.create(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create products
    const productData = getProducts(categoryMap);
    const createdProducts = await Product.create(productData);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create sample reviews
    const reviewData = [
      {
        user: createdUsers[1]._id,
        product: createdProducts[0]._id,
        rating: 5,
        title: 'Absolutely amazing phone!',
        comment: 'The camera quality is stunning and the battery life is fantastic. Best phone I have ever owned.',
      },
      {
        user: createdUsers[2]._id,
        product: createdProducts[0]._id,
        rating: 4,
        title: 'Great phone, premium feel',
        comment: 'Love the titanium build. The A17 Pro chip makes everything buttery smooth. Minor complaint: price is steep.',
      },
      {
        user: createdUsers[1]._id,
        product: createdProducts[2]._id,
        rating: 5,
        title: 'Best headphones ever!',
        comment: 'The noise cancellation is incredible. Perfect for work from home and long flights.',
      },
      {
        user: createdUsers[2]._id,
        product: createdProducts[5]._id,
        rating: 4,
        title: 'Great fit and quality',
        comment: 'The fabric is premium and the slim fit looks sharp. Highly recommend for formal occasions.',
      },
    ];

    await Review.create(reviewData);
    console.log(`✅ Created ${reviewData.length} sample reviews`);

    // Recalculate ratings for reviewed products
    await Review.calcAverageRatings(createdProducts[0]._id);
    await Review.calcAverageRatings(createdProducts[2]._id);
    await Review.calcAverageRatings(createdProducts[5]._id);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Admin Login:');
    console.log('   Email:    admin@shopnest.com');
    console.log('   Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    console.log('🗑️  All data destroyed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
