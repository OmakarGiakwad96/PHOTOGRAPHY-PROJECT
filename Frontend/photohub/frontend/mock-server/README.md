# PhotoHub Mock API (no database required)

A tiny Express server that returns real JSON, shaped exactly like the ER
diagram tables, **without needing MySQL running**. The data store starts
**completely empty** — no dummy names. You add records yourself through
Postman/Bruno, and they immediately show up in the JSON responses.

## 1. Run it

```bash
cd mock-server
npm install
npm start
```
You should see:
```
✅ PhotoHub mock API running at http://localhost:4000/api
```

## 2. Import into Postman or Bruno

- **Postman**: File → Import → select `PhotoHub.postman_collection.json`.
- **Bruno**: Bruno can import Postman v2.1 collections directly — open Bruno →
  Import Collection → select `PhotoHub.postman_collection.json`.

## 3. Recommended order (each folder is numbered)

The collection is organized so you **create data first, then fetch it**,
proving the JSON round-trips correctly:

1. **Auth** — register a photographer, a client, and an admin (creates `users`)
2. **Users** — list/update/block the users you just created
3. **Photographers** — create a photographer profile linked to the photographer user
4. **Packages** — add a package under that photographer
5. **Portfolio** — add a portfolio image under that photographer
6. **Bookings** — the client books the photographer's package
7. **Reviews** — the client reviews the photographer after the booking completes
8. **Payments** — record a payment against the booking
9. **Refunds** — request/approve/reject a refund on that payment
10. **Admin** — dashboard stats, payment issues, system logs

Run requests **top to bottom within each numbered folder** and the IDs line
up automatically (first user → `user_id: 1`, first photographer →
`photographer_id: 1`, etc.), since every collection starts empty.

## 4. What you'll see

Every response is plain JSON — e.g. `POST /api/photographers` returns the
exact photographer object you sent (plus its new `photographer_id`), and
`GET /api/photographers` immediately includes it. No database, no seed data,
nothing pre-filled — just what you send in.

## 5. Resetting

Data lives in memory only (`data.js`). Restart the server
(`Ctrl+C` then `npm start`) to wipe everything back to empty.

## 6. Wiring this to the real MySQL database later

This mock server is a stand-in for a real backend. Once you build one
(Node/Express, Laravel, Spring Boot, etc.) against `database/01_schema.sql`,
keep the same route shapes (`/api/users`, `/api/photographers`,
`/api/bookings`, etc.) so the Postman collection and the React frontend
(`src/services/*.js`) both keep working without changes — just point
`VITE_API_BASE_URL` at your real backend instead of this mock one.
