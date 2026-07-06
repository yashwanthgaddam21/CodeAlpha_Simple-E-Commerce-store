# CodeAlpha E-Commerce Store – Implementation Plan

## Overview

A complete full-stack e-commerce web application built for the CodeAlpha internship Task 1.
**Stack**: React + Vite + TypeScript + Tailwind CSS + Shadcn UI + Framer Motion (Frontend) | Node.js + Express + MongoDB + JWT (Backend).

The app will have a polished startup-style look, full authentication, product browsing, cart & checkout, order management, and a rich admin dashboard.

---

## Open Questions

> [!IMPORTANT]
> **Cloudinary**: Do you have a Cloudinary account and credentials? If not, I will implement local file storage via Multer as the image upload fallback, and the code will be structured so Cloudinary can be swapped in easily.

> [!IMPORTANT]
> **MongoDB**: Will you use MongoDB Atlas (cloud) or a local MongoDB instance for development? I'll generate a `.env.example` covering both options.

> [!NOTE]
> **Payment**: The prompt allows payment simulation. I will implement a Stripe-style card form UI with simulated processing (no real API keys needed). This can be swapped for real Stripe integration later.

> [!NOTE]
> **Seed Data**: I'll generate a database seeder with realistic sample products, categories, and an admin user so the app is immediately demonstrable after setup.

---

## Proposed Changes

### Phase 1 – Project Scaffolding

#### [NEW] Root workspace layout
```
c:\CodeAlpha-Simple E-Commerce Store\
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
├── .gitignore
└── README.md
```

---

### Phase 2 – Backend (`server/`)

#### Folder structure
```
server/
├── config/
│   ├── db.js
│   └── cloudinary.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── reviewController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   ├── errorMiddleware.js
│   └── uploadMiddleware.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   ├── Order.js
│   └── Review.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── reviewRoutes.js
├── validators/
│   ├── authValidator.js
│   ├── productValidator.js
│   └── orderValidator.js
├── utils/
│   ├── generateToken.js
│   ├── apiFeatures.js
│   └── sendEmail.js
├── data/
│   └── seeder.js
├── uploads/          # local image fallback
├── .env.example
├── package.json
└── server.js
```

#### [MODIFY] MongoDB Models
- **User**: name, email, password (hashed), role (user/admin), avatar, phone, addresses[], isBlocked, createdAt
- **Product**: name, description, price, discountPrice, discountPercentage, category (ref), brand, images[], stock, ratings (avg), numReviews, specifications (key-value), isFeatured, slug
- **Category**: name, slug, description, image
- **Cart**: user (ref), items[{product, quantity, price}], totalPrice
- **Order**: user (ref), items[], shippingAddress, paymentMethod, paymentStatus, orderStatus, subtotal, tax, shippingCost, total, notes, statusHistory[]
- **Review**: user (ref), product (ref), rating, title, comment, helpful[]

#### [MODIFY] REST API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/users/profile | Get profile |
| PUT | /api/users/profile | Update profile |
| PUT | /api/users/change-password | Change password |
| GET | /api/users (admin) | List users |
| DELETE | /api/users/:id (admin) | Delete user |
| GET | /api/products | List products (search, filter, sort, paginate) |
| GET | /api/products/featured | Featured products |
| GET | /api/products/:slug | Single product |
| POST | /api/products (admin) | Create product |
| PUT | /api/products/:id (admin) | Update product |
| DELETE | /api/products/:id (admin) | Delete product |
| GET | /api/categories | All categories |
| POST | /api/categories (admin) | Create category |
| PUT | /api/categories/:id (admin) | Update category |
| DELETE | /api/categories/:id (admin) | Delete category |
| GET | /api/cart | Get user cart |
| POST | /api/cart | Add to cart |
| PUT | /api/cart/:itemId | Update quantity |
| DELETE | /api/cart/:itemId | Remove item |
| DELETE | /api/cart | Clear cart |
| POST | /api/orders | Place order |
| GET | /api/orders/myorders | User orders |
| GET | /api/orders/:id | Order details |
| PUT | /api/orders/:id/cancel | Cancel order |
| GET | /api/orders (admin) | All orders |
| PUT | /api/orders/:id/status (admin) | Update status |
| GET | /api/reviews/product/:id | Product reviews |
| POST | /api/reviews | Add review |
| DELETE | /api/reviews/:id | Delete review |
| GET | /api/admin/stats | Dashboard stats |

---

### Phase 3 – Frontend (`client/`)

#### Folder structure
```
client/src/
├── components/
│   ├── ui/              # Shadcn components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminLayout.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   └── ReviewCard.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/
│   │   ├── AddressForm.tsx
│   │   ├── PaymentForm.tsx
│   │   └── OrderSummaryStep.tsx
│   └── common/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       ├── StarRating.tsx
│       └── ImageUpload.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrderSuccessPage.tsx
│   ├── OrdersPage.tsx
│   ├── OrderDetailPage.tsx
│   ├── ProfilePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── AdminProducts.tsx
│       ├── AdminProductForm.tsx
│       ├── AdminCategories.tsx
│       ├── AdminOrders.tsx
│       ├── AdminOrderDetail.tsx
│       └── AdminUsers.tsx
├── layouts/
│   ├── MainLayout.tsx
│   └── AdminLayout.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useDebounce.ts
├── context/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── services/
│   ├── api.ts           # Axios instance
│   ├── authService.ts
│   ├── productService.ts
│   ├── cartService.ts
│   ├── orderService.ts
│   └── adminService.ts
├── utils/
│   ├── formatCurrency.ts
│   ├── formatDate.ts
│   └── validators.ts
├── types/
│   └── index.ts
├── assets/
├── App.tsx
├── main.tsx
└── index.css
```

#### Pages Breakdown
| Page | Key Features |
|------|-------------|
| **HomePage** | Hero, Featured Products, Categories, Why Us, Testimonials, Newsletter, FAQ, Footer |
| **ProductsPage** | Grid + Sidebar filters (category, price range, rating), Search, Sort, Pagination |
| **ProductDetailPage** | Image gallery, specs, add to cart, buy now, reviews, related products |
| **CartPage** | Item list with qty controls, cost breakdown (subtotal, tax, shipping, total) |
| **CheckoutPage** | 4-step stepper (Address → Summary → Payment → Confirmation) |
| **OrdersPage** | Order history with status badges |
| **OrderDetailPage** | Full order details, status timeline |
| **ProfilePage** | Tabs: Profile Info, Change Password, Addresses |
| **LoginPage / RegisterPage** | Clean auth forms with validation |
| **Admin Dashboard** | Stats cards, recent orders table, charts |
| **Admin Products** | CRUD table with image upload |
| **Admin Orders** | Table with status update dropdown |
| **Admin Users** | User table with block/delete |
| **Admin Categories** | CRUD |

---

### Phase 4 – Integration & Polish

- Connect all frontend services to backend APIs
- Add React Hot Toast notifications
- Add Framer Motion page transitions and card animations
- Implement dark/light mode toggle
- Add loading skeletons for all data-fetching states
- Add 404 and error pages
- Final responsiveness pass

---

### Phase 5 – Seed Data & README

- Database seeder with 20+ products across 5 categories
- Admin user seed (admin@store.com / Admin@123)
- Professional README with setup instructions

---

## Verification Plan

### Automated Tests
- `npm run dev` on both client and server — no startup errors
- All API routes tested via seeder + manual curl checks in README

### Manual Verification
- Register → Login → Browse → Add to Cart → Checkout → View Order
- Admin login → manage products, categories, orders
- Dark mode toggle
- Mobile responsive check on 375px viewport
