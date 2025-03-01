import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormPage = () => {
  const [formData, setFormData] = useState({
    childId: "",
    name: "",
    age: "",
    gender: "",
    adhdSubtype: "",
    attentionSpan: "",
    responseTime: "",
    taskCompletionRate: "",
    taskDifficulty: "",
    errorRate: "",
    academicGrade: "",
    attendanceRate: "",
    stressorScore: "",
    currentStrategy: "",
    effectivenessScore: "",
    teacherFeedback: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const isFormValid = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      console.log("Form is invalid");
      return;
    }

    console.log("Form is valid, preparing to submit");

    try {
      const response = await fetch("http://localhost:5001/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.error("Error response from API:", response.status);
        throw new Error("Failed to submit the form");
      }

      const result = await response.json();
      console.log("API response:", result);

      navigate("/results", { state: { result } });
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const currentStrategyOptions = [
    "Structured daily routines",
    "Structured schedules",
    "Use of visual aids and reminders",
    "Use of fidget tools for focus",
    "Positive reinforcement and rewards",
    "Adaptive classroom environments",
    "Collaborative learning",
    "Behavioral reinforcement",
    "Clear and concise instructions",
    "Limit distractions in study areas",
    "Mindfulness and relaxation techniques",
    "Regular physical activity",
    "Gamified learning tools",
    "Encouragement of creative outlets",
    "Cognitive-behavioral therapy",
    "Teacher collaboration and support",
    "Parental training and involvement",
    "Schedule physical activity breaks",
    "Social skills training programs",
    "Token economy system",
    "Implement shorter, task-based assignments",
    "Time management training",
    "Task breakdown into smaller steps",
    "Emotional regulation exercises",
  ];

  const teacherFeedbackOptions = [
    "Emotionally stable",
    "Positive response",
    "Limited responses",
    "Negative response",
    "Moderate, needs more focus",
    "Improved focus",
    "Impulsive behavior",
    "Easily distracted",
    "Great progress",
    "Needs improvement",
    "Low attention",
  ];

  const renderInputField = (name, label, type) => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        type={type}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  const renderSelectField = (name, label, options) => (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">ADHD Assessment Form</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                {renderInputField("childId", "Child ID", "number")}
                {renderInputField("name", "Name", "text")}
                {renderInputField("age", "Age", "number")}
                {renderSelectField("gender", "Gender", ["Male", "Female"])}
                {renderSelectField("adhdSubtype", "ADHD Subtype", [
                  "Inattentive",
                  "Hyperactive",
                  "Combined",
                ])}
                {renderInputField("attentionSpan", "Attention Span (min)", "number")}
                {renderInputField("responseTime", "Response Time (Sec)", "number")}
                {renderInputField("taskCompletionRate", "Task Completion Rate (%)", "number")}
                {renderInputField("taskDifficulty", "Task Difficulty Level (1-10)", "number")}
                {renderInputField("errorRate", "Error Rate (%)", "number")}
                {renderInputField("academicGrade", "Academic Grade", "text")}
                {renderInputField("attendanceRate", "Attendance Rate (%)", "number")}
                {renderInputField("stressorScore", "Stressor Score (1-10)", "number")}
                {renderSelectField("currentStrategy", "Current Strategy", currentStrategyOptions)}
                {renderInputField("effectivenessScore", "Effectiveness Score (1-10)", "number")}
                {renderSelectField("teacherFeedback", "Teacher Feedback", teacherFeedbackOptions)}

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
