from flask import Flask, jsonify
import numpy as np
from lightfm import LightFM
from lightfm.data import Dataset

app = Flask(__name__)

# Dummy dataset
dataset = Dataset()
dataset.fit(users=['user1', 'user2'], items=['track1', 'track2'])
interactions, _ = dataset.build_interactions([('user1', 'track1'), ('user2', 'track2')])

# Train LightFM Model
model = LightFM(loss='warp')
model.fit(interactions, epochs=10)

@app.route('/recommend/<user_id>', methods=['GET'])
def recommend(user_id):
    user_index = 0 if user_id == "user1" else 1  # Map user_id to index
    scores = model.predict(user_index, np.arange(2))
    recommended_item = np.argmax(scores)  # Get best recommendation
    return jsonify({"recommended_track": f"track{recommended_item+1}"})

if __name__ == '__main__':
    app.run(debug=True)
