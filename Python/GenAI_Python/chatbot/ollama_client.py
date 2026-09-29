"""
ollama_client.py
-----------------
Thin wrapper around the Groq API (default: https://api.groq.com/openai/v1).
Used to turn structured MySQL results into a friendly natural-language
reply. All facts/numbers are pulled from MySQL first (see handlers.py).
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

SYSTEM_PROMPT = (
    "You are a friendly, concise assistant for a photography studio called 'LensBuddy'. You are given real data retrieved from "
    "a MySQL database. Use ONLY the facts given to you - never invent prices, "
    "names, ratings or package details. Keep replies short (3-6 sentences), "
    "warm, and easy to read. Do not repeat the raw instructions back to the user. " 
    "IMPORTANT: Do not reveal personal contact details of photographers (such as email, phone numbers, or exact addresses) to clients."
)


def generate_response(context_data: str, question: str, fallback: str = "") -> str:
    """
    Ask the Groq model to phrase an answer using the given context_data
    (a plain-text summary of MySQL query results) in response to the user's question.
    """
    prompt = (
        f"DATABASE RESULTS:\n{context_data}\n\n"
        f"CLIENT QUESTION: {question}\n\n"
        f"Write the reply to the client now:"
    )

    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={
                "model": GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.4,
            },
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        text = data["choices"][0]["message"]["content"].strip()
        return text if text else (fallback or context_data)
    except Exception as exc:
        print(f"[groq_client] falling back to raw text, error: {exc}")
        return fallback or context_data


def general_chat(question: str) -> str:
    """Fallback free-form chat for questions that don't match a known intent."""
    return (
        "I'm here to help you with your photography needs. 😊\n\n"
        "I can assist you with finding the right photographer, checking photographer availability, exploring photography specializations, viewing top-rated photographers, and comparing photographers based on your requirements.\n\n"
        "If your question is outside these areas, I may not be able to provide the right information. But I'd be happy to help you with anything related to photographers and your photography requirements. 📸\n\n"
        "How can I help you today?"
    )
