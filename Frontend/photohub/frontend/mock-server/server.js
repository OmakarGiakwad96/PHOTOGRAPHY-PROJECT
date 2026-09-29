// PhotoHub Mock API Server
// -------------------------------------------------------------
// A tiny Express server that returns real JSON responses shaped
// exactly like the ER diagram tables — with NO database connection.
// Data lives in memory (see data.js) and resets on restart.
//
// Purpose: let evaluators test every endpoint in Postman/Bruno
// without needing to set up MySQL first.
//
// Run:   npm install && npm start
// Base URL: http://localhost:4000/api
// -------------------------------------------------------------

const express = require('express')
const cors = require('cors')
const db = require('./data')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000

// Small helper so every response has a consistent envelope-free JSON body
// (matches what src/utils/api.js in the frontend expects: raw JSON, not wrapped).
function notFound(res, message = 'Not found') {
  return res.status(404).json({ message })
}

// ---------------------------------------------------------------
// Health check
// ---------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PhotoHub mock API is running', time: new Date().toISOString() })
})

// ---------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body
  const user = db.users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase())
  if (!user) return res.status(401).json({ message: 'Invalid email or password.' })
  const { password, ...safeUser } = user
  res.json({ token: 'mock-jwt-token', user: safeUser })
})

app.post('/api/auth/register', (req, res) => {
  const payload = req.body
  const newUser = {
    user_id: db.nextId(db.users, 'user_id'),
    status: 'active',
    is_deleted: false,
    created_at: new Date().toISOString(),
    profile_picture: '',
    ...payload,
  }
  db.users.push(newUser)
  const { password, ...safeUser } = newUser
  res.status(201).json({ token: 'mock-jwt-token', user: safeUser })
})

app.post('/api/auth/forgot-password', (req, res) => {
  res.json({ message: `Password reset link sent to ${req.body.email} (mock).` })
})

app.post('/api/auth/reset-password', (req, res) => {
  res.json({ message: 'Password has been reset (mock).' })
})

// ---------------------------------------------------------------
// USERS
// ---------------------------------------------------------------
app.get('/api/users', (req, res) => {
  res.json(db.users.map(({ password, ...u }) => u))
})

app.get('/api/users/:id', (req, res) => {
  const user = db.users.find((u) => u.user_id === Number(req.params.id))
  if (!user) return notFound(res, 'User not found')
  const { password, ...safeUser } = user
  res.json(safeUser)
})

app.put('/api/users/:id', (req, res) => {
  const idx = db.users.findIndex((u) => u.user_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'User not found')
  db.users[idx] = { ...db.users[idx], ...req.body }
  const { password, ...safeUser } = db.users[idx]
  res.json(safeUser)
})

app.patch('/api/users/:id/status', (req, res) => {
  const idx = db.users.findIndex((u) => u.user_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'User not found')
  db.users[idx].status = req.body.status
  res.json({ user_id: db.users[idx].user_id, status: db.users[idx].status })
})

app.delete('/api/users/:id', (req, res) => {
  const idx = db.users.findIndex((u) => u.user_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'User not found')
  db.users[idx].is_deleted = true
  db.users[idx].deleted_at = new Date().toISOString()
  res.json({ success: true })
})

// ---------------------------------------------------------------
// PHOTOGRAPHERS
// ---------------------------------------------------------------
function photographerWithName(p) {
  const user = db.users.find((u) => u.user_id === p.user_id)
  return { ...p, name: user?.name, email: user?.email }
}

app.get('/api/photographers', (req, res) => {
  const { category, location, search } = req.query
  let list = db.photographers.filter((p) => !p.is_deleted).map(photographerWithName)
  if (location) list = list.filter((p) => p.location.toLowerCase().includes(String(location).toLowerCase()))
  if (search) {
    const s = String(search).toLowerCase()
    list = list.filter((p) => p.name?.toLowerCase().includes(s) || p.bio.toLowerCase().includes(s))
  }
  res.json(list)
})

app.get('/api/photographers/:id', (req, res) => {
  const p = db.photographers.find((x) => x.photographer_id === Number(req.params.id))
  if (!p) return notFound(res, 'Photographer not found')
  res.json(photographerWithName(p))
})

app.post('/api/photographers', (req, res) => {
  const newP = { photographer_id: db.nextId(db.photographers, 'photographer_id'), is_verified: false, is_deleted: false, rating: 0, created_at: new Date().toISOString(), ...req.body }
  db.photographers.push(newP)
  res.status(201).json(newP)
})

app.put('/api/photographers/:id', (req, res) => {
  const idx = db.photographers.findIndex((p) => p.photographer_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Photographer not found')
  db.photographers[idx] = { ...db.photographers[idx], ...req.body }
  res.json(db.photographers[idx])
})

app.patch('/api/photographers/:id/verify', (req, res) => {
  const idx = db.photographers.findIndex((p) => p.photographer_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Photographer not found')
  db.photographers[idx].is_verified = true
  res.json(db.photographers[idx])
})

app.delete('/api/photographers/:id', (req, res) => {
  const idx = db.photographers.findIndex((p) => p.photographer_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Photographer not found')
  db.photographers[idx].is_deleted = true
  res.json({ success: true })
})

// ---------------------------------------------------------------
// PACKAGES
// ---------------------------------------------------------------
app.get('/api/photographers/:id/packages', (req, res) => {
  res.json(db.packages.filter((p) => p.photographer_id === Number(req.params.id) && !p.is_deleted))
})

app.get('/api/packages', (req, res) => {
  res.json(db.packages.filter((p) => !p.is_deleted))
})

app.post('/api/packages', (req, res) => {
  const newPkg = { package_id: db.nextId(db.packages, 'package_id'), is_deleted: false, created_at: new Date().toISOString(), ...req.body }
  db.packages.push(newPkg)
  res.status(201).json(newPkg)
})

app.put('/api/packages/:id', (req, res) => {
  const idx = db.packages.findIndex((p) => p.package_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Package not found')
  db.packages[idx] = { ...db.packages[idx], ...req.body }
  res.json(db.packages[idx])
})

app.delete('/api/packages/:id', (req, res) => {
  const idx = db.packages.findIndex((p) => p.package_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Package not found')
  db.packages[idx].is_deleted = true
  res.json({ success: true })
})

// ---------------------------------------------------------------
// PORTFOLIO
// ---------------------------------------------------------------
app.get('/api/photographers/:id/portfolio', (req, res) => {
  res.json(db.portfolio.filter((p) => p.photographer_id === Number(req.params.id) && !p.is_deleted))
})

app.post('/api/portfolio', (req, res) => {
  const newItem = { portfolio_id: db.nextId(db.portfolio, 'portfolio_id'), is_deleted: false, created_at: new Date().toISOString(), ...req.body }
  db.portfolio.push(newItem)
  res.status(201).json(newItem)
})

app.delete('/api/portfolio/:id', (req, res) => {
  const idx = db.portfolio.findIndex((p) => p.portfolio_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Portfolio item not found')
  db.portfolio[idx].is_deleted = true
  res.json({ success: true })
})

// ---------------------------------------------------------------
// BOOKINGS
// ---------------------------------------------------------------
app.get('/api/users/:id/bookings', (req, res) => {
  res.json(db.bookings.filter((b) => b.user_id === Number(req.params.id) && !b.is_deleted))
})

app.get('/api/photographers/:id/bookings', (req, res) => {
  res.json(db.bookings.filter((b) => b.photographer_id === Number(req.params.id) && !b.is_deleted))
})

app.get('/api/bookings', (req, res) => {
  res.json(db.bookings.filter((b) => !b.is_deleted))
})

app.get('/api/bookings/:id', (req, res) => {
  const b = db.bookings.find((x) => x.booking_id === Number(req.params.id))
  if (!b) return notFound(res, 'Booking not found')
  res.json(b)
})

app.post('/api/bookings', (req, res) => {
  const newBooking = {
    booking_id: db.nextId(db.bookings, 'booking_id'),
    booking_status: 'pending',
    refund_status: 'none',
    is_deleted: false,
    created_at: new Date().toISOString(),
    ...req.body,
  }
  db.bookings.push(newBooking)
  res.status(201).json(newBooking)
})

app.patch('/api/bookings/:id/status', (req, res) => {
  const idx = db.bookings.findIndex((b) => b.booking_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Booking not found')
  db.bookings[idx].booking_status = req.body.booking_status
  res.json(db.bookings[idx])
})

app.patch('/api/bookings/:id/cancel', (req, res) => {
  const idx = db.bookings.findIndex((b) => b.booking_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Booking not found')
  db.bookings[idx].booking_status = 'cancelled'
  db.bookings[idx].cancel_reason = req.body.cancel_reason || null
  db.bookings[idx].cancelled_at = new Date().toISOString()
  res.json(db.bookings[idx])
})

// ---------------------------------------------------------------
// REVIEWS
// ---------------------------------------------------------------
app.get('/api/photographers/:id/reviews', (req, res) => {
  res.json(db.reviews.filter((r) => r.photographer_id === Number(req.params.id) && !r.is_deleted))
})

app.get('/api/users/:id/reviews', (req, res) => {
  res.json(db.reviews.filter((r) => r.user_id === Number(req.params.id) && !r.is_deleted))
})

app.post('/api/reviews', (req, res) => {
  const newReview = { review_id: db.nextId(db.reviews, 'review_id'), is_deleted: false, created_at: new Date().toISOString(), ...req.body }
  db.reviews.push(newReview)
  res.status(201).json(newReview)
})

// ---------------------------------------------------------------
// PAYMENTS
// ---------------------------------------------------------------
app.get('/api/payments', (req, res) => {
  res.json(db.payments)
})

app.get('/api/bookings/:id/payments', (req, res) => {
  res.json(db.payments.filter((p) => p.booking_id === Number(req.params.id)))
})

app.get('/api/users/:id/payments', (req, res) => {
  const userBookingIds = db.bookings.filter((b) => b.user_id === Number(req.params.id)).map((b) => b.booking_id)
  res.json(db.payments.filter((p) => userBookingIds.includes(p.booking_id)))
})

app.post('/api/payments', (req, res) => {
  const newPayment = { payment_id: db.nextId(db.payments, 'payment_id'), payment_status: 'pending', created_at: new Date().toISOString(), ...req.body }
  db.payments.push(newPayment)
  res.status(201).json(newPayment)
})

app.patch('/api/payments/:id/status', (req, res) => {
  const idx = db.payments.findIndex((p) => p.payment_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Payment not found')
  db.payments[idx].payment_status = req.body.payment_status
  res.json(db.payments[idx])
})

// ---------------------------------------------------------------
// REFUNDS
// ---------------------------------------------------------------
app.get('/api/refunds', (req, res) => {
  res.json(db.refunds)
})

app.post('/api/refunds', (req, res) => {
  const newRefund = { refund_id: db.nextId(db.refunds, 'refund_id'), refund_status: 'pending', created_at: new Date().toISOString(), ...req.body }
  db.refunds.push(newRefund)
  res.status(201).json(newRefund)
})

app.patch('/api/refunds/:id/approve', (req, res) => {
  const idx = db.refunds.findIndex((r) => r.refund_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Refund not found')
  db.refunds[idx].refund_status = 'processed'
  db.refunds[idx].approved_by_admin_id = req.body.approved_by_admin_id ?? db.refunds[idx].approved_by_admin_id
  db.refunds[idx].processed_at = new Date().toISOString()
  res.json(db.refunds[idx])
})

app.patch('/api/refunds/:id/reject', (req, res) => {
  const idx = db.refunds.findIndex((r) => r.refund_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Refund not found')
  db.refunds[idx].refund_status = 'rejected'
  res.json(db.refunds[idx])
})

// ---------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: db.users.length,
    totalPhotographers: db.photographers.length,
    totalBookings: db.bookings.length,
    totalRevenue: db.payments.filter((p) => p.payment_status === 'success').reduce((sum, p) => sum + p.amount, 0),
    pendingApprovals: db.photographers.filter((p) => !p.is_verified).length,
    openIssues: db.paymentIssues.filter((i) => i.status === 'open' || i.status === 'in_review').length,
  })
})

app.get('/api/admin/payment-issues', (req, res) => {
  res.json(db.paymentIssues)
})

app.patch('/api/admin/payment-issues/:id/resolve', (req, res) => {
  const idx = db.paymentIssues.findIndex((i) => i.issue_id === Number(req.params.id))
  if (idx === -1) return notFound(res, 'Issue not found')
  db.paymentIssues[idx].status = 'resolved'
  res.json(db.paymentIssues[idx])
})

app.get('/api/admin/logs', (req, res) => {
  res.json(db.systemLogs)
})

// ---------------------------------------------------------------
// Fallback for unmatched routes
// ---------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: `No mock route for ${req.method} ${req.originalUrl}` })
})

app.listen(PORT, () => {
  console.log(`\n✅ PhotoHub mock API running at http://localhost:${PORT}/api`)
  console.log(`   Try it: http://localhost:${PORT}/api/health\n`)
})
