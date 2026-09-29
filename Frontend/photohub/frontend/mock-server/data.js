// In-memory data store for the PhotoHub mock API.
// -------------------------------------------------------------
// Intentionally starts EMPTY — no dummy/seed names. Add records
// yourself via Postman/Bruno (POST requests), then GET them back
// as JSON. Everything resets to empty again when the server restarts.
// -------------------------------------------------------------

let users = []
let photographers = []
let admins = []
let packages = []
let portfolio = []
let bookings = []
let reviews = []
let payments = []
let refunds = []
let paymentIssues = []
let systemLogs = []

// Simple auto-increment helper for POST endpoints.
// Returns 1 for the first record in an empty array.
function nextId(collection, key) {
  return collection.reduce((max, item) => Math.max(max, item[key]), 0) + 1
}

module.exports = {
  users, photographers, admins, packages, portfolio, bookings, reviews,
  payments, refunds, paymentIssues, systemLogs, nextId,
}
