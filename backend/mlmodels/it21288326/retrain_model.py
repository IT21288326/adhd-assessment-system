# # # from pymongo import MongoClient
# # # import pandas as pd
# # # import tensorflow as tf
# # # from sklearn.model_selection import train_test_split
# # # from sklearn.preprocessing import LabelEncoder
# # # import os

# # # # MongoDB setup
# # # client = MongoClient('mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/')
# # # db = client['test']
# # # game_metrics_collection = db['gamemetrics']
# # # questionnaire_collection = db['questionnaireresponses']

# # # # Minimum data required for training
# # # DATA_THRESHOLD = 40  # Set this based on your needs

# # # # Fetch and merge data
# # # def fetch_data():
# # #     game_metrics = list(game_metrics_collection.find())
# # #     questionnaires = list(questionnaire_collection.find())

# # #     dataset = []
# # #     for metric in game_metrics:
# # #         matching_questionnaire = next(
# # #             (q for q in questionnaires if str(q['childId']) == str(metric['childId'])), None
# # #         )
# # #         if matching_questionnaire:
# # #             dataset.append({
# # #                 'averageReactionTime': metric['averageReactionTime'],
# # #                 'correctStreak': metric['correctStreak'],
# # #                 'prematureClicks': metric['prematureClicks'],
# # #                 'missedStars': metric['missedStars'],
# # #                 'score': metric['score'],
# # #                 'ADHD_Type': matching_questionnaire['subtype'],  # Label
# # #             })

# # #     return pd.DataFrame(dataset)

# # # # Train model
# # # def train_model(data):
# # #     X = data[['averageReactionTime', 'correctStreak', 'prematureClicks', 'missedStars', 'score']].values
# # #     y = LabelEncoder().fit_transform(data['ADHD_Type'])

# # #     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # #     model = tf.keras.Sequential([
# # #         tf.keras.layers.Dense(16, activation='relu', input_shape=(X_train.shape[1],)),
# # #         tf.keras.layers.Dense(8, activation='relu'),
# # #         tf.keras.layers.Dense(len(set(y)), activation='softmax'),
# # #     ])
# # #     model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# # #     model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=20, batch_size=16)
    
# # #     # Save the trained model
# # #     #model.save('./adhd_model')
# # #     model.save('E:/New folder (2)/adhd-assessment-system/backend/mlmodels/it21288326/adhd_model.keras')

# # #     print("Model retrained and saved.")

# # # # Main Execution
# # # if __name__ == "__main__":
# # #     data = fetch_data()
# # #     if len(data) >= DATA_THRESHOLD:
# # #         print(f"Training model with {len(data)} records...")
# # #         train_model(data)
# # #     else:
# # #         print(f"Not enough data for training. Current size: {len(data)}")


# # from pymongo import MongoClient
# # import pandas as pd
# # import numpy as np
# # import tensorflow as tf
# # from sklearn.model_selection import train_test_split
# # from sklearn.preprocessing import LabelEncoder, StandardScaler
# # from flask import Flask, request, jsonify
# # import json
# # import os
# # from flask_cors import CORS

# # # MongoDB setup
# # client = MongoClient('mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/')
# # db = client['test']
# # game_metrics_collection = db['gamemetrics']
# # questionnaire_collection = db['questionnaireresponses']


# # CSV_FILE_PATH = "./adhd_data.csv"

# # # # Constants
# # # MODEL_PATH = 'E:/New folder (2)/adhd-assessment-system/backend/mlmodels/it21288326/adhd_model.keras'
# # # ADHD_SUBTYPES = ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined']

# # # Fetch and merge data
# # def fetch_data():
# #     df = load_csv_data(CSV_FILE_PATH)

# #     if df.empty:
# #         print("Dataset is empty. Waiting for data collection...")
# #         return df
    






# #     game_metrics = list(game_metrics_collection.find())
# #     questionnaires = list(questionnaire_collection.find())

# #     dataset = []
# #     for metric in game_metrics:
# #         matching_questionnaire = next(
# #             (q for q in questionnaires if str(q['childId']) == str(metric['childId'])), None
# #         )
# #         if matching_questionnaire:
# #             # Calculate reaction time variability if we have reaction times
# #             reaction_time_variability = 0
# #             if 'reactionTimes' in metric and len(metric['reactionTimes']) > 0:
# #                 reaction_time_variability = np.std(metric['reactionTimes'])
            
# #             # Calculate missed star streaks if available
# #             missed_star_streaks = [0]
# #             if 'missedStarStreaks' in metric:
# #                 missed_star_streaks = metric['missedStarStreaks']
            
# #             dataset.append({
# #                 'averageReactionTime': metric.get('averageReactionTime', 0),
# #                 'reactionTimeVariability': reaction_time_variability,
# #                 'correctStreak': metric.get('correctStreak', 0),
# #                 'prematureClicks': metric.get('prematureClicks', 0),
# #                 'missedStars': metric.get('missedStars', 0),
# #                 'maxMissedStreak': max(missed_star_streaks),
# #                 'score': metric.get('score', 0),
# #                 'ADHD_Type': matching_questionnaire.get('subtype', 'Unknown'),  # Label
# #             })

# #     return pd.DataFrame(dataset)

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
# #     if not os.path.exists(MODEL_PATH):
# #         print("Model not found. Please train the model first.")
# #         return None, None, None, None
    
# #     model = tf.keras.models.load_model(MODEL_PATH)
    
# #     scaler_path = os.path.dirname(MODEL_PATH) + '/scaler.pkl'
# #     if os.path.exists(scaler_path):
# #         scaler = pd.read_pickle(scaler_path)
# #     else:
# #         print("Scaler not found. Using default preprocessing.")
# #         scaler = StandardScaler()
    
# #     info_path = os.path.dirname(MODEL_PATH) + '/model_info.json'
# #     if os.path.exists(info_path):
# #         with open(info_path, 'r') as f:
# #             model_info = json.load(f)
# #         feature_columns = model_info.get('feature_columns', [])
# #         label_mapping = model_info.get('label_mapping', {})
# #     else:
# #         feature_columns = []
# #         label_mapping = {}
    
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

# # # Predict ADHD type and generate GameAnalytics from game metrics
# # def predict_from_game_data(game_data, model, scaler, feature_columns, label_mapping):
# #     # Extract and prepare features from game data
# #     features = {}
# #     for feature in feature_columns:
# #         if feature == 'reactionTimeVariability' and 'reactionTimes' in game_data:
# #             # Calculate variability from reaction times
# #             features[feature] = np.std(game_data['reactionTimes']) if len(game_data['reactionTimes']) > 0 else 0
# #         elif feature == 'maxMissedStreak' and 'missedStarStreaks' in game_data:
# #             features[feature] = max(game_data['missedStarStreaks']) if len(game_data['missedStarStreaks']) > 0 else 0
# #         elif feature == 'prematureClicksRatio':
# #             # Calculate ratio
# #             denominator = game_data.get('prematureClicks', 0) + (len(game_data.get('reactionTimes', [])) or 1)
# #             features[feature] = game_data.get('prematureClicks', 0) / denominator
# #         else:
# #             features[feature] = game_data.get(feature, 0)
    
# #     # Convert to DataFrame for consistent preprocessing
# #     features_df = pd.DataFrame([features])
    
# #     # Fill missing values
# #     for col in feature_columns:
# #         if col not in features_df.columns:
# #             features_df[col] = 0
    
# #     # Ensure correct column order
# #     features_df = features_df[feature_columns]
    
# #     # Scale features
# #     X_scaled = scaler.transform(features_df.values)
    
# #     # Make prediction
# #     prediction_probs = model.predict(X_scaled)[0]
# #     prediction_class = np.argmax(prediction_probs)
    
# #     # Find ADHD type from the prediction
# #     adhd_type = None
# #     for type_name, type_index in label_mapping.items():
# #         if type_index == prediction_class:
# #             adhd_type = type_name
    
# #     if not adhd_type and len(ADHD_SUBTYPES) > prediction_class:
# #         adhd_type = ADHD_SUBTYPES[prediction_class]
    
# #     # Calculate inattention and impulsivity scores
# #     inattention_score = calculate_inattention_score(game_data)
# #     impulsivity_score = calculate_impulsivity_score(game_data)
# #     combined_score = (inattention_score + impulsivity_score) / 2
    
# #     # Generate insights
# #     insights = generate_insights(adhd_type, game_data)
    
# #     # Prepare result in the format expected by the frontend
# #     result = {
# #         'adhd_type': adhd_type,
# #         'confidence': float(prediction_probs[prediction_class]),
# #         'inattention': {
# #             'score': inattention_score,
# #             'level': get_score_level(inattention_score),
# #             'insights': insights['inattention']
# #         },
# #         'impulsivity': {
# #             'score': impulsivity_score,
# #             'level': get_score_level(impulsivity_score),
# #             'insights': insights['impulsivity']
# #         },
# #         'combined': {
# #             'score': combined_score,
# #             'level': get_score_level(combined_score),
# #             'insights': insights['combined']
# #         }
# #     }
    
# #     return result

# # # Calculate inattention score - similar to the frontend logic
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
# #     max_missed_streak = max(missed_star_streaks) if missed_star_streaks else 0
# #     streak_factor = max_missed_streak * 10
    
# #     # Calculate final score (cap at 100)
# #     return min(missed_stars_factor + reaction_time_factor + streak_factor, 100)

# # # Calculate impulsivity score - similar to the frontend logic
# # def calculate_impulsivity_score(data):
# #     # Premature clicks
# #     premature_clicks = data.get('prematureClicks', 0)
# #     reaction_times = data.get('reactionTimes', [])
    
# #     denominator = len(reaction_times) + premature_clicks
# #     premature_clicks_ratio = (premature_clicks / denominator * 100) if denominator > 0 else 0
# #     premature_clicks_factor = min(premature_clicks_ratio, 50)
    
# #     # Fast responses
# #     fast_responses = sum(1 for time in reaction_times if time < 400)
# #     fast_response_ratio = (fast_responses / len(reaction_times) * 100) if len(reaction_times) > 0 else 0
# #     fast_response_factor = min(fast_response_ratio * 0.5, 30)
    
# #     # Variability in reaction times
# #     variability_factor = 0
# #     if 'reactionTimes' in data and len(data['reactionTimes']) > 0:
# #         std_dev = np.std(data['reactionTimes'])
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
                
# #                 result = predict_from_game_data(
# #                     game_data, loaded_model, loaded_scaler, loaded_features, loaded_mapping
# #                 )
# #                 return jsonify(result)
# #             except Exception as e:
# #                 return jsonify({"error": str(e)}), 500

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
# from flask_cors import CORS
# from pymongo import MongoClient
# import pickle


# # Constants
# CSV_FILE_PATH = "D:\ research\ adhd-assessment-system\ backend\mlmodels\it21288326\ adhd_dataset .csv"  # Initial data source
# MODEL_PATH = '/ adhd_model.keras'
# # model_path = "models/adhd_model.keras"
# # model = tf.keras.models.load_model(model_path)

# ADHD_SUBTYPES = ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined']
# DATA_THRESHOLD = 40  # Minimum records needed for training

# # MongoDB setup
# client = MongoClient('mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/')
# db = client['test']
# game_metrics_collection = db['gamemetrics']
# questionnaire_collection = db['questionnaireresponses']

# # Load initial data from CSV
# def load_csv_data(csv_path):
#     """Loads data from CSV if it exists, else returns an empty DataFrame."""
#     if os.path.exists(csv_path):
#         df = pd.read_csv(csv_path)
#         print(f"Loaded {len(df)} records from CSV.")
#         return df
#     else:
#         print("CSV file not found. Creating a new dataset.")
#         # Create empty DataFrame with necessary columns
#         columns = ['childId', 'averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
#                   'prematureClicks', 'missedStars', 'maxMissedStreak', 'score', 'ADHD_Type']
#         return pd.DataFrame(columns=columns)

# # Fetch data from MongoDB and merge with CSV data
# def fetch_data():
#     """Fetches data from both CSV and MongoDB."""
#     # First, load data from CSV
#     csv_data = load_csv_data(CSV_FILE_PATH)
    
#     # Then, fetch latest data from MongoDB
#     game_metrics = list(game_metrics_collection.find())
#     questionnaires = list(questionnaire_collection.find())
    
#     # Process MongoDB data
#     child_data = {}
#     for metric in game_metrics:
#         child_id = str(metric['childId'])
#         # Ensure the child has completed both quiz and game
#         matching_questionnaire = next(
#             (q for q in questionnaires if str(q['childId']) == child_id and q.get('completed', False)), 
#             None
#         )
#         if matching_questionnaire and metric.get('completed', False):
#             # If the child is already in child_data, skip (we only take the first entry)
#             if child_id in child_data:
#                 continue
#             reaction_time_variability = np.std(metric['reactionTimes']) if 'reactionTimes' in metric else 0
#             missed_star_streaks = metric.get('missedStarStreaks', [0])
#             record = {
#                 'childId': child_id,
#                 'averageReactionTime': metric.get('averageReactionTime', 0),
#                 'reactionTimeVariability': reaction_time_variability,
#                 'correctStreak': metric.get('correctStreak', 0),
#                 'prematureClicks': metric.get('prematureClicks', 0),
#                 'missedStars': metric.get('missedStars', 0),
#                 'maxMissedStreak': max(missed_star_streaks),
#                 'score': metric.get('score', 0),
#                 'ADHD_Type': matching_questionnaire.get('subtype', 'Unknown'),  # Label
#             }
#             # Store only the first completed record for each child
#             child_data[child_id] = record
            
#     # Convert MongoDB data to DataFrame
#     mongo_df = pd.DataFrame(list(child_data.values()))
    
#     # Merge data, prioritizing MongoDB data for duplicates
#     if not mongo_df.empty:
#         # Identify children present in both datasets
#         if not csv_data.empty and 'childId' in csv_data.columns:
#             existing_ids = set(csv_data['childId'].astype(str))
#             mongo_df = mongo_df[~mongo_df['childId'].astype(str).isin(existing_ids)]
        
#         # Combine the datasets
#         df = pd.concat([csv_data, mongo_df], ignore_index=True)
        
#         # Save the merged dataset back to CSV for future use
#         df.to_csv(CSV_FILE_PATH, index=False)
#         print(f"Updated CSV with {len(mongo_df)} new records from MongoDB.")
#     else:
#         df = csv_data
    
#     print(f"Total dataset size: {len(df)} records")
#     return df

# # Feature engineering
# def prepare_features(data):
#     # Create additional derived features that match the frontend analytics
#     data['prematureClicksRatio'] = data['prematureClicks'] / (data['prematureClicks'] + 10)  # Avoid division by zero
    
#     # Normalize features for better model performance
#     scaler = StandardScaler()
#     feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
#                        'prematureClicks', 'missedStars', 'maxMissedStreak', 'score', 'prematureClicksRatio']
    
#     # Save scaler for later prediction use
#     X = data[feature_columns].values
#     X_scaled = scaler.fit_transform(X)
    
#     return X_scaled, scaler, feature_columns

# # Train model
# def train_model(data):
#     # Filter out rows with Unknown ADHD_Type
#     data = data[data['ADHD_Type'] != 'Unknown'].copy()
    
#     if len(data) < DATA_THRESHOLD:
#         print(f"Not enough valid data for training. Current size: {len(data)}")
#         return None, None, None, None
    
#     X_scaled, scaler, feature_columns = prepare_features(data)
    
#     # Encode the ADHD types
#     label_encoder = LabelEncoder()
#     y = label_encoder.fit_transform(data['ADHD_Type'])
    
#     # Save the mapping for later use
#     label_mapping = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))
    
#     X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

#     # Create a more complex model
#     model = tf.keras.Sequential([
#         tf.keras.layers.Dense(32, activation='relu', input_shape=(X_train.shape[1],)),
#         tf.keras.layers.Dropout(0.2),
#         tf.keras.layers.Dense(16, activation='relu'),
#         tf.keras.layers.Dropout(0.1),
#         tf.keras.layers.Dense(len(set(y)), activation='softmax'),
#     ])
    
#     model.compile(optimizer='adam', 
#                   loss='sparse_categorical_crossentropy', 
#                   metrics=['accuracy'])

#     # Train with early stopping
#     early_stopping = tf.keras.callbacks.EarlyStopping(
#         monitor='val_loss', patience=5, restore_best_weights=True)
    
#     history = model.fit(
#         X_train, y_train, 
#         validation_data=(X_test, y_test), 
#         epochs=50, 
#         batch_size=16,
#         callbacks=[early_stopping]
#     )
    
#     # Evaluate final model
#     loss, accuracy = model.evaluate(X_test, y_test)
#     print(f"Test accuracy: {accuracy:.4f}")
    
#     # Create directory if it doesn't exist
#     os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    
#     # Save the trained model
#     model.save(MODEL_PATH)
    
#     # Save the scaler and feature info
#     scaler_path = os.path.dirname(MODEL_PATH) + '/scaler.pkl'
#     pd.to_pickle(scaler, scaler_path)
    
#     # Save feature columns and label mapping
#     with open(os.path.dirname(MODEL_PATH) + '/model_info.json', 'w') as f:
#         json.dump({
#             'feature_columns': feature_columns,
#             'label_mapping': label_mapping
#         }, f)

#     print("Model retrained and saved with preprocessing information.")
#     return model, scaler, feature_columns, label_mapping

# # Load trained model and preprocessing objects
# def load_model():
#     """
#     Load the trained model and preprocessing objects.
    
#     Returns:
#     tuple: (model, scaler, feature_columns, label_mapping)
#     """
#     # Load the Keras model
#     try:
#         model = tf.keras.models.load_model(MODEL_PATH)
#     except Exception as e:
#         print(f"Error loading model: {e}")
#         return None, None, None, None
    
#     # Load the scaler
#     try:
#         with open('mlmodels/scaler.pkl', 'rb') as f:
#             scaler = pickle.load(f)
#     except Exception as e:
#         print(f"Error loading scaler: {e}")
#         return model, None, None, None
    
#     # Load the label encoder
#     try:
#         with open('mlmodels/label_encoder.pkl', 'rb') as f:
#             label_encoder = pickle.load(f)
#         label_mapping = dict(zip(label_encoder.classes_, 
#                                 label_encoder.transform(label_encoder.classes_)))
        
#     except Exception as e:
#         print(f"Error loading label encoder: {e}")
#         return model, scaler, None, None
    
#     # Define feature columns
#     feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
#                      'prematureClicks', 'missedStars', 'score', 'prematureClicksRatio']
    
#     return model, scaler, feature_columns, label_mapping

# # Function to generate insights based on prediction results
# def generate_insights(adhd_type, game_data):
#     insights = {
#         'inattention': [],
#         'impulsivity': [],
#         'combined': []
#     }
    
#     # Inattention insights
#     if game_data.get('missedStars', 0) > 5:
#         insights['inattention'].append("Missed several stars, suggesting potential attention lapses.")
    
#     if game_data.get('averageReactionTime', 0) > 1000:
#         insights['inattention'].append("Slower reaction times indicate possible difficulty maintaining focus.")
    
#     if game_data.get('maxMissedStreak', 0) >= 2:
#         insights['inattention'].append("Consecutive missed stars suggest periods of significant inattention.")
    
#     # Impulsivity insights
#     if game_data.get('prematureClicks', 0) > 3:
#         insights['impulsivity'].append("High number of premature clicks suggests impulsive responding.")
    
#     # Add ADHD type-specific insights
#     if adhd_type == "Inattentive":
#         insights['inattention'].append("Model prediction indicates an inattentive pattern consistent with ADHD-I.")
#         insights['combined'].append("Primary challenges appear to be with sustained attention rather than impulse control.")
#     elif adhd_type == "Hyperactive-Impulsive":
#         insights['impulsivity'].append("Model prediction indicates an impulsive pattern consistent with ADHD-HI.")
#         insights['combined'].append("Primary challenges appear to be with impulse control rather than sustained attention.")
#     elif adhd_type == "Combined":
#         insights['combined'].append("Model prediction indicates both inattentive and impulsive patterns, consistent with ADHD-C.")
#     else:  # No ADHD
#         if game_data.get('score', 0) > 200:
#             insights['combined'].append("Performance metrics are within typical ranges, with no significant attention or impulsivity concerns.")
    
#     # Ensure we have at least one insight per category
#     if not insights['inattention']:
#         insights['inattention'].append("Attention metrics are within normal ranges.")
#     if not insights['impulsivity']:
#         insights['impulsivity'].append("Impulsivity metrics are within normal ranges.")
#     if not insights['combined']:
#         if game_data.get('score', 0) > 200:
#             insights['combined'].append("Overall performance is strong, showing good cognitive control.")
#         else:
#             insights['combined'].append("Overall performance is within typical ranges.")
    
#     return insights

# # Calculate inattention score
# def calculate_inattention_score(data):
#     # Factors indicating inattention
#     missed_stars_factor = min(data.get('missedStars', 0) * 5, 40)
    
#     # Long reaction times
#     avg_reaction_time = data.get('averageReactionTime', 0)
#     reaction_time_factor = 0
#     if avg_reaction_time > 1000: reaction_time_factor = 30
#     elif avg_reaction_time > 800: reaction_time_factor = 20
#     elif avg_reaction_time > 600: reaction_time_factor = 10
    
#     # Missed star streaks
#     missed_star_streaks = data.get('missedStarStreaks', [0])
#     if isinstance(missed_star_streaks, str):
#         try:
#             missed_star_streaks = eval(missed_star_streaks)
#         except:
#             missed_star_streaks = [0]
    
#     max_missed_streak = max(missed_star_streaks) if missed_star_streaks else 0
#     streak_factor = max_missed_streak * 10
    
#     # Calculate final score (cap at 100)
#     return min(missed_stars_factor + reaction_time_factor + streak_factor, 100)

# # Calculate impulsivity score
# def calculate_impulsivity_score(data):
#     # Premature clicks
#     premature_clicks = data.get('prematureClicks', 0)
#     reaction_times = data.get('reactionTimes', [])
    
#     # If reaction_times is a string (from CSV), convert to list
#     if isinstance(reaction_times, str):
#         try:
#             reaction_times = eval(reaction_times)
#         except:
#             reaction_times = []
    
#     denominator = len(reaction_times) + premature_clicks
#     premature_clicks_ratio = (premature_clicks / denominator * 100) if denominator > 0 else 0
#     premature_clicks_factor = min(premature_clicks_ratio, 50)
    
#     # Fast responses
#     fast_responses = sum(1 for time in reaction_times if time < 400)
#     fast_response_ratio = (fast_responses / len(reaction_times) * 100) if len(reaction_times) > 0 else 0
#     fast_response_factor = min(fast_response_ratio * 0.5, 30)
    
#     # Variability in reaction times
#     variability_factor = 0
#     if len(reaction_times) > 0:
#         std_dev = np.std(reaction_times)
#         if std_dev > 300: variability_factor = 20
#         elif std_dev > 200: variability_factor = 10
    
#     # Calculate final score (cap at 100)
#     return min(premature_clicks_factor + fast_response_factor + variability_factor, 100)

# # Get score level
# def get_score_level(score):
#     if score < 20: return 'Low'
#     if score < 40: return 'Below Average'
#     if score < 60: return 'Average'
#     if score < 80: return 'Above Average'
#     return 'High'

# # Predict ADHD type and generate GameAnalytics from game metrics
# # def predict_from_game_data(game_data, model, scaler, feature_columns, label_mapping):
# #     # Extract and prepare features from game data
# #     features = {}
# #     for feature in feature_columns:
# #         if feature == 'reactionTimeVariability' and 'reactionTimes' in game_data:
# #             # Calculate variability from reaction times
# #             reaction_times = game_data['reactionTimes']
# #             if isinstance(reaction_times, str):
# #                 try:
# #                     reaction_times = eval(reaction_times)
# #                 except:
# #                     reaction_times = []
# #             features[feature] = np.std(reaction_times) if len(reaction_times) > 0 else 0
# #         elif feature == 'maxMissedStreak' and 'missedStarStreaks' in game_data:
# #             missed_streaks = game_data['missedStarStreaks']
# #             if isinstance(missed_streaks, str):
# #                 try:
# #                     missed_streaks = eval(missed_streaks)
# #                 except:
# #                     missed_streaks = [0]
# #             features[feature] = max(missed_streaks) if len(missed_streaks) > 0 else 0
# #         elif feature == 'prematureClicksRatio':
# #             # Calculate ratio
# #             denominator = game_data.get('prematureClicks', 0) + 10
# #             features[feature] = game_data.get('prematureClicks', 0) / denominator
# #         else:
# #             features[feature] = game_data.get(feature, 0)
    
# #     # Convert to DataFrame for consistent preprocessing
# #     features_df = pd.DataFrame([features])
    
# #     # Fill missing values
# #     for col in feature_columns:
# #         if col not in features_df.columns:
# #             features_df[col] = 0
    
# #     # Ensure correct column order
# #     features_df = features_df[feature_columns]
    
# #     # Scale features
# #     X_scaled = scaler.transform(features_df.values)
    
# #     # Make prediction
# #     prediction_probs = model.predict(X_scaled)[0]
# #     prediction_class = np.argmax(prediction_probs)
    
# #     # Find ADHD type from the prediction
# #     adhd_type = None
# #     for type_name, type_index in label_mapping.items():
# #         if type_index == prediction_class:
# #             adhd_type = type_name
    
# #     if not adhd_type and len(ADHD_SUBTYPES) > prediction_class:
# #         adhd_type = ADHD_SUBTYPES[prediction_class]
    
# #     # Calculate inattention and impulsivity scores
# #     inattention_score = calculate_inattention_score(game_data)
# #     impulsivity_score = calculate_impulsivity_score(game_data)
# #     combined_score = (inattention_score + impulsivity_score) / 2
    
# #     # Generate insights
# #     insights = generate_insights(adhd_type, game_data)
    
# #     # Prepare result in the format expected by the frontend
# #     result = {
# #         'adhd_type': adhd_type,
# #         'confidence': float(prediction_probs[prediction_class]),
# #         'inattention': {
# #             'score': inattention_score,
# #             'level': get_score_level(inattention_score),
# #             'insights': insights['inattention']
# #         },
# #         'impulsivity': {
# #             'score': impulsivity_score,
# #             'level': get_score_level(impulsivity_score),
# #             'insights': insights['impulsivity']
# #         },
# #         'combined': {
# #             'score': combined_score,
# #             'level': get_score_level(combined_score),
# #             'insights': insights['combined']
# #         }
# #     }
    
# #     return result
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
#     # Load model and preprocessing objects
#     model, scaler, feature_columns, label_mapping = load_model()
    
#     if model is None or scaler is None or label_mapping is None:
#         print("Error: Could not load model or preprocessing objects")
#         return None, None
    
#     # Calculate derived metrics
#     avg_reaction_time = np.mean(reaction_times)
#     reaction_time_variability = np.std(reaction_times)
#     premature_clicks_ratio = premature_clicks / (premature_clicks + 10)
    
#     # Create feature vector
#     features = np.array([[
#         avg_reaction_time, 
#         reaction_time_variability, 
#         correct_streak, 
#         premature_clicks, 
#         missed_stars, 
#         score, 
#         premature_clicks_ratio
#     ]])
    
#     # Scale features
#     scaled_features = scaler.transform(features)
    
#     # Make prediction
#     prediction = model.predict(scaled_features)[0]
    
#     # Get predicted class
#     predicted_class = np.argmax(prediction)
    
#     # Map class index back to ADHD type
#     inverse_mapping = {v: k for k, v in label_mapping.items()}
#     predicted_type = inverse_mapping[predicted_class]
    
#     # Get probabilities for each class
#     probabilities = {adhd_type: float(prediction[i]) for i, adhd_type in enumerate(sorted(label_mapping.keys(), key=lambda x: label_mapping[x]))}
    
#     return predicted_type, probabilities

# # Main Execution
# if __name__ == "__main__":
#     # Check if we should train or just run prediction service
#     import sys
#     if len(sys.argv) > 1 and sys.argv[1] == 'train':
#         data = fetch_data()
#         if len(data) >= DATA_THRESHOLD:
#             print(f"Training model with {len(data)} records...")
#             train_model(data)
#         else:
#             print(f"Not enough data for training. Current size: {len(data)}")
#     else:
#         # Run prediction API service
#         app = Flask(__name__)
#         CORS(app)  # Enable CORS for all routes

#         # Load model on startup
#         loaded_model, loaded_scaler, loaded_features, loaded_mapping = load_model()
#         if loaded_model is None:
#             print("Error: Could not load model. Please train the model first.")
#             exit(1)

#         @app.route('/predict', methods=['POST'])
#         def predict():
#             try:
#                 game_data = request.json
#                 if not game_data:
#                     return jsonify({"error": "No game data provided"}), 400
                
#                 result = predict_adhd_type(
                    
#     game_data['reactionTimes'], game_data['correctStreak'], 
#     game_data['prematureClicks'], game_data['missedStars'], game_data['score']
#                 )
#                 return jsonify(result)
#             except Exception as e:
#                 return jsonify({"error": str(e)}), 500
        
#         # @app.route('/add-data', methods=['POST'])
#         # def add_data():
#         #     try:
#         #         new_data = request.json
#         #         if not new_data:
#         #             return jsonify({"error": "No data provided"}), 400
                
#         #         total_records = append_new_data(new_data)
#         #         return jsonify({
#         #             "status": "success",
#         #             "message": "Data added successfully",
#         #             "total_records": total_records
#         #         })
#         #     except Exception as e:
#         #         return jsonify({"error": str(e)}), 500

#         @app.route('/health', methods=['GET'])
#         def health_check():
#             return jsonify({"status": "ok", "model_loaded": loaded_model is not None})

#         # Run the Flask app
#         print("Starting prediction service on http://localhost:5000")
#         app.run(host='0.0.0.0', port=5000, debug=False)

import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from flask import Flask, request, jsonify
import json
import os
import logging
import traceback
from flask_cors import CORS
from pymongo import MongoClient
import pickle
# Add this to your health_check function
import time
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
logger = logging.getLogger(__name__)

# Constants
CSV_FILE_PATH = "D:\ research\ adhd-assessment-system\ backend\mlmodels\it21288326\ adhd_dataset .csv"  # Initial data source
MODEL_PATH = 'D:/research/adhd-assessment-system/backend/mlmodels/it21288326/venv/adhd_model.keras'
ADHD_SUBTYPES = ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined']
DATA_THRESHOLD = 40  # Minimum records needed for training

# MongoDB setup
try:
    client = MongoClient('mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/', serverSelectionTimeoutMS=5000)
    # Test the connection
    client.server_info()
    db = client['test']
    game_metrics_collection = db['gamemetrics']
    questionnaire_collection = db['questionnaireresponses']
    logger.info("MongoDB connection established successfully")
except Exception as e:
    logger.error(f"MongoDB connection error: {str(e)}")
    # Create a fallback mechanism
    client = None
    db = None
    game_metrics_collection = None
    questionnaire_collection = None

class ModelError(Exception):
    """Custom exception for model-related errors"""
    pass

class DataError(Exception):
    """Custom exception for data-related errors"""
    pass

# Load initial data from CSV
def load_csv_data(csv_path):
    """Loads data from CSV if it exists, else returns an empty DataFrame."""
    try:
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            logger.info(f"Loaded {len(df)} records from CSV.")
            return df
        else:
            logger.warning("CSV file not found. Creating a new dataset.")
            # Create empty DataFrame with necessary columns
            columns = ['childId', 'averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
                      'prematureClicks', 'missedStars', 'maxMissedStreak', 'score', 'ADHD_Type']
            return pd.DataFrame(columns=columns)
    except Exception as e:
        logger.error(f"Error loading CSV data: {str(e)}")
        raise DataError(f"Failed to load CSV data: {str(e)}")

# Fetch data from MongoDB and merge with CSV data
def fetch_data():
    """Fetches data from both CSV and MongoDB."""
    try:
        # First, load data from CSV
        csv_data = load_csv_data(CSV_FILE_PATH)
        
        # Then, fetch latest data from MongoDB
        if game_metrics_collection is None or questionnaire_collection is None:
            logger.warning("MongoDB connection not available. Using only CSV data.")
            return csv_data
        
        try:
            game_metrics = list(game_metrics_collection.find())
            questionnaires = list(questionnaire_collection.find())
        except Exception as e:
            logger.error(f"Error fetching data from MongoDB: {str(e)}")
            return csv_data
        
        # Process MongoDB data
        child_data = {}
        for metric in game_metrics:
            try:
                child_id = str(metric['childId'])
                # Ensure the child has completed both quiz and game
                matching_questionnaire = next(
                    (q for q in questionnaires if str(q['childId']) == child_id and q.get('completed', False)), 
                    None
                )
                if matching_questionnaire and metric.get('completed', False):
                    # If the child is already in child_data, skip (we only take the first entry)
                    if child_id in child_data:
                        continue
                    
                    # Safely get reaction times and calculate variability
                    reaction_times = metric.get('reactionTimes', [])
                    reaction_time_variability = np.std(reaction_times) if reaction_times and len(reaction_times) > 0 else 0
                    
                    # Safely get missed star streaks
                    missed_star_streaks = metric.get('missedStarStreaks', [0])
                    if not missed_star_streaks:
                        missed_star_streaks = [0]
                    
                    record = {
                        'childId': child_id,
                        'averageReactionTime': metric.get('averageReactionTime', 0),
                        'reactionTimeVariability': reaction_time_variability,
                        'correctStreak': metric.get('correctStreak', 0),
                        'prematureClicks': metric.get('prematureClicks', 0),
                        'missedStars': metric.get('missedStars', 0),
                        'maxMissedStreak': max(missed_star_streaks),
                        'score': metric.get('score', 0),
                        'ADHD_Type': matching_questionnaire.get('subtype', 'Unknown'),  # Label
                    }
                    # Store only the first completed record for each child
                    child_data[child_id] = record
            except Exception as e:
                logger.error(f"Error processing metric for child {metric.get('childId', 'unknown')}: {str(e)}")
                continue
                
        # Convert MongoDB data to DataFrame
        mongo_df = pd.DataFrame(list(child_data.values()))
        
        # Merge data, prioritizing MongoDB data for duplicates
        if not mongo_df.empty:
            # Identify children present in both datasets
            if not csv_data.empty and 'childId' in csv_data.columns:
                existing_ids = set(csv_data['childId'].astype(str))
                mongo_df = mongo_df[~mongo_df['childId'].astype(str).isin(existing_ids)]
            
            # Combine the datasets
            df = pd.concat([csv_data, mongo_df], ignore_index=True)
            
            # Save the merged dataset back to CSV for future use
            try:
                os.makedirs(os.path.dirname(CSV_FILE_PATH), exist_ok=True)
                df.to_csv(CSV_FILE_PATH, index=False)
                logger.info(f"Updated CSV with {len(mongo_df)} new records from MongoDB.")
            except Exception as e:
                logger.error(f"Error saving merged data to CSV: {str(e)}")
        else:
            df = csv_data
        
        logger.info(f"Total dataset size: {len(df)} records")
        return df
    except Exception as e:
        logger.error(f"Error in fetch_data: {str(e)}\n{traceback.format_exc()}")
        # Return whatever data we have or an empty DataFrame
        return csv_data if 'csv_data' in locals() else pd.DataFrame()

# Feature engineering
def prepare_features(data):
    try:
        # Create additional derived features that match the frontend analytics
        data['prematureClicksRatio'] = data['prematureClicks'] / (data['prematureClicks'] + 10)  # Avoid division by zero
        
        # Normalize features for better model performance
        scaler = StandardScaler()
        feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
                           'prematureClicks', 'missedStars', 'maxMissedStreak', 'score', 'prematureClicksRatio']
        
        # Ensure all features are available
        missing_features = [col for col in feature_columns if col not in data.columns]
        if missing_features:
            raise DataError(f"Missing features in data: {missing_features}")
        
        # Handle missing values
        for col in feature_columns:
            if data[col].isnull().any():
                logger.warning(f"Filling missing values in {col}")
                data[col] = data[col].fillna(data[col].mean() if data[col].count() > 0 else 0)
        
        # Save scaler for later prediction use
        X = data[feature_columns].values
        X_scaled = scaler.fit_transform(X)
        
        return X_scaled, scaler, feature_columns
    except Exception as e:
        logger.error(f"Error in prepare_features: {str(e)}\n{traceback.format_exc()}")
        raise DataError(f"Feature preparation failed: {str(e)}")

# Train model
def train_model(data):
    try:
        # Filter out rows with Unknown ADHD_Type
        data = data[data['ADHD_Type'] != 'Unknown'].copy()
        
        if len(data) < DATA_THRESHOLD:
            logger.warning(f"Not enough valid data for training. Current size: {len(data)}")
            return None, None, None, None
        
        X_scaled, scaler, feature_columns = prepare_features(data)
        
        # Encode the ADHD types
        label_encoder = LabelEncoder()
        y = label_encoder.fit_transform(data['ADHD_Type'])
        
        # Save the mapping for later use
        label_mapping = dict(zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_)))
        
        # Save the label encoder for later use
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        with open(os.path.dirname(MODEL_PATH) + '/label_encoder.pkl', 'wb') as f:
            pickle.dump(label_encoder, f)
        
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

        # Create a more complex model
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(32, activation='relu', input_shape=(X_train.shape[1],)),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(16, activation='relu'),
            tf.keras.layers.Dropout(0.1),
            tf.keras.layers.Dense(len(set(y)), activation='softmax'),
        ])
        
        model.compile(optimizer='adam', 
                      loss='sparse_categorical_crossentropy', 
                      metrics=['accuracy'])

        # Train with early stopping
        early_stopping = tf.keras.callbacks.EarlyStopping(
            monitor='val_loss', patience=5, restore_best_weights=True)
        
        history = model.fit(
            X_train, y_train, 
            validation_data=(X_test, y_test), 
            epochs=50, 
            batch_size=16,
            callbacks=[early_stopping]
        )
        
        # Evaluate final model
        loss, accuracy = model.evaluate(X_test, y_test)
        logger.info(f"Test accuracy: {accuracy:.4f}")
        
        # Save the trained model
        try:
            model.save(MODEL_PATH)
        except Exception as e:
            logger.error(f"Error saving model: {str(e)}")
            # Create a fallback path
            model.save('adhd_model_fallback.keras')
            logger.info("Model saved to fallback location")
        
        # Save the scaler and feature info
        scaler_path = os.path.dirname(MODEL_PATH) + '/scaler.pkl'
        with open(scaler_path, 'wb') as f:
            pickle.dump(scaler, f)
        
        # Save feature columns and label mapping
        with open(os.path.dirname(MODEL_PATH) + '/model_info.json', 'w') as f:
            json.dump({
                'feature_columns': feature_columns,
                'label_mapping': label_mapping
            }, f)

        logger.info("Model retrained and saved with preprocessing information.")
        return model, scaler, feature_columns, label_mapping
    except Exception as e:
        logger.error(f"Error in train_model: {str(e)}\n{traceback.format_exc()}")
        raise ModelError(f"Model training failed: {str(e)}")

# Load trained model and preprocessing objects
# Load trained model and preprocessing objects
def load_model():
    """
    Load the trained model and preprocessing objects.
    
    Returns:
    tuple: (model, scaler, feature_columns, label_mapping)
    """
    model, scaler, label_encoder, feature_columns = None, None, None, None
    
    # Load the Keras model
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.error(f"Error loading model from {MODEL_PATH}: {str(e)}")
        # Try loading from fallback location
        try:
            model = tf.keras.models.load_model('adhd_model_fallback.keras')
            logger.info("Model loaded from fallback location")
        except Exception as e2:
            logger.error(f"Error loading model from fallback location: {str(e2)}")
            return None, None, None, None
    
    # Load the scaler
    try:
        scaler_path = os.path.dirname(MODEL_PATH) + '/scaler.pkl'
        with open(scaler_path, 'rb') as f:
            scaler = pickle.load(f)
        logger.info("Scaler loaded successfully")
    except Exception as e:
        logger.error(f"Error loading scaler: {str(e)}")
        # Try loading from mlmodels directory
        try:
            with open('mlmodels/scaler.pkl', 'rb') as f:
                scaler = pickle.load(f)
            logger.info("Scaler loaded from mlmodels directory")
        except Exception as e2:
            logger.error(f"Error loading scaler from mlmodels directory: {str(e2)}")
            return model, None, None, None
    
    # Load the label encoder
    try:
        label_encoder_path = os.path.dirname(MODEL_PATH) + '/label_encoder.pkl'
        with open(label_encoder_path, 'rb') as f:
            label_encoder = pickle.load(f)
        logger.info("Label encoder loaded successfully")
    except Exception as e:
        logger.error(f"Error loading label encoder from {label_encoder_path}: {str(e)}")
        # Try loading from mlmodels directory
        try:
            with open('mlmodels/label_encoder.pkl', 'rb') as f:
                label_encoder = pickle.load(f)
            logger.info("Label encoder loaded from mlmodels directory")
        except Exception as e2:
            logger.error(f"Error loading label encoder from mlmodels directory: {str(e2)}")
            return model, scaler, None, None
    
    # Get label mapping
    try:
        label_mapping = dict(zip(label_encoder.classes_, 
                                label_encoder.transform(label_encoder.classes_)))
    except Exception as e:
        logger.error(f"Error creating label mapping: {str(e)}")
        return model, scaler, None, None
    
    # Define feature columns
    feature_columns = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 
                     'prematureClicks', 'missedStars', 'maxMissedStreak', 'score', 'prematureClicksRatio']
    
    return model, scaler, feature_columns, label_mapping

# Function to generate insights based on prediction results
def generate_insights(adhd_type, game_data):
    try:
        insights = {
            'inattention': [],
            'impulsivity': [],
            'combined': []
        }
        
        # Inattention insights
        if game_data.get('missedStars', 0) > 5:
            insights['inattention'].append("Missed several stars, suggesting potential attention lapses.")
        
        if game_data.get('averageReactionTime', 0) > 1000:
            insights['inattention'].append("Slower reaction times indicate possible difficulty maintaining focus.")
        
        if game_data.get('maxMissedStreak', 0) >= 2:
            insights['inattention'].append("Consecutive missed stars suggest periods of significant inattention.")
        
        # Impulsivity insights
        if game_data.get('prematureClicks', 0) > 3:
            insights['impulsivity'].append("High number of premature clicks suggests impulsive responding.")
        
        # Add ADHD type-specific insights
        if adhd_type == "Inattentive":
            insights['inattention'].append("Model prediction indicates an inattentive pattern consistent with ADHD-I.")
            insights['combined'].append("Primary challenges appear to be with sustained attention rather than impulse control.")
        elif adhd_type == "Hyperactive-Impulsive":
            insights['impulsivity'].append("Model prediction indicates an impulsive pattern consistent with ADHD-HI.")
            insights['combined'].append("Primary challenges appear to be with impulse control rather than sustained attention.")
        elif adhd_type == "Combined":
            insights['combined'].append("Model prediction indicates both inattentive and impulsive patterns, consistent with ADHD-C.")
        else:  # No ADHD
            if game_data.get('score', 0) > 200:
                insights['combined'].append("Performance metrics are within typical ranges, with no significant attention or impulsivity concerns.")
        
        # Ensure we have at least one insight per category
        if not insights['inattention']:
            insights['inattention'].append("Attention metrics are within normal ranges.")
        if not insights['impulsivity']:
            insights['impulsivity'].append("Impulsivity metrics are within normal ranges.")
        if not insights['combined']:
            if game_data.get('score', 0) > 200:
                insights['combined'].append("Overall performance is strong, showing good cognitive control.")
            else:
                insights['combined'].append("Overall performance is within typical ranges.")
        
        return insights
    except Exception as e:
        logger.error(f"Error generating insights: {str(e)}")
        # Return generic insights if we encounter an error
        return {
            'inattention': ["Unable to generate specific insights for attention metrics."],
            'impulsivity': ["Unable to generate specific insights for impulsivity metrics."],
            'combined': ["Some metrics are outside typical ranges. Consider professional evaluation."]
        }

# Calculate inattention score
def calculate_inattention_score(data):
    try:
        # Factors indicating inattention
        missed_stars = data.get('missedStars', 0)
        missed_stars_factor = min(missed_stars * 5, 40) if isinstance(missed_stars, (int, float)) else 0
        
        # Long reaction times
        avg_reaction_time = data.get('averageReactionTime', 0)
        reaction_time_factor = 0
        if not isinstance(avg_reaction_time, (int, float)):
            reaction_time_factor = 0
        elif avg_reaction_time > 1000: 
            reaction_time_factor = 30
        elif avg_reaction_time > 800: 
            reaction_time_factor = 20
        elif avg_reaction_time > 600: 
            reaction_time_factor = 10
        
        # Missed star streaks
        missed_star_streaks = data.get('missedStarStreaks', [0])
        if isinstance(missed_star_streaks, str):
            try:
                missed_star_streaks = eval(missed_star_streaks)
            except:
                missed_star_streaks = [0]
        
        if not isinstance(missed_star_streaks, list):
            missed_star_streaks = [0]
        
        max_missed_streak = max(missed_star_streaks) if missed_star_streaks else 0
        streak_factor = max_missed_streak * 10
        
        # Calculate final score (cap at 100)
        return min(missed_stars_factor + reaction_time_factor + streak_factor, 100)
    except Exception as e:
        logger.error(f"Error calculating inattention score: {str(e)}")
        return 50  # Return a default mid-range score on error

# Calculate impulsivity score
def calculate_impulsivity_score(data):
    try:
        # Premature clicks
        premature_clicks = data.get('prematureClicks', 0)
        if not isinstance(premature_clicks, (int, float)):
            premature_clicks = 0
            
        reaction_times = data.get('reactionTimes', [])
        
        # If reaction_times is a string (from CSV), convert to list
        if isinstance(reaction_times, str):
            try:
                reaction_times = eval(reaction_times)
            except:
                reaction_times = []
        
        if not isinstance(reaction_times, list):
            reaction_times = []
        
        # Calculate premature clicks ratio
        denominator = len(reaction_times) + premature_clicks
        premature_clicks_ratio = (premature_clicks / denominator * 100) if denominator > 0 else 0
        premature_clicks_factor = min(premature_clicks_ratio, 50)
        
        # Calculate fast responses ratio
        fast_responses = sum(1 for time in reaction_times if isinstance(time, (int, float)) and time < 400)
        fast_response_ratio = (fast_responses / len(reaction_times) * 100) if len(reaction_times) > 0 else 0
        fast_response_factor = min(fast_response_ratio * 0.5, 30)
        
        # Calculate variability in reaction times
        variability_factor = 0
        if len(reaction_times) > 1:
            try:
                std_dev = np.std([t for t in reaction_times if isinstance(t, (int, float))])
                if std_dev > 300: 
                    variability_factor = 20
                elif std_dev > 200: 
                    variability_factor = 10
            except:
                variability_factor = 0
        
        # Calculate final score (cap at 100)
        return min(premature_clicks_factor + fast_response_factor + variability_factor, 100)
    except Exception as e:
        logger.error(f"Error calculating impulsivity score: {str(e)}")
        return 50  # Return a default mid-range score on error

# Get score level
def get_score_level(score):
    try:
        if not isinstance(score, (int, float)):
            return 'Average'
        if score < 20: return 'Low'
        if score < 40: return 'Below Average'
        if score < 60: return 'Average'
        if score < 80: return 'Above Average'
        return 'High'
    except Exception as e:
        logger.error(f"Error getting score level: {str(e)}")
        return 'Average'  # Return a default level on error

def predict_adhd_type(reaction_times, correct_streak, premature_clicks, missed_stars, score):
    """
    Make a prediction using the trained model.
    
    Parameters:
    reaction_times (list): List of reaction times in milliseconds
    correct_streak (int): Maximum correct streak
    premature_clicks (int): Number of premature clicks
    missed_stars (int): Number of missed stars
    score (int): Game score
    
    Returns:
    str: Predicted ADHD type
    dict: Probabilities for each ADHD type
    """
    try:
        # Validate input parameters
        if not isinstance(reaction_times, list):
            raise ValueError("reaction_times must be a list")
        if not isinstance(correct_streak, (int, float)):
            raise ValueError("correct_streak must be a number")
        if not isinstance(premature_clicks, (int, float)):
            raise ValueError("premature_clicks must be a number")
        if not isinstance(missed_stars, (int, float)):
            raise ValueError("missed_stars must be a number")
        if not isinstance(score, (int, float)):
            raise ValueError("score must be a number")
        
        # Load model and preprocessing objects
        model, scaler, feature_columns, label_mapping = load_model()
        
        if model is None:
            raise ModelError("Failed to load model")
        if scaler is None:
            raise ModelError("Failed to load scaler")
        if label_mapping is None:
            raise ModelError("Failed to load label mapping")
        
        # Clean reaction times (remove non-numeric values)
        reaction_times = [rt for rt in reaction_times if isinstance(rt, (int, float))]
        
        # Handle empty reaction times list
        if not reaction_times:
            reaction_times = [600]  # Default value
            logger.warning("Empty reaction times list. Using default value.")
        
        # Calculate derived metrics
        avg_reaction_time = np.mean(reaction_times)
        reaction_time_variability = np.std(reaction_times) if len(reaction_times) > 1 else 0
        premature_clicks_ratio = premature_clicks / (premature_clicks + 10)
        
        # Determine maximum missed streak (default to 0 if not provided)
        max_missed_streak = 0
        
        # Create feature vector
        features = np.array([[
            avg_reaction_time, 
            reaction_time_variability, 
            correct_streak, 
            premature_clicks, 
            missed_stars, 
            max_missed_streak,
            score, 
            # premature_clicks_ratio
        ]])
        
        # Scale features
        scaled_features = scaler.transform(features)
        
        # Make prediction
        prediction = model.predict(scaled_features)[0]
        
        # Get predicted class
        predicted_class = np.argmax(prediction)
        
        # Map class index back to ADHD type
        inverse_mapping = {v: k for k, v in label_mapping.items()}
        predicted_type = inverse_mapping.get(predicted_class, "Unknown")
        
        # Get probabilities for each class
        probabilities = {adhd_type: float(prediction[i]) for i, adhd_type in enumerate(sorted(label_mapping.keys(), key=lambda x: label_mapping[x]))}
        
        return predicted_type, probabilities
    except ModelError as e:
        logger.error(f"Model error in predict_adhd_type: {str(e)}")
        return "Unknown", {"No ADHD": 0.25, "Inattentive": 0.25, "Hyperactive-Impulsive": 0.25, "Combined": 0.25}
    except Exception as e:
        logger.error(f"Error in predict_adhd_type: {str(e)}\n{traceback.format_exc()}")
        return "Unknown", {"No ADHD": 0.25, "Inattentive": 0.25, "Hyperactive-Impulsive": 0.25, "Combined": 0.25}

# Main Execution
if __name__ == "__main__":
    try:
        # Check if we should train or just run prediction service
        import sys
        if len(sys.argv) > 1 and sys.argv[1] == 'train':
            data = fetch_data()
            if len(data) >= DATA_THRESHOLD:
                logger.info(f"Training model with {len(data)} records...")
                train_model(data)
            else:
                logger.warning(f"Not enough data for training. Current size: {len(data)}")
        else:
            # Run prediction API service
            app = Flask(__name__)
            CORS(app)  # Enable CORS for all routes

            # Load model on startup
            loaded_model, loaded_scaler, loaded_features, loaded_mapping = load_model()
            if loaded_model is None:
                logger.error("Error: Could not load model. Please train the model first.")
                # We'll continue running the app, but with limited functionality

            @app.route('/predict', methods=['POST'])
            def predict():
                try:
                    game_data = request.json
                    if not game_data:
                        logger.error("No game data provided in request")
                        return jsonify({"error": "No game data provided"}), 400
                    
                    # Validate required fields
                    required_fields = ['reactionTimes', 'correctStreak', 'prematureClicks', 'missedStars', 'score']
                    missing_fields = [field for field in required_fields if field not in game_data]
                    
                    if missing_fields:
                        error_msg = f"Missing required fields: {', '.join(missing_fields)}"
                        logger.error(error_msg)
                        return jsonify({"error": error_msg}), 400
                    
                    # Make prediction
                    adhd_type, probabilities = predict_adhd_type(
                        game_data['reactionTimes'], 
                        game_data['correctStreak'], 
                        game_data['prematureClicks'], 
                        game_data['missedStars'], 
                        game_data['score']
                    )
                    
                    # Generate insights
                    insights = generate_insights(adhd_type, game_data)
                    
                    # Calculate attention and impulsivity scores
                    inattention_score = calculate_inattention_score(game_data)
                    impulsivity_score = calculate_impulsivity_score(game_data)
                    
                    # Determine score levels
                    inattention_level = get_score_level(inattention_score)
                    impulsivity_level = get_score_level(impulsivity_score)
                    
                    # Prepare response
                    response = {
                        "adhd_type": adhd_type,
                        "probabilities": probabilities,
                        "insights": insights,
                        "scores": {
                            "inattention": {
                                "score": inattention_score,
                                "level": inattention_level
                            },
                            "impulsivity": {
                                "score": impulsivity_score,
                                "level": impulsivity_level
                            }
                        }
                    }
                    
                    logger.info(f"Successfully processed prediction for game data")
                    return jsonify(response), 200
                    
                except Exception as e:
                    error_message = f"Error processing prediction request: {str(e)}"
                    logger.error(f"{error_message}\n{traceback.format_exc()}")
                    return jsonify({
                        "error": "Error processing request",
                        "message": str(e),
                        "adhd_type": "Unknown",
                        "probabilities": {"No ADHD": 0.25, "Inattentive": 0.25, "Hyperactive-Impulsive": 0.25, "Combined": 0.25},
                        "insights": {
                            "inattention": ["Unable to analyze attention metrics due to an error."],
                            "impulsivity": ["Unable to analyze impulsivity metrics due to an error."],
                            "combined": ["An error occurred during analysis. Please try again."]
                        }
                    }), 500

            @app.route('/health', methods=['GET'])
            def health_check():
                try:
                    # Check MongoDB connection
                    db_status = "connected" if client and client.server_info() else "disconnected"
                except Exception:
                    db_status = "disconnected"
                
                model_status = "loaded" if loaded_model is not None else "not loaded"
                scaler_status = "loaded" if loaded_scaler is not None else "not loaded"

                    # Calculate uptime
                uptime_seconds = int(time.time() - start_time)
                days, remainder = divmod(uptime_seconds, 86400)
                hours, remainder = divmod(remainder, 3600)
                minutes, seconds = divmod(remainder, 60)
                uptime_str = f"{days} days, {hours} hours, {minutes} minutes"

                return jsonify({
                    "status": "ok" if loaded_model and loaded_scaler else "degraded",
                    "model_loaded": model_status,
                    "scaler_loaded": scaler_status,
                    "database": db_status,
                    "version": "1.0.0",
                    "uptime": uptime_str
                })
            

            @app.route('/retrain', methods=['POST'])
            def retrain_model():
                try:
                    # Check authorization (simple API key validation)
                    api_key = request.headers.get('X-API-Key')
                    if not api_key or api_key != os.environ.get('MODEL_API_KEY', 'default_training_key'):
                        return jsonify({"error": "Unauthorized"}), 401
                    
                    # Fetch latest data
                    data = fetch_data()
                    
                    if len(data) < DATA_THRESHOLD:
                        return jsonify({
                            "error": "Insufficient data", 
                            "message": f"Need at least {DATA_THRESHOLD} records, but only have {len(data)}"
                        }), 400
                    
                    # Train model
                    model, scaler, feature_columns, label_mapping = train_model(data)
                    
                    if model is None:
                        return jsonify({"error": "Model training failed"}), 500
                    
                    # Update the loaded model variables
                    global loaded_model, loaded_scaler, loaded_features, loaded_mapping
                    loaded_model = model
                    loaded_scaler = scaler
                    loaded_features = feature_columns
                    loaded_mapping = label_mapping
                    
                    return jsonify({"status": "success", "message": "Model retrained successfully"}), 200
                    
                except Exception as e:
                    error_message = f"Error retraining model: {str(e)}"
                    logger.error(f"{error_message}\n{traceback.format_exc()}")
                    return jsonify({"error": "Retraining failed", "message": str(e)}), 500

            @app.errorhandler(404)
            def not_found(e):
                return jsonify({"error": "Endpoint not found"}), 404

            @app.errorhandler(405)
            def method_not_allowed(e):
                return jsonify({"error": "Method not allowed"}), 405

            @app.errorhandler(500)
            def server_error(e):
                return jsonify({"error": "Internal server error", "message": str(e)}), 500

            # Run the Flask app
            logger.info("Starting prediction service on http://localhost:5000")
            app.run(host='0.0.0.0', port=5000, debug=False)
    except Exception as e:
        logger.critical(f"Fatal error starting application: {str(e)}\n{traceback.format_exc()}")
        sys.exit(1)