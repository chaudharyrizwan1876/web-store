<div align="center">

# 🛍️ Web Store — Full Stack E-Commerce Platform

A modern, full-featured e-commerce web application built with the **MERN stack**, featuring a complete shopping experience, secure authentication, an admin dashboard with real-time analytics, and production-grade deployment with CI/CD.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![Deployed on Netlify](https://img.shields.io/badge/Frontend-Netlify-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Overview](#-api-overview)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 📌 About the Project

**Web Store** is a full-stack e-commerce platform built from the ground up with a focus on real-world production practices secure authentication, role-based access control, atomic inventory management, automated email notifications, and a fullyfeatured admin panel with live analytics.

The project is structured as two independently deployable services:

- **`frontend/`** — A React (Vite) single-page application
- **`backend/`** — A Node.js + Express REST API with MongoDB (Mongoose)

Both are connected to a CI/CD pipeline — every push to `main` automatically triggers a new build and deployment on both the frontend and backend hosts.

---

## ✨ Features

### 🛒 Customer Experience
- Browse products across multiple categories with filters (category, brand, price range, condition, rating)
- Product detail pages with image gallery, pricing tiers, and stock indicators
- **Low Stock** / **Out of Stock** badges shown dynamically across product listings
- Add to cart, checkout, and place orders (Cash on Delivery & Stripe-ready)
- **Order History** — expandable order cards with item breakdown and order cancellation
- **Wishlist** — save products for later, persisted per-account in the database
- **Order confirmation emails** sent automatically after checkout

### 🔐 Authentication & Account
- Secure JWT-based authentication with bcrypt password hashing
- **Forgot Password** flow with 6-digit OTP email verification
- Editable **user profile** (name, phone, address, password) via a modal interface
- Rate-limited login/register endpoints to prevent brute-force attacks

### 🛠️ Admin Panel
- Dedicated admin dashboard with sidebar navigation (isolated from the storefront layout)
- **Live analytics**: total revenue, order breakdown by status/payment method, product health (active/inactive/low stock/out of stock), user counts
- 7-day order trend visualization
- Low stock alert widget
- Recent orders table
- Full CRUD product management (with image upload via Cloudinary)
- Order management with status updates

### 🔒 Security Hardening
- Environment secrets excluded from version control (`.gitignore`)
- CORS restricted to explicit allowed origins
- Rate limiting on authentication routes
- Passwords and OTPs hashed with bcrypt — never stored in plain text
- JWT-based route protection with dedicated admin-only middleware

---

## 🧰 Tech Stack

| Layer            | Technology                                             |
|-------------------|--------------------------------------------------------|
| Frontend          | React, Vite, React Router                              |
| Backend           | Node.js, Express                                        |
| Database          | MongoDB (Mongoose ODM), hosted on MongoDB Atlas         |
| Authentication    | JWT, bcryptjs                                            |
| Image Hosting     | Cloudinary                                               |
| Payments          | Stripe                                                   |
| Emails            | Nodemailer (Gmail SMTP)                                  |
| Deployment        | Render (backend) · Netlify (frontend)                    |
| CI/CD             | GitHub-integrated auto-deploy on `main` push              |

---

## 📁 Project Structure

```
web-store/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route handlers (auth, orders, products, admin, wishlist...)
│   │   ├── models/            # Mongoose schemas (User, Product, Order, OtpToken)
│   │   ├── routes/            # Express route definitions
│   │   ├── middleware/        # Auth guard, admin guard, rate limiter, file upload
│   │   ├── config/            # Database connection
│   │   └── scripts/           # Seed scripts (admin user, sample products)
│   ├── server.js              # App entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components (Navbar, product cards, admin widgets...)
│   │   ├── pages/              # Route-level pages (Home, Products, Orders, Wishlist, Admin...)
│   │   ├── layouts/            # Layout wrappers (Main, Checkout, Admin)
│   │   ├── context/             # Global state (Auth, Wishlist)
│   │   └── utils/                # API client, helpers
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB instance)
- A [Cloudinary](https://cloudinary.com/) account (for product images)
- A [Stripe](https://stripe.com/) account (optional, for card payments)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) (for transactional emails)

### Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/web-store.git
cd web-store
```

Install dependencies for both services:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file inside `backend/` with the following keys:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
EMAIL_RECIPIENT=your_notification_email
```

Create a `.env` file inside `frontend/` with:

```env
VITE_API_BASE_URL=http://localhost:5000
```

> ⚠️ Never commit your `.env` files. Both are already excluded via `.gitignore`.

### Running Locally

Start the backend (runs on `http://localhost:5000`):

```bash
cd backend
npm run dev
```

Start the frontend (runs on `http://localhost:5173`):

```bash
cd frontend
npm run dev
```

### Seeding Initial Data (optional)

Create an admin account:

```bash
cd backend
node src/scripts/seedAdmin.js
```

Populate the store with sample products across all categories:

```bash
node src/scripts/seedProducts.js
```

---

## 🔌 API Overview

| Method | Endpoint                          | Description                          | Auth       |
|--------|------------------------------------|---------------------------------------|------------|
| POST   | `/api/auth/register`               | Register a new user                   | Public     |
| POST   | `/api/auth/login`                  | Log in                                | Public     |
| POST   | `/api/auth/forgot-password`        | Request password reset OTP            | Public     |
| POST   | `/api/auth/verify-otp`             | Verify OTP                            | Public     |
| POST   | `/api/auth/reset-password`         | Reset password with verified OTP      | Public     |
| GET    | `/api/products`                     | List products (filterable)            | Public     |
| GET    | `/api/user/profile`                 | Get current user profile              | User       |
| PUT    | `/api/user/profile`                 | Update profile / change password      | User       |
| GET    | `/api/wishlist`                     | Get saved wishlist products           | User       |
| PUT    | `/api/wishlist/:productId/toggle`   | Add/remove product from wishlist      | User       |
| POST   | `/api/orders`                       | Place an order                        | User       |
| GET    | `/api/orders/my`                    | Get logged-in user's orders           | User       |
| PATCH  | `/api/orders/my/:id/cancel`         | Cancel an unpaid order                | User       |
| GET    | `/api/admin/dashboard`              | Store analytics & stats               | Admin      |
| GET    | `/api/admin/orders`                 | List all orders                       | Admin      |
| PATCH  | `/api/admin/orders/:id/status`      | Update order status                   | Admin      |
| GET    | `/api/admin/products`               | List all products                     | Admin      |
| POST   | `/api/admin/products`               | Create a product                      | Admin      |
| PATCH  | `/api/admin/products/:id`           | Update a product                      | Admin      |

> Full route definitions are available under `backend/src/routes/`.

---

## ☁️ Deployment

This project is deployed using a fully automated CI/CD pipeline:

- **Backend** → [Render](https://render.com/), connected directly to the `main` branch. Every push triggers an automatic rebuild and redeploy.
- **Frontend** → [Netlify](https://www.netlify.com/), connected directly to the `main` branch with automatic builds on every push.

**Build settings:**

| Service   | Root Directory | Build Command   | Output / Start                |
|-----------|-----------------|------------------|--------------------------------|
| Backend   | `backend`        | `npm install`     | `node server.js`               |
| Frontend  | `frontend`        | `npm run build`   | `frontend/dist`                |

Remember to configure the corresponding environment variables (see [above](#environment-variables)) directly in the Render and Netlify dashboards — `.env` files are not committed to the repository.

---

## 🗺️ Roadmap

- [x] Secure authentication with OTP-based password recovery
- [x] User profile management
- [x] Order history with cancellation
- [x] Wishlist
- [x] Order confirmation emails
- [x] Stock badges (low stock / out of stock)
- [x] Admin dashboard with live analytics
- [ ] Product reviews & ratings
- [ ] Order status update emails
- [ ] Google OAuth login
- [ ] Recently viewed products

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact

**Rizwan Chaudhary**

- GitHub: [@chaudharyrizwan1876](https://github.com/chaudharyrizwan1876)
- Email: chaudharyrizwan1876@gmail.com

---

<div align="center">

If you found this project useful, consider giving it a ⭐️!

</div>
