# 🛍️ ShopNest – Full Stack E-Commerce Store

<div align="center">

![ShopNest Banner](https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=300&fit=crop)

**A complete, production-ready Full Stack E-Commerce Web Application**

Built for the **CodeAlpha Full Stack Development Internship – Task 1**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## ✨ Features

### 🛒 Customer Features
- **Authentication** – Register, login, JWT-based secure sessions
- **Product Browsing** – Browse 17+ seeded products across 5 categories
- **Advanced Search & Filters** – Search by name, filter by category, price range, rating
- **Product Details** – Image gallery, specifications, reviews with ratings
- **Shopping Cart** – Add/remove/update quantities in real-time
- **Multi-Step Checkout** – Address → Order Summary → Payment → Confirmation
- **Payment Simulation** – Cash on Delivery, Credit Card (simulated), UPI (simulated)
- **Order Management** – Track orders, view order history, cancel pending orders
- **User Profile** – Update name/photo, change password, view saved addresses
- **Dark Mode** – Full dark/light mode with system preference detection
- **Responsive Design** – Works perfectly on mobile, tablet, and desktop

### 🔧 Admin Features
- **Dashboard** – Revenue stats, order counts, user counts, recent order table
- **Product Management** – Full CRUD with image upload, specifications
- **Category Management** – Create, edit, delete product categories
- **Order Management** – View all orders, update status (pending → shipped → delivered)
- **User Management** – View all users, block/unblock, delete

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript, Vite 8 |
| **Styling** | Tailwind CSS v3, Framer Motion |
| **State Management** | React Context API (AuthContext, CartContext) |
| **Forms** | React Hook Form |
| **HTTP Client** | Axios (with JWT interceptors) |
| **Backend** | Node.js + Express 5 |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs |
| **File Uploads** | Multer (local disk storage) |
| **Security** | Helmet, CORS, input validation |
| **Dev Tools** | Nodemon, Concurrently |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/shopnest-ecommerce.git
cd shopnest-ecommerce

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB URI:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/shopnest_ecommerce
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/shopnest
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- 3 users (1 admin + 2 customers)
- 5 categories
- 17 products with images from Unsplash
- 4 sample reviews

### 4. Run Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev:all

# OR separately:
npm run dev          # Backend on :5000
cd client && npm run dev  # Frontend on :5173
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@shopnest.com | Admin@123 |
| **User** | rahul@example.com | User@123 |
| **User** | priya@example.com | User@123 |

> 💡 You can also click "Demo User" or "Demo Admin" on the login page to auto-fill!

---

## 📁 Project Structure

```
shopnest-ecommerce/
├── 📦 server.js              # Express entry point
├── 📦 package.json           # Backend scripts & dependencies
├── 📝 .env.example           # Environment variables template
│
├── config/
│   └── db.js                 # MongoDB connection
│
├── controllers/              # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── ...
│
├── models/                   # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   ├── Order.js
│   └── Review.js
│
├── routes/                   # API routes
├── middleware/               # Auth, admin, error handlers
├── utils/                    # JWT, ApiFeatures
├── data/seeder.js            # Database seeder
│
└── client/                   # React frontend
    ├── src/
    │   ├── App.tsx           # Router setup
    │   ├── context/          # AuthContext, CartContext
    │   ├── pages/            # All page components
    │   │   ├── HomePage.tsx
    │   │   ├── ProductsPage.tsx
    │   │   ├── ProductDetailPage.tsx
    │   │   ├── CartPage.tsx
    │   │   ├── CheckoutPage.tsx
    │   │   ├── OrdersPage.tsx
    │   │   ├── ProfilePage.tsx
    │   │   └── admin/
    │   ├── components/       # Reusable UI components
    │   ├── services/         # Axios API services
    │   ├── types/            # TypeScript interfaces
    │   └── utils/            # Helper functions
    └── vite.config.ts        # Vite + proxy config
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/:slug` | Product by slug |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/myorders` | My orders |
| GET | `/api/orders/:id` | Order by ID |
| PUT | `/api/orders/:id/cancel` | Cancel order |
| GET | `/api/orders` | All orders (Admin) |
| PUT | `/api/orders/:id/status` | Update status (Admin) |

---

## 🎨 UI Preview

The app features:
- 🌙 **Dark/Light Mode** – Seamless toggle
- 🎯 **Glassmorphism Hero** – Animated gradient sections  
- 🃏 **Product Cards** – Hover animations, discount badges, wishlist
- 📦 **Multi-Step Checkout** – Stepper with animated transitions
- 📊 **Admin Dashboard** – Stats cards, sortable tables

---

## 📋 Available Scripts

```bash
# Backend
npm start          # Production server
npm run dev        # Development with nodemon
npm run seed       # Seed database with sample data
npm run seed:destroy  # Clear all database data

# Frontend (from /client)
npm run dev        # Vite dev server
npm run build      # Production build
npm run preview    # Preview production build

# Both (from root)
npm run dev:all    # Start both concurrently
```

---

## 🌍 Deployment

### Backend (Render/Railway)
1. Set environment variables in your hosting dashboard
2. Deploy with `npm start` command

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to your backend URL
2. Build command: `npm run build` 
3. Output directory: `client/dist`

---

## 👤 Author

**Built for CodeAlpha Full Stack Internship – Task 1**

> This project demonstrates full-stack development capabilities including REST API design, MongoDB data modeling, React state management, TypeScript typing, and modern UI/UX design patterns.

---

## 📄 License

This project is for educational/internship purposes. Feel free to use it as a reference!
