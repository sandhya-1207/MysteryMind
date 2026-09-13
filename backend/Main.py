import os
import json

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

from prompts import create_mystery_prompt


# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

# Gemini client
client = genai.Client(api_key=api_key)

# FastAPI app
app = FastAPI()


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://mystery-mind-lgcz.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request model
class MysteryRequest(BaseModel):
    theme: str
    difficulty: str
    puzzleCount: int


# Test route
@app.get("/")
def home():
    return {
        "message": "MysteryMind Backend is Running!"
    }


# Generate mystery
@app.post("/generate-mystery")
def generate_mystery(request: MysteryRequest):

    prompt = create_mystery_prompt(
        request.theme,
        request.difficulty,
        request.puzzleCount
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    text = response.text.strip()

    try:
        mystery = json.loads(text)
        return mystery

    except json.JSONDecodeError:
        return {
            "error": "Gemini returned an invalid JSON response.",
            "raw_response": text
        }