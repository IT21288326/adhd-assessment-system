

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const QuestionnaireForm = () => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]); // Store questions fetched from the backend
  const [responses, setResponses] = useState({}); // Store user responses
  const [childId, setChildId] = useState(location.state?.childId || null); // Get childId from location state
  const [message, setMessage] = useState(""); // Feedback message for submission

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/questionnaire/questions", {
          withCredentials: true, // Ensure requests include credentials
        });
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setMessage("Error loading questions. Please try again later.");
      }
    };

    fetchQuestions();
  }, []);

  // Handle user response changes
  const handleResponseChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: parseInt(value, 10) });
  };

  // Submit questionnaire responses
  const handleSubmit = async () => {
    if (!childId) {
      alert("Child ID is missing. Please log in again.");
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:8800/api/questionnaire/submit",
        { childId, responses },
        { withCredentials: true } // Include session credentials
      );
      alert(`ADHD Subtype: ${result.data.subtype}`);
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      setMessage("Failed to submit questionnaire. Please try again.");
    }
  };

  return (
    <div>
      <h1>VADPRS ADHD Questionnaire</h1>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {questions.length > 0 ? (
        questions.map((q) => (
          <div key={q.id}>
            <label>{q.text}</label>
            <select onChange={(e) => handleResponseChange(q.id, e.target.value)}>
              <option value="0">Never</option>
              <option value="1">Occasionally</option>
              <option value="2">Often</option>
              <option value="3">Very Often</option>
            </select>
          </div>
        ))
      ) : (
        <p>Loading questions...</p>
      )}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default QuestionnaireForm;