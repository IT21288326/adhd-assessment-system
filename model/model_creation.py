import warnings
from sklearn.exceptions import ConvergenceWarning
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=ConvergenceWarning)

import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
from joblib import dump
from sklearn.linear_model import LogisticRegression
import numpy as np

# Load the dataset
data_path = "adhd_children_dataset_improved.csv"
adhd_data = pd.read_csv(data_path)

# Drop irrelevant columns
columns_to_drop = ['Child id', 'Name']
X = adhd_data.drop(columns=columns_to_drop + ['Future Challenge', 'Prevention Mechanism'])

# Define target variables
y_challenge = adhd_data['Future Challenge']
y_prevention = adhd_data['Prevention Mechanism']

# Encode categorical features
categorical_columns = ['Gender', 'ADHD subtype', 'Current Strategy', 'Teacher Feedback', 'Academic Grade']
encoders = {}
for column in categorical_columns:
    encoder = LabelEncoder()
    X[column] = encoder.fit_transform(X[column].astype(str))  # Convert to string before encoding
    encoders[column] = encoder
    dump(encoder, f"{column}_encoder.pkl")
    print(f"Saved encoder for column '{column}' as '{column}_encoder.pkl'")

# Debug: Check for non-numeric columns
for column in X.columns:
    if X[column].dtype == 'object':  # Identify columns with non-numeric values
        print(f"Non-numeric values found in column '{column}': {X[column].unique()}")

# Encode target variables
challenge_encoder = LabelEncoder()
y_challenge = challenge_encoder.fit_transform(y_challenge.astype(str))
dump(challenge_encoder, "challenge_encoder.pkl")
print("Challenge label encoder saved as 'challenge_encoder.pkl'")

prevention_encoder = LabelEncoder()
y_prevention = prevention_encoder.fit_transform(y_prevention.astype(str))
dump(prevention_encoder, "prevention_encoder.pkl")
print("Prevention label encoder saved as 'prevention_encoder.pkl'")

# Handle missing or invalid data
X = X.replace(['C'], np.nan).dropna()  # Replace unexpected strings with NaN and drop rows
y_challenge = y_challenge[:len(X)]  # Align target variable with cleaned feature data
y_prevention = y_prevention[:len(X)]

# Scale numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
dump(scaler, "scaler.pkl")
print("Fitted scaler saved as 'scaler.pkl'")

# Split the dataset into training and testing sets
X_train, X_test, y_challenge_train, y_challenge_test = train_test_split(
    X_scaled, y_challenge, test_size=0.2, random_state=42
)

X_train_p, X_test_p, y_prevention_train, y_prevention_test = train_test_split(
    X_scaled, y_prevention, test_size=0.2, random_state=42
)

# Handle class imbalance using SMOTE
smote = SMOTE(random_state=42)
X_train_c, y_challenge_train = smote.fit_resample(X_train, y_challenge_train)
X_train_p, y_prevention_train = smote.fit_resample(X_train, y_prevention_train)

# Hyperparameter tuning for Logistic Regression
def tune_logistic_regression(X_train, y_train):
    param_grid = {
        'C': [0.01, 0.1, 1, 10],
        'solver': ['lbfgs', 'liblinear']
    }
    model = LogisticRegression(max_iter=5000)
    grid_search = GridSearchCV(
        model,
        param_grid,
        cv=5,
        scoring='accuracy',
        verbose=0,
        n_jobs=-1
    )
    grid_search.fit(X_train, y_train)
    print(f"Best Parameters for Logistic Regression: {grid_search.best_params_}")
    return grid_search.best_estimator_

# Train Logistic Regression models for both targets
print("Tuning and training Logistic Regression for Future Challenge...")
best_model_challenge = tune_logistic_regression(X_train_c, y_challenge_train)
best_model_challenge.fit(X_train_c, y_challenge_train)
dump(best_model_challenge, "best_future_challenge_model.pkl")
print("Best Logistic Regression model for Future Challenge saved as 'best_future_challenge_model.pkl'")

print("Tuning and training Logistic Regression for Prevention Mechanism...")
best_model_prevention = tune_logistic_regression(X_train_p, y_prevention_train)
best_model_prevention.fit(X_train_p, y_prevention_train)
dump(best_model_prevention, "best_prevention_mechanism_model.pkl")
print("Best Logistic Regression model for Prevention Mechanism saved as 'best_prevention_mechanism_model.pkl'")

# Evaluate both models
print("Evaluating Future Challenge Model...")
y_challenge_pred = best_model_challenge.predict(X_test)
print("Classification Report for Future Challenge:")
print(classification_report(y_challenge_test, y_challenge_pred))

print("Evaluating Prevention Mechanism Model...")
y_prevention_pred = best_model_prevention.predict(X_test_p)
print("Classification Report for Prevention Mechanism:")
print(classification_report(y_prevention_test, y_prevention_pred))
