# Ponos.official — Cat Base Shop (Frontend)

React + TypeScript + Vite frontend for the Cat Base Shop e-commerce demo
based on _The Battle Cats_ by PONOS Corporation.

Built as a coursework project for **TUM (Technical University of Moldova)**,
Faculty of Computers, Informatics and Microelectronics, discipline
_Web Technologies_.

## Stack

- **React 19** with hooks (no class components)
- **TypeScript** strict mode
- **Vite 7** dev server with Hot Module Replacement
- **React Router 7** for client-side routing
- **Inter + Outfit** typography (Google Fonts)
- **Vanilla CSS** with CSS custom properties — no Tailwind / CSS-in-JS

## Features

- **10 pages** with full routing: Home, Catalog, Product details, Login,
  Register, Cart, Checkout, Profile (with order history), Admin panel,
  custom 404 with looping video
- **JWT authentication** with role-based UI (User / Manager / Admin)
- **Global cart** via React Context, persisted in localStorage
- **Admin panel** with 2 tabs: Battle Items CRUD and User Management
- **Sticky header** with cart badge and role indicator
- **Adaptive design** for mobile and desktop

## Architecture
src/
├── api/
│   ├── battleCatsApi.ts        Main API client with auth header injection
│   └── config.ts                API_BASE_URL + localStorage keys
├── components/
│   ├── Header.tsx               Sticky nav, Login/Sign Up, cart badge
│   ├── Footer.tsx               Brand and project info
│   ├── LoginModal.tsx           POST /api/session/auth (inline modal)
│   ├── RegisterModal.tsx        POST /api/reg (inline modal)
│   ├── ProductCard.tsx          Catalog card with click navigation
│   └── ProductMiniCard.tsx      Compact card for sidebar lists
├── context/
│   ├── AuthContext.tsx          JWT decode and role extraction
│   └── CartContext.tsx          Map<productId, qty> with localStorage sync
├── pages/                       10 route components
│   ├── HomePage.tsx
│   ├── CatalogPage.tsx
│   ├── ProductDetailsPage.tsx   With Health/Attack/Range stats bars
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── ProfilePage.tsx          Tabs: account info + order history
│   ├── AdminPage.tsx            Tabs: Battle Items + Users
│   └── NotFoundPage.tsx         With looping video background
├── sections/
│   ├── HeroSection.tsx
│   ├── CatalogSection.tsx
│   ├── FavoritesSection.tsx
│   └── AboutSection.tsx
├── data/products.ts             Mock data fallback
├── types.ts                     Shared types incl. BattleItemDto contract
├── App.tsx                      Router and layout
└── index.css                    Design tokens (colors, fonts, shadows)

## Running locally

Prerequisites:
- Node.js 20+
- The companion backend running at `http://localhost:5257`

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Override the backend URL through `.env.local`:
VITE_API_BASE_URL=http://localhost:5257

## Test accounts (seeded in backend database)

| Login   | Password    | Role    |
|---------|-------------|---------|
| admin   | admin123    | Admin   |
| manager | manager123  | Manager |
| user    | user1234    | User    |

After login, the JWT is stored in `localStorage.cbs_token` and the
**Admin Panel** becomes visible to Admin and Manager users. Cart and
order history persist in `localStorage.cbs_cart` and
`localStorage.cbs_orders_<userName>` respectively.

## Backend dependency

Sister repository: **[Back-end](https://github.com/markl666-nat/Back-end)**
contains the ASP.NET Core 8 Web API.

CORS is configured on the backend to allow requests from
`http://localhost:5173` (the Vite dev port).

## Lab coverage (TUM Web Technologies)

- **Lab 2** — Catalog with search, filters, like/cart counters, fetch API,
  loading / error / empty states.
- **Lab 6** — Full multi-page web service: login, registration, cart,
  checkout, order history, admin panel.

## Build for production

```bash
npm run build
npm run preview
```

The output goes to `dist/`.

## Authors

- **markl666-nat** (Маринский М.)
- **radicq** (Рада Черный)

---

© 2026 Ponos.official — built for TUM coursework defense.