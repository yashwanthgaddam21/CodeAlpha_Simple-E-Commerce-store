# 🛍️ ShopNest – Full Stack E-Commerce Store

<div align="center">

![ShopNest Banner](https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=300&fit=crop)

**A full-stack e-commerce web application built with React, Node.js, Express, and MongoDB.**

Built for the **CodeAlpha Full Stack Development Internship – Task 1**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 🌐 Live Demo

- **Website:** [Open ShopNest Live Demo](https://code-alpha-simple-e-commerce-store-gilt.vercel.app/)
- **Backend API Health Check:** [Check API Status](https://shopnest-api-5cnt.onrender.com/api/health)
- **Repository:** [GitHub Repository](https://github.com/yashwanthgaddam21/CodeAlpha_Simple-E-Commerce-store)

> The backend is hosted on Render’s free tier, so the first request after inactivity may take a short time.

---

## ✨ Features

### 🛒 Customer Features

- Secure registration and login with JWT authentication
- Browse products by category
- Search and filter products by name, category, price, and rating
- Product details with images, specifications, and reviews
- Shopping cart with quantity updates
- Multi-step checkout flow
- Simulated payment methods: Cash on Delivery, Card, and UPI
- Order history and eligible order cancellation
- Profile management and password update
- Dark and light mode support
- Responsive layout for mobile, tablet, and desktop

### 🔧 Admin Features

- Dashboard with revenue, order, and user statistics
- Product management: create, edit, and delete products
- Category management
- Order status management
- User management: view, block/unblock, and delete users
- Product image upload support

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion |
| State Management | React Context API |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcryptjs |
| File Uploads | Multer |
| Security | Helmet, CORS |
| Development Tools | Nodemon, Concurrently |

---

## 📁 Project Structure

```text
CodeAlpha_Simple-E-Commerce-store/
├── server.js                 # Express server entry point
├── package.json              # Backend scripts and dependencies
├── .env.example              # Environment variable template
├── config/                   # Database configuration
├── controllers/              # Backend business logic
├── middleware/               # Authentication, admin, and error middleware
├── models/                   # MongoDB/Mongoose schemas
├── routes/                   # API route definitions
├── utils/                    # Helper utilities
├── data/seeder.js            # Sample data seeder
├── uploads/                  # Local uploaded files
└── client/                   # React + TypeScript frontend
    ├── src/
    │   ├── components/       # Reusable components
    │   ├── context/          # Authentication and cart contexts
    │   ├── pages/            # Customer and admin pages
    │   ├── services/         # API service files
    │   └── types/            # TypeScript types
    └── vite.config.ts
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18 or later
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yashwanthgaddam21/CodeAlpha_Simple-E-Commerce-store.git
cd CodeAlpha_Simple-E-Commerce-store
```

### 2. Install Dependencies

```bash
npm install

cd client
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the root folder by copying `.env.example`.

```bash
cp .env.example .env
```

Add your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

> Do not commit `.env` because it contains private credentials.

### 4. Seed the Database

```bash
npm run seed
```

This adds sample users, categories, products, and reviews.

### 5. Run the Application

Run both frontend and backend:

```bash
npm run dev:all
```

Or run them separately:

```bash
# Backend
npm run dev
```

```bash
# Frontend in another terminal
cd client
npm run dev
```

Open the frontend URL shown in the terminal, usually:

```text
http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@shopnest.com` | `Admin@123` |
| User | `rahul@example.com` | `User@123` |
| User | `priya@example.com` | `User@123` |

> Run `npm run seed` before using the demo accounts on a fresh database.

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |
| GET | `/api/auth/me` | Get the current user profile |

### Products

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/products` | Get products with filters |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/:slug` | Get a product by slug |
| POST | `/api/products` | Create a product (Admin) |
| PUT | `/api/products/:id` | Update a product (Admin) |
| DELETE | `/api/products/:id` | Delete a product (Admin) |

### Orders

| Method | Endpoint | Description |
| --- | --- | ---|
| POST | `/api/orders` | Create an order |
| GET | `/api/orders/myorders` | Get logged-in user orders |
| GET | `/api/orders/:id` | Get an order by ID |
| PUT | `/api/orders/:id/cancel` | Cancel an eligible order |
| GET | `/api/orders` | Get all orders (Admin) |
| PUT | `/api/orders/:id/status` | Update order status (Admin) |

### Health Check

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check backend API status |

---

## 📋 Available Scripts

```bash
# Backend
npm start              # Start production server
npm run dev            # Start backend with nodemon
npm run seed           # Add demo data
npm run seed:destroy   # Remove seeded data

# Frontend (inside client folder)
npm run dev            # Start Vite development server
npm run build          # Create production build
npm run preview        # Preview production build

# Root folder
npm run dev:all        # Run frontend and backend together
```

---

## 🚀 Deployment

### Backend — Render

Set these environment variables in Render:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_jwt_secret
CLIENT_URL=https://code-alpha-simple-e-commerce-store-gilt.vercel.app
```

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

### Frontend — Vercel

```text
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Set this environment variable in Vercel:

```env
VITE_API_URL=https://shopnest-api-5cnt.onrender.com/api
```

---

## 🧪 Testing Checklist

- Register a new user and log in
- Test demo customer and admin accounts
- Browse, search, and filter products
- Add, remove, and update cart items
- Complete checkout using simulated payment methods
- View order history
- Test admin product, category, user, and order management
- Test mobile responsiveness
- Verify protected pages redirect unauthenticated users to login

---

## 👤 Author

**Yashwanth Gaddam**

Built for the **CodeAlpha Full Stack Development Internship – Task 1**

---

## 📄 License

This project is created for educational and internship purposes.
