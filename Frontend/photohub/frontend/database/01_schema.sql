-- ============================================================
-- PhotoHub Photography Management System
-- MySQL Schema (matches ER diagram)
-- Run this file first to create the database and all tables.
-- ============================================================

DROP DATABASE IF EXISTS photohub_db;
CREATE DATABASE photohub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE photohub_db;

-- ------------------------------------------------------------
-- 1. USERS  (base table for clients, photographers, admins)
-- ------------------------------------------------------------
CREATE TABLE users (
    user_id         INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    role            ENUM('client', 'photographer', 'admin') NOT NULL DEFAULT 'client',
    profile_picture VARCHAR(255),
    status          ENUM('active', 'inactive', 'blocked') NOT NULL DEFAULT 'active',
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at      DATETIME NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. PHOTOGRAPHERS  (1-1 extension of users)
-- ------------------------------------------------------------
CREATE TABLE photographers (
    photographer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    experience      INT DEFAULT 0,
    bio             TEXT,
    location        VARCHAR(150),
    rating          DECIMAL(3,2) DEFAULT 0.00,
    price_per_hour  DECIMAL(10,2) DEFAULT 0.00,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at      DATETIME NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_photographers_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. ADMIN  (1-1 extension of users)
-- ------------------------------------------------------------
CREATE TABLE admin (
    admin_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    permissions TEXT,
    last_login  DATETIME NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 4. PACKAGES  (photographer -> many packages)
-- ------------------------------------------------------------
CREATE TABLE packages (
    package_id      INT AUTO_INCREMENT PRIMARY KEY,
    photographer_id INT NOT NULL,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    price           DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    duration_hours  INT DEFAULT 1,
    features        TEXT,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_packages_photographer FOREIGN KEY (photographer_id) REFERENCES photographers(photographer_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 5. PORTFOLIO  (photographer -> many portfolio images)
-- ------------------------------------------------------------
CREATE TABLE portfolio (
    portfolio_id    INT AUTO_INCREMENT PRIMARY KEY,
    photographer_id INT NOT NULL,
    image_url       VARCHAR(255) NOT NULL,
    title           VARCHAR(150),
    category        VARCHAR(100),
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_portfolio_photographer FOREIGN KEY (photographer_id) REFERENCES photographers(photographer_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 6. BOOKINGS
-- ------------------------------------------------------------
CREATE TABLE bookings (
    booking_id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id               INT NOT NULL,
    photographer_id       INT NOT NULL,
    package_id            INT NULL,
    event_date             DATE NOT NULL,
    booking_time          VARCHAR(50),
    location               VARCHAR(255),
    special_requirements   TEXT,
    total_price            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    booking_status         ENUM('pending','confirmed','completed','cancelled','rejected') NOT NULL DEFAULT 'pending',
    cancel_reason           TEXT,
    cancelled_by            INT NULL,
    cancelled_at             DATETIME NULL,
    refund_status            ENUM('none','requested','processing','refunded','denied') NOT NULL DEFAULT 'none',
    is_deleted               BOOLEAN NOT NULL DEFAULT FALSE,
    created_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_photographer FOREIGN KEY (photographer_id) REFERENCES photographers(photographer_id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_package FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE SET NULL,
    CONSTRAINT fk_bookings_cancelled_by FOREIGN KEY (cancelled_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 7. REVIEWS
-- ------------------------------------------------------------
CREATE TABLE reviews (
    review_id       INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    photographer_id INT NOT NULL,
    booking_id      INT NULL,
    rating          INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    is_deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_photographer FOREIGN KEY (photographer_id) REFERENCES photographers(photographer_id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 8. PAYMENTS
-- ------------------------------------------------------------
CREATE TABLE payments (
    payment_id      INT AUTO_INCREMENT PRIMARY KEY,
    booking_id      INT NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    payment_method  ENUM('card','upi','netbanking','wallet','cash') NOT NULL DEFAULT 'card',
    payment_gateway VARCHAR(100),
    transaction_id  VARCHAR(150),
    payment_status  ENUM('pending','success','failed','refunded') NOT NULL DEFAULT 'pending',
    paid_at         DATETIME NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 9. REFUNDS
-- ------------------------------------------------------------
CREATE TABLE refunds (
    refund_id            INT AUTO_INCREMENT PRIMARY KEY,
    booking_id           INT NOT NULL,
    payment_id           INT NOT NULL,
    refund_amount        DECIMAL(10,2) NOT NULL,
    refund_reason         TEXT,
    refund_status          ENUM('pending','approved','rejected','processed') NOT NULL DEFAULT 'pending',
    approved_by_admin_id    INT NULL,
    processed_at             DATETIME NULL,
    created_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refunds_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    CONSTRAINT fk_refunds_payment FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE CASCADE,
    CONSTRAINT fk_refunds_admin FOREIGN KEY (approved_by_admin_id) REFERENCES admin(admin_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 10. PAYMENT_ISSUES
-- ------------------------------------------------------------
CREATE TABLE payment_issues (
    issue_id          INT AUTO_INCREMENT PRIMARY KEY,
    payment_id        INT NOT NULL,
    user_id           INT NOT NULL,
    issue_type        VARCHAR(100) NOT NULL,
    description        TEXT,
    status              ENUM('open','in_review','resolved','rejected') NOT NULL DEFAULT 'open',
    resolved_by_admin_id  INT NULL,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_issues_payment FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE CASCADE,
    CONSTRAINT fk_issues_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_issues_admin FOREIGN KEY (resolved_by_admin_id) REFERENCES admin(admin_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 11. SYSTEM_LOGS  (admin audit trail)
-- ------------------------------------------------------------
CREATE TABLE system_logs (
    log_id      INT AUTO_INCREMENT PRIMARY KEY,
    admin_id    INT NOT NULL,
    action      VARCHAR(150) NOT NULL,
    table_name  VARCHAR(100),
    record_id   INT,
    old_value   TEXT,
    new_value   TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_logs_admin FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Helpful indexes
-- ------------------------------------------------------------
CREATE INDEX idx_photographers_location ON photographers(location);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_photographer ON bookings(photographer_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_packages_photographer ON packages(photographer_id);
CREATE INDEX idx_portfolio_photographer ON portfolio(photographer_id);
CREATE INDEX idx_reviews_photographer ON reviews(photographer_id);
