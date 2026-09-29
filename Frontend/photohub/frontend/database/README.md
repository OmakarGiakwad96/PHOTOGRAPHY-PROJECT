# PhotoHub — Database

MySQL schema generated from the ER diagram (Users, Photographers, Admin,
Packages, Portfolio, Bookings, Reviews, Payments, Refunds, Payment_Issues,
System_Logs).

## Files

| File            | Purpose                                                          |
|-------------------|---------------------------------------------------------------------|
| `01_schema.sql`  | Creates the `photohub_db` database and all 11 tables, FKs, indexes |

There is **no seed/dummy-data file** — tables are created empty. Populate
them either by:
- Inserting rows yourself directly in MySQL Workbench / CLI, or
- Building a backend on top of this schema and adding records through the
  mock API workflow described in `/mock-server/README.md` (POST requests
  from Postman/Bruno), then syncing that into MySQL.

## How to run (MySQL Workbench / CLI)

**Option A — MySQL command line**
```bash
mysql -u root -p < 01_schema.sql
```

**Option B — MySQL Workbench**
1. Open MySQL Workbench and connect to your local server.
2. File → Open SQL Script → select `01_schema.sql` → click the ⚡ (execute) button.

This creates a database called **`photohub_db`**. Update your backend's
`.env` (`DB_NAME=photohub_db`, plus your host/user/password) to point at it.

## Notes

- `bookings.event_date` / `booking_time` / `location` capture the shoot details shown in the ER diagram's BOOKINGS entity.
- `refunds.approved_by_admin_id` and `payment_issues.resolved_by_admin_id` both reference `admin.admin_id` (the "manages" relationships in the diagram).
- All tables that need soft-delete carry `is_deleted` (+ `deleted_at` where shown in the diagram).
- Passwords should always be stored hashed (bcrypt/argon2) once you build a real registration flow — the schema just defines a `VARCHAR(255)` column for it.
