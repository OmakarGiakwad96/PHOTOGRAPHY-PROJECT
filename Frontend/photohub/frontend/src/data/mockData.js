// Demo data mirroring /database/02_seed_data.sql so the UI is fully
// browsable before a real backend + MySQL API is connected.

export const users = [
  { user_id: 1, name: 'Riya Sharma', email: 'riya.sharma@example.com', phone: '9876500001', role: 'client', status: 'active', profile_picture: '', created_at: '2026-05-01' },
  { user_id: 2, name: 'Arjun Mehta', email: 'arjun.mehta@example.com', phone: '9876500002', role: 'client', status: 'active', profile_picture: '', created_at: '2026-05-02' },
  { user_id: 3, name: 'Sneha Kapoor', email: 'sneha.kapoor@example.com', phone: '9876500003', role: 'client', status: 'active', profile_picture: '', created_at: '2026-05-03' },
  { user_id: 4, name: 'Karan Verma', email: 'karan.verma@example.com', phone: '9876500004', role: 'client', status: 'inactive', profile_picture: '', created_at: '2026-05-04' },
  { user_id: 5, name: 'Priya Nair', email: 'priya.nair@example.com', phone: '9876500005', role: 'client', status: 'active', profile_picture: '', created_at: '2026-05-05' },
  { user_id: 6, name: 'Devansh Rao', email: 'devansh.rao@example.com', phone: '9876600001', role: 'photographer', status: 'active', profile_picture: '', created_at: '2026-04-01' },
  { user_id: 7, name: 'Ayesha Khan', email: 'ayesha.khan@example.com', phone: '9876600002', role: 'photographer', status: 'active', profile_picture: '', created_at: '2026-04-02' },
  { user_id: 8, name: 'Rohit Malhotra', email: 'rohit.malhotra@example.com', phone: '9876600003', role: 'photographer', status: 'active', profile_picture: '', created_at: '2026-04-03' },
  { user_id: 9, name: 'Neha Joshi', email: 'neha.joshi@example.com', phone: '9876600004', role: 'photographer', status: 'active', profile_picture: '', created_at: '2026-04-04' },
  { user_id: 10, name: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '9876600005', role: 'photographer', status: 'blocked', profile_picture: '', created_at: '2026-04-05' },
  { user_id: 11, name: 'Anita Desai', email: 'anita.desai@example.com', phone: '9876700001', role: 'admin', status: 'active', profile_picture: '', created_at: '2026-01-01' },
  { user_id: 12, name: 'Suresh Iyer', email: 'suresh.iyer@example.com', phone: '9876700002', role: 'admin', status: 'active', profile_picture: '', created_at: '2026-01-02' },
]

export const photographers = [
  { photographer_id: 1, user_id: 6, name: 'Devansh Rao', experience: 8, bio: 'Wedding & pre-wedding storyteller with a cinematic touch.', location: 'Mumbai, MH', rating: 4.8, price_per_hour: 3500, is_verified: true, category: 'Wedding' },
  { photographer_id: 2, user_id: 7, name: 'Ayesha Khan', experience: 5, bio: 'Portrait and fashion photographer, natural light specialist.', location: 'Delhi, DL', rating: 4.6, price_per_hour: 2800, is_verified: true, category: 'Portrait' },
  { photographer_id: 3, user_id: 8, name: 'Rohit Malhotra', experience: 10, bio: 'Event & corporate photography, drone certified.', location: 'Bengaluru, KA', rating: 4.9, price_per_hour: 4200, is_verified: true, category: 'Corporate' },
  { photographer_id: 4, user_id: 9, name: 'Neha Joshi', experience: 3, bio: 'Newborn, maternity and family portrait specialist.', location: 'Pune, MH', rating: 4.4, price_per_hour: 2000, is_verified: false, category: 'Newborn' },
  { photographer_id: 5, user_id: 10, name: 'Vikram Singh', experience: 6, bio: 'Street and travel photographer, still under review.', location: 'Jaipur, RJ', rating: 3.9, price_per_hour: 2500, is_verified: false, category: 'Travel' },
]

export const packages = [
  { package_id: 1, photographer_id: 1, name: 'Classic Wedding Package', description: 'Full day wedding coverage with edited highlights.', price: 45000, duration_hours: 8, features: 'Candid + Traditional, 500 edited photos, 1 highlight video' },
  { package_id: 2, photographer_id: 1, name: 'Pre-Wedding Shoot', description: 'Half day outdoor pre-wedding photoshoot.', price: 15000, duration_hours: 4, features: '150 edited photos, 2 locations' },
  { package_id: 3, photographer_id: 2, name: 'Portrait Session', description: 'Studio portrait session with lighting setup.', price: 6000, duration_hours: 2, features: '30 edited photos, 2 outfit changes' },
  { package_id: 4, photographer_id: 2, name: 'Fashion Lookbook', description: 'Full look-book shoot for models/brands.', price: 18000, duration_hours: 5, features: '100 edited photos, styling consultation' },
  { package_id: 5, photographer_id: 3, name: 'Corporate Event Coverage', description: 'Full event photo & video coverage.', price: 25000, duration_hours: 6, features: 'Photo + video, drone shots, same-day preview' },
  { package_id: 6, photographer_id: 3, name: 'Product Photography', description: 'Studio product shoot for e-commerce.', price: 8000, duration_hours: 3, features: '50 edited images, white background' },
  { package_id: 7, photographer_id: 4, name: 'Newborn Photoshoot', description: 'In-home newborn photography session.', price: 10000, duration_hours: 3, features: '40 edited photos, props included' },
  { package_id: 8, photographer_id: 4, name: 'Maternity Shoot', description: 'Outdoor/indoor maternity photoshoot.', price: 9000, duration_hours: 2, features: '30 edited photos' },
  { package_id: 9, photographer_id: 5, name: 'Travel Story Package', description: 'Day-long travel documentary shoot.', price: 12000, duration_hours: 6, features: '80 edited photos, travel journal blog draft' },
]

export const portfolio = [
  { portfolio_id: 1, photographer_id: 1, image_url: '', title: 'Beachside Wedding', category: 'Wedding' },
  { portfolio_id: 2, photographer_id: 1, image_url: '', title: 'Temple Ceremony', category: 'Wedding' },
  { portfolio_id: 3, photographer_id: 2, image_url: '', title: 'Studio Portrait Series', category: 'Portrait' },
  { portfolio_id: 4, photographer_id: 2, image_url: '', title: 'Editorial Fashion', category: 'Fashion' },
  { portfolio_id: 5, photographer_id: 3, image_url: '', title: 'Tech Summit 2026', category: 'Corporate' },
  { portfolio_id: 6, photographer_id: 3, image_url: '', title: 'Drone Aerial - Campus', category: 'Corporate' },
  { portfolio_id: 7, photographer_id: 4, image_url: '', title: 'Newborn Sleeping Set', category: 'Newborn' },
  { portfolio_id: 8, photographer_id: 4, image_url: '', title: 'Maternity Golden Hour', category: 'Maternity' },
  { portfolio_id: 9, photographer_id: 5, image_url: '', title: 'Streets of Jaipur', category: 'Travel' },
]

export const bookings = [
  { booking_id: 1, user_id: 1, photographer_id: 1, package_id: 1, event_date: '2026-08-15', booking_time: '09:00 AM', location: 'Taj Lands End, Mumbai', special_requirements: 'Need drone coverage of the entrance.', total_price: 45000, booking_status: 'confirmed', refund_status: 'none' },
  { booking_id: 2, user_id: 2, photographer_id: 2, package_id: 3, event_date: '2026-08-02', booking_time: '11:00 AM', location: 'Studio 21, Delhi', special_requirements: 'Bring 2 backdrop colors.', total_price: 6000, booking_status: 'completed', refund_status: 'none' },
  { booking_id: 3, user_id: 3, photographer_id: 3, package_id: 5, event_date: '2026-08-20', booking_time: '10:00 AM', location: 'WeWork Koramangala, Blr', special_requirements: 'Company logo backdrop required.', total_price: 25000, booking_status: 'pending', refund_status: 'none' },
  { booking_id: 4, user_id: 1, photographer_id: 4, package_id: 7, event_date: '2026-07-28', booking_time: '04:00 PM', location: 'Client residence, Pune', special_requirements: 'Baby is 10 days old, keep the room warm.', total_price: 10000, booking_status: 'confirmed', refund_status: 'none' },
  { booking_id: 5, user_id: 4, photographer_id: 1, package_id: 2, event_date: '2026-06-10', booking_time: '07:00 AM', location: 'Marine Drive, Mumbai', special_requirements: 'Sunrise shoot preferred.', total_price: 15000, booking_status: 'cancelled', refund_status: 'refunded' },
  { booking_id: 6, user_id: 5, photographer_id: 5, package_id: 9, event_date: '2026-08-25', booking_time: '08:00 AM', location: 'Amer Fort, Jaipur', special_requirements: 'Cover local market street life too.', total_price: 12000, booking_status: 'pending', refund_status: 'none' },
  { booking_id: 7, user_id: 2, photographer_id: 3, package_id: 6, event_date: '2026-07-30', booking_time: '02:00 PM', location: 'Product Studio, Delhi', special_requirements: 'White background, 12 SKUs.', total_price: 8000, booking_status: 'completed', refund_status: 'none' },
]

export const reviews = [
  { review_id: 1, user_id: 2, photographer_id: 2, booking_id: 2, rating: 5, comment: 'Amazing attention to detail, loved the final portraits!' },
  { review_id: 2, user_id: 1, photographer_id: 4, booking_id: 4, rating: 4, comment: 'Very patient with the newborn, great photos.' },
  { review_id: 3, user_id: 2, photographer_id: 3, booking_id: 7, rating: 5, comment: 'Product shots were crisp and delivered on time.' },
]

export const payments = [
  { payment_id: 1, booking_id: 1, amount: 45000, payment_method: 'card', payment_gateway: 'Razorpay', transaction_id: 'TXN10001', payment_status: 'success', paid_at: '2026-07-10 12:30:00' },
  { payment_id: 2, booking_id: 2, amount: 6000, payment_method: 'upi', payment_gateway: 'Razorpay', transaction_id: 'TXN10002', payment_status: 'success', paid_at: '2026-07-15 09:12:00' },
  { payment_id: 3, booking_id: 3, amount: 25000, payment_method: 'netbanking', payment_gateway: 'PayU', transaction_id: 'TXN10003', payment_status: 'pending', paid_at: null },
  { payment_id: 4, booking_id: 4, amount: 10000, payment_method: 'card', payment_gateway: 'Razorpay', transaction_id: 'TXN10004', payment_status: 'success', paid_at: '2026-07-18 16:45:00' },
  { payment_id: 5, booking_id: 5, amount: 15000, payment_method: 'upi', payment_gateway: 'Razorpay', transaction_id: 'TXN10005', payment_status: 'refunded', paid_at: '2026-06-01 08:20:00' },
  { payment_id: 6, booking_id: 6, amount: 12000, payment_method: 'wallet', payment_gateway: 'Paytm', transaction_id: 'TXN10006', payment_status: 'pending', paid_at: null },
  { payment_id: 7, booking_id: 7, amount: 8000, payment_method: 'card', payment_gateway: 'PayU', transaction_id: 'TXN10007', payment_status: 'success', paid_at: '2026-07-20 11:05:00' },
]

export const refunds = [
  { refund_id: 1, booking_id: 5, payment_id: 5, refund_amount: 15000, refund_reason: 'Client cancelled due to rescheduling.', refund_status: 'processed', approved_by_admin_id: 1, processed_at: '2026-06-06 14:00:00' },
]

export const paymentIssues = [
  { issue_id: 1, payment_id: 3, user_id: 3, issue_type: 'Payment stuck', description: 'Amount deducted from bank but booking still shows pending.', status: 'in_review' },
  { issue_id: 2, payment_id: 6, user_id: 5, issue_type: 'Wrong amount', description: 'Wallet was charged twice for the same booking.', status: 'open' },
  { issue_id: 3, payment_id: 2, user_id: 2, issue_type: 'Invoice request', description: 'Need a GST invoice for the completed booking.', status: 'resolved' },
]

export const systemLogs = [
  { log_id: 1, admin_id: 1, action: 'Verified photographer', table_name: 'photographers', record_id: 1, created_at: '2026-07-01 10:00:00' },
  { log_id: 2, admin_id: 1, action: 'Approved refund', table_name: 'refunds', record_id: 1, created_at: '2026-06-06 14:00:00' },
  { log_id: 3, admin_id: 2, action: 'Blocked user', table_name: 'users', record_id: 10, created_at: '2026-07-05 09:30:00' },
  { log_id: 4, admin_id: 2, action: 'Resolved payment issue', table_name: 'payment_issues', record_id: 3, created_at: '2026-07-16 11:15:00' },
]

export function getPhotographerByUserId(userId) {
  return photographers.find((p) => p.user_id === userId)
}

export function getUserById(id) {
  return users.find((u) => u.user_id === id)
}

export function getPhotographerById(id) {
  return photographers.find((p) => p.photographer_id === id)
}
