"""
app.py
-------
FastAPI application for the "Photographer Services Provider" chatbot.

Run with:
    uvicorn app:app --reload --port 8000

Then open http://localhost:8000 in your browser.
"""

from typing import Any, Optional

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from chatbot import intent, handlers, ollama_client

app = FastAPI(title="LensBuddy - ChatBot")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    intent: str
    data: Optional[Any] = None


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    message = payload.message.strip()
    if not message:
        return ChatResponse(reply="Please type a question about our photography packages.", intent="empty")

    known_cities = handlers.get_known_cities()
    known_names = handlers.get_known_names()

    detected = intent.detect_intent(message, known_cities=known_cities, known_names=known_names)
    detected_intent = detected["intent"]
    entities = detected["entities"]

    if detected_intent == "budget_recommend":
        reply, data = handlers.handle_budget_recommend(entities["budget"], entities.get("event_type"))

    elif detected_intent == "city_recommend":
        reply, data = handlers.handle_city_recommend(entities["city"], entities.get("event_type"))

    elif detected_intent == "compare":
        reply, data = handlers.handle_compare(entities["names"])

    elif detected_intent == "booking_help":
        reply, data = handlers.handle_booking_help()

    elif detected_intent == "feature_search":
        reply, data = handlers.handle_feature_search(entities["feature"])

    elif detected_intent == "review_summary":
        reply, data = handlers.handle_review_summary(entities.get("names"))

    elif detected_intent == "event_recommend":
        reply, data = handlers.handle_event_recommend(entities["event_type"], entities.get("city"))

    else:
        reply = ollama_client.general_chat(message)
        data = None

    return ChatResponse(reply=reply, intent=detected_intent, data=data)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
