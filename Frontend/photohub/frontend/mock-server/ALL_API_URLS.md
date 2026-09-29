# PhotoHub Mock API — All URLs to Test in Postman

Base URL: `http://localhost:4000/api`
(Server: `cd mock-server && npm install && npm start`)

Total endpoints: **43**

---

## Health (1)
```
GET    /api/health
```

## Auth (4)
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

## Users (5)
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
PATCH  /api/users/:id/status
DELETE /api/users/:id
```

## Photographers (7)
```
GET    /api/photographers
GET    /api/photographers?category=Wedding
GET    /api/photographers?location=Mumbai
GET    /api/photographers?search=keyword
GET    /api/photographers/:id
POST   /api/photographers
PUT    /api/photographers/:id
PATCH  /api/photographers/:id/verify
DELETE /api/photographers/:id
```

## Packages (5)
```
GET    /api/packages
GET    /api/photographers/:id/packages
POST   /api/packages
PUT    /api/packages/:id
DELETE /api/packages/:id
```

## Portfolio (3)
```
GET    /api/photographers/:id/portfolio
POST   /api/portfolio
DELETE /api/portfolio/:id
```

## Bookings (8)
```
GET    /api/bookings
GET    /api/users/:id/bookings
GET    /api/photographers/:id/bookings
GET    /api/bookings/:id
POST   /api/bookings
PATCH  /api/bookings/:id/status
PATCH  /api/bookings/:id/cancel
```

## Reviews (3)
```
GET    /api/photographers/:id/reviews
GET    /api/users/:id/reviews
POST   /api/reviews
```

## Payments (6)
```
GET    /api/payments
GET    /api/users/:id/payments
GET    /api/bookings/:id/payments
POST   /api/payments
PATCH  /api/payments/:id/status
```

## Refunds (4)
```
GET    /api/refunds
POST   /api/refunds
PATCH  /api/refunds/:id/approve
PATCH  /api/refunds/:id/reject
```

## Admin (4)
```
GET    /api/admin/stats
GET    /api/admin/payment-issues
PATCH  /api/admin/payment-issues/:id/resolve
GET    /api/admin/logs
```

## Negative / edge cases (to confirm proper error handling)
```
GET    /api/photographers/999        → 404
GET    /api/bookings/999             → 404
PUT    /api/packages/999             → 404
POST   /api/auth/login (unknown email) → 401
GET    /api/this-route-does-not-exist  → 404
```

---

## Quick copy-paste checklist (tick as you test)

- [ ] GET /api/health
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/forgot-password
- [ ] POST /api/auth/reset-password
- [ ] GET /api/users
- [ ] GET /api/users/:id
- [ ] PUT /api/users/:id
- [ ] PATCH /api/users/:id/status
- [ ] DELETE /api/users/:id
- [ ] GET /api/photographers
- [ ] GET /api/photographers/:id
- [ ] POST /api/photographers
- [ ] PUT /api/photographers/:id
- [ ] PATCH /api/photographers/:id/verify
- [ ] DELETE /api/photographers/:id
- [ ] GET /api/packages
- [ ] GET /api/photographers/:id/packages
- [ ] POST /api/packages
- [ ] PUT /api/packages/:id
- [ ] DELETE /api/packages/:id
- [ ] GET /api/photographers/:id/portfolio
- [ ] POST /api/portfolio
- [ ] DELETE /api/portfolio/:id
- [ ] GET /api/bookings
- [ ] GET /api/users/:id/bookings
- [ ] GET /api/photographers/:id/bookings
- [ ] GET /api/bookings/:id
- [ ] POST /api/bookings
- [ ] PATCH /api/bookings/:id/status
- [ ] PATCH /api/bookings/:id/cancel
- [ ] GET /api/photographers/:id/reviews
- [ ] GET /api/users/:id/reviews
- [ ] POST /api/reviews
- [ ] GET /api/payments
- [ ] GET /api/users/:id/payments
- [ ] GET /api/bookings/:id/payments
- [ ] POST /api/payments
- [ ] PATCH /api/payments/:id/status
- [ ] GET /api/refunds
- [ ] POST /api/refunds
- [ ] PATCH /api/refunds/:id/approve
- [ ] PATCH /api/refunds/:id/reject
- [ ] GET /api/admin/stats
- [ ] GET /api/admin/payment-issues
- [ ] PATCH /api/admin/payment-issues/:id/resolve
- [ ] GET /api/admin/logs

For request bodies and expected responses for each of these, see
`API_TEST_PLAN.md` (same folder) or the imported Postman collection
`PhotoHub.postman_collection.json` — every request above already exists
there pre-built, so you can just click **Send** instead of typing URLs.
