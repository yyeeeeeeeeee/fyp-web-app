# build_model.py
import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Sample music data
data = pd.DataFrame([
    {'song': 'Song A', 'genre': 'Pop', 'mood': 'Happy'},
    {'song': 'Song B', 'genre': 'Rock', 'mood': 'Energetic'},
    {'song': 'Song C', 'genre': 'Jazz', 'mood': 'Relaxed'}
])

# Combine textual features
combined = data['genre'] + " " + data['mood']

# Vectorize
vectorizer = TfidfVectorizer()
features = vectorizer.fit_transform(combined)

# Save vectorizer, data, and matrix
with open('recommendation_model.pkl', 'wb') as f:
    pickle.dump((data, vectorizer, features), f)

print("Model saved!")
