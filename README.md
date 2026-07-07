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

## 🌐 Live Demo

- **Website:** [Open ShopNest Live Demo](https://code-alpha-simple-e-commerce-store-gilt.vercel.app/)
- **API Health Check:** [Check Backend Status](https://shopnest-api-5cnt.onrender.com/api/health)
- **Source Code:** [GitHub Repository](https://github.com/yashwanthgaddam21/CodeAlpha_Simple-E-Commerce-store)

> The backend is hosted on Render’s free tier. The first request after inactivity may take 30–60 seconds to respond while the service wakes up.

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
- **Responsive Design** – Works on mobile, tablet, and desktop

### 🔧 Admin Features

- **Dashboard** – Revenue stats, order counts, user counts, recent order table
- **Product Management** – Full CRUD with image upload and specifications
- **Category Management** – Create, edit, and delete product categories
- **Order Management** – View all orders and update status
- **User Management** – View users, block/unblock, and delete users

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript, Vite |
| **Styling** | Tailwind CSS v3, Framer Motion |
| **State Management** | React Context API (AuthContext, CartContext) |
| **Forms** | React Hook Form |
| **HTTP Client** | Axios (with JWT interceptors) |
| **Backend** | Node.js + Express |
| **Database** | MongoDB Atlas + Mongoose |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs |
| **File Uploads** | Multer (local disk storage) |
| **Security** | Helmet, CORS, input validation |
| **Dev Tools** | Nodemon, Concurrently |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone & Install

```bash
git clone https://github.com/yashwanthgaddam21/CodeAlpha_Simple-E-Commerce-store.git
cd CodeAlpha_Simple-E-Commerce-store

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
