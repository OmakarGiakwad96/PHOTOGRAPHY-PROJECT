# Photohub Chatbot (FastAPI + MySQL + Ollama)

A GenAI chatbot that answers client questions about photography packages,
photographers, bookings, budgets, and reviews - reading directly from your
**existing `photohub_db` MySQL database** (the same one used by your Spring
Boot backend), phrased naturally using a **local Ollama model**
(`llama3.2:1b`).

No separate database is created. This project has no `schema.sql` -
your Java backend (Hibernate `ddl-auto=update`) already owns and creates
the tables. This chatbot just reads (and can be extended to write) rows
in those same tables.

## How it works

1. **Intent detection (`chatbot/intent.py`)** - lightweight regex/keyword
   matching extracts what the client wants (budget, city, event type,
   comparison names, feature like "drone", etc). This keeps things reliable
   even with a small 1B model, which struggles with structured extraction.
2. **Data lookup (`chatbot/handlers.py`)** - each intent runs a real SQL
   query against `photohub_db` (`photographers`, `packages`, `reviews`,
   `users`, `bookings`).
3. **Natural language phrasing (`chatbot/ollama_client.py`)** - the raw SQL
   results are handed to your local Ollama model, which is instructed to
   phrase a short, friendly reply **using only the given facts** (no
   invented prices/names). If Ollama is unreachable, a plain-text fallback
   built directly from the SQL data is shown instead - so the bot never
   fully breaks.
4. **FastAPI (`app.py`)** exposes `/api/chat` and serves a simple chat UI.

## Matching your real schema

Your `photographers` and `packages` tables don't have separate
"category" or boolean feature columns - they use free-text fields:

| Table | Column | Format |
|---|---|---|
| `photographers` | `specialties` | comma-separated text, e.g. `"Wedding, Pre-Wedding"` |
| `photographers` | `location` | free text, e.g. `"Pune, Maharashtra"` |
| `packages` | `features` | comma-separated text, e.g. `"Drone, Album, Video"` |

So the chatbot matches these the same way your Java repositories already
do (`findByLocationContainingIgnoreCase`,
`findBySpecialtiesContainingIgnoreCase`) - using SQL `LIKE '%term%'`,
case-insensitive substring search. **Keep this in mind when you add data**:
e.g. make sure a wedding photographer's `specialties` field actually
contains the word "Wedding" somewhere, and a drone package's `features`
or `description` mentions "Drone".

Photographers don't store their own name - it lives on the linked `users`
row (`photographers.user_id -> users.user_id`), so every photographer
query joins to `users` to get `u.name`.

## Example queries it handles

| Client says | Intent |
|---|---|
| "I have ₹25,000 for a pre-wedding shoot" | `budget_recommend` |
| "Suggest a wedding photographer in Pune" | `city_recommend` |
| "Compare Javed and Ketan" | `compare` |
| "How do I book?" | `booking_help` |
| "Which package includes drone photography?" | `feature_search` |
| "My budget is ₹50,000" | `budget_recommend` |
| "Summarize reviews" | `review_summary` |
| "I need photography for a birthday" | `event_recommend` |

Anything else falls back to a general Ollama chat response.

## 1. Prerequisites

- Python 3.10+
- Your Spring Boot backend (`photohub`) already run at least once, so
  Hibernate has created the tables in `photohub_db`
- MySQL Server running locally with data in `photohub_db`
- Ollama installed and running, with `llama3.2:1b` pulled:
  ```bash
  ollama pull llama3.2:1b
  ollama serve   # if not already running as a service
  ```

## 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` to match your Spring Boot `application.properties`
(same `DB_USER` / `DB_PASSWORD` / `DB_NAME=photohub_db`).

## 3. Install dependencies

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 4. Run the app

```bash
uvicorn app:app --reload --port 8000
```

Open **http://localhost:8000** in your browser and start chatting.

> Note: your Spring Boot backend runs on port `8082` (per
> `application.properties`), so there's no port conflict running both
> at once.

You can also test the API directly:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I have 25000 for a pre-wedding shoot"}'
```

## Project structure

```
GenAI_Python/
├── app.py                  # FastAPI entry point
├── requirements.txt
├── .env.example
├── chatbot/
│   ├── db.py                # MySQL connection pool + query helpers
│   ├── intent.py             # Rule-based intent/entity extraction
│   ├── handlers.py           # One handler per intent (SQL against photohub_db)
│   └── ollama_client.py      # Calls local Ollama /api/generate
├── templates/
│   └── index.html           # Chat UI
└── static/
    ├── style.css
    └── script.js
```

## Testing with no data yet

Since your tables are currently empty, every query will correctly return
"no results found" style replies until you add photographers/packages via
your Spring Boot backend (or directly in MySQL). The intent detection
itself works immediately and can be tested standalone:

```bash
python3 -c "
from chatbot.intent import detect_intent
print(detect_intent('I have n25,000 for a pre-wedding shoot.'))
print(detect_intent('Suggest a wedding photographer in Pune.'))
"
```

## Extending it

- To support an actual "book this package" action, add an INSERT into the
  `bookings` table inside a new handler and wire up an intent for it
  (columns: `user_id`, `photographer_id`, `package_id`, `booking_date`,
  `booking_time`, `location`, `total_price`, `booking_status`).
- Swap `OLLAMA_MODEL` in `.env` to any other locally pulled model (e.g.
  `llama3.2:3b`) for better phrasing quality, no code changes required.
