// src/services/api.js
import API_BASE_URL from '../config';

// Fetch system status
export async function fetchSystemStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch system status:", error);
    throw error;
  }
}

// Fetch prediction metrics
export async function fetchPredictionMetrics() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/prediction-metrics`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch prediction metrics:", error);
    throw error;
  }
}

// Fetch model metrics
export async function fetchModelMetrics() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/model-metrics`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch model metrics:", error);
    throw error;
  }
}

// Retrain model
export async function retrainModel(apiKey) {
  try {
    const response = await fetch(`${API_BASE_URL}/retrain`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to retrain model:", error);
    throw error;
  }
}