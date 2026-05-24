#  Merchant Grid — Luxury React Storefront Client

This is the live frontend client application for **Merchant Grid**. Developed with React, Vite, and custom HSL Hues under Tailwind CSS v4, it presents a highly immersive, futuristic shopping interface featuring dynamic micro-interactions, beautiful glassmorphism dashboards, and high-contrast gold layouts.

---

##  Live Deployments

* **Live Frontend Website**: [e-commerce-web-application-ochre.vercel.app](https://e-commerce-web-application-ochre.vercel.app)
* **Linked REST API**: `https://merchant-grid.onrender.com/api`

---

##  Theme Specs & HSL Tokens

Our custom luxury tokens are mapped within `@theme` inside [`index.css`](file:///c:/Users/puish/Desktop/Projects/E-CommerceWebApplication/ecommerceFrontend/src/index.css):
* **Obsidian Canvas Backdrop**: `bg-obsidian-950/90` with matching glass frost blurs (`.glass-effect`).
* **Metallic Aurelian Gold Accent**: `text-accent-500` and `border-accent-500/30`.
* **State Transition Scaling**: Buttons scale down to `scale-[0.97]` on click to mimic premium physical feedback.

---

##  Tech Architecture

* **Framework Engine**: React 19 + Vite 8
* **Styling**: Tailwind CSS v4.0 (declaring modern Google fonts *Plus Jakarta Sans* and *Inter*)
* **Routing**: React Router (`react-router`) backed by a custom Vercel router rewrite fallback (`vercel.json`).
* **Global State Managers**: Zustand Store slices with deep selective reactive loops:
  * `authStore.js` — Handles authentication status, user details, and tokens.
  * `cartStore.js` — Coordinates cart items, quantities, and checkouts.
  * `wishlistStore.js` — Tracks favorited product arrays with population handlers.
  * `productStore.js` — Manages product catalogs, filters, and admin tasks.
* **Notification System**: `react-hot-toast` rendering smooth floating alerts.

---

##  Production Setup (Vercel Integration)

Map this environment variable inside your **Vercel Project Dashboard**:

* **Key**: `VITE_API_URL`
* **Value**: `https://merchant-grid.onrender.com/api`

This directs Axios to query your live Render backend APIs for all catalog, profile, and order transactions.

---

##  Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup local env:
   Create a `.env` file containing:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Verify compiling and bundle sizes:
   ```bash
   npm run build
   ```
