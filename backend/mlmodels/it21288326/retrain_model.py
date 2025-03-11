from pymongo import MongoClient
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import os

# MongoDB setup
client = MongoClient('mongodb+srv://24-25J-261:24-25J-261@cluster0.a1s53.mongodb.net/')
db = client['test']
game_metrics_collection = db['gamemetrics']
questionnaire_collection = db['questionnaireresponses']

# Minimum data required for training
DATA_THRESHOLD = 40  # Set this based on your needs

# Fetch and merge data
def fetch_data():
    game_metrics = list(game_metrics_collection.find())
    questionnaires = list(questionnaire_collection.find())

    dataset = []
    for metric in game_metrics:
        matching_questionnaire = next(
            (q for q in questionnaires if str(q['childId']) == str(metric['childId'])), None
        )
        if matching_questionnaire:
            dataset.append({
                'averageReactionTime': metric['averageReactionTime'],
                'correctStreak': metric['correctStreak'],
                'prematureClicks': metric['prematureClicks'],
                'missedStars': metric['missedStars'],
                'score': metric['score'],
                'ADHD_Type': matching_questionnaire['subtype'],  # Label
            })

    return pd.DataFrame(dataset)

# Train model
def train_model(data):
    X = data[['averageReactionTime', 'correctStreak', 'prematureClicks', 'missedStars', 'score']].values
    y = LabelEncoder().fit_transform(data['ADHD_Type'])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = tf.keras.Sequential([
        tf.keras.layers.Dense(16, activation='relu', input_shape=(X_train.shape[1],)),
        tf.keras.layers.Dense(8, activation='relu'),
        tf.keras.layers.Dense(len(set(y)), activation='softmax'),
    ])
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=20, batch_size=16)
    
    # Save the trained model
    #model.save('./adhd_model')
    model.save('E:/New folder (2)/adhd-assessment-system/backend/mlmodels/it21288326/adhd_model.keras')

    print("Model retrained and saved.")

# Main Execution
if __name__ == "__main__":
    data = fetch_data()
    if len(data) >= DATA_THRESHOLD:
        print(f"Training model with {len(data)} records...")
        train_model(data)
    else:
        print(f"Not enough data for training. Current size: {len(data)}")
