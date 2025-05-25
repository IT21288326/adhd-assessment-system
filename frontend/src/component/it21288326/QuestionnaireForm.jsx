
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import './QuestionnaireForm.css';
import NavigationBar from "./NavigationBar";

const QuestionnaireForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [childId, setChildId] = useState(location.state?.childId || null);
  const [message, setMessage] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const child = location.state?.childData || null;
  const handleDecline = () => {
    navigate(-1);
  };

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/questionnaire/questions", {
          withCredentials: true,
        });
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setMessage("Error loading questions. Please try again later.");
      }
    };

    fetchQuestions();
  }, []);

  // Update progress when responses change
  useEffect(() => {
    if (questions.length > 0) {
      const answeredQuestions = Object.keys(responses).length;
      setProgress((answeredQuestions / questions.length) * 100);
    }
  }, [responses, questions]);

  // Handle user response changes
  const handleResponseChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: parseInt(value, 10) });
    
    // Auto-advance to next question after selecting an answer
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Submit questionnaire responses
  const handleSubmit = async () => {
    if (!childId) {
      alert("Child ID is missing. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await axios.post(
        "http://localhost:8800/api/questionnaire/submit",
        { childId, responses },
        { withCredentials: true }
      );
      // setResult(result.data);
      navigate("/questionnaire-form/report", { 
        state: { 
          childId,
          responses,
          childData: location.state?.childData || null,
          result: result.data
        } 
      });
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      setMessage("Failed to submit questionnaire. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to check if all questions are answered
  const areAllQuestionsAnswered = () => {
    return questions.length > 0 && Object.keys(responses).length === questions.length;
  };

  // Render the result panel
  const renderResult = () => {
    if (!result) return null;
    
    return (<>
      <NavigationBar child={child} />
      <div className="result-panel">
        <div className="result-content">
          <h2>Questionnaire Results</h2>
          <div className="result-info">
            <p>ADHD Subtype: <strong>{result.subtype}</strong></p>
            <p>Thank you for completing the assessment!</p>
          </div>
          <button onClick={() => navigate("/dashboard")} className="primary-button">
            Return to Dashboard
          </button>
        </div>
      </div>
      </>
    );
  };

  return (
    <>
    <NavigationBar child={child} /> 
    <div className="questionnaire-container">
      {result ? (
        renderResult()
      ) : showDisclaimer ? (
        <div className="disclaimer-panel">
          <div className="disclaimer-content">
            <h1>ADHD Questionnaire</h1>
            <div className="disclaimer-mascot">
              {/* <img src="/images/friendly-mascot.png" alt="Friendly character" /> */}
            </div>
            <div className="disclaimer-text">
              <h2>Before We Begin...</h2>
              <p>
                This questionnaire helps identify potential signs of ADHD in children. 
                Your responses will help us understand your child's behavior patterns.
              </p>
              <p>
                <strong>Confidentiality:</strong> All responses are confidential and used only for evaluation purposes.
              </p>
              <p>
                <strong>Instructions:</strong> Please think about your child's behavior over the past six months when answering.
              </p>
            </div>
            <div className="disclaimer-buttons">
              <button className="secondary-button" onClick={handleDecline}>
                Decline
              </button>
              <button className="primary-button" onClick={() => setShowDisclaimer(false)}>
                Agree & Continue
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="questionnaire-panel">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="question-counter">Question {currentQuestion + 1} of {questions.length}</p>
          
          {questions.length > 0 ? (
            <div className="question-container">
              <div className="question-content">
                <h2>{questions[currentQuestion].text}</h2>
                
                <div className="answer-options">
                  {["Never", "Occasionally", "Often", "Very Often"].map((option, index) => (
                    <button
                      key={option}
                      className={`answer-button ${responses[questions[currentQuestion].id] === index ? 'selected' : ''}`}
                      onClick={() => handleResponseChange(questions[currentQuestion].id, index)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                <div className="navigation-buttons">
                  <button 
                    className="nav-button" 
                    onClick={handlePrevQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </button>
                  
                  {currentQuestion < questions.length - 1 ? (
                    <button 
                      className="nav-button" 
                      onClick={handleNextQuestion}
                      disabled={!responses[questions[currentQuestion].id]}
                    >
                      Next
                    </button>
                  ) : (
                    <button 
                      className="submit-button" 
                      onClick={handleSubmit}
                      disabled={!areAllQuestionsAnswered() || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="helper-character">
                {/* <img src="/images/helper-character.png" alt="Helper character" /> */}
                <p className="helper-text">
                  {currentQuestion === 0 
                    ? "Let's start! Select the option that best describes your child's behavior."
                    : currentQuestion === questions.length - 1
                    ? "Almost done! Just one more question to go."
                    : "You're doing great! Keep going."}
                </p>
              </div>
            </div>
          ) : (
            <div className="loading-container">
              <div className="loading-animation"></div>
              <p>Loading questions...</p>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default QuestionnaireForm;