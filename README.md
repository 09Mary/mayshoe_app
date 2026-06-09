# Mayshoe

A Kenyan shoe e-commerce platform with M-Pesa payments.

**Stack:** React 19 + Vite · Django 6 + DRF · SQLite (dev) · Tailwind CSS + DaisyUI · SimpleJWT

---

## Project structure

```
mayshoe_app/
├── backend/          # Django REST API
│   ├── config/       # Settings, URLs, WSGI
│   ├── users/        # Custom user model, registration, JWT login
│   ├── shoes/        # Product catalogue, filters, time-limited drops
│   ├── orders/       # Order + OrderItem models and API
│   ├── payments/     # M-Pesa Daraja STK push integration
│   ├── reviews/      # Product reviews
│   ├── wishlist/     # Per-user saved items
│   └── requirements.txt
└── frontend/         # React SPA
    └── src/
        ├── pages/    # Home, Shop, Cart, Checkout, Orders, Wishlist, Profile, Auth
        ├── components/  # Navbar, Login, Signup, ProductCard, …
        └── utils/    # auth.js (JWT helpers)
```

---

## Getting started

### Backend

> **Requires Python 3.12+** (Django 6 will not install on older versions). On macOS the system `python3` is often 3.9 — use a newer interpreter, e.g. `python3.13` from Homebrew.

```bash
cd backend
python3.13 -m venv venv        # any Python >= 3.12
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env           # fill in real values
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies API calls to `http://127.0.0.1:8000`.

---

## Environment variables

All secrets are read from environment variables. Copy `backend/.env.example` to `backend/.env` and fill in values. Never commit `.env`.

| Variable | Description | Dev default |
|---|---|---|
| `SECRET_KEY` | Django secret key | insecure dev fallback |
| `DEBUG` | Enable debug mode | `True` |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173` |
| `MPESA_CONSUMER_KEY` | Daraja app consumer key | — |
| `MPESA_CONSUMER_SECRET` | Daraja app consumer secret | — |
| `MPESA_SHORTCODE` | M-Pesa shortcode | `174379` (sandbox) |
| `MPESA_PASSKEY` | Daraja Lipa Na M-Pesa passkey | — |
| `MPESA_CALLBACK_URL` | Public URL Safaricom will POST to | — |

---

## API endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register/` | — | Create account |
| POST | `/api/auth/login/` | — | Obtain JWT access + refresh tokens |
| POST | `/api/auth/refresh/` | — | Refresh access token |
| GET | `/api/auth/profile/` | ✓ | Current user profile |
| GET | `/api/shoes/` | — | List shoes (filterable) |
| GET | `/api/shoes/<id>/` | — | Shoe detail |
| POST/PUT/DELETE | `/api/shoes/` | Admin | Manage catalogue |
| GET | `/api/shoes/categories/` | — | List categories |
| GET | `/api/shoes/latest/` | — | Most recently added shoe |
| GET | `/api/shoes/timely/` | — | Currently available time-limited drops |
| GET/POST | `/api/orders/` | ✓ | List or create orders |
| POST | `/api/payments/` | ✓ | Initiate M-Pesa STK push |
| POST | `/api/payments/callback/` | — | Safaricom payment result callback |
| GET | `/api/payments/<id>/status/` | ✓ | Poll payment status |
| GET/POST | `/api/reviews/` | Read: — / Write: ✓ | Product reviews |
| GET/POST/DELETE | `/api/wishlist/` | ✓ | Saved items (user-scoped) |

---

## M-Pesa payment flow

```
Customer → "Pay with M-Pesa"
    │
    ▼
POST /api/orders/          — create order, get order_id
    │
    ▼
POST /api/payments/        — initiate STK push via Daraja API
    │                        customer receives push on phone
    ▼
Frontend polls GET /api/payments/<id>/status/   (every 3 s, up to 2 min)
    │
    │  Safaricom calls POST /api/payments/callback/
    │  → backend marks payment SUCCESS / FAILED, order status → "paid"
    │
    ▼
Poll returns SUCCESS → cart cleared → redirect to /orders
```

**For local development**, Safaricom cannot reach `localhost`. Use [ngrok](https://ngrok.com) to expose port 8000 and set the resulting URL as `MPESA_CALLBACK_URL`.

Sandbox test phone: `254708374149` · PIN: any digits · shortcode: `174379`

---

## Changes log

### Bug fixes & setup
- **`backend/reviews/urls.py`** & **`backend/wishlist/urls.py`** — Router registration was missing a `basename`. Because these viewsets define `get_queryset()` instead of a `queryset` attribute, DRF raised at import time, which crashed the entire URLconf and made *every* API endpoint (including login/register) fail. Added explicit `basename`.
- **`backend/requirements.txt`** — Added `Pillow` (required by `Shoe.image` `ImageField`; Django's system check fails without it).
- **`backend/users/serializers.py`** & **`backend/users/views.py`** — New accounts are now auto-activated when `DEBUG=True` so you can register and log in locally without an SMTP server; email verification is still enforced in production.

### M-Pesa integration
- **`backend/payments/mpesa.py`** *(new)* — Daraja service: `get_access_token()`, `initiate_stk_push()`, `normalize_phone()` (handles `07…`, `+254…`, `254…` formats)
- **`backend/payments/models.py`** — Added `mpesa_checkout_request_id` (indexed) and `mpesa_receipt_number` fields
- **`backend/payments/views.py`** — Replaced mock auto-success with real STK push; added `PaymentCallbackView` (no-auth, receives Safaricom result) and `PaymentStatusView` (authenticated polling endpoint); wraps order status update in `transaction.atomic`
- **`backend/payments/urls.py`** — Added `/callback/` and `/<id>/status/` routes
- **`backend/payments/serializers.py`** — Fixed `order.total` → `order.total_price` bug; new fields marked read-only
- **`backend/requirements.txt`** *(new)* — Documents all backend dependencies including `requests`
- **`frontend/src/pages/Checkout.jsx`** — Full polling UI: "check your phone" waiting state, success, failed, and timeout states with retry option; form inputs now controlled components

### Security hardening
- **`backend/config/settings.py`** — `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` all moved to environment variables; `CorsMiddleware` moved to top of `MIDDLEWARE` (was at bottom, breaking CORS preflight)
- **`backend/.env.example`** *(new)* — Documents all required env vars; safe to commit
- **`.gitignore`** *(new)* — Excludes `.env`, `db.sqlite3`, `__pycache__`, `node_modules`, `media/`, IDE folders
- **`backend/shoes/views.py`** — Added `IsAdminOrReadOnly`: public read access, `is_staff` required for write operations
- **`backend/reviews/views.py`** — Added `IsAuthenticatedOrReadOnly` + `IsOwnerOrReadOnly`: login required to write, only the author can edit/delete their own review
- **`backend/wishlist/views.py`** — Added `IsAuthenticated`; `get_queryset` now scoped to `request.user` (users can no longer read each other's wishlists)
- **`frontend/src/api.js`** — Token interceptor now checks `sessionStorage` as fallback (fixes sessions where "Remember Me" was off)
- **`frontend/src/utils/auth.js`** — `getToken`, `logout`, `getUser` all handle both `localStorage` and `sessionStorage`
- **`frontend/src/components/Signup.jsx`** — Added client-side validation (required fields, email format, min password length), server error display, `useNavigate` instead of `window.location.href`

---

## Admin dashboard

Staff users (those with `is_staff=True` in Django) see an **Admin** link in the navbar.

| Route | Description |
|---|---|
| `/admin-dashboard` | Stats overview: revenue, order counts, low stock alert |
| `/admin-dashboard/orders` | All orders, filterable by status; update status inline |
| `/admin-dashboard/products` | Product list with stock levels; add, edit (price/stock/active), delete |

To make a user staff: `python manage.py shell` → `User.objects.filter(username='you').update(is_staff=True)`

## Email flows

In development, emails print to the terminal (console backend). For production set `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend` and the SMTP env vars.

**Email verification** — triggered on registration:
- **When `DEBUG=True` (development):** accounts are activated immediately on registration so you can log in without a real mail server. No verification email is required.
- **When `DEBUG=False` (production):**
  1. User registers → account inactive, verification email sent
  2. User clicks link → `/verify-email?token=<uuid>` → account activated
  3. User can now log in

**Password reset**:
1. User visits `/reset-password`, enters email
2. Reset link sent → `/reset-password/confirm?uid=<uid>&token=<token>`
3. User sets new password, redirected to login

## Known remaining gaps

| Area | Issue |
|---|---|
| Database | SQLite is for development only — switch to PostgreSQL before production |
| Secret key | The old `SECRET_KEY` is in git history; generate a new one for production |
| JWT storage | Tokens in `localStorage`/`sessionStorage` are XSS-vulnerable — production hardening requires httpOnly cookies + CSRF tokens |
| Tests | No tests exist anywhere in the project |