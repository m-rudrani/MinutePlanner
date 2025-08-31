import os
import requests
from dotenv import load_dotenv

load_dotenv()
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
BASE_URL = "https://api-inference.huggingface.co/models"
HEADERS = {"Authorization": f"Bearer {HF_API_KEY}"}

def hf_query(model: str, payload: dict):
    if not HF_API_KEY:
        raise RuntimeError("HUGGINGFACE_API_KEY not set in .env")
    r = requests.post(f"{BASE_URL}/{model}", headers=HEADERS, json=payload, timeout=30)
    r.raise_for_status()
    return r.json()

def parse_preferences(text: str):
    """Extract structured travel preferences using QA model."""
    questions = [
        "Where does the person want to travel?",
        "How long is the trip?",
        "How many people are traveling?",
        "What are their interests?",
        "What is their budget?",
        "What is their travel pace preference?",
        "What are their special requirements?"
    ]
    qa_model = "deepset/roberta-base-squad2"
    results = []
    for q in questions:
        res = hf_query(qa_model, {"question": q, "context": text})
        if isinstance(res, list) and res:
            results.append(res[0])
        else:
            results.append({"answer": "", "score": 0})

    return {
        "destination": results[0].get("answer", ""),
        "duration": results[1].get("answer", ""),
        "travelers": int("".join(filter(str.isdigit, results[2].get("answer", "1"))) or 1),
        "interests": [s.strip() for s in results[3].get("answer", "").split(",") if s.strip()],
        "budget": results[4].get("answer", ""),
        "pace": results[5].get("answer", ""),
        "special_requirements": results[6].get("answer", "") or text,
    }

def analyze_sentiment(text: str):
    """Run sentiment analysis."""
    model = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    result = hf_query(model, {"inputs": text})
    if isinstance(result, list) and result and isinstance(result[0], list):
        top = max(result[0], key=lambda x: x["score"])
    else:
        top = {"label": "NEUTRAL", "score": 0.5}
    return {"sentiment": top["label"], "confidence": top["score"]}

def extract_locations(text: str):
    """Extract locations from text using NER."""
    model = "dbmdz/bert-large-cased-finetuned-conll03-english"
    result = hf_query(model, {"inputs": text})
    return [
        {"location": ent["word"], "confidence": ent["score"]}
        for ent in result if ent.get("entity_group") == "LOC" and ent.get("score", 0) > 0.8
    ]
