const axios = require("axios");

const callMLApi = async (inputData) => {
    try {
        const response = await axios.post(process.env.ML_API_URL, inputData);
        return response.data; // Return the response from the ML model API
    } catch (error) {
        console.error("Error calling ML API:", error.message);
        throw new Error("Failed to connect to ML model API");
    }
};

module.exports = { callMLApi };
