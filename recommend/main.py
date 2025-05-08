import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from spotify_recommendation_engine import main

app = FastAPI()

class PlaylistRequest(BaseModel):
    playlist_id: str

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://btne.vercel.app"
    # Add more origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/recommendations")
def get_recommendations():
    results = main()
    return results  # Return as list of dicts (JSON)
    

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
