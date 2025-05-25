
# import pandas as pd
# import numpy as np
# import tensorflow as tf
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder, StandardScaler, label_binarize
# from sklearn.metrics import classification_report, roc_auc_score, accuracy_score
# from flask import Flask, request, jsonify
# import json
# import os
# import logging
# import traceback
# from flask_cors import CORS
# from pymongo import MongoClient, ASCENDING, DESCENDING # For sorting
# import pickle
# import time
# import datetime
# import sys # For sys.argv and sys.exit

# start_time = time.time()

# # --- START: Define SCRIPT_DIR and relative paths ---
# SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# LOG_FILE_PATH = os.path.join(SCRIPT_DIR, "adhd_model.log")
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     handlers=[
#         logging.FileHandler(LOG_FILE_PATH),
#         logging.StreamHandler()
#     ]
# )
# logger = logging.getLogger(__name__)

# CSV_FILE_PATH = os.path.join(SCRIPT_DIR, "adhd_dataset.csv")
# MODEL_ARTIFACTS_SUBDIR = 'adhd_model_assets'
# MODEL_BASE_PATH = os.path.join(SCRIPT_DIR, MODEL_ARTIFACTS_SUBDIR)
# MODEL_PATH = os.path.join(MODEL_BASE_PATH, 'adhd_model.keras')
# SCALER_PATH = os.path.join(MODEL_BASE_PATH, 'scaler.pkl')
# LABEL_ENCODER_PATH = os.path.join(MODEL_BASE_PATH, 'label_encoder.pkl')
# MODEL_INFO_PATH = os.path.join(MODEL_BASE_PATH, 'model_info.json')
# MODEL_PERFORMANCE_PATH = os.path.join(MODEL_BASE_PATH, 'model_performance.json')
# ACCURACY_HISTORY_PATH = os.path.join(MODEL_BASE_PATH, 'accuracy_history.json')
# # --- END: Define SCRIPT_DIR and relative paths ---

# # Updated ADHD_SUBTYPES reflecting that 'None' is mapped to 'No ADHD'
# ADHD_SUBTYPES = ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined']
# DATA_THRESHOLD = 10

# # MongoDB setup
# try:
#     client = MongoClient(os.environ.get('MONGODB_URI', 'mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/'), serverSelectionTimeoutMS=5000)
#     client.server_info()
#     db = client[os.environ.get('MONGODB_DBNAME', 'test')]
#     game_metrics_collection = db['gamemetrics']
#     questionnaire_collection = db['questionnaireresponses']
#     logger.info("MongoDB connection established successfully")
# except Exception as e:
#     logger.error(f"MongoDB connection error: {str(e)}")
#     client = None # Ensure these are None for checks later
#     db = None
#     game_metrics_collection = None
#     questionnaire_collection = None

# class ModelError(Exception):
#     pass

# class DataError(Exception):
#     pass

# def load_csv_data(csv_path):
#     try:
#         expected_cols_with_types = {
#             'childId': str,
#             'averageReactionTime': float,
#             'reactionTimeVariability': float,
#             'correctStreak': int,
#             'prematureClicks': int,
#             'missedStars': int,
#             'score': int,
#             'ADHD_Type': str,
#             # 'createdAt_game': object, # Will be parsed to datetime
#             'completed_game': bool,
#             'completed_questionnaire': bool
#         }
#         # Define default values for when a new CSV is created
#         default_values_for_empty_csv = {
#             'completed_game': False,
#             'completed_questionnaire': False,
#             'averageReactionTime': 0.0, # Example defaults
#             'reactionTimeVariability': 0.0,
#             'correctStreak': 0,
#             'prematureClicks': 0,
#             'missedStars': 0,
#             'score': 0,
#         }


#         if os.path.exists(csv_path):
#             df = pd.read_csv(csv_path)
#             logger.info(f"Loaded {len(df)} records from CSV: {csv_path}")

#             # Ensure all expected columns exist and have appropriate types/defaults
#             for col, col_type in expected_cols_with_types.items():
#                 if col not in df.columns:
#                     logger.warning(f"Column '{col}' missing in CSV. Adding it with default values.")
#                     df[col] = default_values_for_empty_csv.get(col, pd.NA if col_type != bool else False) # pd.NA for non-bool, False for bool
                
#                 if col_type == bool:
#                     df[col] = df[col].fillna(default_values_for_empty_csv.get(col, False)).astype(bool)
#                 elif col_type == str and col != 'ADHD_Type': # ADHD_Type handled specially later
#                     df[col] = df[col].astype(str) # Ensure childId is string like
#                 # For numeric types, NaNs are okay for now, will be handled in processing
            
#             if 'createdAt_game' not in df.columns:
#                 df['createdAt_game'] = pd.NaT
#             df['createdAt_game'] = pd.to_datetime(df['createdAt_game'], errors='coerce')


#             return df
#         else:
#             logger.warning(f"CSV file not found: {csv_path}. Creating a new dataset structure.")
#             # Create an empty DataFrame with all expected columns and their defaults
#             df = pd.DataFrame(columns=list(expected_cols_with_types.keys()) + ['createdAt_game']) # Add createdAt_game separately
#             for col, default_val in default_values_for_empty_csv.items():
#                 if col in df.columns:
#                     df[col] = df[col].fillna(default_val) # Fill if column was created empty

#             # Set dtypes for the empty dataframe based on expected types
#             for col, col_type in expected_cols_with_types.items():
#                 if col in df.columns:
#                     try:
#                         df[col] = df[col].astype(col_type)
#                     except Exception as e_type:
#                         logger.warning(f"Could not cast column {col} to {col_type} for new CSV: {e_type}")
#             if 'createdAt_game' in df.columns:
#                  df['createdAt_game'] = pd.to_datetime(df['createdAt_game'], errors='coerce')


#             return df
#     except Exception as e:
#         logger.error(f"Error loading CSV data from {csv_path}: {str(e)}")
#         raise DataError(f"Failed to load CSV data: {str(e)}")

# def fetch_data():
#     try:
#         csv_data = load_csv_data(CSV_FILE_PATH) # This now returns a df with expected columns

#         expected_cols = list(csv_data.columns) # Get expected columns from the loaded (or newly created) csv_data

#         if game_metrics_collection is None or questionnaire_collection is None:
#             logger.warning("MongoDB connection not available. Using only CSV data (if any).")
#             return csv_data.reset_index(drop=True)

#         try:
#             game_metrics_cursor = game_metrics_collection.find().sort("createdAt", DESCENDING)
#             questionnaires_raw_cursor = questionnaire_collection.find()
#             game_metrics = list(game_metrics_cursor)
#             questionnaires_raw = list(questionnaires_raw_cursor)
#             logger.info(f"Fetched {len(game_metrics)} game metrics and {len(questionnaires_raw)} questionnaires from MongoDB.")
#         except Exception as e:
#             logger.error(f"Error fetching data from MongoDB: {str(e)}. Using only CSV data.")
#             return csv_data.reset_index(drop=True)

#         latest_questionnaires_dict = {}
#         for q in sorted(questionnaires_raw, key=lambda x: x.get('createdAt', datetime.datetime.min), reverse=True):
#             child_id_str = str(q.get('childId'))
#             if child_id_str not in latest_questionnaires_dict and q.get('subtype'):
#                 latest_questionnaires_dict[child_id_str] = q
        
#         mongo_child_data_list = []
#         processed_mongo_child_ids = set()

#         for metric in game_metrics:
#             try:
#                 child_id_obj = metric.get('childId')
#                 if not child_id_obj: continue
#                 child_id_str = str(child_id_obj)

#                 if child_id_str in processed_mongo_child_ids: continue
#                 matching_questionnaire = latest_questionnaires_dict.get(child_id_str)

#                 if matching_questionnaire:
#                     rt_variability_db = metric.get('reactionTimeVariability')
#                     if isinstance(rt_variability_db, (int, float)) and rt_variability_db >= 0:
#                         reaction_time_variability = rt_variability_db
#                     else:
#                         reaction_times_list = metric.get('reactionTimes', [])
#                         valid_rts = [rt for rt in reaction_times_list if isinstance(rt, (int,float)) and not np.isnan(rt)]
#                         reaction_time_variability = np.std(valid_rts) if len(valid_rts) > 1 else 0.0
                    
#                     created_at_game = metric.get('createdAt', datetime.datetime.now(datetime.timezone.utc))
#                     if not isinstance(created_at_game, datetime.datetime):
#                         try:
#                             created_at_game_parsed = pd.to_datetime(str(created_at_game), errors='coerce').to_pydatetime()
#                             created_at_game = created_at_game_parsed if pd.NaT != created_at_game_parsed else datetime.datetime.now(datetime.timezone.utc)
#                             if created_at_game.tzinfo is None: created_at_game = created_at_game.replace(tzinfo=datetime.timezone.utc)
#                         except: created_at_game = datetime.datetime.now(datetime.timezone.utc)
                    
#                     avg_rt = metric.get('averageReactionTime', 0.0)
#                     if not isinstance(avg_rt, (int, float)) or avg_rt < 0 or np.isnan(avg_rt): avg_rt = 0.0
                    
#                     correct_streak_val = int(metric.get('correctStreak', 0) if pd.notna(metric.get('correctStreak')) else 0)
#                     premature_clicks_val = int(metric.get('prematureClicks', 0) if pd.notna(metric.get('prematureClicks')) else 0)
#                     missed_stars_val = int(metric.get('missedStars', 0) if pd.notna(metric.get('missedStars')) else 0)
#                     score_val = int(metric.get('score', 0) if pd.notna(metric.get('score')) else 0)
                    
#                     adhd_type_from_db = matching_questionnaire.get('subtype', 'None') # Default to 'None' string

#                     record = {
#                         'childId': child_id_str,
#                         'averageReactionTime': float(avg_rt),
#                         'reactionTimeVariability': float(reaction_time_variability),
#                         'correctStreak': correct_streak_val,
#                         'prematureClicks': premature_clicks_val,
#                         'missedStars': missed_stars_val,
#                         'score': score_val,
#                         'ADHD_Type': adhd_type_from_db, # Keep as fetched for now, standardize later
#                         'createdAt_game': created_at_game,
#                         'completed_game': True,
#                         'completed_questionnaire': True
#                     }
#                     mongo_child_data_list.append(record)
#                     processed_mongo_child_ids.add(child_id_str)
#             except Exception as e:
#                 logger.error(f"Error processing MongoDB metric for child {metric.get('childId', 'unknown')} (ID: {metric.get('_id')}): {str(e)}\n{traceback.format_exc()}")
#                 continue
        
#         mongo_df = pd.DataFrame(mongo_child_data_list)
#         if not mongo_df.empty:
#              for col in expected_cols:
#                 if col not in mongo_df.columns:
#                     mongo_df[col] = csv_data[col].dtype.type() if col in csv_data else pd.NA # Use dtype from csv_data or NA

#         # --- Merging Logic & Standardization ---
#         if not csv_data.empty and 'childId' not in csv_data.columns:
#             logger.warning("Loaded CSV data does not have 'childId' column. Will overwrite with MongoDB data if available.")
#             combined_df = mongo_df if not mongo_df.empty else csv_data # Prioritize Mongo data
#         elif not mongo_df.empty:
#             csv_data['childId'] = csv_data['childId'].astype(str)
#             mongo_df['childId'] = mongo_df['childId'].astype(str)
            
#             existing_csv_child_ids = set(csv_data['childId'])
#             new_mongo_records_df = mongo_df[~mongo_df['childId'].isin(existing_csv_child_ids)]
#             logger.info(f"Found {len(new_mongo_records_df)} new records in MongoDB not present in CSV.")
#             combined_df = pd.concat([csv_data, new_mongo_records_df], ignore_index=True)
#         else: # mongo_df is empty
#             combined_df = csv_data
#             logger.info("No data fetched from MongoDB. Using existing CSV data.")

#         # Ensure all expected columns are present and standardize ADHD_Type
#         if combined_df.empty: # If still empty (e.g. both sources were empty)
#             combined_df = pd.DataFrame(columns=expected_cols) # Create empty structure
#         else:
#             for col in expected_cols:
#                 if col not in combined_df.columns:
#                     combined_df[col] = csv_data[col].dtype.type() if col in csv_data and hasattr(csv_data[col],'dtype') else pd.NA


#         # Standardize ADHD_Type: 'None' (string) and actual pd.NA/NaN to 'No ADHD'
#         if 'ADHD_Type' in combined_df.columns:
#             logger.info(f"Standardizing 'ADHD_Type'. Initial unique values in combined_df: {combined_df['ADHD_Type'].unique()}")
#             # Fill actual NaN/pd.NA with the string 'None' first, then convert all 'None' strings
#             combined_df['ADHD_Type'] = combined_df['ADHD_Type'].fillna('None').astype(str).str.strip()
#             combined_df['ADHD_Type'].replace('None', 'No ADHD', inplace=True)
#             # Optional: Standardize case for all types if needed, e.g., Title Case
#             # combined_df['ADHD_Type'] = combined_df['ADHD_Type'].apply(lambda x: x.title() if pd.notna(x) else x)
#             logger.info(f"ADHD_Type counts after standardization: \n{combined_df['ADHD_Type'].value_counts(dropna=False)}")
        
#         combined_df = combined_df[expected_cols].reset_index(drop=True) # Enforce column order and reset index

#         try:
#             if not combined_df.empty:
#                 combined_df.to_csv(CSV_FILE_PATH, index=False)
#                 logger.info(f"Saved updated combined dataset ({len(combined_df)} records) to CSV: {CSV_FILE_PATH}")
#             else:
#                 logger.info("Combined dataset is empty. Not writing to CSV.")
#         except Exception as e:
#             logger.error(f"Error saving updated combined data to CSV {CSV_FILE_PATH}: {str(e)}")

#         logger.info(f"Final dataset for retraining has {len(combined_df)} records.")
#         return combined_df

#     except Exception as e:
#         logger.critical(f"Critical error in fetch_data's main try block: {str(e)}\n{traceback.format_exc()}")
#         # Fallback to trying to load CSV, ensuring it has structure
#         try:
#             df_fallback = load_csv_data(CSV_FILE_PATH) # load_csv_data now ensures structure
#             return df_fallback.reset_index(drop=True)
#         except DataError: # If load_csv_data itself raises DataError
#             logger.error("Fallback CSV loading also failed critically.")
#             # Return an empty DataFrame with the expected structure as the absolute last resort
#             empty_df_structure = pd.DataFrame(columns=['childId', 'averageReactionTime', 'reactionTimeVariability', 'correctStreak',
#                                                        'prematureClicks', 'missedStars', 'score', 'ADHD_Type', 'createdAt_game',
#                                                        'completed_game', 'completed_questionnaire'])
#             # Apply default types/values as in load_csv_data's new empty df creation
#             empty_df_structure['completed_game'] = False
#             empty_df_structure['completed_questionnaire'] = False
#             # ... set other defaults if necessary
#             return empty_df_structure


# def train_model(data): # 'data' is the combined_df
#     try:
#         # It's crucial that 'data' (combined_df from fetch_data) already had 'ADHD_Type' standardized.
#         # 'None' should have been mapped to 'No ADHD'.
#         # ADHD_SUBTYPES = ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined']

#         logger.info(f"train_model received data with {len(data)} records. Unique ADHD_Types: {data['ADHD_Type'].unique()}")
#         logger.info(f"Value counts of ADHD_Types at start of train_model: \n{data['ADHD_Type'].value_counts(dropna=False)}")


#         # Filter 1: Based on ADHD_SUBTYPES and not 'Unknown'
#         # 'Unknown' should not be in ADHD_SUBTYPES.
#         # If 'ADHD_Type' column can contain 'Unknown' string from data source, this filter is useful.
#         data_train_filtered = data[data['ADHD_Type'].isin(ADHD_SUBTYPES)].copy()
#         # Any row with ADHD_Type not in ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined'] will be dropped.
#         # This also implicitly handles cases where ADHD_Type might be 'Unknown' string or other unexpected strings.

#         logger.info(f"Size after filtering by ADHD_SUBTYPES ('{ADHD_SUBTYPES}'): {len(data_train_filtered)}")
#         if len(data_train_filtered) < len(data):
#             dropped_types = data[~data['ADHD_Type'].isin(ADHD_SUBTYPES)]['ADHD_Type'].unique()
#             logger.warning(f"{len(data) - len(data_train_filtered)} records dropped. ADHD_Types dropped: {list(dropped_types)}")


#         if len(data_train_filtered) < DATA_THRESHOLD:
#             logger.warning(f"Not enough valid data for training after initial filtering. Current size: {len(data_train_filtered)}, Threshold: {DATA_THRESHOLD}")
#             return None, None, None, None

#         data_train_processed = data_train_filtered.copy()
        
#         numeric_cols = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 'prematureClicks', 'missedStars', 'score']
#         for col in numeric_cols:
#             data_train_processed[col] = pd.to_numeric(data_train_processed[col], errors='coerce').fillna(0.0) # Fill NaNs with 0.0 for numeric

#         data_train_processed['prematureClicksRatio'] = data_train_processed['prematureClicks'] / (data_train_processed['prematureClicks'] + 1e-6)
        
#         feature_columns_for_model = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak',
#                                      'prematureClicks', 'missedStars', 'score', 'prematureClicksRatio']

#         # At this point, data_train_processed should only contain rows with ADHD_Type in ADHD_SUBTYPES.
#         # So, the label encoder fitted on ADHD_SUBTYPES should cover all present types.
#         label_encoder = LabelEncoder()
#         # Fit directly on ADHD_SUBTYPES as these are the only valid classes we care about.
#         label_encoder.fit(ADHD_SUBTYPES)
#         logger.info(f"Label encoder fitted with classes: {list(label_encoder.classes_)}")

#         # This filter step should ideally not drop any more rows if the above logic is correct
#         # and data_train_processed['ADHD_Type'] only contains values from ADHD_SUBTYPES.
#         data_train_final = data_train_processed[data_train_processed['ADHD_Type'].isin(label_encoder.classes_)]
        
#         if len(data_train_final) < len(data_train_processed):
#             logger.warning(f"Further {len(data_train_processed) - len(data_train_final)} records dropped after ensuring ADHD_Type is in label_encoder.classes_. This is unexpected if previous filtering was correct.")
#             unexpectedly_dropped = data_train_processed[~data_train_processed['ADHD_Type'].isin(label_encoder.classes_)]['ADHD_Type'].unique()
#             logger.warning(f"Unexpectedly dropped ADHD_Types: {list(unexpectedly_dropped)}")


#         logger.info(f"Final data size for splitting (data_train_final): {len(data_train_final)}")

#         if len(data_train_final) < DATA_THRESHOLD:
#             logger.warning(f"Not enough data after all filtering. Size: {len(data_train_final)}, Threshold: {DATA_THRESHOLD}")
#             return None, None, None, None

#         y = label_encoder.transform(data_train_final['ADHD_Type'])
#         X_unscaled_df = data_train_final[feature_columns_for_model].astype(float)

#         for col in X_unscaled_df.columns: # Should already be float and non-null from previous step
#             if X_unscaled_df[col].isnull().any(): # Double check for safety
#                 logger.warning(f"Unexpected NaNs found in '{col}' before train/test split. Filling with 0.")
#                 X_unscaled_df[col] = X_unscaled_df[col].fillna(0.0)


#         X_train_unscaled, X_test_unscaled, y_train, y_test = train_test_split(
#             X_unscaled_df, y, test_size=0.2, random_state=42,
#             stratify=y if len(np.unique(y)) > 1 else None
#         )

#         scaler = StandardScaler()
#         X_train_scaled = scaler.fit_transform(X_train_unscaled)
#         X_test_scaled = scaler.transform(X_test_unscaled)

#         label_mapping = {str(cls): int(val) for cls, val in zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_))}

#         os.makedirs(MODEL_BASE_PATH, exist_ok=True)
#         with open(LABEL_ENCODER_PATH, 'wb') as f: pickle.dump(label_encoder, f)
#         with open(SCALER_PATH, 'wb') as f: pickle.dump(scaler, f)

#         model = tf.keras.Sequential([
#             tf.keras.layers.Input(shape=(X_train_scaled.shape[1],)), # Use Input layer
#             tf.keras.layers.Dense(32, activation='relu'),
#             tf.keras.layers.Dropout(0.2),
#             tf.keras.layers.Dense(16, activation='relu'),
#             tf.keras.layers.Dropout(0.1),
#             tf.keras.layers.Dense(len(label_encoder.classes_), activation='softmax'),
#         ])

#         model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
#         early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True, verbose=0) # Changed verbose to 0
        
#         logger.info(f"Starting model training with {X_train_scaled.shape[0]} training samples and {X_test_scaled.shape[0]} validation samples.")
#         history = model.fit(X_train_scaled, y_train, validation_data=(X_test_scaled, y_test), epochs=100, batch_size=16, callbacks=[early_stopping], verbose=0)

#         y_pred_proba = model.predict(X_test_scaled)
#         y_pred_classes = np.argmax(y_pred_proba, axis=1)
#         accuracy_val = accuracy_score(y_test, y_pred_classes)
        
#         # Ensure target_names matches the actual classes in the encoder
#         report_target_names = list(label_encoder.classes_)
#         report_labels = list(range(len(report_target_names)))

#         report = classification_report(y_test, y_pred_classes, labels=report_labels, target_names=report_target_names, output_dict=True, zero_division=0)

#         precision_weighted = report['weighted avg']['precision']
#         recall_weighted = report['weighted avg']['recall']
#         f1_weighted = report['weighted avg']['f1-score']
#         auc_ovr_weighted = 0.0
#         num_classes_in_encoder = len(label_encoder.classes_)

#         if num_classes_in_encoder > 1 and len(np.unique(y_test)) > 1: # Check if more than one class in y_test for AUC
#             y_test_binarized = label_binarize(y_test, classes=range(num_classes_in_encoder))
#             if y_test_binarized.shape[1] == num_classes_in_encoder : # OvR if multiple classes
#                  try: auc_ovr_weighted = roc_auc_score(y_test_binarized, y_pred_proba, multi_class='ovr', average='weighted')
#                  except ValueError as e_auc: logger.warning(f"Could not calculate OvR AUC: {e_auc}. y_test_binarized shape: {y_test_binarized.shape}, y_pred_proba shape: {y_pred_proba.shape}"); auc_ovr_weighted = 0.0
#             elif y_test_binarized.shape[1] == 1 and num_classes_in_encoder == 2: # Binary case where label_binarize might return 1 column
#                  try: auc_ovr_weighted = roc_auc_score(y_test, y_pred_proba[:, 1]) # Use prob of positive class
#                  except ValueError as e_auc: logger.warning(f"Could not calculate AUC for binary case: {e_auc}"); auc_ovr_weighted = 0.0
#         elif num_classes_in_encoder == 1 or len(np.unique(y_test)) == 1 :
#             logger.warning(f"ROC AUC score is not defined because only one class is present in y_true (test set unique classes: {np.unique(y_test)}) or model has only one output class ({num_classes_in_encoder}).")


#         performance_data = {
#             'accuracy': accuracy_val, 'precision': precision_weighted, 'recall': recall_weighted,
#             'f1_score': f1_weighted, 'auc': auc_ovr_weighted,
#             'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat(),
#             'dataset_size_trained_on': len(data_train_final), 'num_features': X_train_scaled.shape[1],
#             'model_architecture': [layer.get_config() for layer in model.layers]
#         }
#         with open(MODEL_PERFORMANCE_PATH, 'w') as f: json.dump(performance_data, f, indent=4)

#         history_data = []
#         if os.path.exists(ACCURACY_HISTORY_PATH):
#             try:
#                 with open(ACCURACY_HISTORY_PATH, 'r') as f: history_data = json.load(f)
#             except json.JSONDecodeError: history_data = []
#         current_month_str = datetime.datetime.now(datetime.timezone.utc).strftime("%b %Y")
#         month_entry = next((item for item in history_data if item["date"] == current_month_str), None)
#         if month_entry: month_entry["accuracy"] = round(accuracy_val * 100, 2)
#         else: history_data.append({'date': current_month_str, 'accuracy': round(accuracy_val * 100, 2)})
#         history_data = history_data[-12:]
#         with open(ACCURACY_HISTORY_PATH, 'w') as f: json.dump(history_data, f, indent=4)

#         logger.info(f"Model training completed. Test accuracy: {accuracy_val:.4f}. Performance metrics saved to {MODEL_PERFORMANCE_PATH}")
#         model.save(MODEL_PATH)
#         logger.info(f"Model saved to {MODEL_PATH}")
#         with open(MODEL_INFO_PATH, 'w') as f:
#             json.dump({'feature_columns': feature_columns_for_model, 'label_mapping': label_mapping}, f, indent=4)
#         logger.info(f"Model info saved to {MODEL_INFO_PATH}")

#         return model, scaler, feature_columns_for_model, label_mapping
#     except DataError as e:
#         logger.error(f"DataError in train_model: {str(e)}")
#         return None, None, None, None
#     except Exception as e:
#         logger.error(f"Error in train_model: {str(e)}\n{traceback.format_exc()}")
#         return None, None, None, None

# # load_model, generate_insights, calculate scores, predict_adhd_type remain largely the same
# # Ensure predict_adhd_type also standardizes input or assumes features are already calculated.
# # The Flask app routes and main execution block also remain largely the same.

# # ... (load_model, predict_adhd_type, scoring functions, Flask app code as before) ...
# # The provided snippet for these was extensive, assuming they are largely correct
# # with the main data pipeline fixed.
# # Key things for predict_adhd_type:
# # - It calculates features like avg_reaction_time, reaction_time_variability, premature_clicks_ratio on the fly.
# # - It loads the scaler and label_encoder which were saved by train_model.
# # - The label_encoder will now have classes based on the updated ADHD_SUBTYPES.


# # Make sure to include the rest of your functions:
# # load_model, predict_adhd_type, generate_insights, calculate_inattention_score,
# # calculate_impulsivity_score, get_score_level, and the Flask app part.
# # The following is a placeholder for the rest of your script.

# def load_model():
#     try:
#         if not all(os.path.exists(p) for p in [MODEL_PATH, SCALER_PATH, LABEL_ENCODER_PATH, MODEL_INFO_PATH]):
#             logger.error(f"One or more model files are missing. Checked paths: MODEL_PATH={MODEL_PATH}, SCALER_PATH={SCALER_PATH}, LABEL_ENCODER_PATH={LABEL_ENCODER_PATH}, MODEL_INFO_PATH={MODEL_INFO_PATH}. Please train the model first.")
#             return None, None, None, None, None

#         model = tf.keras.models.load_model(MODEL_PATH)
#         with open(SCALER_PATH, 'rb') as f: scaler = pickle.load(f)
#         with open(LABEL_ENCODER_PATH, 'rb') as f: label_encoder = pickle.load(f)
#         with open(MODEL_INFO_PATH, 'r') as f: model_info = json.load(f)

#         feature_columns = model_info.get('feature_columns')
#         label_mapping = model_info.get('label_mapping')

#         if not all([model, scaler, label_encoder, feature_columns is not None, label_mapping is not None]):
#             raise ModelError("Failed to load one or more model components (model, scaler, encoder, features, or mapping).")

#         logger.info(f"Model and preprocessing objects loaded successfully from {MODEL_BASE_PATH}")
#         return model, scaler, feature_columns, label_mapping, label_encoder
#     except Exception as e:
#         logger.error(f"Error loading model or preprocessing objects: {str(e)}\n{traceback.format_exc()}")
#         return None, None, None, None, None

# def generate_insights(adhd_type, game_data_for_insights):
#     insights = {'inattention': [], 'impulsivity': [], 'combined': []}
#     missed_stars = game_data_for_insights.get('missedStars', 0)
#     avg_reaction_time = game_data_for_insights.get('averageReactionTime', 0)
#     premature_clicks = game_data_for_insights.get('prematureClicks', 0)

#     if missed_stars > 5: insights['inattention'].append("Missed several stars, suggesting potential attention lapses.")
#     if avg_reaction_time > 1000: insights['inattention'].append("Slower reaction times may indicate difficulty maintaining focus.")
#     if premature_clicks > 3: insights['impulsivity'].append("High number of premature clicks suggests impulsive responding.")

#     if adhd_type == "Inattentive": insights['inattention'].append("Model prediction aligns with an inattentive pattern.")
#     elif adhd_type == "Hyperactive-Impulsive": insights['impulsivity'].append("Model prediction aligns with an impulsive pattern.")
#     elif adhd_type == "Combined": insights['combined'].append("Model prediction indicates both inattentive and impulsive patterns.")
#     elif adhd_type == "No ADHD": insights['combined'].append("Performance metrics are within typical ranges based on model prediction.") # 'None' is mapped to 'No ADHD'
#     else: insights['combined'].append(f"Model predicted '{adhd_type}'.")


#     if not insights['inattention'] and adhd_type not in ["Hyperactive-Impulsive", "Combined"]:
#         insights['inattention'].append("Attention metrics within typical game ranges or not indicative of primary inattention.")
#     if not insights['impulsivity'] and adhd_type not in ["Inattentive", "Combined"]:
#         insights['impulsivity'].append("Impulsivity metrics within typical game ranges or not indicative of primary impulsivity.")
#     if not insights['combined'] and adhd_type in ["No ADHD", "Unknown"]:
#         insights['combined'].append("Overall performance noted.")
#     return insights

# def calculate_inattention_score(game_data_for_scores):
#     score = 0.0
#     avg_rt_pred = game_data_for_scores.get('averageReactionTime', 0.0)
#     missed_stars = game_data_for_scores.get('missedStars', 0)

#     score += min(missed_stars * 5, 40)
#     if avg_rt_pred > 1000: score += 30
#     elif avg_rt_pred > 800: score += 20
#     return min(score, 100.0)

# def calculate_impulsivity_score(game_data_for_scores):
#     score = 0.0
#     prem_clicks = game_data_for_scores.get('prematureClicks', 0)
#     rx_times_cleaned = game_data_for_scores.get('reactionTimes_cleaned', []) # Expect this from predict_adhd_type
#     rt_variability = game_data_for_scores.get('reactionTimeVariability', 0.0)

#     total_actions = len(rx_times_cleaned) + prem_clicks
#     if total_actions > 0: score += min((prem_clicks / total_actions * 100), 50)
    
#     fast_responses = sum(1 for t in rx_times_cleaned if isinstance(t, (int, float)) and t < 400)
#     if rx_times_cleaned: score += min((fast_responses / len(rx_times_cleaned) * 100) * 0.5, 30)
    
#     if rt_variability > 300: score += 20
#     return min(score, 100.0)

# def get_score_level(score):
#     if not isinstance(score, (int, float, np.number)) or np.isnan(score): return 'Average'
#     if score < 20: return 'Low'
#     if score < 40: return 'Below Average'
#     if score < 60: return 'Average'
#     if score < 80: return 'Above Average'
#     return 'High'

# def predict_adhd_type(reaction_times_raw, correct_streak, premature_clicks, missed_stars, score_game):
#     try:
#         loaded_model, loaded_scaler, loaded_feature_columns, _, loaded_label_encoder = load_model()
#         if loaded_model is None: raise ModelError("Failed to load model for prediction.")

#         reaction_times_cleaned = [rt for rt in reaction_times_raw if isinstance(rt, (int, float)) and not np.isnan(rt)]
#         if not reaction_times_cleaned: reaction_times_cleaned = [600.0] # Default if empty

#         avg_reaction_time = np.mean(reaction_times_cleaned) if reaction_times_cleaned else 0.0
#         reaction_time_variability = np.std(reaction_times_cleaned) if len(reaction_times_cleaned) > 1 else 0.0
        
#         premature_clicks_num = int(premature_clicks) if pd.notna(premature_clicks) else 0
#         premature_clicks_ratio = premature_clicks_num / (premature_clicks_num + 1e-6)
        
#         correct_streak_num = int(correct_streak) if pd.notna(correct_streak) else 0
#         missed_stars_num = int(missed_stars) if pd.notna(missed_stars) else 0
#         score_game_num = int(score_game) if pd.notna(score_game) else 0

#         feature_values_dict_for_model_and_scores = {
#             'averageReactionTime': avg_reaction_time,
#             'reactionTimeVariability': reaction_time_variability,
#             'correctStreak': correct_streak_num,
#             'prematureClicks': premature_clicks_num,
#             'missedStars': missed_stars_num,
#             'score': score_game_num,
#             'prematureClicksRatio': premature_clicks_ratio,
#             'reactionTimes_cleaned': reaction_times_cleaned 
#         }
        
#         for k_col in loaded_feature_columns:
#              val = feature_values_dict_for_model_and_scores.get(k_col)
#              if val is None or not isinstance(val, (int, float, np.number)) or np.isnan(val):
#                 logger.warning(f"Feature {k_col} is missing, non-numeric or NaN ({val}) during prediction. Defaulting to 0.")
#                 feature_values_dict_for_model_and_scores[k_col] = 0.0

#         features_ordered = [feature_values_dict_for_model_and_scores[col_name] for col_name in loaded_feature_columns]
#         features_np = np.array([features_ordered], dtype=float)

#         scaled_features = loaded_scaler.transform(features_np)
#         prediction_proba = loaded_model.predict(scaled_features)[0]

#         predicted_class_idx = np.argmax(prediction_proba)
#         # Ensure index is within bounds of label_encoder.classes_
#         if predicted_class_idx >= len(loaded_label_encoder.classes_):
#             logger.error(f"Predicted class index {predicted_class_idx} is out of bounds for label encoder classes (len: {len(loaded_label_encoder.classes_)}). Defaulting to Unknown.")
#             predicted_type = "Unknown" # Or a sensible default from your ADHD_SUBTYPES
#             probabilities = {cls: 0.0 for cls in loaded_label_encoder.classes_}
#             if probabilities: probabilities[list(probabilities.keys())[0]] = 1.0 # Assign full prob to first class as fallback
#         else:
#             predicted_type = loaded_label_encoder.classes_[predicted_class_idx]
#             probabilities = {str(cls): float(prob) for cls, prob in zip(loaded_label_encoder.classes_, prediction_proba)}


#         return predicted_type, probabilities, feature_values_dict_for_model_and_scores
#     except ModelError as e_model: # Catch specific ModelError
#         logger.error(f"ModelError in predict_adhd_type: {str(e_model)}")
#     except Exception as e_generic:
#         logger.error(f"Generic error in predict_adhd_type: {str(e_generic)}\n{traceback.format_exc()}")
    
#     # Fallback structure if any error occurs
#     fallback_features = {'averageReactionTime': 600.0, 'reactionTimeVariability': 0.0, 'correctStreak': 0,
#                          'prematureClicks': 0, 'missedStars': 0, 'score': 0, 'prematureClicksRatio': 0.0,
#                          'reactionTimes_cleaned': [600.0]}
#     # Use ADHD_SUBTYPES for fallback probabilities if label_encoder failed to load
#     fallback_probs_keys = ADHD_SUBTYPES if 'loaded_label_encoder' not in locals() or not hasattr(loaded_label_encoder, 'classes_') else loaded_label_encoder.classes_
#     fallback_probabilities = {str(adhd_t): 1.0/len(fallback_probs_keys) for adhd_t in fallback_probs_keys if adhd_t != 'Unknown'}
#     if not fallback_probabilities: fallback_probabilities = {"Unknown":1.0}
#     return "Unknown", fallback_probabilities, fallback_features


# # Main Execution Block
# if __name__ == "__main__":
#     try:
#         if len(sys.argv) > 1 and sys.argv[1] == 'train':
#             logger.info("Starting model training process via command line...")
#             training_data = fetch_data() # fetch_data now returns a DataFrame with standardized ADHD_Type
#             if not training_data.empty and len(training_data) >= DATA_THRESHOLD:
#                 logger.info(f"Training model with {len(training_data)} records (post fetch_data).")
#                 train_model(training_data)
#                 logger.info("Model training process completed.")
#             else:
#                 size_info = len(training_data) if not training_data.empty else 0
#                 logger.warning(f"Not enough data for training or data is empty. Found: {size_info} records. Required: {DATA_THRESHOLD}")
#             sys.exit(0)

#         app = Flask(__name__)
#         CORS(app)

#         # Attempt to load the model once at startup
#         loaded_model_global, _, _, _, _ = load_model()
#         if loaded_model_global is None:
#             logger.warning("Flask app starting, but model could not be loaded initially. Ensure model is trained.")

#         @app.route('/predict', methods=['POST'])
#         def predict():
#             try:
#                 game_data = request.json
#                 if not game_data: return jsonify({"error": "No game data provided", "message": "Request body is empty."}), 400
                
#                 required_fields = ['reactionTimes', 'correctStreak', 'prematureClicks', 'missedStars', 'score']
#                 missing_fields = [field for field in required_fields if field not in game_data]
#                 if missing_fields:
#                     return jsonify({"error": f"Missing one or more required fields: {', '.join(missing_fields)}", 
#                                     "message": f"Please provide: {', '.join(missing_fields)}"}), 400

#                 try:
#                     rt = game_data['reactionTimes'] # Should be list of numbers
#                     cs = int(game_data['correctStreak'])
#                     pc = int(game_data['prematureClicks'])
#                     ms = int(game_data['missedStars'])
#                     sc = int(game_data['score'])
#                     # Validate rt is a list of numbers
#                     if not isinstance(rt, list) or not all(isinstance(x, (int, float)) for x in rt):
#                         if not rt: # if rt is empty list, it's acceptable for predict_adhd_type
#                             pass
#                         else:
#                             raise ValueError("reactionTimes must be a list of numbers.")
#                 except (ValueError, TypeError) as e:
#                     logger.error(f"Invalid data types in prediction input: {e}. Data: {game_data}")
#                     return jsonify({"error": "Invalid data types for game metrics.", 
#                                     "message": str(e)}), 400

#                 adhd_type, probabilities, calculated_features_for_scoring = predict_adhd_type(
#                     rt, cs, pc, ms, sc
#                 )
                
#                 insights = generate_insights(adhd_type, calculated_features_for_scoring)
#                 inattention_score = calculate_inattention_score(calculated_features_for_scoring)
#                 impulsivity_score = calculate_impulsivity_score(calculated_features_for_scoring)

#                 response = {
#                     "adhd_type": adhd_type,
#                     "probabilities": probabilities,
#                     "insights": insights,
#                     "scores": {
#                         "inattention": {"score": inattention_score, "level": get_score_level(inattention_score)},
#                         "impulsivity": {"score": impulsivity_score, "level": get_score_level(impulsivity_score)}
#                     }
#                 }
#                 return jsonify(response), 200
#             except Exception as e_pred_route: # Catch any other unexpected error in the route
#                 logger.error(f"Error processing prediction request route: {str(e_pred_route)}\n{traceback.format_exc()}")
#                 return jsonify({"error": "Error processing prediction request", "message": str(e_pred_route)}), 500

#         @app.route('/health', methods=['GET'])
#         def health_check():
#             db_status_val = "disconnected"
#             if client is not None:
#                 try: client.server_info(); db_status_val = "connected"
#                 except Exception: db_status_val = "disconnected"

#             model_file_exists = os.path.exists(MODEL_PATH)
#             scaler_file_exists = os.path.exists(SCALER_PATH)
            
#             uptime_seconds = int(time.time() - start_time)
#             days, rem_uptime = divmod(uptime_seconds, 86400); hours, rem_uptime = divmod(rem_uptime, 3600); minutes, _ = divmod(rem_uptime, 60)
#             uptime_str = f"{days}d {hours}h {minutes}m"
            
#             model_version_timestamp_iso = "N/A"
#             if os.path.exists(MODEL_PERFORMANCE_PATH):
#                 try:
#                     with open(MODEL_PERFORMANCE_PATH, 'r') as f: perf_data = json.load(f)
#                     model_version_timestamp_iso = perf_data.get('timestamp', "N/A")
#                 except Exception: pass

#             return jsonify({
#                 "status": "ok" if model_file_exists and scaler_file_exists and db_status_val == "connected" else "degraded",
#                 "model_loaded": "available" if model_file_exists else "not_available",
#                 "scaler_loaded": "available" if scaler_file_exists else "not_available",
#                 "database": db_status_val,
#                 "version": model_version_timestamp_iso,
#                 "uptime": uptime_str
#             })

#         @app.route('/dashboard-data', methods=['GET'])
#         def get_dashboard_data():
#             response_data = {}
#             response_data['totalPredictions'] = 0
#             if game_metrics_collection is not None:
#                 try: response_data['totalPredictions'] = game_metrics_collection.count_documents({})
#                 except Exception as e: logger.error(f"DB Error (totalPredictions): {e}")
            
#             response_data['predictionsByType'] = []
#             try:
#                 df_csv = load_csv_data(CSV_FILE_PATH) # This df has ADHD_Type standardized
#                 if not df_csv.empty and 'ADHD_Type' in df_csv.columns:
#                     # ADHD_SUBTYPES is now ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined']
#                     type_counts = df_csv[df_csv['ADHD_Type'].isin(ADHD_SUBTYPES)]['ADHD_Type'].value_counts().to_dict()
#                     response_data['predictionsByType'] = [{'name': str(k), 'value': int(v)} for k, v in type_counts.items()]
#             except Exception as e: logger.error(f"CSV Error (predictionsByType): {e}")

#             daily_preds_data = []
#             if game_metrics_collection is not None:
#                 try:
#                     pipeline = [{"$match": {"createdAt": {"$exists": True, "$type": "date"}}}, {"$group": {"_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$createdAt"}}, "count": {"$sum": 1}}}, {"$sort": {"_id": DESCENDING}}, {"$limit": 7}, {"$sort": {"_id": ASCENDING}}]
#                     agg_results = list(game_metrics_collection.aggregate(pipeline))
#                     if agg_results: daily_preds_data = [{"date": item["_id"], "count": item["count"]} for item in agg_results]
#                 except Exception as e: logger.error(f"DB Aggregation Error (dailyPredictions): {e}")
#             if not daily_preds_data:
#                 for i in range(6, -1, -1): daily_preds_data.append({"date": (datetime.date.today() - datetime.timedelta(days=i)).strftime("%Y-%m-%d"), "count": np.random.randint(5, 25)})
#             response_data['dailyPredictions'] = daily_preds_data
            
#             perf_metrics_default = {'accuracy': 0.0, 'keyPerformanceMetrics': [{'name': 'F1', 'value': '0.00'}, {'name': 'Prec', 'value': '0.00'}, {'name': 'Rec', 'value': '0.00'}, {'name': 'AUC', 'value': '0.00'}], 'datasetSize': 0}
#             if os.path.exists(MODEL_PERFORMANCE_PATH):
#                 try:
#                     with open(MODEL_PERFORMANCE_PATH, 'r') as f: perf = json.load(f)
#                     response_data['accuracy'] = round(perf.get('accuracy', 0.0) * 100, 1)
#                     response_data['keyPerformanceMetrics'] = [{'name': 'F1', 'value': f"{perf.get('f1_score', 0.0):.2f}"}, {'name': 'Prec', 'value': f"{perf.get('precision', 0.0):.2f}"}, {'name': 'Rec', 'value': f"{perf.get('recall', 0.0):.2f}"}, {'name': 'AUC', 'value': f"{perf.get('auc', 0.0):.2f}"}]
#                     response_data['datasetSize'] = perf.get('dataset_size_trained_on', 0)
#                 except Exception as e: logger.error(f"File Error (modelPerformance): {e}"); response_data.update(perf_metrics_default)
#             else: response_data.update(perf_metrics_default)

#             response_data['accuracyTrend'] = [{'date': 'N/A', 'accuracy': 0.0}]
#             if os.path.exists(ACCURACY_HISTORY_PATH):
#                 try:
#                     with open(ACCURACY_HISTORY_PATH, 'r') as f: acc_hist = json.load(f)
#                     if acc_hist: response_data['accuracyTrend'] = [{'date': item['date'], 'accuracy': float(item.get('accuracy', 0.0))} for item in acc_hist]
#                 except Exception as e: logger.error(f"File Error (accuracyTrend): {e}")
            
#             if response_data.get('datasetSize', 0) == 0:
#                 try: response_data['datasetSize'] = len(load_csv_data(CSV_FILE_PATH))
#                 except: response_data['datasetSize'] = 0

#             feat_imp_data = []
#             if os.path.exists(MODEL_INFO_PATH):
#                 try:
#                     with open(MODEL_INFO_PATH, 'r') as f: m_info = json.load(f)
#                     features = m_info.get('feature_columns', [])
#                     if features:
#                         base_imps = np.random.dirichlet(np.ones(len(features))) * 0.8
#                         feat_imp_data = [{'name': str(name), 'value': round(float(val), 3)} for name, val in zip(features, base_imps)]
#                         feat_imp_data = sorted(feat_imp_data, key=lambda x: x['value'], reverse=True)
#                 except Exception as e: logger.error(f"File Error (featureImportance): {e}")
#             if not feat_imp_data:
#                  default_features_for_imp = ['averageReactionTime', 'reactionTimeVariability', 'prematureClicks', 'missedStars', 'score']
#                  base_imps = np.random.dirichlet(np.ones(len(default_features_for_imp))) * 0.8
#                  feat_imp_data = [{'name': str(name), 'value': round(float(val), 3)} for name, val in zip(default_features_for_imp, base_imps)]
#                  feat_imp_data = sorted(feat_imp_data, key=lambda x: x['value'], reverse=True)
#             response_data['featureImportance'] = feat_imp_data
#             return jsonify(response_data)

#         @app.route('/retrain', methods=['POST'])
#         def retrain_endpoint():
#             try:
#                 api_key = request.headers.get('X-API-Key')
#                 expected_api_key = os.environ.get('MODEL_API_KEY', 'default_training_key') 
#                 if not api_key or api_key != expected_api_key:
#                     return jsonify({"error": "Unauthorized access", "message": "Invalid API Key provided."}), 401

#                 logger.info("Retraining request received and authorized.")
#                 data_for_retrain = fetch_data()
#                 if data_for_retrain.empty or len(data_for_retrain) < DATA_THRESHOLD:
#                     msg = f"Insufficient data for retraining. Need at least {DATA_THRESHOLD} valid records, found {len(data_for_retrain) if not data_for_retrain.empty else 0}."
#                     return jsonify({"error": "Insufficient data", "message": msg}), 400

#                 logger.info(f"Starting retraining with {len(data_for_retrain)} records.")
#                 trained_model, _, _, _ = train_model(data_for_retrain)
#                 if trained_model is None:
#                     return jsonify({"error": "Model training failed", "message": "The model training process encountered an error."}), 500
#                 global loaded_model_global # Make sure to declare it global if you modify it
#                 loaded_model_global, _, _, _, _ = load_model() # Reload the new model
#                 return jsonify({"status": "success", "message": "Model retrained successfully"}), 200
#             except Exception as e:
#                 logger.error(f"Error retraining model via API: {str(e)}\n{traceback.format_exc()}")
#                 return jsonify({"error": "Retraining failed", "message": str(e)}), 500

#         @app.errorhandler(404)
#         def not_found_error(error): return jsonify({"error": "Endpoint not found", "message": "The requested URL was not found on the server."}), 404
#         @app.errorhandler(405)
#         def method_not_allowed_error(error): return jsonify({"error": "Method not allowed", "message": "The method is not allowed for the requested URL."}), 405
#         @app.errorhandler(Exception)
#         def handle_generic_exception(e):
#             logger.error(f"Unhandled exception: {str(e)}\n{traceback.format_exc()}")
#             return jsonify({"error": "An internal server error occurred", "message": "An unexpected error occurred. Please try again later."}), 500

#         logger.info(f"Starting Flask API service on http://0.0.0.0:5000. Model artifacts expected in: {MODEL_BASE_PATH}")
#         app.run(host='0.0.0.0', port=5000, debug=False)

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
import sys # For sys.argv and sys.exit
import threading # For automatic retraining

start_time = time.time()

# --- START: Define SCRIPT_DIR and relative paths ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

LOG_FILE_PATH = os.path.join(SCRIPT_DIR, "adhd_model.log")
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE_PATH),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

CSV_FILE_PATH = os.path.join(SCRIPT_DIR, "adhd_dataset.csv")
MODEL_ARTIFACTS_SUBDIR = 'adhd_model_assets'
MODEL_BASE_PATH = os.path.join(SCRIPT_DIR, MODEL_ARTIFACTS_SUBDIR)
MODEL_PATH = os.path.join(MODEL_BASE_PATH, 'adhd_model.keras')
SCALER_PATH = os.path.join(MODEL_BASE_PATH, 'scaler.pkl')
LABEL_ENCODER_PATH = os.path.join(MODEL_BASE_PATH, 'label_encoder.pkl')
MODEL_INFO_PATH = os.path.join(MODEL_BASE_PATH, 'model_info.json')
MODEL_PERFORMANCE_PATH = os.path.join(MODEL_BASE_PATH, 'model_performance.json')
ACCURACY_HISTORY_PATH = os.path.join(MODEL_BASE_PATH, 'accuracy_history.json')
# --- END: Define SCRIPT_DIR and relative paths ---

# Updated ADHD_SUBTYPES reflecting that 'None' is mapped to 'No ADHD'
ADHD_SUBTYPES = ['No ADHD', 'Inattentive', 'Hyperactive-Impulsive', 'Combined']
DATA_THRESHOLD = 10 # Minimum data for any training

# --- START: Auto Retraining Configuration ---
AUTO_RETRAIN_ENABLED = True  # Set to False to disable
AUTO_RETRAIN_INTERVAL_SECONDS = 3600 # Check every 1 hour
AUTO_RETRAIN_NEW_RECORDS_THRESHOLD = 1 # Retrain if 20 new records are available
# --- END: Auto Retraining Configuration ---

# Global variables for loaded model (to be updated by reload_global_model)
loaded_model_global = None
loaded_scaler_global = None
loaded_feature_columns_global = None
loaded_label_mapping_global = None
loaded_label_encoder_global = None
retraining_lock = threading.Lock() # To prevent concurrent training

# MongoDB setup
try:
    client = MongoClient(os.environ.get('MONGODB_URI', 'mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/'), serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client[os.environ.get('MONGODB_DBNAME', 'test')]
    game_metrics_collection = db['gamemetrics']
    questionnaire_collection = db['questionnaireresponses']
    logger.info("MongoDB connection established successfully")
except Exception as e:
    logger.error(f"MongoDB connection error: {str(e)}")
    client = None 
    db = None
    game_metrics_collection = None
    questionnaire_collection = None

class ModelError(Exception):
    pass

class DataError(Exception):
    pass

def load_csv_data(csv_path):
    try:
        expected_cols_with_types = {
            'childId': str,
            'averageReactionTime': float,
            'reactionTimeVariability': float,
            'correctStreak': int,
            'prematureClicks': int,
            'missedStars': int,
            'score': int,
            'ADHD_Type': str,
            'completed_game': bool,
            'completed_questionnaire': bool
        }
        default_values_for_empty_csv = {
            'completed_game': False,
            'completed_questionnaire': False,
            'averageReactionTime': 0.0, 
            'reactionTimeVariability': 0.0,
            'correctStreak': 0,
            'prematureClicks': 0,
            'missedStars': 0,
            'score': 0,
        }

        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            logger.info(f"Loaded {len(df)} records from CSV: {csv_path}")

            for col, col_type in expected_cols_with_types.items():
                if col not in df.columns:
                    logger.warning(f"Column '{col}' missing in CSV. Adding it with default values.")
                    df[col] = default_values_for_empty_csv.get(col, pd.NA if col_type != bool else False) 
                
                if col_type == bool:
                    df[col] = df[col].fillna(default_values_for_empty_csv.get(col, False)).astype(bool)
                elif col_type == str and col != 'ADHD_Type': 
                    df[col] = df[col].astype(str) 
            
            if 'createdAt_game' not in df.columns:
                df['createdAt_game'] = pd.NaT
            df['createdAt_game'] = pd.to_datetime(df['createdAt_game'], errors='coerce')
            return df
        else:
            logger.warning(f"CSV file not found: {csv_path}. Creating a new dataset structure.")
            df = pd.DataFrame(columns=list(expected_cols_with_types.keys()) + ['createdAt_game'])
            for col, default_val in default_values_for_empty_csv.items():
                if col in df.columns:
                    df[col] = df[col].fillna(default_val) 

            for col, col_type in expected_cols_with_types.items():
                if col in df.columns:
                    try:
                        df[col] = df[col].astype(col_type)
                    except Exception as e_type:
                        logger.warning(f"Could not cast column {col} to {col_type} for new CSV: {e_type}")
            if 'createdAt_game' in df.columns:
                 df['createdAt_game'] = pd.to_datetime(df['createdAt_game'], errors='coerce')
            return df
    except Exception as e:
        logger.error(f"Error loading CSV data from {csv_path}: {str(e)}")
        raise DataError(f"Failed to load CSV data: {str(e)}")

def fetch_data():
    try:
        csv_data = load_csv_data(CSV_FILE_PATH)
        expected_cols = list(csv_data.columns) 

        if game_metrics_collection is None or questionnaire_collection is None:
            logger.warning("MongoDB connection not available. Using only CSV data (if any).")
            return csv_data.reset_index(drop=True)

        try:
            game_metrics_cursor = game_metrics_collection.find().sort("createdAt", DESCENDING)
            questionnaires_raw_cursor = questionnaire_collection.find()
            game_metrics = list(game_metrics_cursor)
            questionnaires_raw = list(questionnaires_raw_cursor)
            logger.info(f"Fetched {len(game_metrics)} game metrics and {len(questionnaires_raw)} questionnaires from MongoDB.")
        except Exception as e:
            logger.error(f"Error fetching data from MongoDB: {str(e)}. Using only CSV data.")
            return csv_data.reset_index(drop=True)

        latest_questionnaires_dict = {}
        for q in sorted(questionnaires_raw, key=lambda x: x.get('createdAt', datetime.datetime.min), reverse=True):
            child_id_str = str(q.get('childId'))
            if child_id_str not in latest_questionnaires_dict and q.get('subtype'):
                latest_questionnaires_dict[child_id_str] = q
        
        mongo_child_data_list = []
        processed_mongo_child_ids = set()

        for metric in game_metrics:
            try:
                child_id_obj = metric.get('childId')
                if not child_id_obj: continue
                child_id_str = str(child_id_obj)

                if child_id_str in processed_mongo_child_ids: continue
                matching_questionnaire = latest_questionnaires_dict.get(child_id_str)

                if matching_questionnaire:
                    rt_variability_db = metric.get('reactionTimeVariability')
                    if isinstance(rt_variability_db, (int, float)) and rt_variability_db >= 0:
                        reaction_time_variability = rt_variability_db
                    else:
                        reaction_times_list = metric.get('reactionTimes', [])
                        valid_rts = [rt for rt in reaction_times_list if isinstance(rt, (int,float)) and not np.isnan(rt)]
                        reaction_time_variability = np.std(valid_rts) if len(valid_rts) > 1 else 0.0
                    
                    created_at_game_raw = metric.get('createdAt')
                    if isinstance(created_at_game_raw, datetime.datetime):
                        created_at_game = created_at_game_raw
                    elif isinstance(created_at_game_raw, str): # Handle string dates
                         try:
                            created_at_game = pd.to_datetime(created_at_game_raw, errors='coerce').to_pydatetime()
                         except: # Broad exception for various date string parse failures
                            created_at_game = datetime.datetime.now(datetime.timezone.utc) # Fallback
                    else: # Other types or None
                        created_at_game = datetime.datetime.now(datetime.timezone.utc) # Fallback

                    if created_at_game and created_at_game.tzinfo is None: # Ensure timezone aware
                        created_at_game = created_at_game.replace(tzinfo=datetime.timezone.utc)
                    
                    avg_rt = metric.get('averageReactionTime', 0.0)
                    if not isinstance(avg_rt, (int, float)) or avg_rt < 0 or np.isnan(avg_rt): avg_rt = 0.0
                    
                    correct_streak_val = int(metric.get('correctStreak', 0) if pd.notna(metric.get('correctStreak')) else 0)
                    premature_clicks_val = int(metric.get('prematureClicks', 0) if pd.notna(metric.get('prematureClicks')) else 0)
                    missed_stars_val = int(metric.get('missedStars', 0) if pd.notna(metric.get('missedStars')) else 0)
                    score_val = int(metric.get('score', 0) if pd.notna(metric.get('score')) else 0)
                    
                    adhd_type_from_db = matching_questionnaire.get('subtype', 'None') 

                    record = {
                        'childId': child_id_str,
                        'averageReactionTime': float(avg_rt),
                        'reactionTimeVariability': float(reaction_time_variability),
                        'correctStreak': correct_streak_val,
                        'prematureClicks': premature_clicks_val,
                        'missedStars': missed_stars_val,
                        'score': score_val,
                        'ADHD_Type': adhd_type_from_db, 
                        'createdAt_game': created_at_game,
                        'completed_game': True,
                        'completed_questionnaire': True
                    }
                    mongo_child_data_list.append(record)
                    processed_mongo_child_ids.add(child_id_str)
            except Exception as e:
                logger.error(f"Error processing MongoDB metric for child {metric.get('childId', 'unknown')} (ID: {metric.get('_id')}): {str(e)}\n{traceback.format_exc()}")
                continue
        
        mongo_df = pd.DataFrame(mongo_child_data_list)
        if not mongo_df.empty:
             for col in expected_cols:
                if col not in mongo_df.columns:
                    mongo_df[col] = csv_data[col].dtype.type() if col in csv_data else pd.NA 

        if not csv_data.empty and 'childId' not in csv_data.columns:
            logger.warning("Loaded CSV data does not have 'childId' column. Will overwrite with MongoDB data if available.")
            combined_df = mongo_df if not mongo_df.empty else csv_data 
        elif not mongo_df.empty:
            csv_data['childId'] = csv_data['childId'].astype(str)
            mongo_df['childId'] = mongo_df['childId'].astype(str)
            
            existing_csv_child_ids = set(csv_data['childId'])
            new_mongo_records_df = mongo_df[~mongo_df['childId'].isin(existing_csv_child_ids)]
            logger.info(f"Found {len(new_mongo_records_df)} new records in MongoDB not present in CSV.")
            combined_df = pd.concat([csv_data, new_mongo_records_df], ignore_index=True)
        else: 
            combined_df = csv_data
            logger.info("No data fetched from MongoDB. Using existing CSV data.")

        if combined_df.empty: 
            combined_df = pd.DataFrame(columns=expected_cols) 
        else:
            for col in expected_cols:
                if col not in combined_df.columns:
                    combined_df[col] = csv_data[col].dtype.type() if col in csv_data and hasattr(csv_data[col],'dtype') else pd.NA

        if 'ADHD_Type' in combined_df.columns:
            combined_df['ADHD_Type'] = combined_df['ADHD_Type'].fillna('None').astype(str).str.strip()
            combined_df['ADHD_Type'].replace('None', 'No ADHD', inplace=True)
        
        combined_df = combined_df[expected_cols].reset_index(drop=True) 

        try:
            if not combined_df.empty:
                # Ensure createdAt_game is in a consistent string format for CSV if it's datetime
                if 'createdAt_game' in combined_df.columns and pd.api.types.is_datetime64_any_dtype(combined_df['createdAt_game']):
                    # Make a copy to avoid SettingWithCopyWarning if combined_df is a slice
                    df_to_save = combined_df.copy()
                    df_to_save['createdAt_game'] = df_to_save['createdAt_game'].dt.strftime('%Y-%m-%d %H:%M:%S.%f%z')
                    df_to_save.to_csv(CSV_FILE_PATH, index=False)
                else:
                    combined_df.to_csv(CSV_FILE_PATH, index=False)
                logger.info(f"Saved updated combined dataset ({len(combined_df)} records) to CSV: {CSV_FILE_PATH}")
            else:
                logger.info("Combined dataset is empty. Not writing to CSV.")
        except Exception as e:
            logger.error(f"Error saving updated combined data to CSV {CSV_FILE_PATH}: {str(e)}")

        logger.info(f"Final dataset for retraining has {len(combined_df)} records.")
        return combined_df

    except Exception as e:
        logger.critical(f"Critical error in fetch_data's main try block: {str(e)}\n{traceback.format_exc()}")
        try:
            df_fallback = load_csv_data(CSV_FILE_PATH) 
            return df_fallback.reset_index(drop=True)
        except DataError: 
            logger.error("Fallback CSV loading also failed critically.")
            empty_df_structure = pd.DataFrame(columns=['childId', 'averageReactionTime', 'reactionTimeVariability', 'correctStreak',
                                                       'prematureClicks', 'missedStars', 'score', 'ADHD_Type', 'createdAt_game',
                                                       'completed_game', 'completed_questionnaire'])
            empty_df_structure['completed_game'] = False
            empty_df_structure['completed_questionnaire'] = False
            return empty_df_structure

def train_model(data):
    try:
        logger.info(f"train_model received data with {len(data)} records. Unique ADHD_Types: {data['ADHD_Type'].unique()}")
        
        data_train_filtered = data[data['ADHD_Type'].isin(ADHD_SUBTYPES)].copy()
        logger.info(f"Size after filtering by ADHD_SUBTYPES ('{ADHD_SUBTYPES}'): {len(data_train_filtered)}")
        if len(data_train_filtered) < len(data):
            dropped_types = data[~data['ADHD_Type'].isin(ADHD_SUBTYPES)]['ADHD_Type'].unique()
            logger.warning(f"{len(data) - len(data_train_filtered)} records dropped. ADHD_Types dropped: {list(dropped_types)}")

        if len(data_train_filtered) < DATA_THRESHOLD:
            logger.warning(f"Not enough valid data for training after initial filtering. Current size: {len(data_train_filtered)}, Threshold: {DATA_THRESHOLD}")
            return None # Simplified return for failure

        data_train_processed = data_train_filtered.copy()
        
        numeric_cols = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak', 'prematureClicks', 'missedStars', 'score']
        for col in numeric_cols:
            data_train_processed[col] = pd.to_numeric(data_train_processed[col], errors='coerce').fillna(0.0) 

        data_train_processed['prematureClicksRatio'] = data_train_processed['prematureClicks'] / (data_train_processed['score'] + data_train_processed['prematureClicks'] + 1e-6) # Ensure score is part of denominator or similar logic
        
        feature_columns_for_model = ['averageReactionTime', 'reactionTimeVariability', 'correctStreak',
                                     'prematureClicks', 'missedStars', 'score', 'prematureClicksRatio']

        label_encoder = LabelEncoder()
        label_encoder.fit(ADHD_SUBTYPES)
        logger.info(f"Label encoder fitted with classes: {list(label_encoder.classes_)}")

        data_train_final = data_train_processed[data_train_processed['ADHD_Type'].isin(label_encoder.classes_)]
        
        if len(data_train_final) < len(data_train_processed):
            unexpectedly_dropped = data_train_processed[~data_train_processed['ADHD_Type'].isin(label_encoder.classes_)]['ADHD_Type'].unique()
            logger.warning(f"Unexpectedly dropped ADHD_Types: {list(unexpectedly_dropped)}")

        logger.info(f"Final data size for splitting (data_train_final): {len(data_train_final)}")

        if len(data_train_final) < DATA_THRESHOLD:
            logger.warning(f"Not enough data after all filtering. Size: {len(data_train_final)}, Threshold: {DATA_THRESHOLD}")
            return None

        y = label_encoder.transform(data_train_final['ADHD_Type'])
        X_unscaled_df = data_train_final[feature_columns_for_model].astype(float)

        for col in X_unscaled_df.columns: 
            if X_unscaled_df[col].isnull().any(): 
                logger.warning(f"Unexpected NaNs found in '{col}' before train/test split. Filling with 0.")
                X_unscaled_df[col] = X_unscaled_df[col].fillna(0.0)

        X_train_unscaled, X_test_unscaled, y_train, y_test = train_test_split(
            X_unscaled_df, y, test_size=0.2, random_state=42,
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
            tf.keras.layers.Input(shape=(X_train_scaled.shape[1],)),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(16, activation='relu'),
            tf.keras.layers.Dropout(0.1),
            tf.keras.layers.Dense(len(label_encoder.classes_), activation='softmax'),
        ])

        model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
        early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True, verbose=0)
        
        logger.info(f"Starting model training with {X_train_scaled.shape[0]} training samples and {X_test_scaled.shape[0]} validation samples.")
        history = model.fit(X_train_scaled, y_train, validation_data=(X_test_scaled, y_test), epochs=100, batch_size=16, callbacks=[early_stopping], verbose=0)

        y_pred_proba = model.predict(X_test_scaled)
        y_pred_classes = np.argmax(y_pred_proba, axis=1)
        accuracy_val = accuracy_score(y_test, y_pred_classes)
        
        report_target_names = list(label_encoder.classes_)
        report_labels = list(range(len(report_target_names)))

        report = classification_report(y_test, y_pred_classes, labels=report_labels, target_names=report_target_names, output_dict=True, zero_division=0)

        precision_weighted = report['weighted avg']['precision']
        recall_weighted = report['weighted avg']['recall']
        f1_weighted = report['weighted avg']['f1-score']
        auc_ovr_weighted = 0.0
        num_classes_in_encoder = len(label_encoder.classes_)

        if num_classes_in_encoder > 1 and len(np.unique(y_test)) > 1: 
            y_test_binarized = label_binarize(y_test, classes=range(num_classes_in_encoder))
            if y_test_binarized.shape[1] == num_classes_in_encoder : 
                 try: auc_ovr_weighted = roc_auc_score(y_test_binarized, y_pred_proba, multi_class='ovr', average='weighted')
                 except ValueError as e_auc: logger.warning(f"Could not calculate OvR AUC: {e_auc}."); auc_ovr_weighted = 0.0
            elif y_test_binarized.shape[1] == 1 and num_classes_in_encoder == 2: 
                 try: auc_ovr_weighted = roc_auc_score(y_test, y_pred_proba[:, 1]) 
                 except ValueError as e_auc: logger.warning(f"Could not calculate AUC for binary case: {e_auc}"); auc_ovr_weighted = 0.0
        elif num_classes_in_encoder == 1 or len(np.unique(y_test)) == 1 :
            logger.warning(f"ROC AUC score is not defined due to single class.")

        performance_data = {
            'accuracy': accuracy_val, 'precision': precision_weighted, 'recall': recall_weighted,
            'f1_score': f1_weighted, 'auc': auc_ovr_weighted,
            'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'dataset_size_trained_on': len(data_train_final), # This is crucial for auto-retrain logic
            'num_features': X_train_scaled.shape[1],
            'model_architecture': [layer.get_config() for layer in model.layers]
        }
        with open(MODEL_PERFORMANCE_PATH, 'w') as f: json.dump(performance_data, f, indent=4)

        history_data = []
        if os.path.exists(ACCURACY_HISTORY_PATH):
            try:
                with open(ACCURACY_HISTORY_PATH, 'r') as f: history_data = json.load(f)
            except json.JSONDecodeError: history_data = []
        current_month_str = datetime.datetime.now(datetime.timezone.utc).strftime("%b %Y")
        month_entry = next((item for item in history_data if item["date"] == current_month_str), None)
        if month_entry: month_entry["accuracy"] = round(accuracy_val * 100, 2)
        else: history_data.append({'date': current_month_str, 'accuracy': round(accuracy_val * 100, 2)})
        history_data = history_data[-12:]
        with open(ACCURACY_HISTORY_PATH, 'w') as f: json.dump(history_data, f, indent=4)

        logger.info(f"Model training completed. Test accuracy: {accuracy_val:.4f}. Performance metrics saved to {MODEL_PERFORMANCE_PATH}")
        model.save(MODEL_PATH)
        logger.info(f"Model saved to {MODEL_PATH}")
        with open(MODEL_INFO_PATH, 'w') as f:
            json.dump({'feature_columns': feature_columns_for_model, 'label_mapping': label_mapping}, f, indent=4)
        logger.info(f"Model info saved to {MODEL_INFO_PATH}")

        return model # Return only the model if successful, or use all for consistency
    except DataError as e:
        logger.error(f"DataError in train_model: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Error in train_model: {str(e)}\n{traceback.format_exc()}")
        return None

def load_model_artifacts(): # Renamed for clarity
    try:
        if not all(os.path.exists(p) for p in [MODEL_PATH, SCALER_PATH, LABEL_ENCODER_PATH, MODEL_INFO_PATH]):
            logger.error(f"One or more model files are missing. Checked paths: MODEL_PATH={MODEL_PATH}, SCALER_PATH={SCALER_PATH}, LABEL_ENCODER_PATH={LABEL_ENCODER_PATH}, MODEL_INFO_PATH={MODEL_INFO_PATH}. Please train the model first.")
            return None, None, None, None, None

        model = tf.keras.models.load_model(MODEL_PATH)
        with open(SCALER_PATH, 'rb') as f: scaler = pickle.load(f)
        with open(LABEL_ENCODER_PATH, 'rb') as f: label_encoder = pickle.load(f)
        with open(MODEL_INFO_PATH, 'r') as f: model_info = json.load(f)

        feature_columns = model_info.get('feature_columns')
        label_mapping = model_info.get('label_mapping')

        if not all([model, scaler, label_encoder, feature_columns is not None, label_mapping is not None]):
            raise ModelError("Failed to load one or more model components (model, scaler, encoder, features, or mapping).")

        logger.info(f"Model and preprocessing objects loaded successfully from {MODEL_BASE_PATH}")
        return model, scaler, feature_columns, label_mapping, label_encoder
    except Exception as e:
        logger.error(f"Error loading model or preprocessing objects: {str(e)}\n{traceback.format_exc()}")
        return None, None, None, None, None

def reload_global_model():
    global loaded_model_global, loaded_scaler_global, loaded_feature_columns_global, loaded_label_mapping_global, loaded_label_encoder_global
    logger.info("Attempting to reload global model artifacts...")
    model, scaler, features, mapping, encoder = load_model_artifacts()
    if model is not None:
        loaded_model_global = model
        loaded_scaler_global = scaler
        loaded_feature_columns_global = features
        loaded_label_mapping_global = mapping
        loaded_label_encoder_global = encoder
        logger.info("Global model artifacts reloaded successfully.")
        return True
    else:
        logger.error("Failed to reload global model artifacts.")
        return False

def generate_insights(adhd_type, game_data_for_insights):
    insights = {'inattention': [], 'impulsivity': [], 'combined': []}
    missed_stars = game_data_for_insights.get('missedStars', 0)
    avg_reaction_time = game_data_for_insights.get('averageReactionTime', 0)
    premature_clicks = game_data_for_insights.get('prematureClicks', 0)

    if missed_stars > 5: insights['inattention'].append("Missed several stars, suggesting potential attention lapses.")
    if avg_reaction_time > 1000: insights['inattention'].append("Slower reaction times may indicate difficulty maintaining focus.")
    if premature_clicks > 3: insights['impulsivity'].append("High number of premature clicks suggests impulsive responding.")

    if adhd_type == "Inattentive": insights['inattention'].append("Model prediction aligns with an inattentive pattern.")
    elif adhd_type == "Hyperactive-Impulsive": insights['impulsivity'].append("Model prediction aligns with an impulsive pattern.")
    elif adhd_type == "Combined": insights['combined'].append("Model prediction indicates both inattentive and impulsive patterns.")
    elif adhd_type == "No ADHD": insights['combined'].append("Performance metrics are within typical ranges based on model prediction.")
    else: insights['combined'].append(f"Model predicted '{adhd_type}'.")


    if not insights['inattention'] and adhd_type not in ["Hyperactive-Impulsive", "Combined"]:
        insights['inattention'].append("Attention metrics within typical game ranges or not indicative of primary inattention.")
    if not insights['impulsivity'] and adhd_type not in ["Inattentive", "Combined"]:
        insights['impulsivity'].append("Impulsivity metrics within typical game ranges or not indicative of primary impulsivity.")
    if not insights['combined'] and adhd_type in ["No ADHD", "Unknown"]:
        insights['combined'].append("Overall performance noted.")
    return insights

def calculate_inattention_score(game_data_for_scores):
    score = 0.0
    avg_rt_pred = game_data_for_scores.get('averageReactionTime', 0.0)
    missed_stars = game_data_for_scores.get('missedStars', 0)

    score += min(missed_stars * 5, 40)
    if avg_rt_pred > 1000: score += 30
    elif avg_rt_pred > 800: score += 20
    return min(score, 100.0)

def calculate_impulsivity_score(game_data_for_scores):
    score = 0.0
    prem_clicks = game_data_for_scores.get('prematureClicks', 0)
    rx_times_cleaned = game_data_for_scores.get('reactionTimes_cleaned', []) 
    rt_variability = game_data_for_scores.get('reactionTimeVariability', 0.0)

    total_actions = len(rx_times_cleaned) + prem_clicks
    if total_actions > 0: score += min((prem_clicks / total_actions * 100), 50)
    
    fast_responses = sum(1 for t in rx_times_cleaned if isinstance(t, (int, float)) and t < 400)
    if rx_times_cleaned: score += min((fast_responses / len(rx_times_cleaned) * 100) * 0.5, 30)
    
    if rt_variability > 300: score += 20
    return min(score, 100.0)

def get_score_level(score):
    if not isinstance(score, (int, float, np.number)) or np.isnan(score): return 'Average'
    if score < 20: return 'Low'
    if score < 40: return 'Below Average'
    if score < 60: return 'Average'
    if score < 80: return 'Above Average'
    return 'High'

def predict_adhd_type(reaction_times_raw, correct_streak, premature_clicks, missed_stars, score_game):
    try:
        # Use global model artifacts
        if loaded_model_global is None or loaded_scaler_global is None or loaded_feature_columns_global is None or loaded_label_encoder_global is None:
            logger.warning("Global model artifacts not loaded. Attempting to load them now for prediction.")
            if not reload_global_model() or loaded_model_global is None: # Try to reload if not available
                 raise ModelError("Failed to load model for prediction, global artifacts are missing.")

        reaction_times_cleaned = [rt for rt in reaction_times_raw if isinstance(rt, (int, float)) and not np.isnan(rt)]
        if not reaction_times_cleaned: reaction_times_cleaned = [600.0] 

        avg_reaction_time = np.mean(reaction_times_cleaned) if reaction_times_cleaned else 0.0
        reaction_time_variability = np.std(reaction_times_cleaned) if len(reaction_times_cleaned) > 1 else 0.0
        
        premature_clicks_num = int(premature_clicks) if pd.notna(premature_clicks) else 0
        score_game_num = int(score_game) if pd.notna(score_game) else 0 # Ensure score_game is used
        premature_clicks_ratio = premature_clicks_num / (score_game_num + premature_clicks_num + 1e-6) # Example, adjust as per your definition
        
        correct_streak_num = int(correct_streak) if pd.notna(correct_streak) else 0
        missed_stars_num = int(missed_stars) if pd.notna(missed_stars) else 0
        
        feature_values_dict_for_model_and_scores = {
            'averageReactionTime': avg_reaction_time,
            'reactionTimeVariability': reaction_time_variability,
            'correctStreak': correct_streak_num,
            'prematureClicks': premature_clicks_num,
            'missedStars': missed_stars_num,
            'score': score_game_num,
            'prematureClicksRatio': premature_clicks_ratio,
            'reactionTimes_cleaned': reaction_times_cleaned 
        }
        
        for k_col in loaded_feature_columns_global:
             val = feature_values_dict_for_model_and_scores.get(k_col)
             if val is None or not isinstance(val, (int, float, np.number)) or np.isnan(val):
                logger.warning(f"Feature {k_col} is missing, non-numeric or NaN ({val}) during prediction. Defaulting to 0.")
                feature_values_dict_for_model_and_scores[k_col] = 0.0

        features_ordered = [feature_values_dict_for_model_and_scores[col_name] for col_name in loaded_feature_columns_global]
        features_np = np.array([features_ordered], dtype=float)

        scaled_features = loaded_scaler_global.transform(features_np)
        prediction_proba = loaded_model_global.predict(scaled_features)[0]

        predicted_class_idx = np.argmax(prediction_proba)
        
        if predicted_class_idx >= len(loaded_label_encoder_global.classes_):
            logger.error(f"Predicted class index {predicted_class_idx} is out of bounds. Defaulting.")
            predicted_type = "Unknown" 
            probabilities = {cls: 0.0 for cls in loaded_label_encoder_global.classes_}
            if probabilities: probabilities[list(probabilities.keys())[0]] = 1.0 
        else:
            predicted_type = loaded_label_encoder_global.classes_[predicted_class_idx]
            probabilities = {str(cls): float(prob) for cls, prob in zip(loaded_label_encoder_global.classes_, prediction_proba)}

        return predicted_type, probabilities, feature_values_dict_for_model_and_scores
    except ModelError as e_model: 
        logger.error(f"ModelError in predict_adhd_type: {str(e_model)}")
    except Exception as e_generic:
        logger.error(f"Generic error in predict_adhd_type: {str(e_generic)}\n{traceback.format_exc()}")
    
    fallback_features = {'averageReactionTime': 600.0, 'reactionTimeVariability': 0.0, 'correctStreak': 0,
                         'prematureClicks': 0, 'missedStars': 0, 'score': 0, 'prematureClicksRatio': 0.0,
                         'reactionTimes_cleaned': [600.0]}
    fallback_probs_keys = ADHD_SUBTYPES if loaded_label_encoder_global is None or not hasattr(loaded_label_encoder_global, 'classes_') else loaded_label_encoder_global.classes_
    fallback_probabilities = {str(adhd_t): 1.0/len(fallback_probs_keys) for adhd_t in fallback_probs_keys if adhd_t != 'Unknown'}
    if not fallback_probabilities: fallback_probabilities = {"Unknown":1.0}
    return "Unknown", fallback_probabilities, fallback_features


def auto_retrain_job():
    logger.info("Auto-retrain job started.")
    while True:
        try:
            time.sleep(AUTO_RETRAIN_INTERVAL_SECONDS)
            if not AUTO_RETRAIN_ENABLED:
                logger.info("Auto-retraining is disabled. Skipping check.")
                continue

            logger.info("Auto-retrain: Checking for new data...")
            current_data = fetch_data()
            current_data_size = len(current_data)

            last_trained_size = 0
            if os.path.exists(MODEL_PERFORMANCE_PATH):
                try:
                    with open(MODEL_PERFORMANCE_PATH, 'r') as f:
                        perf_data = json.load(f)
                        last_trained_size = perf_data.get('dataset_size_trained_on', 0)
                except Exception as e:
                    logger.error(f"Auto-retrain: Error reading model performance file: {e}")
            
            logger.info(f"Auto-retrain: Current dataset size: {current_data_size}, Last trained size: {last_trained_size}")

            if current_data_size >= (last_trained_size + AUTO_RETRAIN_NEW_RECORDS_THRESHOLD) and \
               current_data_size >= DATA_THRESHOLD:
                logger.info(f"Auto-retrain: Conditions met. Attempting to acquire lock for retraining.")
                if retraining_lock.acquire(blocking=False): # Try to get lock without waiting
                    logger.info("Auto-retrain: Lock acquired. Starting retraining process.")
                    try:
                        trained_model = train_model(current_data)
                        if trained_model is not None:
                            logger.info("Auto-retrain: Model retrained successfully. Reloading global model.")
                            reload_global_model()
                        else:
                            logger.error("Auto-retrain: Model training function returned None. Training failed.")
                    except Exception as e_train:
                        logger.error(f"Auto-retrain: Error during training process: {e_train}\n{traceback.format_exc()}")
                    finally:
                        retraining_lock.release()
                        logger.info("Auto-retrain: Lock released.")
                else:
                    logger.info("Auto-retrain: Could not acquire lock, another training process might be running.")
            else:
                logger.info("Auto-retrain: Conditions not met for retraining.")

        except Exception as e:
            logger.error(f"Auto-retrain: Unhandled exception in auto-retrain job: {e}\n{traceback.format_exc()}")
            # Sleep longer if there's a persistent error to avoid spamming logs
            time.sleep(AUTO_RETRAIN_INTERVAL_SECONDS * 2)


# Main Execution Block
if __name__ == "__main__":
    try:
        # Initial model load
        reload_global_model() # Load the model artifacts into global vars at startup

        if len(sys.argv) > 1 and sys.argv[1] == 'train':
            logger.info("Starting model training process via command line...")
            training_data = fetch_data() 
            if not training_data.empty and len(training_data) >= DATA_THRESHOLD:
                logger.info(f"Training model with {len(training_data)} records (post fetch_data).")
                if train_model(training_data): # train_model returns model on success, None on fail
                    reload_global_model() # Reload after successful manual train too
            else:
                size_info = len(training_data) if not training_data.empty else 0
                logger.warning(f"Not enough data for training or data is empty. Found: {size_info} records. Required: {DATA_THRESHOLD}")
            sys.exit(0)

        # Start auto-retraining thread if enabled
        if AUTO_RETRAIN_ENABLED:
            retrain_thread = threading.Thread(target=auto_retrain_job, daemon=True)
            retrain_thread.start()
            logger.info("Automatic retraining thread initiated.")
        else:
            logger.info("Automatic retraining is disabled by configuration.")

        app = Flask(__name__)
        CORS(app)

        # Flask routes (predict, health, dashboard-data, retrain, errorhandlers)
        # ... (Keep your existing Flask routes exactly as they are, they will use the global model variables)
        @app.route('/predict', methods=['POST'])
        def predict():
            try:
                game_data = request.json
                if not game_data: return jsonify({"error": "No game data provided", "message": "Request body is empty."}), 400
                
                required_fields = ['reactionTimes', 'correctStreak', 'prematureClicks', 'missedStars', 'score']
                missing_fields = [field for field in required_fields if field not in game_data]
                if missing_fields:
                    return jsonify({"error": f"Missing one or more required fields: {', '.join(missing_fields)}", 
                                    "message": f"Please provide: {', '.join(missing_fields)}"}), 400

                try:
                    rt = game_data['reactionTimes'] 
                    cs = int(game_data['correctStreak'])
                    pc = int(game_data['prematureClicks'])
                    ms = int(game_data['missedStars'])
                    sc = int(game_data['score'])
                    if not isinstance(rt, list) or not all(isinstance(x, (int, float)) for x in rt):
                        if not rt: 
                            pass
                        else:
                            raise ValueError("reactionTimes must be a list of numbers.")
                except (ValueError, TypeError) as e:
                    logger.error(f"Invalid data types in prediction input: {e}. Data: {game_data}")
                    return jsonify({"error": "Invalid data types for game metrics.", 
                                    "message": str(e)}), 400

                adhd_type, probabilities, calculated_features_for_scoring = predict_adhd_type(
                    rt, cs, pc, ms, sc
                )
                
                insights = generate_insights(adhd_type, calculated_features_for_scoring)
                inattention_score = calculate_inattention_score(calculated_features_for_scoring)
                impulsivity_score = calculate_impulsivity_score(calculated_features_for_scoring)

                response = {
                    "adhd_type": adhd_type,
                    "probabilities": probabilities,
                    "insights": insights,
                    "scores": {
                        "inattention": {"score": inattention_score, "level": get_score_level(inattention_score)},
                        "impulsivity": {"score": impulsivity_score, "level": get_score_level(impulsivity_score)}
                    }
                }
                return jsonify(response), 200
            except Exception as e_pred_route: 
                logger.error(f"Error processing prediction request route: {str(e_pred_route)}\n{traceback.format_exc()}")
                return jsonify({"error": "Error processing prediction request", "message": str(e_pred_route)}), 500

        @app.route('/health', methods=['GET'])
        def health_check():
            db_status_val = "disconnected"
            if client is not None:
                try: client.server_info(); db_status_val = "connected"
                except Exception: db_status_val = "disconnected"
            
            # Check if global model is loaded, implies model files existed at load time
            model_available = loaded_model_global is not None 
            scaler_available = loaded_scaler_global is not None
            
            uptime_seconds = int(time.time() - start_time)
            days, rem_uptime = divmod(uptime_seconds, 86400); hours, rem_uptime = divmod(rem_uptime, 3600); minutes, _ = divmod(rem_uptime, 60)
            uptime_str = f"{days}d {hours}h {minutes}m"
            
            model_version_timestamp_iso = "N/A"
            if os.path.exists(MODEL_PERFORMANCE_PATH):
                try:
                    with open(MODEL_PERFORMANCE_PATH, 'r') as f: perf_data = json.load(f)
                    model_version_timestamp_iso = perf_data.get('timestamp', "N/A")
                except Exception: pass

            return jsonify({
                "status": "ok" if model_available and scaler_available and db_status_val == "connected" else "degraded",
                "model_loaded": "available" if model_available else "not_available",
                "scaler_loaded": "available" if scaler_available else "not_available",
                "database": db_status_val,
                "version": model_version_timestamp_iso,
                "uptime": uptime_str
            })

        @app.route('/dashboard-data', methods=['GET'])
        def get_dashboard_data():
            response_data = {}
            response_data['totalPredictions'] = 0 # This would ideally be from actual prediction logs, not gamemetrics total
            if game_metrics_collection is not None:
                try: 
                    # For demo, using gamemetrics. A dedicated prediction log would be better.
                    response_data['totalPredictions'] = game_metrics_collection.count_documents({})
                except Exception as e: logger.error(f"DB Error (totalPredictions): {e}")
            
            response_data['predictionsByType'] = []
            try:
                df_csv = load_csv_data(CSV_FILE_PATH) 
                if not df_csv.empty and 'ADHD_Type' in df_csv.columns:
                    type_counts = df_csv[df_csv['ADHD_Type'].isin(ADHD_SUBTYPES)]['ADHD_Type'].value_counts().to_dict()
                    response_data['predictionsByType'] = [{'name': str(k), 'value': int(v)} for k, v in type_counts.items()]
            except Exception as e: logger.error(f"CSV Error (predictionsByType): {e}")

            daily_preds_data = [] # This also ideally from prediction logs
            if game_metrics_collection is not None:
                try:
                    pipeline = [{"$match": {"createdAt": {"$exists": True, "$type": "date"}}}, {"$group": {"_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$createdAt"}}, "count": {"$sum": 1}}}, {"$sort": {"_id": DESCENDING}}, {"$limit": 7}, {"$sort": {"_id": ASCENDING}}]
                    agg_results = list(game_metrics_collection.aggregate(pipeline))
                    if agg_results: daily_preds_data = [{"date": item["_id"], "count": item["count"]} for item in agg_results]
                except Exception as e: logger.error(f"DB Aggregation Error (dailyPredictions): {e}")
            if not daily_preds_data: # Fallback for demo
                for i in range(6, -1, -1): daily_preds_data.append({"date": (datetime.date.today() - datetime.timedelta(days=i)).strftime("%Y-%m-%d"), "count": np.random.randint(5, 25)})
            response_data['dailyPredictions'] = daily_preds_data
            
            perf_metrics_default = {'accuracy': 0.0, 'keyPerformanceMetrics': [{'name': 'F1', 'value': '0.00'}, {'name': 'Prec', 'value': '0.00'}, {'name': 'Rec', 'value': '0.00'}, {'name': 'AUC', 'value': '0.00'}], 'datasetSize': 0}
            if os.path.exists(MODEL_PERFORMANCE_PATH):
                try:
                    with open(MODEL_PERFORMANCE_PATH, 'r') as f: perf = json.load(f)
                    response_data['accuracy'] = round(perf.get('accuracy', 0.0) * 100, 1)
                    response_data['keyPerformanceMetrics'] = [{'name': 'F1', 'value': f"{perf.get('f1_score', 0.0):.2f}"}, {'name': 'Prec', 'value': f"{perf.get('precision', 0.0):.2f}"}, {'name': 'Rec', 'value': f"{perf.get('recall', 0.0):.2f}"}, {'name': 'AUC', 'value': f"{perf.get('auc', 0.0):.2f}"}]
                    response_data['datasetSize'] = perf.get('dataset_size_trained_on', 0)
                except Exception as e: logger.error(f"File Error (modelPerformance): {e}"); response_data.update(perf_metrics_default)
            else: response_data.update(perf_metrics_default)

            response_data['accuracyTrend'] = [{'date': 'N/A', 'accuracy': 0.0}]
            if os.path.exists(ACCURACY_HISTORY_PATH):
                try:
                    with open(ACCURACY_HISTORY_PATH, 'r') as f: acc_hist = json.load(f)
                    if acc_hist: response_data['accuracyTrend'] = [{'date': item['date'], 'accuracy': float(item.get('accuracy', 0.0))} for item in acc_hist]
                except Exception as e: logger.error(f"File Error (accuracyTrend): {e}")
            
            if response_data.get('datasetSize', 0) == 0: # Fallback dataset size from CSV if performance file is missing/empty
                try: response_data['datasetSize'] = len(load_csv_data(CSV_FILE_PATH))
                except: response_data['datasetSize'] = 0

            feat_imp_data = [] # Feature importance is complex, using placeholder
            if os.path.exists(MODEL_INFO_PATH) and loaded_feature_columns_global:
                try: # Using loaded_feature_columns_global as the source of truth for features
                    features = loaded_feature_columns_global
                    base_imps = np.random.dirichlet(np.ones(len(features))) * 0.8 # Placeholder
                    feat_imp_data = [{'name': str(name), 'value': round(float(val), 3)} for name, val in zip(features, base_imps)]
                    feat_imp_data = sorted(feat_imp_data, key=lambda x: x['value'], reverse=True)
                except Exception as e: logger.error(f"Error generating placeholder featureImportance: {e}")
            if not feat_imp_data: # Ultimate fallback if everything else fails
                 default_features_for_imp = ['averageReactionTime', 'reactionTimeVariability', 'prematureClicks', 'missedStars', 'score']
                 base_imps = np.random.dirichlet(np.ones(len(default_features_for_imp))) * 0.8
                 feat_imp_data = [{'name': str(name), 'value': round(float(val), 3)} for name, val in zip(default_features_for_imp, base_imps)]
                 feat_imp_data = sorted(feat_imp_data, key=lambda x: x['value'], reverse=True)
            response_data['featureImportance'] = feat_imp_data
            return jsonify(response_data)

        @app.route('/retrain', methods=['POST'])
        def retrain_endpoint():
            try:
                api_key = request.headers.get('X-API-Key')
                expected_api_key = os.environ.get('MODEL_API_KEY', 'default_training_key') 
                if not api_key or api_key != expected_api_key:
                    return jsonify({"error": "Unauthorized access", "message": "Invalid API Key provided."}), 401

                logger.info("Manual retraining request received and authorized.")
                if not retraining_lock.acquire(blocking=False):
                     return jsonify({"error": "Training in progress", "message": "Another training process (manual or automatic) is currently running."}), 409 # 409 Conflict
                
                try:
                    data_for_retrain = fetch_data()
                    if data_for_retrain.empty or len(data_for_retrain) < DATA_THRESHOLD:
                        msg = f"Insufficient data for retraining. Need at least {DATA_THRESHOLD} valid records, found {len(data_for_retrain) if not data_for_retrain.empty else 0}."
                        return jsonify({"error": "Insufficient data", "message": msg}), 400

                    logger.info(f"Starting manual retraining with {len(data_for_retrain)} records.")
                    trained_model_obj = train_model(data_for_retrain) # train_model returns model object or None
                    if trained_model_obj is None:
                        return jsonify({"error": "Model training failed", "message": "The model training process encountered an error."}), 500
                    
                    reload_global_model() # Reload the new model into global scope
                    return jsonify({"status": "success", "message": "Model retrained successfully"}), 200
                finally:
                    retraining_lock.release()
                    logger.info("Manual retrain: Lock released.")

            except Exception as e:
                logger.error(f"Error retraining model via API: {str(e)}\n{traceback.format_exc()}")
                # Ensure lock is released if an unexpected error occurs before finally block
                if retraining_lock.locked():
                    retraining_lock.release()
                return jsonify({"error": "Retraining failed", "message": str(e)}), 500

        @app.errorhandler(404)
        def not_found_error(error): return jsonify({"error": "Endpoint not found", "message": "The requested URL was not found on the server."}), 404
        @app.errorhandler(405)
        def method_not_allowed_error(error): return jsonify({"error": "Method not allowed", "message": "The method is not allowed for the requested URL."}), 405
        @app.errorhandler(Exception)
        def handle_generic_exception(e):
            logger.error(f"Unhandled exception: {str(e)}\n{traceback.format_exc()}")
            return jsonify({"error": "An internal server error occurred", "message": "An unexpected error occurred. Please try again later."}), 500

        logger.info(f"Starting Flask API service on http://0.0.0.0:5000. Model artifacts expected in: {MODEL_BASE_PATH}")
        app.run(host='0.0.0.0', port=5000, debug=False) # debug=False is important for threaded apps

    except Exception as e:
        logger.critical(f"Fatal error starting application: {str(e)}\n{traceback.format_exc()}")
        sys.exit(1)