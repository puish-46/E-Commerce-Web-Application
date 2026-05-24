#  Merchant Grid — Production Backend REST API

This is the production-ready REST API service powering the **Merchant Grid** e-commerce ecosystem. Built with Express.js and MongoDB, it features highly optimized request-limiting logic, isolated database clusters, secure JWT middleware, and Cloudinary media upload channels.

---

##  Live Endpoint Details

* **Live Base URL**: [merchant-grid.onrender.com](https://merchant-grid.onrender.com)
* **Status Endpoint**: `GET https://merchant-grid.onrender.com/api` (limiter checks, connection integrity checks)

---

##  Tech Stack & Security Controls

* **REST Router**: Express.js v5.x (using modern catch-all parameter compilers)
* **ODM Layer**: Mongoose & MongoDB Atlas
* **CORS Middleware**: Dynamic permitted origins authorization linked to `process.env.FRONTEND_URL`
* **Limiter Throttle**: `express-rate-limit` allowing maximum 200 checks per 15 minutes per IP
* **Security Headers**: `helmet` headers (cross-origin resource policies disabled specifically to allow client asset rendering)
* **Cloud Storage**: Multer + Cloudinary SDK integration

---

##  Production Environment Variables (Render Setup)

Create these configurations inside your **Render Dashboard** to launch:

```env
NODE_ENV=production
MONGO_URI=your_classic_mongodb_atlas_connection_string_targeting_/ecommerce
JWT_SECRET=your_secure_jwt_secret_token
FRONTEND_URL=https://e-commerce-web-application-ochre.vercel.app
CLOUDINARY_CLOUD_NAME=dmy4pethk
CLOUDINARY_API_KEY=279957134391697
CLOUDINARY_API_SECRET=kM7UrJWyKz5uKu6qv2dDaDpWk5k
```

---

##  REST API Endpoints Map

###  Authentication (`/api/auth`)
* `POST /api/auth/register` — Create a new customer profile.
* `POST /api/auth/login` — Authenticate credentials & retrieve JWT token.
* `GET /api/auth/profile` — Fetch currently authenticated user credentials.

###  Product Operations (`/api/products`)
* `GET /api/products` — Retrieve products with flexible category sorting, page limits, and search inputs.
* `GET /api/products/:id` — Details of a single product.
* `POST /api/products` (Admin) — Add a new product to the collection.
* `PUT /api/products/:id` (Admin) — Modify product catalog coordinates.
* `DELETE /api/products/:id` (Admin) — Remove a product completely.

###  User Features
* `/api/cart` — GET cart details, POST to update items, and DELETE to clear items.
* `/api/wishlist` — GET wishlist items, POST to toggle a product on/off.
* `/api/orders` — POST to check out, GET to retrieve customer order list.

###  Categories (`/api/categories`)
* `GET /api/categories` — Retrieve active item categories.
* `POST /api/categories` (Admin) — Add a new category tag.

---

##  Running Locally

1. Install modules:
   ```bash
   npm install
   ```
2. Setup local `.env` with a local port and local MongoDB instance.
3. Seed the catalog:
   ```bash
   npm run data:import
   ```
4. Start development mode (with active file reloads via nodemon):
   ```bash
   npm run dev
   ```
