# Orvexa — Freelance Services Platform (Full-Stack Application)

**Orvexa** is a full-stack freelance services marketplace. Clients discover and buy services, pay securely through an escrow-style balance, and collaborate with freelancers inside real-time contract chats. Admins and support staff manage the whole platform from a dedicated dashboard.

This folder contains the **Next.js frontend**. The API lives in [`./backend`](./backend/README.md) (NestJS · PostgreSQL · Redis · BullMQ · Socket.IO).

---

## Highlights

- Three user roles with tailored experiences: **Client**, **Freelancer**, **Admin / Support**
- **Escrow-style payments** — money is frozen on purchase and released only when the client accepts the delivery
- **Contract workspace** with real-time chat, image attachments and emoji picker
- **Real-time notifications** and **online presence** over Socket.IO
- **Identity verification** flow with admin review
- **Service moderation** — every service is reviewed by an admin before it is published
- Full **admin dashboard**: users, services, orders, payments, contracts, support and platform wallet
- Built-in **support center** with FAQ and live conversations
- Skeleton loading states, empty states and toast feedback throughout

---

## Features

### For everyone
- Landing page: hero, stats marquee, about, featured categories, recommended services, client reviews and call-to-action
- Browse and **search services** with category filters and pagination
- Service details: image gallery, features, keywords, rating, reviews and seller card
- Browse **experts** and view public freelancer / user profiles
- Registration with a **password strength meter**; secure login with refresh-token handling
- Informational pages: About, How it works, Careers, Community, Updates, Terms and Privacy
- Cookie consent banner

### For clients
- **Cart** — add/remove services, order summary, clear cart
- **Orders** — create an order from the cart, view order history and details, cancel while unpaid
- **Wallet** — top up balance, see available vs. frozen funds
- **Payments** — pay an order from balance, payment history and payment details
- **Contracts** — track every purchased service, filter/search, see status and deadline
- **Accept delivery** to release the payment to the freelancer
- **Review** a service after the contract is completed

### For freelancers
- Editable **freelancer profile**: avatar, cover, job title, about, skills, website, quick stats and ratings
- **Create / edit services** with image upload, features, keywords, price, delivery time and a **live preview**
- **My services** page with status filters (`pending`, `published`, `rejected`) and the admin's rejection reason
- **Deliver work** from the contract page and get paid on acceptance
- Reviews received and completed-orders statistics

### Contract workspace
- Real-time **chat** between client and freelancer (text + up to 5 images, emoji picker, delete message)
- Contract sidebar: service, parties, amount, deadline and status
- Automatic **expiry & refund** if the freelancer misses the deadline (handled by the backend's BullMQ job)

### Trust & safety
- **Identity verification** (profile photo + ID document) with pending / approved / rejected states and retry
- Verification badge on profiles
- Blocked accounts are rejected immediately

### Support
- Support center with topics and FAQ
- Open a support conversation, chat with the support team, attach files
- Conversation list with status and unread indicators

### Admin / Support dashboard (`/admin`)
- **Dashboard** with animated stats, revenue and contract-status overview
- **Users** management: roles, block, delete, and **verification review**
- **Services** moderation: approve or reject with a reason
- **Orders**, **payments** and **contracts** monitoring with pagination
- **Support** inbox and conversation details
- **Platform wallet**: view commission balance and withdraw

### Real-time
- Live notification bell with sound and toast
- Mark one / all notifications as read (synced across tabs)
- Online/offline presence for users
- Cookie-authenticated Socket.IO connection

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) |
| UI library | **React 19** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS 4** |
| State management | **Zustand** (auth, notifications, messages, presence) |
| Real-time | **socket.io-client** |
| Icons / UX | `lucide-react`, `react-hot-toast`, `emoji-picker-react` |
| Linting | ESLint 9 + `eslint-config-next` |

---

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx · page.tsx        # root layout + landing page
│   ├── (pages)/                     # route groups per feature
│   │   ├── (auth)/                  # login, register
│   │   ├── (services)/              # services, service/[id], create/edit service, my services
│   │   ├── (carts)/                 # cart
│   │   ├── (orders)/                # orders, order/[id]
│   │   ├── (payments)/              # payments, payment/[id], wallet
│   │   ├── (contracts)/             # contracts, contract/[id] (chat workspace)
│   │   ├── (reviews)/               # review/[id]
│   │   ├── (notifications)/
│   │   ├── (supports)/              # support center, conversations
│   │   ├── (user-profiles)/         # profile, freelancer profile, public profiles
│   │   ├── (user-verifications)/    # identity verification
│   │   ├── (users)/                 # experts
│   │   └── about · how-it-works · careers · community · updates · terms · privacy
│   ├── admin/                       # admin dashboard (users, services, orders, payments, contracts, support, wallets)
│   ├── apis/                        # API clients per resource + shared request() wrapper
│   ├── hooks/                       # data-fetching hooks per resource
│   ├── stores/                      # Zustand stores
│   ├── types/                       # shared TypeScript types
│   ├── config/
│   │   ├── middlewares/             # Auth / Client / Freelancer / Admin route guards
│   │   ├── routes/                  # ProtectedRoute
│   │   ├── socket/                  # Socket.IO client
│   │   └── ui/                      # notification toast
│   └── shared/components/           # Navbar, Footer, Hero, Pagination, badges, …
└── public/
```

Each page follows the same convention: `page.tsx` composes small, focused components from a sibling `components/` folder, with `utils/` for formatting and status helpers.

---

## How It Works

**API layer.** All HTTP calls go through a single `request()` wrapper (`app/apis/request.ts`) that:
- sends cookies (`credentials: "include"`) — tokens are HTTP-only and never exposed to JavaScript,
- automatically calls the refresh endpoint and **retries once** when the access token expires (`401`),
- throws the backend error payload so components can show clean toast messages.

**State.** Zustand stores hold the current user, notifications, chat messages and online users. `LayoutClient` loads the user on startup and, once authenticated, connects the presence, notification and message sockets.

**Access control.** Route guards (`AuthMiddleware`, `ClientMiddleware`, `FreelancerMiddleware`, `AdminMiddleware`) and a `ProtectedRoute` component show a forbidden state or redirect when a role is not allowed. The backend enforces the same rules on every endpoint — the frontend guards are for UX, not security.

---

## Getting Started

**Prerequisites:** Node.js 20+ and the [backend](../backend/README.md) running on `http://localhost:4001`.

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**.

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint the project |

### Configuration

- The backend URL is set in `app/apis/request.ts` (`BACKEND_URL`, default `http://localhost:4001`).
- Remote images are allowed from `res.cloudinary.com` in `next.config.ts`.
- The backend allows CORS only from `http://localhost:3000` by default (see `backend/src/url.ts`).

### Run the whole project

```bash
# terminal 1 — backend
cd backend && npm install && cp .env.example .env && npm run start:dev

# terminal 2 — frontend
cd frontend && npm install && npm run dev
```

Optionally seed demo data with `npm run seed` in the backend (demo admin: `admin@orvexa.com`).

---

## Roadmap

- Move `BACKEND_URL` to an environment variable (`NEXT_PUBLIC_API_URL`)
- Dispute / cancellation flow for contracts
- Real payment gateway for balance top-ups
- Localization (Arabic / RTL) and dark/light theme
- End-to-end tests (Playwright)

---

## Related

- 📘 **Backend documentation:** [`../backend/README.md`](../backend/README.md) — architecture, contract lifecycle, payment race-condition handling and BullMQ-based contract expiration.
