# RentNest 🏠

**Find & List Rental Properties with Ease**

A backend REST API for a rental property marketplace where landlords list properties, tenants submit rental requests, and admins oversee the platform.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT |
| Validation | Zod |
| Payment | Stripe / SSLCommerz (pluggable) |

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd rentnest
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### 3. Database Migration

```bash
npx prisma migrate dev
```

### 4. Run Development Server

```bash
npm run dev
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Any authenticated user |

### Properties

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/properties` | Public |
| GET | `/api/properties/:id` | Public |
| POST | `/api/properties` | Landlord |
| PUT | `/api/properties/:id` | Landlord (owner only) |
| DELETE | `/api/properties/:id` | Landlord (owner only) |

### Categories

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/categories` | Public |
| POST | `/api/categories` | Admin |
| PATCH | `/api/categories/:id` | Admin |
| DELETE | `/api/categories/:id` | Admin |

### Rental Requests

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/rentals` | Tenant |
| GET | `/api/rentals` | Tenant / Landlord |
| GET | `/api/rentals/:id` | Tenant / Landlord |
| PATCH | `/api/rentals/:id` | Landlord |

### Payments

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/payments/create` | Tenant |
| POST | `/api/payments/confirm` | Tenant |
| GET | `/api/payments` | Tenant |
| GET | `/api/payments/:id` | Tenant |

### Reviews

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/reviews` | Tenant (post-payment only) |
| GET | `/api/reviews/property/:propertyId` | Public |

### Admin

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/users` | Admin |
| PATCH | `/api/admin/users/:id` | Admin |
| GET | `/api/admin/properties` | Admin |
| GET | `/api/admin/rentals` | Admin |

---

## Roles

| Role | Permissions |
|------|-------------|
| **TENANT** | Browse, request rentals, pay, leave reviews |
| **LANDLORD** | Manage listings, approve/reject requests |
| **ADMIN** | Full platform oversight, user management |