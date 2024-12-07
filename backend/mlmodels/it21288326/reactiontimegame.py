from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

# Load the trained model
model = joblib.load("svm_model.pkl")

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow requests from React app

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse incoming JSON data
        data = request.get_json()

        # Validate required keys and ensure inputs are not None
        required_keys = ['averageReactionTime', 'correctStreak', 'prematureClicks', 'missedStars', 'score']
        missing_keys = [key for key in required_keys if key not in data or data[key] is None]
        if missing_keys:
            return jsonify({'error': f"Missing or invalid field(s): {', '.join(missing_keys)}"}), 400

        # Prepare metrics array for the model
        try:
            metrics = np.array([
                data['averageReactionTime'], 
                data['correctStreak'], 
                data['prematureClicks'], 
                data['missedStars'], 
                data['score']
            ], dtype=float).reshape(1, -1)  # Ensure numeric input and reshape into 2D array
        except ValueError as ve:
            return jsonify({'error': f"Invalid input data type: {ve}"}), 400

        # Make prediction using the preloaded model
        prediction = model.predict(metrics)[0]  # Get prediction from model

        # Convert the prediction to a Python native type for JSON serialization
        return jsonify({'ADHD_Type': str(prediction)})

    except Exception as e:
        # Log exception details for debugging
        import logging
        logging.exception("Internal server error")
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=5001)  # Run on port 5001
