const API_URL = "http://localhost:5001/api/predict";

export const predict = async (formData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("API call failed");
  }

  return response.json();
};
