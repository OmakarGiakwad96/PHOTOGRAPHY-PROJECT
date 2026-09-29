"""
db.py
------
Small helper layer around mysql-connector-python.

This connects to your EXISTING Spring Boot database `photohub_db`
(created/managed by the Java backend via Hibernate ddl-auto=update).
No schema.sql/seed_data.sql needed here - the chatbot only reads
(and, for bookings, writes) rows in tables that already exist.

Connection settings are read from environment variables (see .env.example).
"""

import os
import mysql.connector
# pyrefly: ignore [missing-import]
from mysql.connector import pooling
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "manager"),
    "database": os.getenv("DB_NAME", "photohub_db"),
}

_pool = None


def get_pool():
    global _pool
    if _pool is None:
        _pool = pooling.MySQLConnectionPool(
            pool_name="photohub_bot_pool",
            pool_size=5,
            **DB_CONFIG,
        )
    return _pool


def fetch_all(query: str, params: tuple = ()):
    """Run a SELECT query and return a list of dict rows."""
    conn = get_pool().get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(query, params)
        rows = cur.fetchall()
        cur.close()
        return rows
    finally:
        conn.close()


def fetch_one(query: str, params: tuple = ()):
    rows = fetch_all(query, params)
    return rows[0] if rows else None


def execute(query: str, params: tuple = ()):
    """Run an INSERT/UPDATE/DELETE query. Returns lastrowid."""
    conn = get_pool().get_connection()
    try:
        cur = conn.cursor()
        cur.execute(query, params)
        conn.commit()
        last_id = cur.lastrowid
        cur.close()
        return last_id
    finally:
        conn.close()
