import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import make_pipeline
from sklearn.svm import SVC
import numpy as np

# Load the dataset
file_path = "adhd_children_dataset_improved.csv"
dataset = pd.read_csv(file_path)

# Drop unnecessary columns
data = dataset.drop(columns=["Child id", "Name"])

# Separate features (X) and targets (y)
X = data.drop(columns=["Future Challenge", "Prevention Mechanism"])
y_challenge = data["Future Challenge"]

# Encode categorical features and targets
categorical_columns = X.select_dtypes(include=["object"]).columns

encoders = {col: LabelEncoder() for col in categorical_columns}
for col in categorical_columns:
    X[col] = encoders[col].fit_transform(X[col])

y_challenge = LabelEncoder().fit_transform(y_challenge)

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y_challenge, test_size=0.2, random_state=42
)

# Models to evaluate
models = {
    "Random Forest": RandomForestClassifier(random_state=42),
    "Logistic Regression": LogisticRegression(max_iter=5000),
    "SVM": SVC(probability=True),
    "Neural Network": MLPClassifier(random_state=42, max_iter=300),
}

# Evaluate models
results = {}
for name, model in models.items():
    pipeline = make_pipeline(StandardScaler(), model)
    scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring="accuracy")
    results[name] = np.mean(scores)

# Print results
results_sorted = dict(sorted(results.items(), key=lambda item: item[1], reverse=True))
print("Model Selection Results:")
for model, score in results_sorted.items():
    print(f"{model}: {score:.4f}")
