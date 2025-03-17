

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import './QuestionnaireForm.css'
// const QuestionnaireForm = () => {
//   const location = useLocation();
//   const [questions, setQuestions] = useState([]); // Store questions fetched from the backend
//   const [responses, setResponses] = useState({}); // Store user responses
//   const [childId, setChildId] = useState(location.state?.childId || null); // Get childId from location state
//   const [message, setMessage] = useState(""); // Feedback message for submission
//   const [showDisclaimer, setShowDisclaimer] = useState(true); // Toggle between disclaimer and questionnaire
//   const navigate = useNavigate(); // Initialize navigate function

//   const handleDecline = () => {
//     navigate(-1); // Navigate to the previous page
//   };
//   // Fetch questions from the backend
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await axios.get("http://localhost:8800/api/questionnaire/questions", {
//           withCredentials: true, // Ensure requests include credentials
//         });
//         setQuestions(response.data);
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//         setMessage("Error loading questions. Please try again later.");
//       }
//     };

//     fetchQuestions();
//   }, []);

//   // Handle user response changes
//   const handleResponseChange = (questionId, value) => {
//     setResponses({ ...responses, [questionId]: parseInt(value, 10) });
//   };

//   // Submit questionnaire responses
//   const handleSubmit = async () => {
//     if (!childId) {
//       alert("Child ID is missing. Please log in again.");
//       return;
//     }

//     try {
//       const result = await axios.post(
//         "http://localhost:8800/api/questionnaire/submit",
//         { childId, responses },
//         { withCredentials: true } // Include session credentials
//       );
//       alert(`ADHD Subtype: ${result.data.subtype}`);
//     } catch (error) {
//       console.error("Error submitting questionnaire:", error);
//       setMessage("Failed to submit questionnaire. Please try again.");
//     }
//   };

//   return (
//     <div className="ques">
//     {showDisclaimer ? (
//       // Disclaimer Page
//       <div style={{ background:'white',opacity:'0.95', maxWidth: "50%",maxHeight: "92%", margin: "20px auto", padding: "50px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" ,textAlign:'justify',overflowY: "auto"}}>
//         <h1 style={{ textAlign: "center" }}>Disclaimer: ADHD Questionnaire for Parents</h1><br></br><br></br>
//         <p style={{ fontSize: "20px", lineHeight: "1.6" }}>
//           <strong>Important Notice:</strong>
//           <br />
//           This questionnaire is designed to help identify potential signs of Attention Deficit Hyperactivity Disorder (ADHD) in children. The questions aim to assess behaviors commonly associated with ADHD, which may be exhibited by children in varying degrees
//           <br /><br />
          
//           <strong>Confidentiality:</strong>
//           <br />
//           All responses provided are confidential and will only be used for the purpose of evaluating ADHD-related behaviors.
//           <br /><br />
//           <strong>Instructions:</strong>
//           <br />
//           Please read each question carefully and respond based on your observations of your child’s behavior over the past six months.
//           <br /><br />
          
//           By proceeding with this questionnaire, you acknowledge that you understand the purpose, confidentiality, and limitations of the screening process.
//           <br /><br />
//           Thank you for your participation!
//         </p>
//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
          
//           <button
//       style={{
//         padding: "10px 20px",
//         fontSize: "16px",
//         backgroundColor: "#FF4D4D",
//         color: "#fff",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer",
//       }}
//       onClick={handleDecline} // Call the navigate function
//     >
//       Decline
//     </button>
//     <button
//             style={{ padding: "10px 20px", fontSize: "16px", backgroundColor:'#4083A8', color:'white', border: "none", borderRadius: "5px", cursor: "pointer" }}
//             onClick={() => setShowDisclaimer(false)}
//           >
//             Agree and Next
//           </button>
//         </div>
//       </div>
//     ) : (

//     <div style={{ background:'white',opacity:'0.95',maxWidth: "50%",maxHeight: "95%", margin: "20px auto", padding: "65px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" ,overflowY: "auto"}}>
//   {message && <p style={{ color: "red", textAlign: "center" }}>{message}</p>}

//   <form>
//     {questions.length > 0 ? (
//       questions.map((q) => (
//         <div key={q.id} style={{ marginBottom: "65px" }}>
//           <label style={{ display: "block", marginBottom: "20px" , fontSize: "25px", fontWeight:'600',textAlign:'justify'}}>{q.id}.  {q.text}</label>
//           <div onChange={(e) => handleResponseChange(q.id, e.target.value)} style={{ display: "flex", gap: "60px", flexWrap: "wrap" , fontSize: "20px"}}>
//             <label>
//               <input type="radio" name={`question-${q.id}`} value="0" /> Never
//             </label>
//             <label>
//               <input type="radio" name={`question-${q.id}`} value="1" /> Occasionally
//             </label>
//             <label>
//               <input type="radio" name={`question-${q.id}`} value="2" /> Often
//             </label>
//             <label>
//               <input type="radio" name={`question-${q.id}`} value="3" /> Very Often
//             </label>
//           </div>
//         </div>
//       ))
//     ) : (
//       <p>Loading questions...</p>
//     )}

//     <button type="button" onClick={handleSubmit} style={{ display: "block", margin: "20px auto", padding: "10px 20px", fontSize: "18px", backgroundColor:'#4083A8', color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
//       Submit
//     </button>
//   </form>
// </div>

// )}
//     </div>
//   );
// };

// export default QuestionnaireForm;



//   // <div>
//     //   <h1>VADPRS ADHD Questionnaire</h1>
//     //   {message && <p style={{ color: "red" }}>{message}</p>}

//     //   {questions.length > 0 ? (
//     //     questions.map((q) => (
//     //       <div key={q.id}>
//     //         <label>{q.text}</label>
//     //         <select onChange={(e) => handleResponseChange(q.id, e.target.value)}>
//     //           <option value="0">Never</option>
//     //           <option value="1">Occasionally</option>
//     //           <option value="2">Often</option>
//     //           <option value="3">Very Often</option>
//     //         </select>
//     //       </div>
//     //     ))
//     //   ) : (
//     //     <p>Loading questions...</p>
//     //   )}

//     //   <button onClick={handleSubmit}>Submit</button>
//     // </div>
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