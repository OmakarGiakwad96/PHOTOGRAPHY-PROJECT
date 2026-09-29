# PhotoHub Mock API — Full Postman/Bruno Test Plan

Base URL: `http://localhost:4000/api`
Server must be running: `cd mock-server && npm install && npm start`
Collection: `PhotoHub.postman_collection.json` (numbered folders match this doc)

Data store starts **empty**. Run tests **in order** — later tests depend on
IDs created by earlier ones. Restart the server (`npm start`) to reset
everything back to empty before a fresh run.

Legend: ✅ Positive test (should succeed) · ⚠️ Negative test (should fail correctly)

---

## 0. Health Check

| # | Test | Method & URL | Expected Status | Expected Response |
|---|------|---------------|------------------|---------------------|
| 0.1 ✅ | Server is alive | `GET /health` | 200 | `{ status: "ok", message: "...", time: "..." }` |

---

## 1. Auth

| # | Test | Method & URL | Body | Expected Status | Expected Response |
|---|------|---------------|------|------------------|---------------------|
| 1.1 ✅ | Register photographer | `POST /auth/register` | `{name, email, password, phone, role:"photographer"}` | 201 | `{ token, user: {...} }` — `user.user_id = 1`, no `password` field returned |
| 1.2 ✅ | Register client | `POST /auth/register` | `{name, email, password, phone, role:"client"}` | 201 | `user.user_id = 2` |
| 1.3 ✅ | Register admin | `POST /auth/register` | `{name, email, password, phone, role:"admin"}` | 201 | `user.user_id = 3` |
| 1.4 ✅ | Login with valid email | `POST /auth/login` | `{email: "<client email from 1.2>", password: "anything"}` | 200 | `{ token, user }` — mock server doesn't check password, only email match |
| 1.5 ⚠️ | Login with unknown email | `POST /auth/login` | `{email: "doesnotexist@example.com", password: "x"}` | 401 | `{ message: "Invalid email or password." }` |
| 1.6 ✅ | Forgot password | `POST /auth/forgot-password` | `{email: "<any registered email>"}` | 200 | `{ message: "Password reset link sent to ... (mock)." }` |
| 1.7 ✅ | Reset password | `POST /auth/reset-password` | `{}` (mock ignores token/body) | 200 | `{ message: "Password has been reset (mock)." }` |

---

## 2. Users

| # | Test | Method & URL | Body | Expected Status | Expected Response |
|---|------|---------------|------|------------------|---------------------|
| 2.1 ✅ | Get all users | `GET /users` | — | 200 | Array of 3 users from section 1, **no `password` field** on any of them |
| 2.2 ✅ | Get user by valid id | `GET /users/1` | — | 200 | User object, `password` omitted |
| 2.3 ⚠️ | Get user by invalid id | `GET /users/999` | — | 404 | `{ message: "User not found" }` |
| 2.4 ✅ | Update user | `PUT /users/1` | `{phone: "9999988888"}` | 200 | Updated user, `phone` reflects new value |
| 2.5 ⚠️ | Update non-existent user | `PUT /users/999` | `{phone:"0"}` | 404 | `{ message: "User not found" }` |
| 2.6 ✅ | Block a user | `PATCH /users/2/status` | `{status: "blocked"}` | 200 | `{ user_id: 2, status: "blocked" }` |
| 2.7 ✅ | Unblock the same user | `PATCH /users/2/status` | `{status: "active"}` | 200 | `{ user_id: 2, status: "active" }` |
| 2.8 ✅ | Soft delete user | `DELETE /users/3` | — | 200 | `{ success: true }` |
| 2.9 ✅ | Confirm soft delete flag | `GET /users/3` | — | 200 | `is_deleted: true`, `deleted_at` populated (user still fetchable — soft delete only) |

---

## 3. Photographers

| # | Test | Method & URL | Body | Expected Status | Expected Response |
|---|------|---------------|------|------------------|---------------------|
| 3.1 ✅ | Create photographer profile | `POST /photographers` | `{user_id:1, experience:8, bio:"...", location:"Mumbai, MH", price_per_hour:3500}` | 201 | Object with `photographer_id: 1`, `is_verified: false` |
| 3.2 ✅ | Get all photographers | `GET /photographers` | — | 200 | Array with the one created, includes joined `name`/`email` from user 1 |
| 3.3 ✅ | Get photographer by id | `GET /photographers/1` | — | 200 | Full object incl. `name: "Devansh Rao"` (or whatever you registered) |
| 3.4 ⚠️ | Get photographer by invalid id | `GET /photographers/999` | — | 404 | `{ message: "Photographer not found" }` |
| 3.5 ✅ | Filter by search | `GET /photographers?search=mumbai` (or a bio keyword) | — | 200 | Array filtered to matches only |
| 3.6 ✅ | Filter by location | `GET /photographers?location=Mumbai` | — | 200 | Array filtered by location substring |
| 3.7 ✅ | Update photographer | `PUT /photographers/1` | `{price_per_hour: 3800}` | 200 | `price_per_hour: 3800` in response |
| 3.8 ✅ | Verify photographer | `PATCH /photographers/1/verify` | — | 200 | `is_verified: true` |
| 3.9 ⚠️ | Verify invalid photographer | `PATCH /photographers/999/verify` | — | 404 | `{ message: "Photographer not found" }` |
| 3.10 ✅ | Soft delete photographer | `DELETE /photographers/1` | — | 200 | `{ success: true }` — **do this LAST**, since later sections (4–9) depend on `photographer_id: 1` still being active |

> ⚠️ Tip: Skip test 3.10 until you've finished sections 4–9, or re-create the photographer afterward.

---

## 4. Packages

| # | Test | Method & URL | Body | Expected Status | Expected Response |
|---|------|---------------|------|------------------|---------------------|
| 4.1 ✅ | Create package | `POST /packages` | `{photographer_id:1, name:"Classic Wedding Package", description:"...", price:45000, duration_hours:8, features:"..."}` | 201 | Object with `package_id: 1` |
| 4.2 ✅ | Get all packages | `GET /packages` | — | 200 | Array containing the created package |
| 4.3 ✅ | Get packages by photographer | `GET /photographers/1/packages` | — | 200 | Array scoped to `photographer_id: 1` only |
| 4.4 ✅ | Update package | `PUT /packages/1` | `{price: 47000}` | 200 | `price: 47000` |
| 4.5 ⚠️ | Update invalid package | `PUT /packages/999` | `{price:1}` | 404 | `{ message: "Package not found" }` |
| 4.6 ✅ | Delete package | `DELETE /packages/1` | — | 200 | `{ success: true }` |
| 4.7 ✅ | Confirm soft delete | `GET /packages` | — | 200 | Deleted package **excluded** from the list (endpoint filters `is_deleted`) |

> ⚠️ Tip: Re-create the package (repeat 4.1) before moving to section 6, since Bookings needs an active `package_id`.

---

## 5. Portfolio

| # | Test | Method & URL | Body | Expected Status | Expected Response |
|---|------|---------------|------|------------------|---------------------|
| 5.1 ✅ | Add portfolio item | `POST /portfolio` | `{photographer_id:1, image_url:"/images/sample.jpg", title:"Beachside Wedding", category:"Wedding"}` | 201 | Object with `portfolio_id: 1` |
| 5.2 ✅ | Get portfolio by photographer | `GET /photographers/1/portfolio` | — | 200 | Array containing the item |
| 5.3 ✅ | Delete portfolio item | `DELETE /portfolio/1` | — | 200 | `{ success: true }` |
| 5.4 ⚠️ | Delete invalid portfolio item | `DELETE /portfolio/999` | — | 404 | `{ message: "Portfolio item not found" }` |

---

## 6. Bookings

| # | Test | Method & URL | Body | Expected Status | Expected Response |
|---|------|---------------|------|------------------|---------------------|
| 6.1 ✅ | Create booking | `POST /bookings` | `{user_id:2, photographer_id:1, package_id:1, event_date:"2026-09-01", booking_time:"10:00 AM", location:"...", total_price:45000}` | 201 | Object with `booking_id: 1`, `booking_status: "pending"`, `refund_status: "none"` |
| 6.2 ✅ | Get all bookings | `GET /bookings` | — | 200 | Array with the created booking |
| 6.3 ✅ | Get bookings by user | `GET /users/2/bookings` | — | 200 | Array scoped to `user_id: 2` |
| 6.4 ✅ | Get bookings by photographer | `GET /photographers/1/bookings` | — | 200 | Array scoped to `photographer_id: 1` |
| 6.5 ✅ | Get booking by id | `GET /bookings/1` | — | 200 | Full booking object |
| 6.6 ⚠️ | Get invalid booking | `GET /bookings/999` | — | 404 | `{ message: "Booking not found" }` |
| 6.7 ✅ | Confirm booking | `PATCH /bookings/1/status` | `{booking_status: "confirmed"}` | 200 | `booking_status: "confirmed"` |
| 6.8 ✅ | Complete booking | `PATCH /bookings/1/status` | `{booking_status: "completed"}` | 200 | `booking_status: "completed"` |
| 6.9 ✅ | Cancel a booking | Create a 2nd booking first, then `PATCH /bookings/2/cancel` | `{cancel_reason: "Client requested cancellation"}` | 200 | `booking_status: "cancelled"`, `cancel_reason` set, `cancelled_at` populated |

---

## 7. Reviews

*Requires booking 1 to be `completed` (from 6.8).*

| # | Test | Method & URL | Body | Expected Status | Expected Response |
|---|------|---------------|------|------------------|---------------------|
| 7.1 ✅ | Create review | `POST /reviews` | `{user_id:2, photographer_id:1, booking_id:1, rating:5, comment:"Excellent!"}` | 201 | Object with `review_id: 1` |
| 7.2 ✅ | Get reviews by photographer | `GET /photographers/1/reviews` | — | 200 | Array containing the review |
| 7.3 ✅ | Get reviews by user | `GET /users/2/reviews` | — | 200 | Array containing the review |

---

## 8. Payments

| # | Test | Method & URL | Body | Expected Status | Expected Response |
|---|------|---------------|------|------------------|---------------------|
| 8.1 ✅ | Create payment | `POST /payments` | `{booking_id:1, amount:45000, payment_method:"card", payment_gateway:"Razorpay", transaction_id:"TXN10001"}` | 201 | Object with `payment_id: 1`, `payment_status: "pending"` |
| 8.2 ✅ | Get all payments | `GET /payments` | — | 200 | Array containing the payment |
| 8.3 ✅ | Get payments by user | `GET /users/2/payments` | — | 200 | Array (resolved via that user's bookings) |
| 8.4 ✅ | Get payments by booking | `GET /bookings/1/payments` | — | 200 | Array scoped to `booking_id: 1` |
| 8.5 ✅ | Mark payment successful | `PATCH /payments/1/status` | `{payment_status: "success"}` | 200 | `payment_status: "success"` |
| 8.6 ⚠️ | Update invalid payment | `PATCH /payments/999/status` | `{payment_status:"success"}` | 404 | `{ message: "Payment not found" }` |

---

## 9. Refunds

| # | Test | Method & URL | Body | Expected Status | Expected Response |
|---|------|---------------|------|------------------|---------------------|
| 9.1 ✅ | Request refund | `POST /refunds` | `{booking_id:1, payment_id:1, refund_amount:45000, refund_reason:"Photographer unavailable"}` | 201 | Object with `refund_id: 1`, `refund_status: "pending"` |
| 9.2 ✅ | Get all refunds | `GET /refunds` | — | 200 | Array containing the refund |
| 9.3 ✅ | Approve refund | `PATCH /refunds/1/approve` | `{approved_by_admin_id: 3}` (use the admin `user_id` from 1.3, or an `admin_id` if you tracked one) | 200 | `refund_status: "processed"`, `processed_at` populated |
| 9.4 ✅ | Reject a refund | Create a 2nd refund, then `PATCH /refunds/2/reject` | — | 200 | `refund_status: "rejected"` |
| 9.5 ⚠️ | Approve invalid refund | `PATCH /refunds/999/approve` | `{}` | 404 | `{ message: "Refund not found" }` |

---

## 10. Admin

| # | Test | Method & URL | Body | Expected Status | Expected Response |
|---|------|---------------|------|------------------|---------------------|
| 10.1 ✅ | Dashboard stats | `GET /admin/stats` | — | 200 | `{ totalUsers, totalPhotographers, totalBookings, totalRevenue, pendingApprovals, openIssues }` — verify counts match what you created |
| 10.2 ✅ | Get payment issues | `GET /admin/payment-issues` | — | 200 | `[]` (none created yet — no endpoint to create one is exposed by default; see note below) |
| 10.3 ⚠️ | Resolve non-existent issue | `PATCH /admin/payment-issues/1/resolve` | — | 404 | `{ message: "Issue not found" }` (expected, since none were created) |
| 10.4 ✅ | Get system logs | `GET /admin/logs` | — | 200 | `[]` (none created — this endpoint is read-only in the mock) |

---

## 11. Cross-cutting / negative tests (run anywhere)

| # | Test | Method & URL | Expected Status | Expected Response |
|---|------|---------------|------------------|---------------------|
| 11.1 ⚠️ | Unknown route | `GET /api/does-not-exist` | 404 | `{ message: "No mock route for GET /api/does-not-exist" }` |
| 11.2 ⚠️ | Wrong method on valid route | `DELETE /health` | 404 | Same fallback message (route only supports GET) |
| 11.3 ✅ | CORS works from browser/frontend | Any GET from `http://localhost:5173` (the React app) | 200 | No CORS error in browser console — server has `cors()` enabled globally |
| 11.4 ✅ | Content-Type on POST | Send `POST /users-like` request with `Content-Type: application/json` header | 200/201 | Body parses correctly; omitting the header on a POST will make `req.body` empty/`undefined` — good test to show why the header matters |

---

## Suggested run order for a live demo

1. Section 0 (health)
2. Section 1 (create 3 users)
3. Section 2 (manage those users)
4. Section 3.1–3.9 (create + manage photographer, **skip 3.10**)
5. Section 4 (packages) — **re-run 4.1 after 4.6** so the package exists again
6. Section 5 (portfolio)
7. Section 6 (bookings)
8. Section 7 (reviews)
9. Section 8 (payments)
10. Section 9 (refunds)
11. Section 10 (admin stats — should now show non-zero counts)
12. Section 11 (negative/edge cases)

This order proves: registration → profile creation → service listing →
booking → payment → review → refund, end to end, entirely through JSON
requests with zero pre-seeded data.
