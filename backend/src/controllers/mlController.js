const InputData = require("../models/InputData");
const { callMLApi } = require("../services/mlService");

// Handles input, calls ML API, and saves data to MongoDB
const processMLRequest = async (req, res) => {
    try {
        const inputData = req.body;

        // Validate input
        if (!inputData || Object.keys(inputData).length === 0) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        // Map frontend keys to backend-required format
        const transformedPayload = transformPayload(inputData);

        // Call the ML model API
        const mlResponse = await callMLApi(transformedPayload);

        // Save transformed response to MongoDB
        const backendResponseFormat = {
            futureChallenge: mlResponse["Future Challenge"],
            preventionMechanism: mlResponse["Prevention Mechanism"],
        };

        // Save the input and response to MongoDB
        const newEntry = new InputData({ input: inputData, mlResponse: backendResponseFormat });
        await newEntry.save();

        // Return the ML model response
        return res.status(200).json({
            message: "Data processed successfully",
            backendResponseFormat,
        });
    } catch (error) {
        console.error("Error processing ML request:", error.message);
        return res.status(500).json({ error: "Failed to process request" });
    }
};

function transformPayload(payload) {
    return {
        "Age": payload.age,
        "Gender": payload.gender,
        "ADHD subtype": payload.adhdSubtype,
        "Attention span (min)": payload.attentionSpan,
        "Response time (Sec)": payload.responseTime,
        "Task Completion Rate (%)": payload.taskCompletionRate,
        "Task difficulty level (1-10)": payload.taskDifficulty,
        "Error rate (%)": payload.errorRate,
        "Academic Grade": payload.academicGrade,
        "Attendance Rate (%)": payload.attendanceRate,
        "Stressor Score (1-10)": payload.stressorScore,
        "Current Strategy": payload.currentStrategy,
        "Effectiveness Score (1-10)": payload.effectivenessScore,
        "Teacher Feedback": payload.teacherFeedback,
    };
}

module.exports = { processMLRequest };
