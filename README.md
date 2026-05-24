#  Merchant Grid — Luxury MERN E-Commerce Storefront

Merchant Grid is a production-grade, highly optimized, and visually addictive MERN e-commerce application designed under the **"Midnight Obsidian & Aurelian Gold"** luxury theme coordinates. Inspired by high-end brands like Apple, Stripe, and Nike, it delivers ultra-responsive page loads, secure checking cycles, and full administrative panel catalog controls.

---

##  Live Deployments

| Component | Cloud Platform | Live URLs |
| :--- | :--- | :--- |
|  **Frontend Store** | **Vercel** | [e-commerce-web-application-ochre.vercel.app](https://e-commerce-web-application-ochre.vercel.app) |
|  **Backend API** | **Render** | [merchant-grid.onrender.com](https://merchant-grid.onrender.com) |
|  **Database Cluster** | **MongoDB Atlas** | Isolated `/ecommerce` Production Instance |

---

##  Design Language & Aesthetics
* **Midnight Obsidian Surfaces**: Deep slate backdrops (`#09090b`) matched with premium frosted charcoal card frameworks (`#18181b`).
* **Aurelian Metallic Gold**: Luxurious glowing borders, buttons, and badges (`#dfc299`).
* **Dynamic Micro-Transitions**: 3D active button scaling, gold ambient glows, and clean shimmer skeleton loaders.
* **Premium Typography**: **Plus Jakarta Sans** (headings) and **Inter** (exceptionally clean body copy).

---

##  Key Features

*  **MERN Authentication**: Secure JWT-based registration and login flows with automatic cookie synchronization.
*  **Product Catalog Details**: Grid layouts with responsive category filters, floating overlay Quick Views, and live reviews.
*  **Performance Cart & Wishlist**: Sticky, responsive order summary boards, free-shipping calculators, and real-time inventory limits.
*  **Collapsible Tracking Dashboard**: Beautiful tracking cards displaying logistic badges, pricing lists, and clipboard copying indicators.
*  **Premium Admin Panel**: Centralized dashboard to manage products, update shipping statuses, add categories, and view user statistics.
*  **Cloudinary Asset Storage**: Multi-image secure cloud uploads.

---

##  Tech Stack

### Frontend Client
* **Core**: React 19 + Vite 8
* **Styling**: Tailwind CSS v4.0 (Custom Theme Tokens)
* **State Manager**: Zustand (Type-Safe store slices)
* **Network & Router**: Axios interceptors + React Router

### Backend API
* **Engine**: Node.js + Express.js v5.x
* **Database**: MongoDB Atlas + Mongoose
* **Security & Optimization**: Helmet, CORS, and Express Rate Limiter
* **Media Handlers**: Multer + Cloudinary SDK

---

##  Project Architecture

```text
E-Commerce-Web-Application/
├── README.md               # Main Workspace Guide
├── ecommerceBackend/       # Express.js API & Database models
│   ├── server.js           # Production Express Entry Point
│   ├── config/             # DB Connection Configs
│   ├── controllers/        # Model Controller logic
│   ├── routes/             # REST Route mappings
│   └── models/             # Mongoose schemas (Product, Cart, Order, etc.)
└── ecommerceFrontend/      # React Client Storefront
    ├── src/
    │   ├── components/     # Reusable UI Atoms (Button, Input, Badge)
    │   ├── pages/          # Catalog, Cart, Wishlist, Admin views
    │   └── store/          # Zustand global state slices
    └── vercel.json         # Vercel Client-Side routing rewrites
```

---

##  Local Development Quickstart

### 1. Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd ecommerceBackend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your local environment by creating a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ecommerceAdvanced
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Run the local development database seeder (seeds all 50 products):
   ```bash
   npm run data:import
   ```
5. Launch the backend API server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate into the frontend directory:
   ```bash
   cd ../ecommerceFrontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup your environment variable in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the local dev server:
   ```bash
   npm run dev
   ```
