"""
handlers.py
------------
One function per intent from intent.py. Each handler:
  1. Queries MySQL (photohub_db) for the relevant rows.
  2. Builds a plain-text "context" summary of those rows.
  3. Asks ollama_client.generate_response() to phrase a friendly reply.
  4. Returns (reply_text, raw_data) so the API can send both to the UI.

SCHEMA NOTES (matches your Spring Boot entities exactly):
  photographers: photographer_id, user_id (FK -> users), experience, bio,
                 location, rating, price_per_hour, is_verified, cover_image,
                 specialties (free text, comma-separated), is_deleted
  packages:      package_id, photographer_id (FK), name, description, price,
                 duration_hours, features (free text, comma-separated), is_deleted
  reviews:       review_id, user_id (FK), photographer_id (FK), rating (1-5 int),
                 comment, created_at, is_deleted
  bookings:      booking_id, user_id, photographer_id, package_id, event_id,
                 booking_date, booking_time, location, special_requirements,
                 total_price, booking_status, is_deleted
  users:         user_id, name, email, phone, role, ...

Photographers don't have a "name" column themselves - it lives on the
linked `users` row, so every photographer query joins to `users`.
Packages/photographers have no dedicated category or boolean feature
columns - "Wedding", "drone", etc. are matched with SQL LIKE against the
free-text name/description/specialties/features fields (same substring
matching your Java repositories already use, e.g.
findByLocationContainingIgnoreCase / findBySpecialtiesContainingIgnoreCase).
"""

from . import db
from . import ollama_client

EVENT_TERM_MAP = {
    "pre-wedding": "pre-wedding",
    "wedding": "wedding",
    "birthday": "birthday",
    "event": "event",
    "maternity": "maternity",
    "portrait": "portrait",
}


# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------
def get_known_cities():
    rows = db.fetch_all(
        "SELECT DISTINCT location FROM photographers "
        "WHERE is_deleted = 0 AND location IS NOT NULL"
    )
    return [r["location"] for r in rows if r["location"]]


def get_known_names():
    rows = db.fetch_all(
        "SELECT u.name AS name FROM photographers p "
        "JOIN users u ON p.user_id = u.user_id "
        "WHERE p.is_deleted = 0"
    )
    return [r["name"] for r in rows if r["name"]]


def _package_line(p):
    features_txt = f" | Features: {p['features']}" if p.get("features") else ""
    return (
        f"- {p['name']} | Price: Rs.{p['price']:,.0f} | "
        f"Duration: {p.get('duration_hours', '?')}h{features_txt}"
    )


def _photographer_line(p):
    verified = " (verified)" if p.get("is_verified") else ""
    return (
        f"{p['name']}{verified} | Location: {p.get('location', 'N/A')} | "
        f"Specialties: {p.get('specialties', 'N/A')} | "
        f"Experience: {p.get('experience', '?')} years | "
        f"Rating: {p.get('rating', 'N/A')}/5 | "
        f"Rate: Rs.{p.get('price_per_hour', 0):,.0f}/hr"
    )


# ------------------------------------------------------------
# Example 1 & 6: Budget-based package recommendation
# ------------------------------------------------------------
def handle_budget_recommend(budget: int, event_type: str = None):
    query = "SELECT * FROM packages WHERE is_deleted = 0 AND price <= %s"
    params = [budget]
    if event_type:
        term = EVENT_TERM_MAP.get(event_type, event_type)
        query += " AND (name LIKE %s OR description LIKE %s OR features LIKE %s)"
        like_term = f"%{term}%"
        params += [like_term, like_term, like_term]
    query += " ORDER BY price DESC LIMIT 5"

    packages = db.fetch_all(query, tuple(params))

    if not packages:
        cheapest = db.fetch_all(
            "SELECT * FROM packages WHERE is_deleted = 0 ORDER BY price ASC LIMIT 3"
        )
        context = (
            f"No packages were found at or under a budget of Rs.{budget:,}"
            + (f" for {event_type} shoots." if event_type else ".")
        )
        if cheapest:
            context += "\nClosest cheaper options:\n" + "\n".join(_package_line(p) for p in cheapest)
            fallback = (
                f"I couldn't find a package at or under Rs.{budget:,}"
                + (f" for a {event_type} shoot" if event_type else "")
                + ". Here are the closest lower-priced options instead:\n"
                + "\n".join(_package_line(p) for p in cheapest)
            )
        else:
            fallback = "No packages exist in the database yet. Please add some packages first."
        return ollama_client.generate_response(context, f"My budget is {budget}", fallback), cheapest

    best = packages[0]  # highest price within budget = best value used of the budget
    context = (
        f"Client budget: Rs.{budget:,}"
        + (f" for a {event_type} shoot" if event_type else "")
        + f".\nBest matching package: {_package_line(best)}\n"
        + "Other options within budget:\n"
        + ("\n".join(_package_line(p) for p in packages[1:]) or "None")
    )
    fallback = f"Based on your budget of Rs.{budget:,}, I'd recommend the {best['name']} at Rs.{best['price']:,.0f}."
    reply = ollama_client.generate_response(context, f"My budget is Rs.{budget:,}", fallback)
    return reply, packages


# ------------------------------------------------------------
# Example 2: City-based photographer recommendation
# ------------------------------------------------------------
def handle_city_recommend(city: str, event_type: str = None):
    query = (
        "SELECT p.*, u.name AS name, u.email AS email, u.phone AS phone "
        "FROM photographers p JOIN users u ON p.user_id = u.user_id "
        "WHERE p.is_deleted = 0 AND p.location LIKE %s"
    )
    params = [f"%{city}%"]
    if event_type:
        term = EVENT_TERM_MAP.get(event_type, event_type)
        query += " AND p.specialties LIKE %s"
        params.append(f"%{term}%")
    query += " ORDER BY p.rating DESC LIMIT 3"

    photographers = db.fetch_all(query, tuple(params))
    if not photographers:
        context = f"No photographers found in {city}" + (f" specializing in {event_type}." if event_type else ".")
        fallback = f"I couldn't find a matching photographer in {city} right now."
        return ollama_client.generate_response(context, f"Suggest a photographer in {city}", fallback), []

    top = photographers[0]
    packages = db.fetch_all(
        "SELECT * FROM packages WHERE is_deleted = 0 AND photographer_id = %s ORDER BY price ASC",
        (top["photographer_id"],),
    )

    context = (
        f"Top-rated photographer in {city}: {_photographer_line(top)}\n"
        f"Bio: {top.get('bio', 'N/A')}\n"
        "Their packages:\n"
        + ("\n".join(_package_line(p) for p in packages) if packages else "No packages listed yet.")
    )
    fallback = (
        f"I'd recommend {top['name']} in {city} - specialties: {top.get('specialties', 'N/A')}, "
        f"{top.get('experience', '?')} years of experience, rating {top.get('rating', 'N/A')}/5."
    )
    reply = ollama_client.generate_response(context, f"Suggest a photographer in {city}", fallback)
    return reply, {"photographer": top, "packages": packages}


# ------------------------------------------------------------
# Example 3: Compare two photographers
# ------------------------------------------------------------
def handle_compare(names):
    photographers = []
    for name in names:
        row = db.fetch_one(
            "SELECT p.*, u.name AS name FROM photographers p "
            "JOIN users u ON p.user_id = u.user_id "
            "WHERE u.name = %s AND p.is_deleted = 0",
            (name,),
        )
        if row:
            photographers.append(row)

    if len(photographers) < 2:
        context = f"Could not find both photographers in the database: {names}"
        return ollama_client.generate_response(context, f"Compare {' and '.join(names)}", context), []

    lines = [
        f"{p['name']}: location={p.get('location', 'N/A')}, specialties={p.get('specialties', 'N/A')}, "
        f"experience={p.get('experience', '?')} years, hourly_rate=Rs.{p.get('price_per_hour', 0):,.0f}, "
        f"rating={p.get('rating', 'N/A')}/5. Bio: {p.get('bio', 'N/A')}"
        for p in photographers
    ]
    context = "Comparison data:\n" + "\n".join(lines)
    fallback = "\n\n".join(lines)
    reply = ollama_client.generate_response(
        context, f"Compare {photographers[0]['name']} and {photographers[1]['name']}", fallback
    )
    return reply, photographers


# ------------------------------------------------------------
# Example 4: Booking process explanation
# ------------------------------------------------------------
def handle_booking_help():
    steps = (
        "1. Browse photographers/packages by city, event type or budget.\n"
        "2. Select a package that fits your needs.\n"
        "3. Choose your preferred event date and time.\n"
        "4. Make the payment.\n"
        "5. Your booking status starts as 'Pending' and moves to 'Confirmed' "
        "once the photographer accepts, then 'Completed' after the shoot."
    )
    reply = ollama_client.generate_response(
        steps, "How do I book?", "Here's how booking works:\n" + steps
    )
    return reply, {"steps": steps}


# ------------------------------------------------------------
# Example 5: Feature search (e.g. drone photography)
# ------------------------------------------------------------
def handle_feature_search(feature: str):
    like_term = f"%{feature}%"
    query = (
        "SELECT * FROM packages WHERE is_deleted = 0 "
        "AND (features LIKE %s OR description LIKE %s OR name LIKE %s) "
        "ORDER BY price ASC"
    )
    packages = db.fetch_all(query, (like_term, like_term, like_term))

    if not packages:
        context = f"No packages currently include {feature}."
        return ollama_client.generate_response(context, f"Which package includes {feature}?", context), []

    context = f"Packages that include {feature}:\n" + "\n".join(_package_line(p) for p in packages)
    fallback = context
    reply = ollama_client.generate_response(context, f"Which package includes {feature}?", fallback)
    return reply, packages


# ------------------------------------------------------------
# Example 7: Review summary
# ------------------------------------------------------------
def handle_review_summary(names=None):
    if names:
        photographer = db.fetch_one(
            "SELECT p.*, u.name AS name FROM photographers p "
            "JOIN users u ON p.user_id = u.user_id "
            "WHERE u.name = %s AND p.is_deleted = 0",
            (names[0],),
        )
        if not photographer:
            context = f"No photographer named {names[0]} found."
            return ollama_client.generate_response(context, "Summarize reviews", context), []
        reviews = db.fetch_all(
            "SELECT * FROM reviews WHERE is_deleted = 0 AND photographer_id = %s",
            (photographer["photographer_id"],),
        )
        subject = photographer["name"]
    else:
        reviews = db.fetch_all("SELECT * FROM reviews WHERE is_deleted = 0")
        subject = "all photographers"

    if not reviews:
        context = f"No reviews found for {subject}."
        return ollama_client.generate_response(context, "Summarize reviews", context), []

    avg_rating = sum(float(r["rating"]) for r in reviews) / len(reviews)
    review_texts = "\n".join(f"- ({r['rating']}/5) {r.get('comment', '')}" for r in reviews)
    context = (
        f"Reviews for {subject} (average rating {avg_rating:.1f}/5, {len(reviews)} reviews):\n"
        + review_texts
        + "\n\nSummarize the common strengths and any recurring improvement areas mentioned."
    )
    fallback = f"Average rating for {subject} is {avg_rating:.1f}/5 across {len(reviews)} reviews."
    reply = ollama_client.generate_response(context, "Summarize reviews", fallback)
    return reply, {"average_rating": round(avg_rating, 1), "count": len(reviews), "reviews": reviews}


# ------------------------------------------------------------
# Example 8: Event-type based recommendation (e.g. birthday)
# ------------------------------------------------------------
def handle_event_recommend(event_type: str, city: str = None):
    term = EVENT_TERM_MAP.get(event_type, event_type)

    query = (
        "SELECT p.*, u.name AS name FROM photographers p "
        "JOIN users u ON p.user_id = u.user_id "
        "WHERE p.is_deleted = 0 AND p.specialties LIKE %s"
    )
    params = [f"%{term}%"]
    if city:
        query += " AND p.location LIKE %s"
        params.append(f"%{city}%")
    query += " ORDER BY p.rating DESC LIMIT 1"

    photographer = db.fetch_one(query, tuple(params))

    if not photographer:
        context = f"No specialist found for event type '{event_type}'" + (f" in {city}." if city else ".")
        return ollama_client.generate_response(context, f"I need photography for a {event_type}", context), []

    packages = db.fetch_all(
        "SELECT * FROM packages WHERE is_deleted = 0 AND photographer_id = %s "
        "AND (name LIKE %s OR description LIKE %s) ORDER BY price ASC",
        (photographer["photographer_id"], f"%{term}%", f"%{term}%"),
    )
    if not packages:
        # fall back to any package from this photographer if none match the term specifically
        packages = db.fetch_all(
            "SELECT * FROM packages WHERE is_deleted = 0 AND photographer_id = %s ORDER BY price ASC",
            (photographer["photographer_id"],),
        )

    context = (
        f"Recommended specialist for {event_type}: {_photographer_line(photographer)}\n"
        "Suitable packages:\n" + ("\n".join(_package_line(p) for p in packages) if packages else "No packages found yet.")
    )
    fallback = (
        f"For a {event_type}, I'd recommend {photographer['name']} "
        f"(rating {photographer.get('rating', 'N/A')}/5)."
    )
    reply = ollama_client.generate_response(context, f"I need photography for a {event_type}", fallback)
    return reply, {"photographer": photographer, "packages": packages}
