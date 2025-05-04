# recommendation_api.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Allow frontend/backend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
with open("recommendation_model.pkl", "rb") as f:
    data, vectorizer, features = pickle.load(f)

@app.post("/recommend")
async def recommend(payload: Request):
    body = await payload.json()
    input_text = body.get("query", "")

    if not input_text:
        return {"error": "No input provided"}

    vector = vectorizer.transform([input_text])
    sims = cosine_similarity(vector, features).flatten()
    top_indices = sims.argsort()[::-1][:5]
    results = data.iloc[top_indices].to_dict(orient="records")

    return {"recommendations": results}
