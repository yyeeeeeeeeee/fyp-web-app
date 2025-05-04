# app.py
import pickle
import streamlit as st
from sklearn.metrics.pairwise import cosine_similarity
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os

# Load recommendation model
with open('recommendation_model.pkl', 'rb') as f:
    data, vectorizer, features = pickle.load(f)

# Setup Spotify API
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

auth_manager = SpotifyClientCredentials(client_id=SPOTIFY_CLIENT_ID, client_secret=SPOTIFY_CLIENT_SECRET)
sp = spotipy.Spotify(auth_manager=auth_manager)

# Streamlit app
st.title("🎵 Simple Content-Based Recommender")

user_input = st.text_input("Enter genre and mood (e.g., 'Pop Happy')")

if st.button("Get Recommendations"):
    if user_input:
        # Vectorize user input
        user_vec = vectorizer.transform([user_input])
        sim_scores = cosine_similarity(user_vec, features).flatten()
        
        top_indices = sim_scores.argsort()[::-1][:3]
        results = data.iloc[top_indices]

        for i, row in results.iterrows():
            st.markdown(f"**{row['song']}** | {row['genre']} | {row['mood']}")
            
            # Optional: Spotify track search
            results = sp.search(q=row['song'], limit=1, type='track')
            if results['tracks']['items']:
                track = results['tracks']['items'][0]
                st.audio(track['preview_url'])
                st.write(f"[Open in Spotify]({track['external_urls']['spotify']})")
    else:
        st.warning("Please enter a genre and mood.")




