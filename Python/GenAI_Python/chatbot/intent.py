"""
intent.py
----------
Lightweight, dependency-free rule-based intent detection.

A 1.3GB llama3.2:1b model is not reliable enough to extract structured
entities (budgets, city names, package names) on its own, so this module
uses regex/keyword matching for that - which is fast, free, and 100%
predictable - and hands off only the final phrasing to Ollama.

NOTE ON SCHEMA:
photohub_db (your real Spring Boot / Hibernate database) stores:
  - photographers.location   -> free text, e.g. "Pune, Maharashtra"
  - photographers.specialties -> free text, comma-separated e.g. "Wedding, Pre-Wedding"
  - packages.features        -> free text, comma-separated e.g. "Drone, Album, Video"
There are no dedicated "category" or boolean feature columns, so matching
is done with SQL LIKE '%term%' (case-insensitive), the same pattern your
Java repositories already use (e.g. findByLocationContainingIgnoreCase).
"""

import re

# Common Indian cities used as a fallback when the DB has no photographers yet
# (so extract_city still works on an empty database). Real city names found in
# photographers.location are also checked first if provided via known_cities.
DEFAULT_CITIES = [
    "Pune", "Mumbai", "Nashik", "Nagpur", "Delhi", "Bangalore", "Bengaluru",
    "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Surat", "Jaipur",
    "Lucknow", "Indore", "Chandigarh", "Goa", "Kochi", "Coimbatore",
]

EVENT_KEYWORDS = {
    "pre-wedding": ["pre-wedding", "pre wedding", "prewedding"],
    "wedding": ["wedding", "marriage", "shaadi"],
    "birthday": ["birthday", "bday"],
    "event": ["event", "corporate", "conference", "product launch", "party"],
    "maternity": ["maternity", "baby shower", "pregnancy"],
    "portrait": ["portrait", "headshot", "profile shoot"],
}

FEATURE_KEYWORDS = {
    "drone": ["drone", "aerial"],
    "album": ["album", "printed book"],
    "video": ["video", "cinematic", "film"],
    "candid": ["candid"],
}


def extract_budget(text: str):
    """
    Extract a budget amount from text like:
    'I have n25,000 for a pre-wedding shoot', 'My budget is n50,000',
    'budget of Rs. 40000', '₹35000', '30k budget'
    Returns an int or None.
    """
    t = text.lower()

    # e.g. "30k" / "35 k"
    k_match = re.search(r"(\d+(?:\.\d+)?)\s*k\b", t)
    if k_match:
        return int(float(k_match.group(1)) * 1000)

    # numbers with optional currency prefixes: n25,000 / ₹25000 / rs 25,000 / inr25000
    num_match = re.search(
        r"(?:₹|rs\.?|inr|n)?\s?(\d{1,3}(?:,\d{2,3})+|\d{4,7})", t
    )
    if num_match:
        raw = num_match.group(1).replace(",", "")
        try:
            return int(raw)
        except ValueError:
            return None
    return None


def extract_event_type(text: str):
    t = text.lower()
    for category, keywords in EVENT_KEYWORDS.items():
        for kw in keywords:
            if kw in t:
                return category
    return None


def extract_feature(text: str):
    t = text.lower()
    for term, keywords in FEATURE_KEYWORDS.items():
        for kw in keywords:
            if kw in t:
                return term
    return None


def extract_city(text: str, known_cities=None):
    """
    Look for a city name in the text. Checks real cities pulled from
    photographers.location first (known_cities), then falls back to a
    static Indian-city list so this still works on an empty database.
    """
    t = text.lower()
    candidates = list(dict.fromkeys((known_cities or []) + DEFAULT_CITIES))
    for city in candidates:
        if city.lower() in t:
            return city
    return None


def extract_names(text: str, known_names):
    """Return list of known photographer names (from users.name) mentioned in text."""
    t = text.lower()
    found = []
    for full_name in known_names:
        first_name = full_name.split()[0].lower()
        if first_name in t or full_name.lower() in t:
            found.append(full_name)
    return found


def detect_intent(text: str, known_cities=None, known_names=None):
    """
    Returns a dict: {"intent": str, "entities": {...}}
    Intents: compare, booking_help, feature_search, review_summary,
             city_recommend, event_recommend, budget_recommend, general
    """
    known_cities = known_cities or []
    known_names = known_names or []
    t = text.lower().strip()

    names = extract_names(text, known_names)
    if ("compare" in t or " vs " in t or "versus" in t) and len(names) >= 2:
        return {"intent": "compare", "entities": {"names": names[:2]}}

    if any(kw in t for kw in ["how do i book", "how to book", "booking process", "how does booking work", "how can i book"]):
        return {"intent": "booking_help", "entities": {}}

    feature = extract_feature(text)
    if feature and any(kw in t for kw in ["which package", "what package", "package includes", "packages include", "package that has", "package with"]):
        return {"intent": "feature_search", "entities": {"feature": feature}}

    if "review" in t or "reviews" in t or "feedback" in t:
        names_for_review = names if names else []
        return {"intent": "review_summary", "entities": {"names": names_for_review}}

    city = extract_city(text, known_cities)
    event_type = extract_event_type(text)
    budget = extract_budget(text)

    if city and ("photographer" in t or "suggest" in t or "recommend" in t):
        return {"intent": "city_recommend", "entities": {"city": city, "event_type": event_type}}

    if budget:
        return {"intent": "budget_recommend", "entities": {"budget": budget, "event_type": event_type}}

    if event_type:
        return {"intent": "event_recommend", "entities": {"event_type": event_type, "city": city}}

    if feature:
        return {"intent": "feature_search", "entities": {"feature": feature}}

    return {"intent": "general", "entities": {}}
