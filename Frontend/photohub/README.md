# PhotoHub 📷 - Premium Photography Services Platform

> A full-featured React + Vite + Tailwind CSS photography services web application with a complete 11-entity ER database simulation, role-based dashboards, 4-step booking workflow, and interactive live data browser.

---

## 🚀 Quick Start

```bash
# 1. Navigate to project directory
cd photohub

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

---

## 🎯 Demo Accounts (Use Quick Login Buttons in Auth Modal)

| Role         | Email                    | Dashboard Access               |
|--------------|--------------------------|-------------------------------|
| **Client**   | eleanor@example.com      | Bookings, Payments, Refunds   |
| **Photographer** | marcus@photohub.com  | Packages CRUD, Portfolio CRUD |
| **Admin**    | admin@photohub.com       | System Logs, Verify, Refunds  |

---

## 📦 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Framework  | React 18 + Vite 5                       |
| Styling    | Tailwind CSS 3 + Custom Animations      |
| Icons      | Lucide React                            |
| State      | React Context API + useState            |
| Storage    | localStorage (browser persistence)     |
| Fonts      | Inter (Google Fonts)                    |

---

## 🗃️ Database ER Entities (11 Tables Simulated)

```
USERS          → Authentication, roles, profile management
PHOTOGRAPHERS  → Pro profiles, ratings, specialties, verification
PACKAGES       → Service packages with pricing & features
PORTFOLIO      → Photo gallery linked to photographers
BOOKINGS       → Confirmed event reservations with status
REVIEWS        → Client ratings & comments per photographer
ADMIN          → Super-admin access control entity
PAYMENTS       → Secure payment records linked to bookings
REFUNDS        → Refund requests with admin approval flow
PAYMENT_ISSUES → Client-reported payment dispute tickets
SYSTEM_LOGS    → Full audit trail of all CUD database operations
```

---

## 🧩 Full Feature List

### Public Pages (No Login Required)
- **Home** — Hero banner, stats, featured photographers, service cards, 4-step booking guide
- Protected pages prompt login/register

### Client Dashboard
- View all bookings (status, event ID, date, venue)
- Cancel booking + auto-request refund entry creation
- View payment receipts with transaction IDs
- Report payment issues (escalates to admin)

### Photographer Workspace
- Create and list service packages (PACKAGES entity CRUD)
- Add and view portfolio images (PORTFOLIO entity CRUD)
- View assigned bookings

### Admin Control Center
- **System Audit Log Viewer** — Full live table showing all SYSTEM_LOGS entries
- **Refund Manager** — Approve or reject pending refunds
- **Payment Issues Panel** — Resolve open client disputes
- **Photographer Verification** — Toggle verified status with one click

### Global Modals
- **AuthModal** — Login, Register + Quick Demo Role Buttons
- **BookingModal** — 4-Step Wizard (Select → Date/Venue → Special Reqs → Payment)
- **PhotographerDetailModal** — Full profile, packages, portfolio & review tabs

---

## 📁 Project Structure

```
photohub/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── AppContext.jsx
    ├── data/
    │   └── mockData.js
    └── components/
        ├── Navbar.jsx
        ├── HeroSection.jsx
        ├── ServicesSection.jsx
        ├── PhotographersSection.jsx
        ├── PhotographersDirectory.jsx
        ├── BookingStepsSection.jsx
        ├── PackagesSection.jsx
        ├── GallerySection.jsx
        ├── AboutSection.jsx
        ├── ContactSection.jsx
        ├── Footer.jsx
        ├── AuthModal.jsx
        ├── BookingModal.jsx
        ├── PhotographerDetailModal.jsx
        └── Dashboards/
            ├── ClientDashboard.jsx
            ├── PhotographerDashboard.jsx
            └── AdminDashboard.jsx
```

---

## 🏗️ Build for Production

```bash
npm run build
# Output in dist/ folder
```

---

*Built with ❤️ using React + Vite + Tailwind CSS*
