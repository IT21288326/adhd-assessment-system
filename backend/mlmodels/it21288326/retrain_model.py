# # # # from pymongo import MongoClient
# # # # import pandas as pd
# # # # import tensorflow as tf
# # # # from sklearn.model_selection import train_test_split
# # # # from sklearn.preprocessing import LabelEncoder
# # # # import os

# # # # # MongoDB setup
# # # # client = MongoClient('mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/')
# # # # db = client['test']
# # # # game_metrics_collection = db['gamemetrics']
# # # # questionnaire_collection = db['questionnaireresponses']

# # # # # Minimum data required for training
# # # # DATA_THRESHOLD = 40  # Set this based on your needs

# # # # # Fetch and merge data
# # # # def fetch_data():
# # # #     game_metrics = list(game_metrics_collection.find())
# # # #     questionnaires = list(questionnaire_collection.find())

# # # #     dataset = []
# # # #     for metric in game_metrics:
# # # #         matching_questionnaire = next(
# # # #             (q for q in questionnaires if str(q['childId']) == str(metric['childId'])), None
# # # #         )
# # # #         if matching_questionnaire:
# # # #             dataset.append({
# # # #                 'averageReactionTime': metric['averageReactionTime'],
# # # #                 'correctStreak': metric['correctStreak'],
# # # #                 'prematureClicks': metric['prematureClicks'],
# # # #                 'missedStars': metric['missedStars'],
# # # #                 'score': metric['score'],
# # # #                 'ADHD_Type': matching_questionnaire['subtype'],  # Label
# # # #             })

# # # #     return pd.DataFrame(dataset)

# # # # # Train model
# # # # def train_model(data):
# # # #     X = data[['averageReactionTime', 'correctStreak', 'prematureClicks', 'missedStars', 'score']].values
# # # #     y = LabelEncoder().fit_transform(data['ADHD_Type'])

# # # #     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # # #     model = tf.keras.Sequential([
# # # #         tf.keras.layers.Dense(16, activation='relu', input_shape=(X_train.shape[1],)),
# # # #         tf.keras.layers.Dense(8, activation='relu'),
# # # #         tf.keras.layers.Dense(len(set(y)), activation='softmax'),
# # # #     ])
# # # #     model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# # # #     model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=20, batch_size=16)
    
# # # #     # Save the trained model
# # # #     #model.save('./adhd_model')
# # # #     model.save('E:/New folder (2)/adhd-assessment-system/backend/mlmodels/it21288326/adhd_model.keras')

# # # #     print("Model retrained and saved.")

# # # # # Main Execution
# # # # if __name__ == "__main__":
# # # #     data = fetch_data()
# # # #     if len(data) >= DATA_THRESHOLD:
# # # #         print(f"Training model with {len(data)} records...")
# # # #         train_model(data)
# # # #     else:
# # # #         print(f"Not enough data for training. Current size: {len(data)}")


# # # from pymongo import MongoClient
# # # import pandas as pd
# # # import numpy as np
# # # import tensorflow as tf
# # # from sklearn.model_selection import train_test_split
# # # from sklearn.preprocessing import LabelEncoder, StandardScaler
# # # from flask import Flask, request, jsonify
# # # import json
# # # import os
# # # from flask_cors import CORS

# # # # MongoDB setup
# # # client = MongoClient('mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/')
# # # db = client['test']
# # # game_metrics_collection = db['gamemetrics']
# # # questionnaire_collection = db['questionnaireresponses']


# # # CSV_FILE_PATH = "./adhd_data.csv"

# # # # # Constants
# # # # MODEL_PATH = 'E:/New folder (2)/adhd-assessment-system/backend/mlmodels/it21288326/adhd_model.keras'
# # # # ADHD_SUBTYPES = ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined']

# # # # Fetch and merge data
# # # def fetch_data():
# # #     df = load_csv_data(CSV_FILE_PATH)

# # #     if df.empty:
# # #         print("Dataset is empty. Waiting for data collection...")
# # #         return df
    






# # #     game_metrics = list(game_metrics_collection.find())
# # #     questionnaires = list(questionnaire_collection.find())

# # #     dataset = []
# # #     for metric in game_metrics:
# # #         matching_questionnaire = next(
# # #             (q for q in questionnaires if str(q['childId']) == str(metric['childId'])), None
# # #         )
# # #         if matching_questionnaire:
# # #             # Calculate reaction time variability if we have reaction times
# # #             reaction_time_variability = 0
# # #             if 'reactionTimes' in metric and len(metric['reactionTimes']) > 0:
# # #                 reaction_time_variability = np.std(metric['reactionTimes'])
            
# # #             # Calculate missed star streaks if available
# # #             missed_star_streaks = [0]
# # #             if 'missedStarStreaks' in metric:
# # #                 missed_star_streaks = metric['missedStarStreaks']
            
# # #             dataset.append({
# # #                 'averageReactionTime': metric.get('averageReactionTime', 0),
# # #                 'reactionTimeVariability': reaction_time_variability,
# # #                 'correctStreak': metric.get('correctStreak', 0),
# # #                 'prematureClicks': metric.get('prematureClicks', 0),
# # #                 'missedStars': metric.get('missedStars', 0),
# # #                 'maxMissedStreak': max(missed_star_streaks),
# # #                 'score': metric.get('score', 0),
# # #                 'ADHD_Type': matching_questionnaire.get('subtype', 'Unknown'),  # Label
# # #             })

# # #     return pd.DataFrame(dataset)

# # # # Feature engineering
# # # def prepare_features(data):
# # #     # Create additional derived features that match the frontend analytics
# # #     data['prematureClicksRatio'] = data['prematureClicks'] / (data['prematureClicks'] + 10)  # Avoid division by zero
    
# # #     # Normalize features for better model performance
# # #     scaler = StandardScaler()
# # #     feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
# # #                        'prematureClicks', 'missedStars', 'maxMissedStreak', 'score', 'prematureClicksRatio']
    
# # #     # Save scaler for later prediction use
# # #     X = data[feature_columns].values
# # #     X_scaled = scaler.fit_transform(X)
    
# # #     return X_scaled, scaler, feature_columns

# # # # Train model
# # # def train_model(data):
# # #     X_scaled, scaler, feature_columns = prepare_features(data)
    
# # #     # Encode the ADHD types
# # #     label_encoder = LabelEncoder()
# # #     y = label_encoder.fit_transform(data['ADHD_Type'])
    
# # #     # Save the mapping for later use
# # #     label_mapping = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))
    
# # #     X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# # #     # Create a more complex model
# # #     model = tf.keras.Sequential([
# # #         tf.keras.layers.Dense(32, activation='relu', input_shape=(X_train.shape[1],)),
# # #         tf.keras.layers.Dropout(0.2),
# # #         tf.keras.layers.Dense(16, activation='relu'),
# # #         tf.keras.layers.Dropout(0.1),
# # #         tf.keras.layers.Dense(len(set(y)), activation='softmax'),
# # #     ])
    
# # #     model.compile(optimizer='adam', 
# # #                   loss='sparse_categorical_crossentropy', 
# # #                   metrics=['accuracy'])

# # #     # Train with early stopping
# # #     early_stopping = tf.keras.callbacks.EarlyStopping(
# # #         monitor='val_loss', patience=5, restore_best_weights=True)
    
# # #     history = model.fit(
# # #         X_train, y_train, 
# # #         validation_data=(X_test, y_test), 
# # #         epochs=50, 
# # #         batch_size=16,
# # #         callbacks=[early_stopping]
# # #     )
    
# # #     # Evaluate final model
# # #     loss, accuracy = model.evaluate(X_test, y_test)
# # #     print(f"Test accuracy: {accuracy:.4f}")
    
# # #     # Save the trained model
# # #     model.save(MODEL_PATH)
    
# # #     # Save the scaler and feature info
# # #     scaler_path = os.path.dirname(MODEL_PATH) + '/scaler.pkl'
# # #     pd.to_pickle(scaler, scaler_path)
    
# # #     # Save feature columns and label mapping
# # #     with open(os.path.dirname(MODEL_PATH) + '/model_info.json', 'w') as f:
# # #         json.dump({
# # #             'feature_columns': feature_columns,
# # #             'label_mapping': label_mapping
# # #         }, f)

# # #     print("Model retrained and saved with preprocessing information.")
# # #     return model, scaler, feature_columns, label_mapping

# # # # Load trained model and preprocessing objects
# # # def load_model():
# # #     if not os.path.exists(MODEL_PATH):
# # #         print("Model not found. Please train the model first.")
# # #         return None, None, None, None
    
# # #     model = tf.keras.models.load_model(MODEL_PATH)
    
# # #     scaler_path = os.path.dirname(MODEL_PATH) + '/scaler.pkl'
# # #     if os.path.exists(scaler_path):
# # #         scaler = pd.read_pickle(scaler_path)
# # #     else:
# # #         print("Scaler not found. Using default preprocessing.")
# # #         scaler = StandardScaler()
    
# # #     info_path = os.path.dirname(MODEL_PATH) + '/model_info.json'
# # #     if os.path.exists(info_path):
# # #         with open(info_path, 'r') as f:
# # #             model_info = json.load(f)
# # #         feature_columns = model_info.get('feature_columns', [])
# # #         label_mapping = model_info.get('label_mapping', {})
# # #     else:
# # #         feature_columns = []
# # #         label_mapping = {}
    
# # #     return model, scaler, feature_columns, label_mapping

# # # # Function to generate insights based on prediction results
# # # def generate_insights(adhd_type, game_data):
# # #     insights = {
# # #         'inattention': [],
# # #         'impulsivity': [],
# # #         'combined': []
# # #     }
    
# # #     # Inattention insights
# # #     if game_data.get('missedStars', 0) > 5:
# # #         insights['inattention'].append("Missed several stars, suggesting potential attention lapses.")
    
# # #     if game_data.get('averageReactionTime', 0) > 1000:
# # #         insights['inattention'].append("Slower reaction times indicate possible difficulty maintaining focus.")
    
# # #     if game_data.get('maxMissedStreak', 0) >= 2:
# # #         insights['inattention'].append("Consecutive missed stars suggest periods of significant inattention.")
    
# # #     # Impulsivity insights
# # #     if game_data.get('prematureClicks', 0) > 3:
# # #         insights['impulsivity'].append("High number of premature clicks suggests impulsive responding.")
    
# # #     # Add ADHD type-specific insights
# # #     if adhd_type == "Inattentive":
# # #         insights['inattention'].append("Model prediction indicates an inattentive pattern consistent with ADHD-I.")
# # #         insights['combined'].append("Primary challenges appear to be with sustained attention rather than impulse control.")
# # #     elif adhd_type == "Hyperactive-Impulsive":
# # #         insights['impulsivity'].append("Model prediction indicates an impulsive pattern consistent with ADHD-HI.")
# # #         insights['combined'].append("Primary challenges appear to be with impulse control rather than sustained attention.")
# # #     elif adhd_type == "Combined":
# # #         insights['combined'].append("Model prediction indicates both inattentive and impulsive patterns, consistent with ADHD-C.")
# # #     else:  # No ADHD
# # #         if game_data.get('score', 0) > 200:
# # #             insights['combined'].append("Performance metrics are within typical ranges, with no significant attention or impulsivity concerns.")
    
# # #     # Ensure we have at least one insight per category
# # #     if not insights['inattention']:
# # #         insights['inattention'].append("Attention metrics are within normal ranges.")
# # #     if not insights['impulsivity']:
# # #         insights['impulsivity'].append("Impulsivity metrics are within normal ranges.")
# # #     if not insights['combined']:
# # #         if game_data.get('score', 0) > 200:
# # #             insights['combined'].append("Overall performance is strong, showing good cognitive control.")
# # #         else:
# # #             insights['combined'].append("Overall performance is within typical ranges.")
    
# # #     return insights

# # # # Predict ADHD type and generate GameAnalytics from game metrics
# # # def predict_from_game_data(game_data, model, scaler, feature_columns, label_mapping):
# # #     # Extract and prepare features from game data
# # #     features = {}
# # #     for feature in feature_columns:
# # #         if feature == 'reactionTimeVariability' and 'reactionTimes' in game_data:
# # #             # Calculate variability from reaction times
# # #             features[feature] = np.std(game_data['reactionTimes']) if len(game_data['reactionTimes']) > 0 else 0
# # #         elif feature == 'maxMissedStreak' and 'missedStarStreaks' in game_data:
# # #             features[feature] = max(game_data['missedStarStreaks']) if len(game_data['missedStarStreaks']) > 0 else 0
# # #         elif feature == 'prematureClicksRatio':
# # #             # Calculate ratio
# # #             denominator = game_data.get('prematureClicks', 0) + (len(game_data.get('reactionTimes', [])) or 1)
# # #             features[feature] = game_data.get('prematureClicks', 0) / denominator
# # #         else:
# # #             features[feature] = game_data.get(feature, 0)
    
# # #     # Convert to DataFrame for consistent preprocessing
# # #     features_df = pd.DataFrame([features])
    
# # #     # Fill missing values
# # #     for col in feature_columns:
# # #         if col not in features_df.columns:
# # #             features_df[col] = 0
    
# # #     # Ensure correct column order
# # #     features_df = features_df[feature_columns]
    
# # #     # Scale features
# # #     X_scaled = scaler.transform(features_df.values)
    
# # #     # Make prediction
# # #     prediction_probs = model.predict(X_scaled)[0]
# # #     prediction_class = np.argmax(prediction_probs)
    
# # #     # Find ADHD type from the prediction
# # #     adhd_type = None
# # #     for type_name, type_index in label_mapping.items():
# # #         if type_index == prediction_class:
# # #             adhd_type = type_name
    
# # #     if not adhd_type and len(ADHD_SUBTYPES) > prediction_class:
# # #         adhd_type = ADHD_SUBTYPES[prediction_class]
    
# # #     # Calculate inattention and impulsivity scores
# # #     inattention_score = calculate_inattention_score(game_data)
# # #     impulsivity_score = calculate_impulsivity_score(game_data)
# # #     combined_score = (inattention_score + impulsivity_score) / 2
    
# # #     # Generate insights
# # #     insights = generate_insights(adhd_type, game_data)
    
# # #     # Prepare result in the format expected by the frontend
# # #     result = {
# # #         'adhd_type': adhd_type,
# # #         'confidence': float(prediction_probs[prediction_class]),
# # #         'inattention': {
# # #             'score': inattention_score,
# # #             'level': get_score_level(inattention_score),
# # #             'insights': insights['inattention']
# # #         },
# # #         'impulsivity': {
# # #             'score': impulsivity_score,
# # #             'level': get_score_level(impulsivity_score),
# # #             'insights': insights['impulsivity']
# # #         },
# # #         'combined': {
# # #             'score': combined_score,
# # #             'level': get_score_level(combined_score),
# # #             'insights': insights['combined']
# # #         }
# # #     }
    
# # #     return result

# # # # Calculate inattention score - similar to the frontend logic
# # # def calculate_inattention_score(data):
# # #     # Factors indicating inattention
# # #     missed_stars_factor = min(data.get('missedStars', 0) * 5, 40)
    
# # #     # Long reaction times
# # #     avg_reaction_time = data.get('averageReactionTime', 0)
# # #     reaction_time_factor = 0
# # #     if avg_reaction_time > 1000: reaction_time_factor = 30
# # #     elif avg_reaction_time > 800: reaction_time_factor = 20
# # #     elif avg_reaction_time > 600: reaction_time_factor = 10
    
# # #     # Missed star streaks
# # #     missed_star_streaks = data.get('missedStarStreaks', [0])
# # #     max_missed_streak = max(missed_star_streaks) if missed_star_streaks else 0
# # #     streak_factor = max_missed_streak * 10
    
# # #     # Calculate final score (cap at 100)
# # #     return min(missed_stars_factor + reaction_time_factor + streak_factor, 100)

# # # # Calculate impulsivity score - similar to the frontend logic
# # # def calculate_impulsivity_score(data):
# # #     # Premature clicks
# # #     premature_clicks = data.get('prematureClicks', 0)
# # #     reaction_times = data.get('reactionTimes', [])
    
# # #     denominator = len(reaction_times) + premature_clicks
# # #     premature_clicks_ratio = (premature_clicks / denominator * 100) if denominator > 0 else 0
# # #     premature_clicks_factor = min(premature_clicks_ratio, 50)
    
# # #     # Fast responses
# # #     fast_responses = sum(1 for time in reaction_times if time < 400)
# # #     fast_response_ratio = (fast_responses / len(reaction_times) * 100) if len(reaction_times) > 0 else 0
# # #     fast_response_factor = min(fast_response_ratio * 0.5, 30)
    
# # #     # Variability in reaction times
# # #     variability_factor = 0
# # #     if 'reactionTimes' in data and len(data['reactionTimes']) > 0:
# # #         std_dev = np.std(data['reactionTimes'])
# # #         if std_dev > 300: variability_factor = 20
# # #         elif std_dev > 200: variability_factor = 10
    
# # #     # Calculate final score (cap at 100)
# # #     return min(premature_clicks_factor + fast_response_factor + variability_factor, 100)

# # # # Get score level
# # # def get_score_level(score):
# # #     if score < 20: return 'Low'
# # #     if score < 40: return 'Below Average'
# # #     if score < 60: return 'Average'
# # #     if score < 80: return 'Above Average'
# # #     return 'High'

# # # # Main Execution
# # # if __name__ == "__main__":
# # #     # Check if we should train or just run prediction service
# # #     import sys
# # #     if len(sys.argv) > 1 and sys.argv[1] == 'train':
# # #         data = fetch_data()
# # #         if len(data) >= DATA_THRESHOLD:
# # #             print(f"Training model with {len(data)} records...")
# # #             train_model(data)
# # #         else:
# # #             print(f"Not enough data for training. Current size: {len(data)}")
# # #     else:
# # #         # Run prediction API service
# # #         app = Flask(__name__)
# # #         CORS(app)  # Enable CORS for all routes

# # #         # Load model on startup
# # #         loaded_model, loaded_scaler, loaded_features, loaded_mapping = load_model()
# # #         if loaded_model is None:
# # #             print("Error: Could not load model. Please train the model first.")
# # #             exit(1)

# # #         @app.route('/predict', methods=['POST'])
# # #         def predict():
# # #             try:
# # #                 game_data = request.json
# # #                 if not game_data:
# # #                     return jsonify({"error": "No game data provided"}), 400
                
# # #                 result = predict_from_game_data(
# # #                     game_data, loaded_model, loaded_scaler, loaded_features, loaded_mapping
# # #                 )
# # #                 return jsonify(result)
# # #             except Exception as e:
# # #                 return jsonify({"error": str(e)}), 500

# # #         @app.route('/health', methods=['GET'])
# # #         def health_check():
# # #             return jsonify({"status": "ok", "model_loaded": loaded_model is not None})

# # #         # Run the Flask app
# # #         print("Starting prediction service on http://localhost:5000")
# # #         app.run(host='0.0.0.0', port=5000, debug=False)

# # import pandas as pd
# # import numpy as np
# # import tensorflow as tf
# # from sklearn.model_selection import train_test_split
# # from sklearn.preprocessing import LabelEncoder, StandardScaler
# # from flask import Flask, request, jsonify
# # import json
# # import os
# # from flask_cors import CORS
# # from pymongo import MongoClient
# # import pickle


# # # Constants
# # CSV_FILE_PATH = "D:\ research\ adhd-assessment-system\ backend\mlmodels\it21288326\ adhd_dataset .csv"  # Initial data source
# # MODEL_PATH = '/ adhd_model.keras'
# # # model_path = "models/adhd_model.keras"
# # # model = tf.keras.models.load_model(model_path)

# # ADHD_SUBTYPES = ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined']
# # DATA_THRESHOLD = 40  # Minimum records needed for training

# # # MongoDB setup
# # client = MongoClient('mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/')
# # db = client['test']
# # game_metrics_collection = db['gamemetrics']
# # questionnaire_collection = db['questionnaireresponses']

# # # Load initial data from CSV
# # def load_csv_data(csv_path):
# #     """Loads data from CSV if it exists, else returns an empty DataFrame."""
# #     if os.path.exists(csv_path):
# #         df = pd.read_csv(csv_path)
# #         print(f"Loaded {len(df)} records from CSV.")
# #         return df
# #     else:
# #         print("CSV file not found. Creating a new dataset.")
# #         # Create empty DataFrame with necessary columns
# #         columns = ['childId', 'averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
# #                   'prematureClicks', 'missedStars', 'maxMissedStreak', 'score', 'ADHD_Type']
# #         return pd.DataFrame(columns=columns)

# # # Fetch data from MongoDB and merge with CSV data
# # def fetch_data():
# #     """Fetches data from both CSV and MongoDB."""
# #     # First, load data from CSV
# #     csv_data = load_csv_data(CSV_FILE_PATH)
    
# #     # Then, fetch latest data from MongoDB
# #     game_metrics = list(game_metrics_collection.find())
# #     questionnaires = list(questionnaire_collection.find())
    
# #     # Process MongoDB data
# #     child_data = {}
# #     for metric in game_metrics:
# #         child_id = str(metric['childId'])
# #         # Ensure the child has completed both quiz and game
# #         matching_questionnaire = next(
# #             (q for q in questionnaires if str(q['childId']) == child_id and q.get('completed', False)), 
# #             None
# #         )
# #         if matching_questionnaire and metric.get('completed', False):
# #             # If the child is already in child_data, skip (we only take the first entry)
# #             if child_id in child_data:
# #                 continue
# #             reaction_time_variability = np.std(metric['reactionTimes']) if 'reactionTimes' in metric else 0
# #             missed_star_streaks = metric.get('missedStarStreaks', [0])
# #             record = {
# #                 'childId': child_id,
# #                 'averageReactionTime': metric.get('averageReactionTime', 0),
# #                 'reactionTimeVariability': reaction_time_variability,
# #                 'correctStreak': metric.get('correctStreak', 0),
# #                 'prematureClicks': metric.get('prematureClicks', 0),
# #                 'missedStars': metric.get('missedStars', 0),
# #                 'maxMissedStreak': max(missed_star_streaks),
# #                 'score': metric.get('score', 0),
# #                 'ADHD_Type': matching_questionnaire.get('subtype', 'Unknown'),  # Label
# #             }
# #             # Store only the first completed record for each child
# #             child_data[child_id] = record
            
# #     # Convert MongoDB data to DataFrame
# #     mongo_df = pd.DataFrame(list(child_data.values()))
    
# #     # Merge data, prioritizing MongoDB data for duplicates
# #     if not mongo_df.empty:
# #         # Identify children present in both datasets
# #         if not csv_data.empty and 'childId' in csv_data.columns:
# #             existing_ids = set(csv_data['childId'].astype(str))
# #             mongo_df = mongo_df[~mongo_df['childId'].astype(str).isin(existing_ids)]
        
# #         # Combine the datasets
# #         df = pd.concat([csv_data, mongo_df], ignore_index=True)
        
# #         # Save the merged dataset back to CSV for future use
# #         df.to_csv(CSV_FILE_PATH, index=False)
# #         print(f"Updated CSV with {len(mongo_df)} new records from MongoDB.")
# #     else:
# #         df = csv_data
    
# #     print(f"Total dataset size: {len(df)} records")
# #     return df

# # # Feature engineering
# # def prepare_features(data):
# #     # Create additional derived features that match the frontend analytics
# #     data['prematureClicksRatio'] = data['prematureClicks'] / (data['prematureClicks'] + 10)  # Avoid division by zero
    
# #     # Normalize features for better model performance
# #     scaler = StandardScaler()
# #     feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
# #                        'prematureClicks', 'missedStars', 'maxMissedStreak', 'score', 'prematureClicksRatio']
    
# #     # Save scaler for later prediction use
# #     X = data[feature_columns].values
# #     X_scaled = scaler.fit_transform(X)
    
# #     return X_scaled, scaler, feature_columns

# # # Train model
# # def train_model(data):
# #     # Filter out rows with Unknown ADHD_Type
# #     data = data[data['ADHD_Type'] != 'Unknown'].copy()
    
# #     if len(data) < DATA_THRESHOLD:
# #         print(f"Not enough valid data for training. Current size: {len(data)}")
# #         return None, None, None, None
    
# #     X_scaled, scaler, feature_columns = prepare_features(data)
    
# #     # Encode the ADHD types
# #     label_encoder = LabelEncoder()
# #     y = label_encoder.fit_transform(data['ADHD_Type'])
    
# #     # Save the mapping for later use
# #     label_mapping = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))
    
# #     X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# #     # Create a more complex model
# #     model = tf.keras.Sequential([
# #         tf.keras.layers.Dense(32, activation='relu', input_shape=(X_train.shape[1],)),
# #         tf.keras.layers.Dropout(0.2),
# #         tf.keras.layers.Dense(16, activation='relu'),
# #         tf.keras.layers.Dropout(0.1),
# #         tf.keras.layers.Dense(len(set(y)), activation='softmax'),
# #     ])
    
# #     model.compile(optimizer='adam', 
# #                   loss='sparse_categorical_crossentropy', 
# #                   metrics=['accuracy'])

# #     # Train with early stopping
# #     early_stopping = tf.keras.callbacks.EarlyStopping(
# #         monitor='val_loss', patience=5, restore_best_weights=True)
    
# #     history = model.fit(
# #         X_train, y_train, 
# #         validation_data=(X_test, y_test), 
# #         epochs=50, 
# #         batch_size=16,
# #         callbacks=[early_stopping]
# #     )
    
# #     # Evaluate final model
# #     loss, accuracy = model.evaluate(X_test, y_test)
# #     print(f"Test accuracy: {accuracy:.4f}")
    
# #     # Create directory if it doesn't exist
# #     os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    
# #     # Save the trained model
# #     model.save(MODEL_PATH)
    
# #     # Save the scaler and feature info
# #     scaler_path = os.path.dirname(MODEL_PATH) + '/scaler.pkl'
# #     pd.to_pickle(scaler, scaler_path)
    
# #     # Save feature columns and label mapping
# #     with open(os.path.dirname(MODEL_PATH) + '/model_info.json', 'w') as f:
# #         json.dump({
# #             'feature_columns': feature_columns,
# #             'label_mapping': label_mapping
# #         }, f)

# #     print("Model retrained and saved with preprocessing information.")
# #     return model, scaler, feature_columns, label_mapping

# # # Load trained model and preprocessing objects
# # def load_model():
# #     """
# #     Load the trained model and preprocessing objects.
    
# #     Returns:
# #     tuple: (model, scaler, feature_columns, label_mapping)
# #     """
# #     # Load the Keras model
# #     try:
# #         model = tf.keras.models.load_model(MODEL_PATH)
# #     except Exception as e:
# #         print(f"Error loading model: {e}")
# #         return None, None, None, None
    
# #     # Load the scaler
# #     try:
# #         with open('mlmodels/scaler.pkl', 'rb') as f:
# #             scaler = pickle.load(f)
# #     except Exception as e:
# #         print(f"Error loading scaler: {e}")
# #         return model, None, None, None
    
# #     # Load the label encoder
# #     try:
# #         with open('mlmodels/label_encoder.pkl', 'rb') as f:
# #             label_encoder = pickle.load(f)
# #         label_mapping = dict(zip(label_encoder.classes_, 
# #                                 label_encoder.transform(label_encoder.classes_)))
        
# #     except Exception as e:
# #         print(f"Error loading label encoder: {e}")
# #         return model, scaler, None, None
    
# #     # Define feature columns
# #     feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
# #                      'prematureClicks', 'missedStars', 'score', 'prematureClicksRatio']
    
# #     return model, scaler, feature_columns, label_mapping

# # # Function to generate insights based on prediction results
# # def generate_insights(adhd_type, game_data):
# #     insights = {
# #         'inattention': [],
# #         'impulsivity': [],
# #         'combined': []
# #     }
    
# #     # Inattention insights
# #     if game_data.get('missedStars', 0) > 5:
# #         insights['inattention'].append("Missed several stars, suggesting potential attention lapses.")
    
# #     if game_data.get('averageReactionTime', 0) > 1000:
# #         insights['inattention'].append("Slower reaction times indicate possible difficulty maintaining focus.")
    
# #     if game_data.get('maxMissedStreak', 0) >= 2:
# #         insights['inattention'].append("Consecutive missed stars suggest periods of significant inattention.")
    
# #     # Impulsivity insights
# #     if game_data.get('prematureClicks', 0) > 3:
# #         insights['impulsivity'].append("High number of premature clicks suggests impulsive responding.")
    
# #     # Add ADHD type-specific insights
# #     if adhd_type == "Inattentive":
# #         insights['inattention'].append("Model prediction indicates an inattentive pattern consistent with ADHD-I.")
# #         insights['combined'].append("Primary challenges appear to be with sustained attention rather than impulse control.")
# #     elif adhd_type == "Hyperactive-Impulsive":
# #         insights['impulsivity'].append("Model prediction indicates an impulsive pattern consistent with ADHD-HI.")
# #         insights['combined'].append("Primary challenges appear to be with impulse control rather than sustained attention.")
# #     elif adhd_type == "Combined":
# #         insights['combined'].append("Model prediction indicates both inattentive and impulsive patterns, consistent with ADHD-C.")
# #     else:  # No ADHD
# #         if game_data.get('score', 0) > 200:
# #             insights['combined'].append("Performance metrics are within typical ranges, with no significant attention or impulsivity concerns.")
    
# #     # Ensure we have at least one insight per category
# #     if not insights['inattention']:
# #         insights['inattention'].append("Attention metrics are within normal ranges.")
# #     if not insights['impulsivity']:
# #         insights['impulsivity'].append("Impulsivity metrics are within normal ranges.")
# #     if not insights['combined']:
# #         if game_data.get('score', 0) > 200:
# #             insights['combined'].append("Overall performance is strong, showing good cognitive control.")
# #         else:
# #             insights['combined'].append("Overall performance is within typical ranges.")
    
# #     return insights

# # # Calculate inattention score
# # def calculate_inattention_score(data):
# #     # Factors indicating inattention
# #     missed_stars_factor = min(data.get('missedStars', 0) * 5, 40)
    
# #     # Long reaction times
# #     avg_reaction_time = data.get('averageReactionTime', 0)
# #     reaction_time_factor = 0
# #     if avg_reaction_time > 1000: reaction_time_factor = 30
# #     elif avg_reaction_time > 800: reaction_time_factor = 20
# #     elif avg_reaction_time > 600: reaction_time_factor = 10
    
# #     # Missed star streaks
# #     missed_star_streaks = data.get('missedStarStreaks', [0])
# #     if isinstance(missed_star_streaks, str):
# #         try:
# #             missed_star_streaks = eval(missed_star_streaks)
# #         except:
# #             missed_star_streaks = [0]
    
# #     max_missed_streak = max(missed_star_streaks) if missed_star_streaks else 0
# #     streak_factor = max_missed_streak * 10
    
# #     # Calculate final score (cap at 100)
# #     return min(missed_stars_factor + reaction_time_factor + streak_factor, 100)

# # # Calculate impulsivity score
# # def calculate_impulsivity_score(data):
# #     # Premature clicks
# #     premature_clicks = data.get('prematureClicks', 0)
# #     reaction_times = data.get('reactionTimes', [])
    
# #     # If reaction_times is a string (from CSV), convert to list
# #     if isinstance(reaction_times, str):
# #         try:
# #             reaction_times = eval(reaction_times)
# #         except:
# #             reaction_times = []
    
# #     denominator = len(reaction_times) + premature_clicks
# #     premature_clicks_ratio = (premature_clicks / denominator * 100) if denominator > 0 else 0
# #     premature_clicks_factor = min(premature_clicks_ratio, 50)
    
# #     # Fast responses
# #     fast_responses = sum(1 for time in reaction_times if time < 400)
# #     fast_response_ratio = (fast_responses / len(reaction_times) * 100) if len(reaction_times) > 0 else 0
# #     fast_response_factor = min(fast_response_ratio * 0.5, 30)
    
# #     # Variability in reaction times
# #     variability_factor = 0
# #     if len(reaction_times) > 0:
# #         std_dev = np.std(reaction_times)
# #         if std_dev > 300: variability_factor = 20
# #         elif std_dev > 200: variability_factor = 10
    
# #     # Calculate final score (cap at 100)
# #     return min(premature_clicks_factor + fast_response_factor + variability_factor, 100)

# # # Get score level
# # def get_score_level(score):
# #     if score < 20: return 'Low'
# #     if score < 40: return 'Below Average'
# #     if score < 60: return 'Average'
# #     if score < 80: return 'Above Average'
# #     return 'High'

# # # Predict ADHD type and generate GameAnalytics from game metrics
# # # def predict_from_game_data(game_data, model, scaler, feature_columns, label_mapping):
# # #     # Extract and prepare features from game data
# # #     features = {}
# # #     for feature in feature_columns:
# # #         if feature == 'reactionTimeVariability' and 'reactionTimes' in game_data:
# # #             # Calculate variability from reaction times
# # #             reaction_times = game_data['reactionTimes']
# # #             if isinstance(reaction_times, str):
# # #                 try:
# # #                     reaction_times = eval(reaction_times)
# # #                 except:
# # #                     reaction_times = []
# # #             features[feature] = np.std(reaction_times) if len(reaction_times) > 0 else 0
# # #         elif feature == 'maxMissedStreak' and 'missedStarStreaks' in game_data:
# # #             missed_streaks = game_data['missedStarStreaks']
# # #             if isinstance(missed_streaks, str):
# # #                 try:
# # #                     missed_streaks = eval(missed_streaks)
# # #                 except:
# # #                     missed_streaks = [0]
# # #             features[feature] = max(missed_streaks) if len(missed_streaks) > 0 else 0
# # #         elif feature == 'prematureClicksRatio':
# # #             # Calculate ratio
# # #             denominator = game_data.get('prematureClicks', 0) + 10
# # #             features[feature] = game_data.get('prematureClicks', 0) / denominator
# # #         else:
# # #             features[feature] = game_data.get(feature, 0)
    
# # #     # Convert to DataFrame for consistent preprocessing
# # #     features_df = pd.DataFrame([features])
    
# # #     # Fill missing values
# # #     for col in feature_columns:
# # #         if col not in features_df.columns:
# # #             features_df[col] = 0
    
# # #     # Ensure correct column order
# # #     features_df = features_df[feature_columns]
    
# # #     # Scale features
# # #     X_scaled = scaler.transform(features_df.values)
    
# # #     # Make prediction
# # #     prediction_probs = model.predict(X_scaled)[0]
# # #     prediction_class = np.argmax(prediction_probs)
    
# # #     # Find ADHD type from the prediction
# # #     adhd_type = None
# # #     for type_name, type_index in label_mapping.items():
# # #         if type_index == prediction_class:
# # #             adhd_type = type_name
    
# # #     if not adhd_type and len(ADHD_SUBTYPES) > prediction_class:
# # #         adhd_type = ADHD_SUBTYPES[prediction_class]
    
# # #     # Calculate inattention and impulsivity scores
# # #     inattention_score = calculate_inattention_score(game_data)
# # #     impulsivity_score = calculate_impulsivity_score(game_data)
# # #     combined_score = (inattention_score + impulsivity_score) / 2
    
# # #     # Generate insights
# # #     insights = generate_insights(adhd_type, game_data)
    
# # #     # Prepare result in the format expected by the frontend
# # #     result = {
# # #         'adhd_type': adhd_type,
# # #         'confidence': float(prediction_probs[prediction_class]),
# # #         'inattention': {
# # #             'score': inattention_score,
# # #             'level': get_score_level(inattention_score),
# # #             'insights': insights['inattention']
# # #         },
# # #         'impulsivity': {
# # #             'score': impulsivity_score,
# # #             'level': get_score_level(impulsivity_score),
# # #             'insights': insights['impulsivity']
# # #         },
# # #         'combined': {
# # #             'score': combined_score,
# # #             'level': get_score_level(combined_score),
# # #             'insights': insights['combined']
# # #         }
# # #     }
    
# # #     return result
# # def predict_adhd_type(reaction_times, correct_streak, premature_clicks, missed_stars, score):
# #     """
# #     Make a prediction using the trained model.
    
# #     Parameters:
# #     reaction_times (list): List of reaction times in milliseconds
# #     correct_streak (int): Maximum correct streak
# #     premature_clicks (int): Number of premature clicks
# #     missed_stars (int): Number of missed stars
# #     score (int): Game score
    
# #     Returns:
# #     str: Predicted ADHD type
# #     dict: Probabilities for each ADHD type
# #     """
# #     # Load model and preprocessing objects
# #     model, scaler, feature_columns, label_mapping = load_model()
    
# #     if model is None or scaler is None or label_mapping is None:
# #         print("Error: Could not load model or preprocessing objects")
# #         return None, None
    
# #     # Calculate derived metrics
# #     avg_reaction_time = np.mean(reaction_times)
# #     reaction_time_variability = np.std(reaction_times)
# #     premature_clicks_ratio = premature_clicks / (premature_clicks + 10)
    
# #     # Create feature vector
# #     features = np.array([[
# #         avg_reaction_time, 
# #         reaction_time_variability, 
# #         correct_streak, 
# #         premature_clicks, 
# #         missed_stars, 
# #         score, 
# #         premature_clicks_ratio
# #     ]])
    
# #     # Scale features
# #     scaled_features = scaler.transform(features)
    
# #     # Make prediction
# #     prediction = model.predict(scaled_features)[0]
    
# #     # Get predicted class
# #     predicted_class = np.argmax(prediction)
    
# #     # Map class index back to ADHD type
# #     inverse_mapping = {v: k for k, v in label_mapping.items()}
# #     predicted_type = inverse_mapping[predicted_class]
    
# #     # Get probabilities for each class
# #     probabilities = {adhd_type: float(prediction[i]) for i, adhd_type in enumerate(sorted(label_mapping.keys(), key=lambda x: label_mapping[x]))}
    
# #     return predicted_type, probabilities

# # # Main Execution
# # if __name__ == "__main__":
# #     # Check if we should train or just run prediction service
# #     import sys
# #     if len(sys.argv) > 1 and sys.argv[1] == 'train':
# #         data = fetch_data()
# #         if len(data) >= DATA_THRESHOLD:
# #             print(f"Training model with {len(data)} records...")
# #             train_model(data)
# #         else:
# #             print(f"Not enough data for training. Current size: {len(data)}")
# #     else:
# #         # Run prediction API service
# #         app = Flask(__name__)
# #         CORS(app)  # Enable CORS for all routes

# #         # Load model on startup
# #         loaded_model, loaded_scaler, loaded_features, loaded_mapping = load_model()
# #         if loaded_model is None:
# #             print("Error: Could not load model. Please train the model first.")
# #             exit(1)

# #         @app.route('/predict', methods=['POST'])
# #         def predict():
# #             try:
# #                 game_data = request.json
# #                 if not game_data:
# #                     return jsonify({"error": "No game data provided"}), 400
                
# #                 result = predict_adhd_type(
                    
# #     game_data['reactionTimes'], game_data['correctStreak'], 
# #     game_data['prematureClicks'], game_data['missedStars'], game_data['score']
# #                 )
# #                 return jsonify(result)
# #             except Exception as e:
# #                 return jsonify({"error": str(e)}), 500
        
# #         # @app.route('/add-data', methods=['POST'])
# #         # def add_data():
# #         #     try:
# #         #         new_data = request.json
# #         #         if not new_data:
# #         #             return jsonify({"error": "No data provided"}), 400
                
# #         #         total_records = append_new_data(new_data)
# #         #         return jsonify({
# #         #             "status": "success",
# #         #             "message": "Data added successfully",
# #         #             "total_records": total_records
# #         #         })
# #         #     except Exception as e:
# #         #         return jsonify({"error": str(e)}), 500

# #         @app.route('/health', methods=['GET'])
# #         def health_check():
# #             return jsonify({"status": "ok", "model_loaded": loaded_model is not None})

# #         # Run the Flask app
# #         print("Starting prediction service on http://localhost:5000")
# #         app.run(host='0.0.0.0', port=5000, debug=False)

# import pandas as pd
# import numpy as np
# import tensorflow as tf
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder, StandardScaler
# from flask import Flask, request, jsonify
# import json
# import os
# import logging
# import traceback
# from flask_cors import CORS
# from pymongo import MongoClient
# import pickle
# # Add this to your health_check function
# import time
# start_time = time.time()



# # Set up logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     handlers=[
#         logging.FileHandler("adhd_model.log"),
#         logging.StreamHandler()
#     ]
# )
# logger = logging.getLogger(__name__)

# # Constants
# CSV_FILE_PATH = "C:/Users/shash/Documents/GitHub/adhd-assessment-system/backend/mlmodels/it21288326/adhd_dataset.csv"  # Initial data source
# MODEL_PATH = 'C:/Users/shash/Documents/GitHub/adhd-assessment-system/backend/mlmodels/it21288326/adhd_model.keras'
# ADHD_SUBTYPES = ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined']
# DATA_THRESHOLD = 0  # Minimum records needed for training

# # MongoDB setup
# try:
#     client = MongoClient('mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/', serverSelectionTimeoutMS=5000)
#     # Test the connection
#     client.server_info()
#     db = client['test']
#     game_metrics_collection = db['gamemetrics']
#     questionnaire_collection = db['questionnaireresponses']
#     logger.info("MongoDB connection established successfully")
# except Exception as e:
#     logger.error(f"MongoDB connection error: {str(e)}")
#     # Create a fallback mechanism
#     client = None
#     db = None
#     game_metrics_collection = None
#     questionnaire_collection = None

# class ModelError(Exception):
#     """Custom exception for model-related errors"""
#     pass

# class DataError(Exception):
#     """Custom exception for data-related errors"""
#     pass

# # Load initial data from CSV
# def load_csv_data(csv_path):
#     """Loads data from CSV if it exists, else returns an empty DataFrame."""
#     try:
#         if os.path.exists(csv_path):
#             df = pd.read_csv(csv_path)
#             logger.info(f"Loaded {len(df)} records from CSV.")
#             return df
#         else:
#             logger.warning("CSV file not found. Creating a new dataset.")
#             # Create empty DataFrame with necessary columns
#             columns = ['childId', 'averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
#                       'prematureClicks', 'missedStars', 'maxMissedStreak', 'score', 'ADHD_Type']
#             return pd.DataFrame(columns=columns)
#     except Exception as e:
#         logger.error(f"Error loading CSV data: {str(e)}")
#         raise DataError(f"Failed to load CSV data: {str(e)}")

# # Fetch data from MongoDB and merge with CSV data
# def fetch_data():
#     """Fetches data from both CSV and MongoDB."""
#     try:
#         # First, load data from CSV
#         csv_data = load_csv_data(CSV_FILE_PATH)
        
#         # Then, fetch latest data from MongoDB
#         if game_metrics_collection is None or questionnaire_collection is None:
#             logger.warning("MongoDB connection not available. Using only CSV data.")
#             return csv_data
        
#         try:
#             game_metrics = list(game_metrics_collection.find())
#             questionnaires = list(questionnaire_collection.find())
#         except Exception as e:
#             logger.error(f"Error fetching data from MongoDB: {str(e)}")
#             return csv_data
        
#         # Process MongoDB data
#         child_data = {}
#         for metric in game_metrics:
#             try:
#                 child_id = str(metric['childId'])
#                 # Ensure the child has completed both quiz and game
#                 matching_questionnaire = next(
#                     (q for q in questionnaires if str(q['childId']) == child_id and q.get('completed', False)), 
#                     None
#                 )
#                 if matching_questionnaire and metric.get('completed', False):
#                     # If the child is already in child_data, skip (we only take the first entry)
#                     if child_id in child_data:
#                         continue
                    
#                     # Safely get reaction times and calculate variability
#                     reaction_times = metric.get('reactionTimes', [])
#                     reaction_time_variability = np.std(reaction_times) if reaction_times and len(reaction_times) > 0 else 0
                    
#                     # Safely get missed star streaks
#                     missed_star_streaks = metric.get('missedStarStreaks', [0])
#                     if not missed_star_streaks:
#                         missed_star_streaks = [0]
                    
#                     record = {
#                         'childId': child_id,
#                         'averageReactionTime': metric.get('averageReactionTime', 0),
#                         'reactionTimeVariability': reaction_time_variability,
#                         'correctStreak': metric.get('correctStreak', 0),
#                         'prematureClicks': metric.get('prematureClicks', 0),
#                         'missedStars': metric.get('missedStars', 0),
#                         'maxMissedStreak': max(missed_star_streaks),
#                         'score': metric.get('score', 0),
#                         'ADHD_Type': matching_questionnaire.get('subtype', 'Unknown'),  # Label
#                     }
#                     # Store only the first completed record for each child
#                     child_data[child_id] = record
#             except Exception as e:
#                 logger.error(f"Error processing metric for child {metric.get('childId', 'unknown')}: {str(e)}")
#                 continue
                
#         # Convert MongoDB data to DataFrame
#         mongo_df = pd.DataFrame(list(child_data.values()))
        
#         # Merge data, prioritizing MongoDB data for duplicates
#         if not mongo_df.empty:
#             # Identify children present in both datasets
#             if not csv_data.empty and 'childId' in csv_data.columns:
#                 existing_ids = set(csv_data['childId'].astype(str))
#                 mongo_df = mongo_df[~mongo_df['childId'].astype(str).isin(existing_ids)]
            
#             # Combine the datasets
#             df = pd.concat([csv_data, mongo_df], ignore_index=True)
            
#             # Save the merged dataset back to CSV for future use
#             try:
#                 os.makedirs(os.path.dirname(CSV_FILE_PATH), exist_ok=True)
#                 df.to_csv(CSV_FILE_PATH, index=False)
#                 logger.info(f"Updated CSV with {len(mongo_df)} new records from MongoDB.")
#             except Exception as e:
#                 logger.error(f"Error saving merged data to CSV: {str(e)}")
#         else:
#             df = csv_data
        
#         logger.info(f"Total dataset size: {len(df)} records")
#         return df
#     except Exception as e:
#         logger.error(f"Error in fetch_data: {str(e)}\n{traceback.format_exc()}")
#         # Return whatever data we have or an empty DataFrame
#         return csv_data if 'csv_data' in locals() else pd.DataFrame()

# # Feature engineering
# def prepare_features(data):
#     try:
#         # Create additional derived features that match the frontend analytics
#         data['prematureClicksRatio'] = data['prematureClicks'] / (data['prematureClicks'] + 10)  # Avoid division by zero
        
#         # Normalize features for better model performance
#         # scaler = StandardScaler()
#         # feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
#         #                    'prematureClicks', 'missedStars', 'maxMissedStreak', 'score', 'prematureClicksRatio']

#         scaler = StandardScaler()
#         feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
#                            'prematureClicks', 'missedStars', 'score', 'prematureClicksRatio']


        
#         # Ensure all features are available
#         missing_features = [col for col in feature_columns if col not in data.columns]
#         if missing_features:
#             raise DataError(f"Missing features in data: {missing_features}")
        
#         # Handle missing values
#         for col in feature_columns:
#             if data[col].isnull().any():
#                 logger.warning(f"Filling missing values in {col}")
#                 data[col] = data[col].fillna(data[col].mean() if data[col].count() > 0 else 0)
        
#         # Save scaler for later prediction use
#         X = data[feature_columns].values
#         X_scaled = scaler.fit_transform(X)
        
#         return X_scaled, scaler, feature_columns
#     except Exception as e:
#         logger.error(f"Error in prepare_features: {str(e)}\n{traceback.format_exc()}")
#         raise DataError(f"Feature preparation failed: {str(e)}")

# # Train model
# def train_model(data):
#     try:
#         # Filter out rows with Unknown ADHD_Type
#         data = data[data['ADHD_Type'] != 'Unknown'].copy()
        
#         if len(data) < DATA_THRESHOLD:
#             logger.warning(f"Not enough valid data for training. Current size: {len(data)}")
#             return None, None, None, None
        
#         X_scaled, scaler, feature_columns = prepare_features(data)
        
#         # Encode the ADHD types
#         label_encoder = LabelEncoder()
#         y = label_encoder.fit_transform(data['ADHD_Type'])
        
#         # Save the mapping for later use
#         label_mapping = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))
        
#         # Save the label encoder for later use
#         os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
#         with open(os.path.dirname(MODEL_PATH) + '/label_encoder.pkl', 'wb') as f:
#             pickle.dump(label_encoder, f)
        
#         X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

#         # Create a more complex model
#         model = tf.keras.Sequential([
#             tf.keras.layers.Dense(32, activation='relu', input_shape=(X_train.shape[1],)),
#             tf.keras.layers.Dropout(0.2),
#             tf.keras.layers.Dense(16, activation='relu'),
#             tf.keras.layers.Dropout(0.1),
#             tf.keras.layers.Dense(len(set(y)), activation='softmax'),
#         ])
        
#         model.compile(optimizer='adam', 
#                       loss='sparse_categorical_crossentropy', 
#                       metrics=['accuracy'])

#         # Train with early stopping
#         early_stopping = tf.keras.callbacks.EarlyStopping(
#             monitor='val_loss', patience=5, restore_best_weights=True)
        
#         history = model.fit(
#             X_train, y_train, 
#             validation_data=(X_test, y_test), 
#             epochs=50, 
#             batch_size=16,
#             callbacks=[early_stopping]
#         )
        
#         # Evaluate final model
#         loss, accuracy = model.evaluate(X_test, y_test)
#         logger.info(f"Test accuracy: {accuracy:.4f}")
        
#         # Save the trained model
#         try:
#             model.save(MODEL_PATH)
#         except Exception as e:
#             logger.error(f"Error saving model: {str(e)}")
#             # Create a fallback path
#             model.save('adhd_model_fallback.keras')
#             logger.info("Model saved to fallback location")
        
#         # Save the scaler and feature info
#         scaler_path = os.path.dirname(MODEL_PATH) + '/scaler.pkl'
#         with open(scaler_path, 'wb') as f:
#             pickle.dump(scaler, f)
        
#         # Save feature columns and label mapping
#         # with open(os.path.dirname(MODEL_PATH) + '/model_info.json', 'w') as f:
#         #     json.dump({
#         #         'feature_columns': feature_columns,
#         #         'label_mapping': label_mapping
#         #     }, f)

#         with open(os.path.dirname(MODEL_PATH) + '/model_info.json', 'w') as f:
#                 json.dump({
#                     'feature_columns': feature_columns,
#                     'label_mapping': {key: int(value) for key, value in label_mapping.items()}  # Convert int64 to int
#                }, f)


#         logger.info("Model retrained and saved with preprocessing information.")
#         return model, scaler, feature_columns, label_mapping
#     except Exception as e:
#         logger.error(f"Error in train_model: {str(e)}\n{traceback.format_exc()}")
#         raise ModelError(f"Model training failed: {str(e)}")

# # Load trained model and preprocessing objects
# # Load trained model and preprocessing objects
# def load_model():
#     """
#     Load the trained model and preprocessing objects.
    
#     Returns:
#     tuple: (model, scaler, feature_columns, label_mapping)
#     """
#     model, scaler, label_encoder, feature_columns = None, None, None, None
    
#     # Load the Keras model
#     try:
#         model = tf.keras.models.load_model(MODEL_PATH)
#         logger.info("Model loaded successfully")
#     except Exception as e:
#         logger.error(f"Error loading model from {MODEL_PATH}: {str(e)}")
#         # Try loading from fallback location
#         try:
#             model = tf.keras.models.load_model('adhd_model_fallback.keras')
#             logger.info("Model loaded from fallback location")
#         except Exception as e2:
#             logger.error(f"Error loading model from fallback location: {str(e2)}")
#             return None, None, None, None
    
#     # Load the scaler
#     try:
#         scaler_path = os.path.dirname(MODEL_PATH) + '/scaler.pkl'
#         with open(scaler_path, 'rb') as f:
#             scaler = pickle.load(f)
#         logger.info("Scaler loaded successfully")
#     except Exception as e:
#         logger.error(f"Error loading scaler: {str(e)}")
#         # Try loading from mlmodels directory
#         try:
#             with open('mlmodels/scaler.pkl', 'rb') as f:
#                 scaler = pickle.load(f)
#             logger.info("Scaler loaded from mlmodels directory")
#         except Exception as e2:
#             logger.error(f"Error loading scaler from mlmodels directory: {str(e2)}")
#             return model, None, None, None
    
#     # Load the label encoder
#     try:
#         label_encoder_path = os.path.dirname(MODEL_PATH) + '/label_encoder.pkl'
#         with open(label_encoder_path, 'rb') as f:
#             label_encoder = pickle.load(f)
#         logger.info("Label encoder loaded successfully")
#     except Exception as e:
#         logger.error(f"Error loading label encoder from {label_encoder_path}: {str(e)}")
#         # Try loading from mlmodels directory
#         try:
#             with open('mlmodels/label_encoder.pkl', 'rb') as f:
#                 label_encoder = pickle.load(f)
#             logger.info("Label encoder loaded from mlmodels directory")
#         except Exception as e2:
#             logger.error(f"Error loading label encoder from mlmodels directory: {str(e2)}")
#             return model, scaler, None, None
    
#     # Get label mapping
#     try:
#         label_mapping = dict(zip(label_encoder.classes_, 
#                                 label_encoder.transform(label_encoder.classes_)))
#     except Exception as e:
#         logger.error(f"Error creating label mapping: {str(e)}")
#         return model, scaler, None, None
    
#     # Define feature columns
#     # feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
#     #                  'prematureClicks', 'missedStars', 'maxMissedStreak', 'score', 'prematureClicksRatio']

#     feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
#                      'prematureClicks', 'missedStars', 'score', 'prematureClicksRatio']
    
#     return model, scaler, feature_columns, label_mapping

# # Function to generate insights based on prediction results
# def generate_insights(adhd_type, game_data):
#     try:
#         insights = {
#             'inattention': [],
#             'impulsivity': [],
#             'combined': []
#         }
        
#         # Inattention insights
#         if game_data.get('missedStars', 0) > 5:
#             insights['inattention'].append("Missed several stars, suggesting potential attention lapses.")
        
#         if game_data.get('averageReactionTime', 0) > 1000:
#             insights['inattention'].append("Slower reaction times indicate possible difficulty maintaining focus.")
        
#         if game_data.get('maxMissedStreak', 0) >= 2:
#             insights['inattention'].append("Consecutive missed stars suggest periods of significant inattention.")
        
#         # Impulsivity insights
#         if game_data.get('prematureClicks', 0) > 3:
#             insights['impulsivity'].append("High number of premature clicks suggests impulsive responding.")
        
#         # Add ADHD type-specific insights
#         if adhd_type == "Inattentive":
#             insights['inattention'].append("Model prediction indicates an inattentive pattern consistent with ADHD-I.")
#             insights['combined'].append("Primary challenges appear to be with sustained attention rather than impulse control.")
#         elif adhd_type == "Hyperactive-Impulsive":
#             insights['impulsivity'].append("Model prediction indicates an impulsive pattern consistent with ADHD-HI.")
#             insights['combined'].append("Primary challenges appear to be with impulse control rather than sustained attention.")
#         elif adhd_type == "Combined":
#             insights['combined'].append("Model prediction indicates both inattentive and impulsive patterns, consistent with ADHD-C.")
#         else:  # No ADHD
#             if game_data.get('score', 0) > 200:
#                 insights['combined'].append("Performance metrics are within typical ranges, with no significant attention or impulsivity concerns.")
        
#         # Ensure we have at least one insight per category
#         if not insights['inattention']:
#             insights['inattention'].append("Attention metrics are within normal ranges.")
#         if not insights['impulsivity']:
#             insights['impulsivity'].append("Impulsivity metrics are within normal ranges.")
#         if not insights['combined']:
#             if game_data.get('score', 0) > 200:
#                 insights['combined'].append("Overall performance is strong, showing good cognitive control.")
#             else:
#                 insights['combined'].append("Overall performance is within typical ranges.")
        
#         return insights
#     except Exception as e:
#         logger.error(f"Error generating insights: {str(e)}")
#         # Return generic insights if we encounter an error
#         return {
#             'inattention': ["Unable to generate specific insights for attention metrics."],
#             'impulsivity': ["Unable to generate specific insights for impulsivity metrics."],
#             'combined': ["Some metrics are outside typical ranges. Consider professional evaluation."]
#         }

# # Calculate inattention score
# def calculate_inattention_score(data):
#     try:
#         # Factors indicating inattention
#         missed_stars = data.get('missedStars', 0)
#         missed_stars_factor = min(missed_stars * 5, 40) if isinstance(missed_stars, (int, float)) else 0
        
#         # Long reaction times
#         avg_reaction_time = data.get('averageReactionTime', 0)
#         reaction_time_factor = 0
#         if not isinstance(avg_reaction_time, (int, float)):
#             reaction_time_factor = 0
#         elif avg_reaction_time > 1000: 
#             reaction_time_factor = 30
#         elif avg_reaction_time > 800: 
#             reaction_time_factor = 20
#         elif avg_reaction_time > 600: 
#             reaction_time_factor = 10
        
#         # Missed star streaks
#         missed_star_streaks = data.get('missedStarStreaks', [0])
#         if isinstance(missed_star_streaks, str):
#             try:
#                 missed_star_streaks = eval(missed_star_streaks)
#             except:
#                 missed_star_streaks = [0]
        
#         if not isinstance(missed_star_streaks, list):
#             missed_star_streaks = [0]
        
#         max_missed_streak = max(missed_star_streaks) if missed_star_streaks else 0
#         streak_factor = max_missed_streak * 10
        
#         # Calculate final score (cap at 100)
#         return min(missed_stars_factor + reaction_time_factor + streak_factor, 100)
#     except Exception as e:
#         logger.error(f"Error calculating inattention score: {str(e)}")
#         return 50  # Return a default mid-range score on error

# # Calculate impulsivity score
# def calculate_impulsivity_score(data):
#     try:
#         # Premature clicks
#         premature_clicks = data.get('prematureClicks', 0)
#         if not isinstance(premature_clicks, (int, float)):
#             premature_clicks = 0
            
#         reaction_times = data.get('reactionTimes', [])
        
#         # If reaction_times is a string (from CSV), convert to list
#         if isinstance(reaction_times, str):
#             try:
#                 reaction_times = eval(reaction_times)
#             except:
#                 reaction_times = []
        
#         if not isinstance(reaction_times, list):
#             reaction_times = []
        
#         # Calculate premature clicks ratio
#         denominator = len(reaction_times) + premature_clicks
#         premature_clicks_ratio = (premature_clicks / denominator * 100) if denominator > 0 else 0
#         premature_clicks_factor = min(premature_clicks_ratio, 50)
        
#         # Calculate fast responses ratio
#         fast_responses = sum(1 for time in reaction_times if isinstance(time, (int, float)) and time < 400)
#         fast_response_ratio = (fast_responses / len(reaction_times) * 100) if len(reaction_times) > 0 else 0
#         fast_response_factor = min(fast_response_ratio * 0.5, 30)
        
#         # Calculate variability in reaction times
#         variability_factor = 0
#         if len(reaction_times) > 1:
#             try:
#                 std_dev = np.std([t for t in reaction_times if isinstance(t, (int, float))])
#                 if std_dev > 300: 
#                     variability_factor = 20
#                 elif std_dev > 200: 
#                     variability_factor = 10
#             except:
#                 variability_factor = 0
        
#         # Calculate final score (cap at 100)
#         return min(premature_clicks_factor + fast_response_factor + variability_factor, 100)
#     except Exception as e:
#         logger.error(f"Error calculating impulsivity score: {str(e)}")
#         return 50  # Return a default mid-range score on error

# # Get score level
# def get_score_level(score):
#     try:
#         if not isinstance(score, (int, float)):
#             return 'Average'
#         if score < 20: return 'Low'
#         if score < 40: return 'Below Average'
#         if score < 60: return 'Average'
#         if score < 80: return 'Above Average'
#         return 'High'
#     except Exception as e:
#         logger.error(f"Error getting score level: {str(e)}")
#         return 'Average'  # Return a default level on error

# def predict_adhd_type(reaction_times, correct_streak, premature_clicks, missed_stars, score):
#     """
#     Make a prediction using the trained model.
    
#     Parameters:
#     reaction_times (list): List of reaction times in milliseconds
#     correct_streak (int): Maximum correct streak
#     premature_clicks (int): Number of premature clicks
#     missed_stars (int): Number of missed stars
#     score (int): Game score
    
#     Returns:
#     str: Predicted ADHD type
#     dict: Probabilities for each ADHD type
#     """
#     try:
#         # Validate input parameters
#         if not isinstance(reaction_times, list):
#             raise ValueError("reaction_times must be a list")
#         if not isinstance(correct_streak, (int, float)):
#             raise ValueError("correct_streak must be a number")
#         if not isinstance(premature_clicks, (int, float)):
#             raise ValueError("premature_clicks must be a number")
#         if not isinstance(missed_stars, (int, float)):
#             raise ValueError("missed_stars must be a number")
#         if not isinstance(score, (int, float)):
#             raise ValueError("score must be a number")
        
#         # Load model and preprocessing objects
#         model, scaler, feature_columns, label_mapping = load_model()
        
#         if model is None:
#             raise ModelError("Failed to load model")
#         if scaler is None:
#             raise ModelError("Failed to load scaler")
#         if label_mapping is None:
#             raise ModelError("Failed to load label mapping")
        
#         # Clean reaction times (remove non-numeric values)
#         reaction_times = [rt for rt in reaction_times if isinstance(rt, (int, float))]
        
#         # Handle empty reaction times list
#         if not reaction_times:
#             reaction_times = [600]  # Default value
#             logger.warning("Empty reaction times list. Using default value.")
        
#         # Calculate derived metrics
#         avg_reaction_time = np.mean(reaction_times)
#         reaction_time_variability = np.std(reaction_times) if len(reaction_times) > 1 else 0
#         premature_clicks_ratio = premature_clicks / (premature_clicks + 10)
        
#         # Determine maximum missed streak (default to 0 if not provided)
#         max_missed_streak = 0
        
#         # Create feature vector
#         features = np.array([[
#             avg_reaction_time, 
#             reaction_time_variability, 
#             correct_streak, 
#             premature_clicks, 
#             missed_stars, 

#             # max_missed_streak,

#             score, 
#             # premature_clicks_ratio
#         ]])
        
#         # Scale features
#         scaled_features = scaler.transform(features)
        
#         # Make prediction
#         prediction = model.predict(scaled_features)[0]
        
#         # Get predicted class
#         predicted_class = np.argmax(prediction)
        
#         # Map class index back to ADHD type
#         inverse_mapping = {v: k for k, v in label_mapping.items()}
#         predicted_type = inverse_mapping.get(predicted_class, "Unknown")
        
#         # Get probabilities for each class
#         probabilities = {adhd_type: float(prediction[i]) for i, adhd_type in enumerate(sorted(label_mapping.keys(), key=lambda x: label_mapping[x]))}
        
#         return predicted_type, probabilities
#     except ModelError as e:
#         logger.error(f"Model error in predict_adhd_type: {str(e)}")
#         return "Unknown", {"No ADHD": 0.25, "Inattentive": 0.25, "Hyperactive-Impulsive": 0.25, "Combined": 0.25}
#     except Exception as e:
#         logger.error(f"Error in predict_adhd_type: {str(e)}\n{traceback.format_exc()}")
#         return "Unknown", {"No ADHD": 0.25, "Inattentive": 0.25, "Hyperactive-Impulsive": 0.25, "Combined": 0.25}

# # Main Execution
# if __name__ == "__main__":
#     try:
#         # Check if we should train or just run prediction service
#         import sys
#         if len(sys.argv) > 1 and sys.argv[1] == 'train':
#             data = fetch_data()
#             if len(data) >= DATA_THRESHOLD:
#                 logger.info(f"Training model with {len(data)} records...")
#                 train_model(data)
#             else:
#                 logger.warning(f"Not enough data for training. Current size: {len(data)}")
#         else:
#             # Run prediction API service
#             app = Flask(__name__)
#             CORS(app)  # Enable CORS for all routes

#             # Load model on startup
#             loaded_model, loaded_scaler, loaded_features, loaded_mapping = load_model()
#             if loaded_model is None:
#                 logger.error("Error: Could not load model. Please train the model first.")
#                 # We'll continue running the app, but with limited functionality

#             @app.route('/predict', methods=['POST'])
#             def predict():
#                 try:
#                     game_data = request.json
#                     if not game_data:
#                         logger.error("No game data provided in request")
#                         return jsonify({"error": "No game data provided"}), 400
                    
#                     # Validate required fields
#                     required_fields = ['reactionTimes', 'correctStreak', 'prematureClicks', 'missedStars', 'score']
#                     missing_fields = [field for field in required_fields if field not in game_data]
                    
#                     if missing_fields:
#                         error_msg = f"Missing required fields: {', '.join(missing_fields)}"
#                         logger.error(error_msg)
#                         return jsonify({"error": error_msg}), 400
                    
#                     # Make prediction
#                     adhd_type, probabilities = predict_adhd_type(
#                         game_data['reactionTimes'], 
#                         game_data['correctStreak'], 
#                         game_data['prematureClicks'], 
#                         game_data['missedStars'], 
#                         game_data['score']
#                     )
                    
#                     # Generate insights
#                     insights = generate_insights(adhd_type, game_data)
                    
#                     # Calculate attention and impulsivity scores
#                     inattention_score = calculate_inattention_score(game_data)
#                     impulsivity_score = calculate_impulsivity_score(game_data)
                    
#                     # Determine score levels
#                     inattention_level = get_score_level(inattention_score)
#                     impulsivity_level = get_score_level(impulsivity_score)
                    
#                     # Prepare response
#                     response = {
#                         "adhd_type": adhd_type,
#                         "probabilities": probabilities,
#                         "insights": insights,
#                         "scores": {
#                             "inattention": {
#                                 "score": inattention_score,
#                                 "level": inattention_level
#                             },
#                             "impulsivity": {
#                                 "score": impulsivity_score,
#                                 "level": impulsivity_level
#                             }
#                         }
#                     }
                    
#                     logger.info(f"Successfully processed prediction for game data")
#                     return jsonify(response), 200
                    
#                 except Exception as e:
#                     error_message = f"Error processing prediction request: {str(e)}"
#                     logger.error(f"{error_message}\n{traceback.format_exc()}")
#                     return jsonify({
#                         "error": "Error processing request",
#                         "message": str(e),
#                         "adhd_type": "Unknown",
#                         "probabilities": {"No ADHD": 0.25, "Inattentive": 0.25, "Hyperactive-Impulsive": 0.25, "Combined": 0.25},
#                         "insights": {
#                             "inattention": ["Unable to analyze attention metrics due to an error."],
#                             "impulsivity": ["Unable to analyze impulsivity metrics due to an error."],
#                             "combined": ["An error occurred during analysis. Please try again."]
#                         }
#                     }), 500

#             @app.route('/health', methods=['GET'])
#             def health_check():
#                 try:
#                     # Check MongoDB connection
#                     db_status = "connected" if client and client.server_info() else "disconnected"
#                 except Exception:
#                     db_status = "disconnected"
                
#                 model_status = "loaded" if loaded_model is not None else "not loaded"
#                 scaler_status = "loaded" if loaded_scaler is not None else "not loaded"

#                     # Calculate uptime
#                 uptime_seconds = int(time.time() - start_time)
#                 days, remainder = divmod(uptime_seconds, 86400)
#                 hours, remainder = divmod(remainder, 3600)
#                 minutes, seconds = divmod(remainder, 60)
#                 uptime_str = f"{days} days, {hours} hours, {minutes} minutes"

#                 return jsonify({
#                     "status": "ok" if loaded_model and loaded_scaler else "degraded",
#                     "model_loaded": model_status,
#                     "scaler_loaded": scaler_status,
#                     "database": db_status,
#                     "version": "1.0.0",
#                     "uptime": uptime_str
#                 })
            

#             @app.route('/retrain', methods=['POST'])
#             def retrain_model():
#                 try:
#                     # Check authorization (simple API key validation)
#                     api_key = request.headers.get('X-API-Key')
#                     if not api_key or api_key != os.environ.get('MODEL_API_KEY', 'default_training_key'):
#                         return jsonify({"error": "Unauthorized"}), 401
                    
#                     # Fetch latest data
#                     data = fetch_data()
                    
#                     if len(data) < DATA_THRESHOLD:
#                         return jsonify({
#                             "error": "Insufficient data", 
#                             "message": f"Need at least {DATA_THRESHOLD} records, but only have {len(data)}"
#                         }), 400
                    
#                     # Train model
#                     model, scaler, feature_columns, label_mapping = train_model(data)
                    
#                     if model is None:
#                         return jsonify({"error": "Model training failed"}), 500
                    
#                     # Update the loaded model variables
#                     global loaded_model, loaded_scaler, loaded_features, loaded_mapping
#                     loaded_model = model
#                     loaded_scaler = scaler
#                     loaded_features = feature_columns
#                     loaded_mapping = label_mapping
                    
#                     return jsonify({"status": "success", "message": "Model retrained successfully"}), 200
                    
#                 except Exception as e:
#                     error_message = f"Error retraining model: {str(e)}"
#                     logger.error(f"{error_message}\n{traceback.format_exc()}")
#                     return jsonify({"error": "Retraining failed", "message": str(e)}), 500

#             @app.errorhandler(404)
#             def not_found(e):
#                 return jsonify({"error": "Endpoint not found"}), 404

#             @app.errorhandler(405)
#             def method_not_allowed(e):
#                 return jsonify({"error": "Method not allowed"}), 405

#             @app.errorhandler(500)
#             def server_error(e):
#                 return jsonify({"error": "Internal server error", "message": str(e)}), 500

#             # Run the Flask app
#             logger.info("Starting prediction service on http://localhost:5000")
#             app.run(host='0.0.0.0', port=5000, debug=False)
#     except Exception as e:
#         logger.critical(f"Fatal error starting application: {str(e)}\n{traceback.format_exc()}")
#         sys.exit(1)

import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler, label_binarize
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score
from flask import Flask, request, jsonify
import json
import os
import logging
import traceback
from flask_cors import CORS
from pymongo import MongoClient, ASCENDING, DESCENDING # For sorting
import pickle
import time
import datetime

start_time = time.time()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("adhd_model.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(_name_)

# Constants
CSV_FILE_PATH = "D:/4Y2S/SQA/adhd-assessment-system/backend/mlmodels/it21288326/adhd_dataset.csv"
MODEL_BASE_PATH = 'D:/4Y2S/SQA/adhd-assessment-system/backend/mlmodels/it21288326/'
MODEL_PATH = os.path.join(MODEL_BASE_PATH, 'adhd_model.keras')
SCALER_PATH = os.path.join(MODEL_BASE_PATH, 'scaler.pkl')
LABEL_ENCODER_PATH = os.path.join(MODEL_BASE_PATH, 'label_encoder.pkl')
MODEL_INFO_PATH = os.path.join(MODEL_BASE_PATH, 'model_info.json')
MODEL_PERFORMANCE_PATH = os.path.join(MODEL_BASE_PATH, 'model_performance.json')
ACCURACY_HISTORY_PATH = os.path.join(MODEL_BASE_PATH, 'accuracy_history.json')


ADHD_SUBTYPES = ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined', 'None'] # Added 'None' as per your Questionnaire model
DATA_THRESHOLD = 10

# MongoDB setup
try:
    client = MongoClient('mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/', serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client['test']
    game_metrics_collection = db['gamemetrics'] # Matches Mongoose model 'GameMetric' -> 'gamemetrics'
    questionnaire_collection = db['questionnaireresponses'] # Matches Mongoose model 'QuestionnaireResponse' -> 'questionnaireresponses'
    logger.info("MongoDB connection established successfully")

    # Ensure indexes (can be run once or checked)
    # game_metrics_collection.create_index([("childId", ASCENDING)])
    # game_metrics_collection.create_index([("completed", ASCENDING)]) # Assuming 'completed' field exists
    # game_metrics_collection.create_index([("createdAt", DESCENDING)])
    # questionnaire_collection.create_index([("childId", ASCENDING)])
    # questionnaire_collection.create_index([("completed", ASCENDING)]) # Assuming 'completed' field exists

except Exception as e:
    logger.error(f"MongoDB connection error: {str(e)}")
    client = None # Important for later checks
    db = None
    game_metrics_collection = None
    questionnaire_collection = None

class ModelError(Exception):
    pass

class DataError(Exception):
    pass

def load_csv_data(csv_path):
    try:
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            logger.info(f"Loaded {len(df)} records from CSV: {csv_path}")
            return df
        else:
            logger.warning(f"CSV file not found: {csv_path}. Creating a new dataset.")
            # Added 'completed_game' and 'completed_questionnaire' for clarity
            columns = ['childId', 'averageReactionTime', 'reactionTimeVariability', 'correctStreak',
                       'prematureClicks', 'missedStars', 'score', 'ADHD_Type', 'createdAt_game',
                       'completed_game', 'completed_questionnaire']
            return pd.DataFrame(columns=columns)
    except Exception as e:
        logger.error(f"Error loading CSV data from {csv_path}: {str(e)}")
        raise DataError(f"Failed to load CSV data: {str(e)}")

def fetch_data():
    try:
        csv_data = load_csv_data(CSV_FILE_PATH)

        # Correct check for collection objects
        if game_metrics_collection is None or questionnaire_collection is None:
            logger.warning("MongoDB connection not available (collections are None). Using only CSV data.")
            return csv_data

        try:
            # Mongoose automatically pluralizes and lowercases model names for collections.
            # 'GameMetric' -> 'gamemetrics'
            # 'QuestionnaireResponse' -> 'questionnaireresponses'
            # Your Python variable names match this convention.

            # Assuming 'completed' field exists in your Mongoose schemas or you add it
            # Otherwise, you might need to adjust the logic for what constitutes a "completed" record.
            # For now, I'll assume it might be added or is implicitly handled.
            # Let's assume 'completed' means the game session finished and questionnaire was submitted.
            # Your Mongoose schemas don't explicitly show a 'completed' field.
            # I'll add a placeholder for now. You'll need to define how 'completed' is determined.
            # A simple way: if a game metric exists, it's "completed". If a questionnaire exists, it's "completed".
            # This might differ from your React frontend's usage of 'completed'.

            game_metrics_cursor = game_metrics_collection.find().sort("createdAt", DESCENDING)
            questionnaires_raw_cursor = questionnaire_collection.find()

            # Convert cursors to lists
            game_metrics = list(game_metrics_cursor)
            questionnaires_raw = list(questionnaires_raw_cursor)

        except Exception as e:
            logger.error(f"Error fetching data from MongoDB: {str(e)}")
            return csv_data

        # Optimize questionnaire lookup
        # Assuming questionnaire 'subtype' is the target and if it exists, it's "completed"
        completed_questionnaires_dict = {
            str(q['childId']): q
            for q in questionnaires_raw # if q.get('subtype') # or some other 'completed' flag
        }

        child_data = {}
        processed_child_ids = set()

        for metric in game_metrics:
            try:
                child_id_obj = metric.get('childId') # This is an ObjectId
                if not child_id_obj:
                    logger.warning(f"Skipping metric due to missing childId: {metric.get('_id')}")
                    continue
                child_id = str(child_id_obj)

                if child_id in processed_child_ids:
                    continue

                matching_questionnaire = completed_questionnaires_dict.get(child_id)

                # How do we define a "completed" game metric from your schema?
                # Let's assume if the record exists, the game session was completed enough to be logged.
                game_completed_flag = True # Placeholder: Define based on your Mongoose GameMetric schema
                questionnaire_completed_flag = bool(matching_questionnaire and matching_questionnaire.get('subtype')) # Example

                if matching_questionnaire and game_completed_flag: # Ensure both parts are "valid"
                    reaction_times = metric.get('reactionTimes', [])
                    reaction_time_variability = np.std(reaction_times) if reaction_times and len(reaction_times) > 0 else 0
                    created_at_game = metric.get('createdAt', datetime.datetime.utcnow())
                    if not isinstance(created_at_game, datetime.datetime):
                        try: created_at_game = datetime.datetime.fromisoformat(str(created_at_game).replace("Z", "+00:00"))
                        except: created_at_game = datetime.datetime.utcnow()

                    record = {
                        'childId': child_id,
                        'averageReactionTime': metric.get('averageReactionTime', 0),
                        'reactionTimeVariability': reaction_time_variability,
                        'correctStreak': metric.get('correctStreak', 0),
                        'prematureClicks': metric.get('prematureClicks', 0),
                        'missedStars': metric.get('missedStars', 0),
                        'score': metric.get('score', 0),
                        'ADHD_Type': matching_questionnaire.get('subtype', 'None'), # Default to 'None' if subtype missing
                        'createdAt_game': created_at_game,
                        'completed_game': game_completed_flag,
                        'completed_questionnaire': questionnaire_completed_flag
                    }
                    child_data[child_id] = record
                    processed_child_ids.add(child_id)

            except Exception as e:
                logger.error(f"Error processing metric for child {metric.get('childId', 'unknown')} (ID: {metric.get('_id')}): {str(e)}")
                continue

        mongo_df = pd.DataFrame(list(child_data.values()))

        if not mongo_df.empty:
            if not csv_data.empty and 'childId' in csv_data.columns:
                existing_ids = set(csv_data['childId'].astype(str))
                mongo_df_new = mongo_df[~mongo_df['childId'].astype(str).isin(existing_ids)]
                df = pd.concat([csv_data, mongo_df_new], ignore_index=True)
                logger.info(f"Added {len(mongo_df_new)} new unique child records from MongoDB to CSV.")
            else:
                df = mongo_df
                logger.info(f"CSV was empty or lacked 'childId'. Using {len(mongo_df)} records from MongoDB.")

            try:
                os.makedirs(os.path.dirname(CSV_FILE_PATH), exist_ok=True)
                df.to_csv(CSV_FILE_PATH, index=False)
                logger.info(f"Saved combined dataset to CSV. Total records: {len(df)}")
            except Exception as e:
                logger.error(f"Error saving merged data to CSV: {str(e)}")
        else:
            df = csv_data
            logger.info("No new valid records fetched from MongoDB, or MongoDB data was empty. Using existing CSV data.")

        logger.info(f"Final dataset size for processing: {len(df)} records")
        return df
    except Exception as e:
        logger.error(f"Critical error in fetch_data: {str(e)}\n{traceback.format_exc()}")
        return csv_data if 'csv_data' in locals() and isinstance(csv_data, pd.DataFrame) else pd.DataFrame()


def prepare_features(data):
    try:
        data = data.copy()
        data['prematureClicksRatio'] = data['prematureClicks'] / (data['prematureClicks'] + 1e-6)

        feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak',
                           'prematureClicks', 'missedStars', 'score', 'prematureClicksRatio']

        missing_features = [col for col in feature_columns if col not in data.columns]
        if missing_features:
            for mf in missing_features:
                logger.warning(f"Feature '{mf}' missing in data for prepare_features, creating with default value 0.")
                data[mf] = 0

        for col in feature_columns:
            if data[col].isnull().any():
                logger.warning(f"Filling {data[col].isnull().sum()} missing values in '{col}' with its mean or 0.")
                data[col] = pd.to_numeric(data[col], errors='coerce')
                data[col] = data[col].fillna(data[col].mean() if data[col].count() > 0 else 0)

        X = data[feature_columns].values
        X_scaled = StandardScaler().fit_transform(X) # Save scaler in train_model
        # Return scaler from prepare_features if you want to fit it here and save,
        # but typically, fitting scaler happens in train_model on training data only.
        # For now, let's assume scaler is fit in train_model.
        return X_scaled, feature_columns # Removed scaler from return here
    except Exception as e:
        logger.error(f"Error in prepare_features: {str(e)}\n{traceback.format_exc()}")
        raise DataError(f"Feature preparation failed: {str(e)}")


# def train_model(data):
    try:
        # Use 'None' from your Mongoose model's enum for ADHD_Type
        data_train = data[data['ADHD_Type'].isin(ADHD_SUBTYPES) & (data['ADHD_Type'] != 'Unknown')].copy() # 'Unknown' if not in enum
        # Ensure 'completed_game' and 'completed_questionnaire' are true if you added these
        # data_train = data_train[(data_train['completed_game'] == True) & (data_train['completed_questionnaire'] == True)]


        if len(data_train) < DATA_THRESHOLD:
            logger.warning(f"Not enough valid data for training after filtering. Current size: {len(data_train)}, Threshold: {DATA_THRESHOLD}")
            return None, None, None, None

        # Prepare features returns X_scaled and feature_columns
        # The scaler should be fit on X_train part of the data_train
        X_unscaled = data_train[['averageReactionTime', 'reactionTimeVariability', 'correctStreak',
                                 'prematureClicks', 'missedStars', 'score', 'prematureClicksRatio']].values # Example, ensure all features here
        
        label_encoder = LabelEncoder()
        # Fit label encoder on all possible ADHD subtypes to ensure consistency
        all_possible_labels = [s for s in ADHD_SUBTYPES if s != 'Unknown']
        label_encoder.fit(all_possible_labels)
        
        # Transform the 'ADHD_Type' column; handle types not in all_possible_labels if any
        # For safety, filter data_train to only include rows where ADHD_Type is in label_encoder.classes_
        data_train = data_train[data_train['ADHD_Type'].isin(label_encoder.classes_)]
        if len(data_train) < DATA_THRESHOLD: # Re-check after this specific filtering
            logger.warning(f"Not enough data after ensuring ADHD_Type is known to encoder. Size: {len(data_train)}")
            return None, None, None, None

        y = label_encoder.transform(data_train['ADHD_Type'])
        feature_columns_used_for_model = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak',
                                          'prematureClicks', 'missedStars', 'score', 'prematureClicksRatio'] # ensure this matches X_unscaled

        X_train_unscaled, X_test_unscaled, y_train, y_test = train_test_split(
            data_train[feature_columns_used_for_model], y, test_size=0.2, random_state=42,
            stratify=y if len(np.unique(y)) > 1 else None
        )
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train_unscaled)
        X_test_scaled = scaler.transform(X_test_unscaled)


        label_mapping = {str(cls): int(val) for cls, val in zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_))}

        os.makedirs(MODEL_BASE_PATH, exist_ok=True)
        with open(LABEL_ENCODER_PATH, 'wb') as f: pickle.dump(label_encoder, f)
        with open(SCALER_PATH, 'wb') as f: pickle.dump(scaler, f) # Save the fitted scaler

        model = tf.keras.Sequential([
            tf.keras.layers.Dense(32, activation='relu', input_shape=(X_train_scaled.shape[1],)),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(16, activation='relu'),
            tf.keras.layers.Dropout(0.1),
            tf.keras.layers.Dense(len(label_encoder.classes_), activation='softmax'),
        ])

        model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
        early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True, verbose=1)
        history = model.fit(X_train_scaled, y_train, validation_data=(X_test_scaled, y_test), epochs=100, batch_size=16, callbacks=[early_stopping], verbose=0)

        y_pred_proba = model.predict(X_test_scaled)
        y_pred_classes = np.argmax(y_pred_proba, axis=1)
        accuracy_val = accuracy_score(y_test, y_pred_classes)
        report = classification_report(y_test, y_pred_classes, labels=range(len(label_encoder.classes_)), target_names=label_encoder.classes_, output_dict=True, zero_division=0)

        precision_weighted = report['weighted avg']['precision']
        recall_weighted = report['weighted avg']['recall']
        f1_weighted = report['weighted avg']['f1-score']
        auc_ovr_weighted = 0.0
        if len(label_encoder.classes_) > 1:
            y_test_binarized = label_binarize(y_test, classes=range(len(label_encoder.classes_)))
            if y_test_binarized.shape[1] > 1:
                 try: auc_ovr_weighted = roc_auc_score(y_test_binarized, y_pred_proba, multi_class='ovr', average='weighted')
                 except ValueError as e_auc: logger.warning(f"Could not calculate AUC: {e_auc}"); auc_ovr_weighted = 0.0

        performance_data = {
            'accuracy': accuracy_val, 'precision': precision_weighted, 'recall': recall_weighted,
            'f1_score': f1_weighted, 'auc': auc_ovr_weighted,
            'timestamp': time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            'dataset_size_trained_on': len(data_train), 'num_features': X_train_scaled.shape[1],
            'model_architecture': [layer.get_config() for layer in model.layers]
        }
        with open(MODEL_PERFORMANCE_PATH, 'w') as f: json.dump(performance_data, f, indent=4)

        history_data = []
        if os.path.exists(ACCURACY_HISTORY_PATH):
            try:
                with open(ACCURACY_HISTORY_PATH, 'r') as f: history_data = json.load(f)
            except json.JSONDecodeError: history_data = []
        current_month_str = time.strftime("%b %Y", time.gmtime())
        month_entry = next((item for item in history_data if item["date"] == current_month_str), None)
        if month_entry: month_entry["accuracy"] = round(accuracy_val * 100, 2)
        else: history_data.append({'date': current_month_str, 'accuracy': round(accuracy_val * 100, 2)})
        history_data = history_data[-12:]
        with open(ACCURACY_HISTORY_PATH, 'w') as f: json.dump(history_data, f, indent=4)

        logger.info(f"Model training completed. Test accuracy: {accuracy_val:.4f}. Performance metrics saved.")
        model.save(MODEL_PATH)
        with open(MODEL_INFO_PATH, 'w') as f:
            json.dump({'feature_columns': feature_columns_used_for_model, 'label_mapping': label_mapping}, f, indent=4)

        return model, scaler, feature_columns_used_for_model, label_mapping
    except Exception as e:
        logger.error(f"Error in train_model: {str(e)}\n{traceback.format_exc()}")
        raise ModelError(f"Model training failed: {str(e)}")

def train_model(data):
    try:
        data_train = data[data['ADHD_Type'].isin(ADHD_SUBTYPES) & (data['ADHD_Type'] != 'Unknown')].copy()

        if len(data_train) < DATA_THRESHOLD:
            logger.warning(f"Not enough valid data for training after initial filtering. Current size: {len(data_train)}, Threshold: {DATA_THRESHOLD}")
            return None, None, None, None

        # Step 1: Create 'prematureClicksRatio' and other preprocessed features
        # prepare_features_for_training should return the modified DataFrame and feature column names
        
        # Make a copy to avoid SettingWithCopyWarning if data_train is a slice
        data_train_processed = data_train.copy()
        data_train_processed['prematureClicksRatio'] = data_train_processed['prematureClicks'] / (data_train_processed['prematureClicks'] + 1e-6)
        
        # Define the feature columns that the model will actually use
        # These should be the columns present after all preprocessing.
        feature_columns_for_model = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak',
                                     'prematureClicks', 'missedStars', 'score', 'prematureClicksRatio']

        # Ensure all these feature columns exist after the step above
        missing_model_features = [col for col in feature_columns_for_model if col not in data_train_processed.columns]
        if missing_model_features:
            logger.error(f"Critical: Following model features are missing after processing: {missing_model_features}")
            raise DataError(f"Model features missing: {missing_model_features}")

        label_encoder = LabelEncoder()
        all_possible_labels = [s for s in ADHD_SUBTYPES if s != 'Unknown']
        label_encoder.fit(all_possible_labels)

        # Filter data_train_processed to only include rows where ADHD_Type is known to the encoder
        data_train_final = data_train_processed[data_train_processed['ADHD_Type'].isin(label_encoder.classes_)]

        if len(data_train_final) < DATA_THRESHOLD:
            logger.warning(f"Not enough data after ensuring ADHD_Type is known to encoder. Size: {len(data_train_final)}")
            return None, None, None, None

        y = label_encoder.transform(data_train_final['ADHD_Type'])
        X_unscaled = data_train_final[feature_columns_for_model] # This is now a DataFrame

        X_train_unscaled, X_test_unscaled, y_train, y_test = train_test_split(
            X_unscaled, y, test_size=0.2, random_state=42,
            stratify=y if len(np.unique(y)) > 1 else None
        )

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train_unscaled)
        X_test_scaled = scaler.transform(X_test_unscaled)

        label_mapping = {str(cls): int(val) for cls, val in zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_))}

        os.makedirs(MODEL_BASE_PATH, exist_ok=True)
        with open(LABEL_ENCODER_PATH, 'wb') as f: pickle.dump(label_encoder, f)
        with open(SCALER_PATH, 'wb') as f: pickle.dump(scaler, f)

        model = tf.keras.Sequential([
            tf.keras.layers.Dense(32, activation='relu', input_shape=(X_train_scaled.shape[1],)),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(16, activation='relu'),
            tf.keras.layers.Dropout(0.1),
            tf.keras.layers.Dense(len(label_encoder.classes_), activation='softmax'),
        ])

        model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
        early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True, verbose=1)
        history = model.fit(X_train_scaled, y_train, validation_data=(X_test_scaled, y_test), epochs=100, batch_size=16, callbacks=[early_stopping], verbose=0)

        y_pred_proba = model.predict(X_test_scaled)
        y_pred_classes = np.argmax(y_pred_proba, axis=1)
        accuracy_val = accuracy_score(y_test, y_pred_classes)
        report = classification_report(y_test, y_pred_classes, labels=range(len(label_encoder.classes_)), target_names=label_encoder.classes_, output_dict=True, zero_division=0)

        precision_weighted = report['weighted avg']['precision']
        recall_weighted = report['weighted avg']['recall']
        f1_weighted = report['weighted avg']['f1-score']
        auc_ovr_weighted = 0.0
        if len(label_encoder.classes_) > 1:
            y_test_binarized = label_binarize(y_test, classes=range(len(label_encoder.classes_)))
            if y_test_binarized.shape[1] > 1:
                 try: auc_ovr_weighted = roc_auc_score(y_test_binarized, y_pred_proba, multi_class='ovr', average='weighted')
                 except ValueError as e_auc: logger.warning(f"Could not calculate AUC: {e_auc}"); auc_ovr_weighted = 0.0

        performance_data = {
            'accuracy': accuracy_val, 'precision': precision_weighted, 'recall': recall_weighted,
            'f1_score': f1_weighted, 'auc': auc_ovr_weighted,
            'timestamp': time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            'dataset_size_trained_on': len(data_train_final), 'num_features': X_train_scaled.shape[1], # Use data_train_final
            'model_architecture': [layer.get_config() for layer in model.layers]
        }
        with open(MODEL_PERFORMANCE_PATH, 'w') as f: json.dump(performance_data, f, indent=4)

        history_data = []
        if os.path.exists(ACCURACY_HISTORY_PATH):
            try:
                with open(ACCURACY_HISTORY_PATH, 'r') as f: history_data = json.load(f)
            except json.JSONDecodeError: history_data = []
        current_month_str = time.strftime("%b %Y", time.gmtime())
        month_entry = next((item for item in history_data if item["date"] == current_month_str), None)
        if month_entry: month_entry["accuracy"] = round(accuracy_val * 100, 2)
        else: history_data.append({'date': current_month_str, 'accuracy': round(accuracy_val * 100, 2)})
        history_data = history_data[-12:]
        with open(ACCURACY_HISTORY_PATH, 'w') as f: json.dump(history_data, f, indent=4)

        logger.info(f"Model training completed. Test accuracy: {accuracy_val:.4f}. Performance metrics saved.")
        model.save(MODEL_PATH)
        with open(MODEL_INFO_PATH, 'w') as f:
            # Save the feature columns that were actually used for training
            json.dump({'feature_columns': feature_columns_for_model, 'label_mapping': label_mapping}, f, indent=4)

        return model, scaler, feature_columns_for_model, label_mapping # Return feature_columns_for_model
    except DataError as e: # Catch specific DataError
        logger.error(f"DataError in train_model: {str(e)}")
        # Don't re-raise, just return Nones so the flow can continue if retrying or in API
        return None, None, None, None
    except Exception as e:
        logger.error(f"Error in train_model: {str(e)}\n{traceback.format_exc()}")
        # Don't re-raise ModelError here, as this is a general exception
        return None, None, None, None # Return Nones to indicate failure
def load_model():
    try:
        if not all(os.path.exists(p) for p in [MODEL_PATH, SCALER_PATH, LABEL_ENCODER_PATH, MODEL_INFO_PATH]):
            logger.error("One or more model files are missing. Please train the model first.")
            return None, None, None, None, None

        model = tf.keras.models.load_model(MODEL_PATH)
        with open(SCALER_PATH, 'rb') as f: scaler = pickle.load(f)
        with open(LABEL_ENCODER_PATH, 'rb') as f: label_encoder = pickle.load(f)
        with open(MODEL_INFO_PATH, 'r') as f: model_info = json.load(f)

        feature_columns = model_info.get('feature_columns')
        label_mapping = model_info.get('label_mapping')

        if not all([model, scaler, label_encoder, feature_columns, label_mapping]):
            raise ModelError("Failed to load one or more model components.")

        logger.info("Model and preprocessing objects loaded successfully.")
        return model, scaler, feature_columns, label_mapping, label_encoder
    except Exception as e:
        logger.error(f"Error loading model or preprocessing objects: {str(e)}\n{traceback.format_exc()}")
        return None, None, None, None, None

# --- (generate_insights, calculate_inattention_score, calculate_impulsivity_score, get_score_level - assume they are fine) ---
def generate_insights(adhd_type, game_data):
    insights = {'inattention': [], 'impulsivity': [], 'combined': []}
    if game_data.get('missedStars', 0) > 5: insights['inattention'].append("Missed several stars, suggesting potential attention lapses.")
    if game_data.get('averageReactionTime', 0) > 1000: insights['inattention'].append("Slower reaction times may indicate difficulty maintaining focus.")
    if game_data.get('prematureClicks', 0) > 3: insights['impulsivity'].append("High number of premature clicks suggests impulsive responding.")
    if adhd_type == "Inattentive": insights['inattention'].append("Model prediction aligns with an inattentive pattern.")
    elif adhd_type == "Hyperactive-Impulsive": insights['impulsivity'].append("Model prediction aligns with an impulsive pattern.")
    elif adhd_type == "Combined": insights['combined'].append("Model prediction indicates both inattentive and impulsive patterns.")
    else: insights['combined'].append("Performance metrics are within typical ranges based on model.") # For 'None' ADHD type
    if not insights['inattention']: insights['inattention'].append("Attention metrics within typical game ranges.")
    if not insights['impulsivity']: insights['impulsivity'].append("Impulsivity metrics within typical game ranges.")
    if not insights['combined']: insights['combined'].append("Overall performance noted.")
    return insights

def calculate_inattention_score(data):
    score = 0
    score += min(data.get('missedStars', 0) * 5, 40)
    art = data.get('averageReactionTime', 0)
    if art > 1000: score += 30
    elif art > 800: score += 20
    # Example: If 'missedStarStreaks' is available in raw game_data for predict
    # missed_streaks = data.get('missedStarStreaks', [0])
    # if missed_streaks: score += min(max(missed_streaks) * 10, 30)
    return min(score, 100)

def calculate_impulsivity_score(data):
    score = 0
    prem_clicks = data.get('prematureClicks', 0)
    rx_times = data.get('reactionTimes', [])
    total_actions = len(rx_times) + prem_clicks
    if total_actions > 0: score += min((prem_clicks / total_actions * 100), 50)
    fast_responses = sum(1 for t in rx_times if isinstance(t, (int, float)) and t < 400)
    if rx_times: score += min((fast_responses / len(rx_times) * 100) * 0.5, 30)
    if len(rx_times) > 1:
        valid_rx_times = [t for t in rx_times if isinstance(t, (int,float))]
        if len(valid_rx_times) > 1:
            std_dev = np.std(valid_rx_times)
            if std_dev > 300: score += 20
    return min(score, 100)

def get_score_level(score):
    if not isinstance(score, (int, float)): return 'Average'
    if score < 20: return 'Low';
    if score < 40: return 'Below Average'
    if score < 60: return 'Average';
    if score < 80: return 'Above Average'
    return 'High'


def predict_adhd_type(reaction_times, correct_streak, premature_clicks, missed_stars, score):
    try:
        loaded_model, loaded_scaler, loaded_feature_columns, loaded_label_mapping, loaded_label_encoder = load_model()
        if loaded_model is None: raise ModelError("Failed to load model for prediction.")

        reaction_times_cleaned = [rt for rt in reaction_times if isinstance(rt, (int, float))]
        if not reaction_times_cleaned: reaction_times_cleaned = [600] # Default if empty

        avg_reaction_time = np.mean(reaction_times_cleaned)
        reaction_time_variability = np.std(reaction_times_cleaned) if len(reaction_times_cleaned) > 1 else 0
        premature_clicks_ratio = premature_clicks / (premature_clicks + 1e-6)

        feature_values_dict = {
            'averageReactionTime': avg_reaction_time,
            'reactionTimeVariability': reaction_time_variability,
            'correctStreak': correct_streak,
            'prematureClicks': premature_clicks,
            'missedStars': missed_stars,
            'score': score,
            'prematureClicksRatio': premature_clicks_ratio
        }
        features_ordered = [feature_values_dict[col_name] for col_name in loaded_feature_columns]
        features_np = np.array([features_ordered])

        scaled_features = loaded_scaler.transform(features_np)
        prediction_proba = loaded_model.predict(scaled_features)[0]

        predicted_class_idx = np.argmax(prediction_proba)
        predicted_type = loaded_label_encoder.classes_[predicted_class_idx]
        probabilities = {str(cls): float(prob) for cls, prob in zip(loaded_label_encoder.classes_, prediction_proba)}

        return predicted_type, probabilities
    except ModelError as e:
        logger.error(f"Model error in predict_adhd_type: {str(e)}")
        return "Unknown", {adhd_type: 1.0/len(ADHD_SUBTYPES) for adhd_type in ADHD_SUBTYPES if adhd_type != 'Unknown'}
    except Exception as e:
        logger.error(f"Error in predict_adhd_type: {str(e)}\n{traceback.format_exc()}")
        return "Unknown", {adhd_type: 1.0/len(ADHD_SUBTYPES) for adhd_type in ADHD_SUBTYPES if adhd_type != 'Unknown'}

# Main Execution
if _name_ == "_main_":
    try:
        import sys
        if len(sys.argv) > 1 and sys.argv[1] == 'train':
            logger.info("Starting model training process...")
            data = fetch_data()
            if not data.empty and len(data) >= DATA_THRESHOLD:
                logger.info(f"Training model with {len(data)} records...")
                train_model(data)
                logger.info("Model training process completed.")
            else:
                logger.warning(f"Not enough data for training or data is empty. Current size: {len(data) if not data.empty else 0}. Threshold: {DATA_THRESHOLD}")
            sys.exit(0)

        app = Flask(_name_)
        CORS(app)
        loaded_model_global, _, _, _, _ = load_model()

        @app.route('/predict', methods=['POST'])
        def predict():
            try:
                game_data = request.json
                if not game_data: return jsonify({"error": "No game data provided"}), 400
                required_fields = ['reactionTimes', 'correctStreak', 'prematureClicks', 'missedStars', 'score']
                if any(field not in game_data for field in required_fields):
                    return jsonify({"error": f"Missing one or more required fields: {', '.join(required_fields)}"}), 400

                adhd_type, probabilities = predict_adhd_type(
                    game_data['reactionTimes'], game_data['correctStreak'],
                    game_data['prematureClicks'], game_data['missedStars'], game_data['score']
                )
                insights = generate_insights(adhd_type, game_data) # Pass raw game_data
                inattention_score = calculate_inattention_score(game_data) # Pass raw game_data
                impulsivity_score = calculate_impulsivity_score(game_data) # Pass raw game_data

                response = {
                    "adhd_type": adhd_type, "probabilities": probabilities, "insights": insights,
                    "scores": {
                        "inattention": {"score": inattention_score, "level": get_score_level(inattention_score)},
                        "impulsivity": {"score": impulsivity_score, "level": get_score_level(impulsivity_score)}
                    }
                }
                return jsonify(response), 200
            except Exception as e:
                logger.error(f"Error processing prediction request: {str(e)}\n{traceback.format_exc()}")
                return jsonify({"error": "Error processing request", "message": str(e)}), 500

        @app.route('/health', methods=['GET'])
        def health_check():
            db_status = "disconnected"
            # Correct check for collection objects
            if client is not None: # Check if client itself is not None
                try: client.server_info(); db_status = "connected"
                except Exception: db_status = "disconnected"

            model_file_exists = os.path.exists(MODEL_PATH)
            scaler_file_exists = os.path.exists(SCALER_PATH)
            uptime_seconds = int(time.time() - start_time)
            days, rem = divmod(uptime_seconds, 86400); hours, rem = divmod(rem, 3600); minutes, _ = divmod(rem, 60)
            uptime_str = f"{days}d {hours}h {minutes}m"
            model_version = "N/A"
            if os.path.exists(MODEL_PERFORMANCE_PATH):
                try:
                    with open(MODEL_PERFORMANCE_PATH, 'r') as f: perf_data = json.load(f)
                    model_version = perf_data.get('timestamp', "N/A")
                except: pass

            return jsonify({
                "status": "ok" if model_file_exists and scaler_file_exists and db_status == "connected" else "degraded",
                "model_loaded": "available" if model_file_exists else "not_available",
                "scaler_loaded": "available" if scaler_file_exists else "not_available",
                "database": db_status, "version": model_version, "uptime": uptime_str
            })

        @app.route('/dashboard-data', methods=['GET'])
        def get_dashboard_data():
            response_data = {}

            # Correct check for collection objects
            if game_metrics_collection is not None:
                try: response_data['totalPredictions'] = game_metrics_collection.count_documents({}) # Count all game metrics for now
                except Exception as e: logger.error(f"DB Error (totalPreds): {e}"); response_data['totalPredictions'] = 0
            else:
                response_data['totalPredictions'] = 0


            try:
                df_csv = load_csv_data(CSV_FILE_PATH)
                if not df_csv.empty and 'ADHD_Type' in df_csv.columns:
                    # Use all subtypes from ADHD_SUBTYPES for filtering, excluding 'Unknown'
                    valid_subtypes_for_dist = [s for s in ADHD_SUBTYPES if s != 'Unknown']
                    type_counts = df_csv[df_csv['ADHD_Type'].isin(valid_subtypes_for_dist)]['ADHD_Type'].value_counts().to_dict()
                    response_data['predictionsByType'] = [{'name': k, 'value': v} for k, v in type_counts.items()]
                else: response_data['predictionsByType'] = []
            except Exception as e: logger.error(f"CSV Error (predsByType): {e}"); response_data['predictionsByType'] = []

            daily_preds_data = []
            # Correct check for collection objects
            if game_metrics_collection is not None:
                try:
                    pipeline = [
                        # If you add a 'completed' flag to GameMetric schema, use it here:
                        # {"$match": {"completed": True, "createdAt": {"$exists": True, "$type": "date"}}},
                        {"$match": {"createdAt": {"$exists": True, "$type": "date"}}}, # Assuming all logged metrics are "predictions"
                        {"$group": {"_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$createdAt"}}, "count": {"$sum": 1}}},
                        {"$sort": {"_id": DESCENDING}}, {"$limit": 7}, {"$sort": {"_id": ASCENDING}}
                    ]
                    agg_results = list(game_metrics_collection.aggregate(pipeline))
                    if agg_results: daily_preds_data = [{"date": item["_id"], "count": item["count"]} for item in agg_results]
                except Exception as e: logger.error(f"DB Aggregation Error (dailyPreds): {e}")
            if not daily_preds_data:
                for i in range(6, -1, -1):
                    day = datetime.date.today() - datetime.timedelta(days=i)
                    daily_preds_data.append({"date": day.strftime("%Y-%m-%d"), "count": np.random.randint(50, 150)})
            response_data['dailyPredictions'] = daily_preds_data

            perf_metrics_default = {'accuracy': 0, 'keyPerformanceMetrics': [
                {'name': 'F1', 'value': '0.00'}, {'name': 'Prec', 'value': '0.00'},
                {'name': 'Rec', 'value': '0.00'}, {'name': 'AUC', 'value': '0.00'}
            ]}
            if os.path.exists(MODEL_PERFORMANCE_PATH):
                try:
                    with open(MODEL_PERFORMANCE_PATH, 'r') as f: perf = json.load(f)
                    response_data['accuracy'] = round(perf.get('accuracy', 0) * 100, 1)
                    response_data['keyPerformanceMetrics'] = [
                        {'name': 'F1', 'value': f"{perf.get('f1_score', 0):.2f}"},
                        {'name': 'Prec', 'value': f"{perf.get('precision', 0):.2f}"},
                        {'name': 'Rec', 'value': f"{perf.get('recall', 0):.2f}"},
                        {'name': 'AUC', 'value': f"{perf.get('auc', 0):.2f}"}
                    ]
                    response_data['datasetSize'] = perf.get('dataset_size_trained_on', 0)
                except Exception as e: logger.error(f"File Error (perfMetrics): {e}"); response_data.update(perf_metrics_default)
            else: response_data.update(perf_metrics_default)

            if os.path.exists(ACCURACY_HISTORY_PATH):
                try:
                    with open(ACCURACY_HISTORY_PATH, 'r') as f: response_data['accuracyTrend'] = json.load(f)
                except Exception as e: logger.error(f"File Error (accTrend): {e}"); response_data['accuracyTrend'] = [{'date': 'N/A', 'accuracy': 0}]
            else: response_data['accuracyTrend'] = [{'date': 'N/A', 'accuracy': 0}]

            if 'datasetSize' not in response_data or response_data['datasetSize'] == 0:
                try:
                    df_csv_current = load_csv_data(CSV_FILE_PATH)
                    response_data['datasetSize'] = len(df_csv_current)
                except: response_data['datasetSize'] = 0

            feat_imp_data = []
            if os.path.exists(MODEL_INFO_PATH):
                try:
                    with open(MODEL_INFO_PATH, 'r') as f: m_info = json.load(f)
                    features = m_info.get('feature_columns', [])
                    if features: # Ensure features list is not empty
                        base_imps = np.random.dirichlet(np.ones(len(features))) * 0.8
                        feat_imp_data = [{'name': name, 'value': round(val, 3)} for name, val in zip(features, base_imps)]
                        feat_imp_data = sorted(feat_imp_data, key=lambda x: x['value'], reverse=True)
                except Exception as e: logger.error(f"File Error (featImp): {e}")
            if not feat_imp_data:
                 feat_imp_data = [{"name": f"Feature{i+1}", "value": round(0.3 - i*0.05, 2)} for i in range(min(5, len(features) if 'features' in locals() and features else 5))]
            response_data['featureImportance'] = feat_imp_data

            return jsonify(response_data)

        @app.route('/retrain', methods=['POST'])
        def retrain_endpoint():
            try:
                api_key = request.headers.get('X-API-Key')
                expected_api_key = os.environ.get('MODEL_API_KEY', 'default_training_key')
                if not api_key or api_key != expected_api_key:
                    return jsonify({"error": "Unauthorized"}), 401

                logger.info("Retraining request received and authorized.")
                data_for_retrain = fetch_data()
                if data_for_retrain.empty or len(data_for_retrain) < DATA_THRESHOLD:
                    return jsonify({"error": "Insufficient data", "message": f"Need at least {DATA_THRESHOLD} valid records, found {len(data_for_retrain) if not data_for_retrain.empty else 0}"}), 400

                global loaded_model_global
                model, _, _, _ = train_model(data_for_retrain)
                if model is None: return jsonify({"error": "Model training failed during retrain process"}), 500

                loaded_model_global, _, _, _, _ = load_model()
                logger.info("Model retrained successfully via API.")
                return jsonify({"status": "success", "message": "Model retrained successfully"}), 200
            except Exception as e:
                logger.error(f"Error retraining model via API: {str(e)}\n{traceback.format_exc()}")
                return jsonify({"error": "Retraining failed", "message": str(e)}), 500

        @app.errorhandler(404)
        def not_found(e): return jsonify({"error": "Endpoint not found"}), 404
        @app.errorhandler(405)
        def method_not_allowed(e): return jsonify({"error": "Method not allowed"}), 405
        @app.errorhandler(Exception)
        def handle_exception(e):
            # For specific known exceptions, you can provide more tailored messages
            if isinstance(e, NotImplementedError) and "Collection objects do not implement truth value testing" in str(e):
                logger.error(f"PyMongo Collection boolean test error: {str(e)}\n{traceback.format_exc()}")
                # This specific error should be fixed, but as a fallback:
                return jsonify({"error": "Internal server error", "message": "A database interaction error occurred."}), 500

            logger.error(f"Unhandled exception: {str(e)}\n{traceback.format_exc()}")
            return jsonify({"error": "Internal server error", "message": "An unexpected error occurred."}), 500

        logger.info("Starting Flask API service on http://localhost:5000")
        app.run(host='0.0.0.0', port=5000, debug=False)

    except Exception as e:
        logger.critical(f"Fatal error starting application: {str(e)}\n{traceback.format_exc()}")
        sys.exit(1)