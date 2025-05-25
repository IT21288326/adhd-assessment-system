// // // import React, { useEffect, useState } from "react";
// // // import { useLocation, useNavigate } from "react-router-dom";
// // // import "./ReportPage.css";

// // // const ReportPage = () => {
// // //   const location = useLocation();
// // //   const navigate = useNavigate();
// // //   const [loading, setLoading] = useState(true);
// // //   const [report, setReport] = useState(null);
// // //   const [childData, setChildData] = useState(null);

// // //   useEffect(() => {
// // //     // Get responses and child data from location state or API
// // //     const responses = location.state?.responses;
// // //     const childId = location.state?.childId;
    
// // //     if (!responses || !childId) {
// // //       // If no data in state, try to fetch from API
// // //       fetchReportData(childId);
// // //     } else {
// // //       // Generate report from available data
// // //       generateReport(responses, location.state?.childData);
// // //     }
// // //   }, [location]);

// // //   const fetchReportData = async (childId) => {
// // //     try {
// // //       setLoading(true);
// // //       // Fetch responses if not available in state
// // //       const responseData = await fetch(`http://localhost:8800/api/questionnaire/results/${childId}`, {
// // //         credentials: "include"
// // //       });
      
// // //       if (!responseData.ok) {
// // //         throw new Error("Failed to fetch questionnaire data");
// // //       }
      
// // //       const data = await responseData.json();
      
// // //       // Fetch child information
// // //       const childResponse = await fetch(`http://localhost:8800/api/children/${childId}`, {
// // //         credentials: "include"
// // //       });
      
// // //       if (!childResponse.ok) {
// // //         throw new Error("Failed to fetch child data");
// // //       }
      
// // //       const childData = await childResponse.json();
// // //       setChildData(childData);
      
// // //       // Generate report
// // //       generateReport(data.responses, childData);
// // //     } catch (error) {
// // //       console.error("Error fetching report data:", error);
// // //     }
// // //   };

// // //   const generateReport = (responses, childData) => {
// // //     // Calculate scores for each subtype
// // //     const inattentiveScore = calculateSubtypeScore(responses, 1, 9);
// // //     const hyperactiveScore = calculateSubtypeScore(responses, 10, 18);
// // //     const combinedScore = inattentiveScore + hyperactiveScore;
// // //     const oddScore = calculateSubtypeScore(responses, 19, 26);
// // //     const cdScore = calculateSubtypeScore(responses, 27, 40);
// // //     const anxietyScore = calculateSubtypeScore(responses, 41, 47);
    
// // //     // Calculate performance issues
// // //     const hasPerformanceIssues = hasPerformanceProblems(responses);
    
// // //     // Determine clinical cutoffs
// // //     const inattentiveCutoff = hasInattentiveCutoff(responses, hasPerformanceIssues);
// // //     const hyperactiveCutoff = hasHyperactiveCutoff(responses, hasPerformanceIssues);
// // //     const combinedCutoff = inattentiveCutoff && hyperactiveCutoff;
// // //     const oddCutoff = hasODDCutoff(responses, hasPerformanceIssues);
// // //     const cdCutoff = hasCDCutoff(responses, hasPerformanceIssues);
// // //     const anxietyCutoff = hasAnxietyCutoff(responses, hasPerformanceIssues);
    
// // //     // Calculate percentiles (this would normally come from normed data)
// // //     // For now, using simple estimation based on max possible scores
// // //     const inattentivePercentile = calculatePercentile(inattentiveScore, 27); // max 27 (9 questions * 3 max score)
// // //     const hyperactivePercentile = calculatePercentile(hyperactiveScore, 27);
// // //     const combinedPercentile = calculatePercentile(combinedScore, 54);
// // //     const oddPercentile = calculatePercentile(oddScore, 24);
// // //     const cdPercentile = calculatePercentile(cdScore, 42);
// // //     const anxietyPercentile = calculatePercentile(anxietyScore, 21);
    
// // //     // Determine primary diagnosis
// // //     let primaryDiagnosis = "No ADHD diagnosis indicated";
// // //     let subtypeDetails = "";
    
// // //     if (combinedCutoff) {
// // //       primaryDiagnosis = "ADHD - Combined Type";
// // //       subtypeDetails = "Meets criteria for both Inattentive and Hyperactive/Impulsive subtypes";
// // //     } else if (inattentiveCutoff) {
// // //       primaryDiagnosis = "ADHD - Predominantly Inattentive Type";
// // //       subtypeDetails = "Meets criteria for Inattentive subtype";
// // //     } else if (hyperactiveCutoff) {
// // //       primaryDiagnosis = "ADHD - Predominantly Hyperactive/Impulsive Type";
// // //       subtypeDetails = "Meets criteria for Hyperactive/Impulsive subtype";
// // //     }
    
// // //     // Create report object
// // //     const reportData = {
// // //       date: new Date().toLocaleDateString(),
// // //       childName: childData?.name || "Unknown",
// // //       childAge: childData?.age || calculateAge(childData?.birthDate) || "Unknown",
// // //       scores: {
// // //         inattentive: {
// // //           score: inattentiveScore,
// // //           aboveCutoff: inattentiveCutoff,
// // //           percentile: inattentivePercentile
// // //         },
// // //         hyperactive: {
// // //           score: hyperactiveScore,
// // //           aboveCutoff: hyperactiveCutoff,
// // //           percentile: hyperactivePercentile
// // //         },
// // //         combined: {
// // //           score: combinedScore,
// // //           aboveCutoff: combinedCutoff,
// // //           percentile: combinedPercentile
// // //         },
// // //         odd: {
// // //           score: oddScore,
// // //           aboveCutoff: oddCutoff,
// // //           percentile: oddPercentile
// // //         },
// // //         cd: {
// // //           score: cdScore,
// // //           aboveCutoff: cdCutoff,
// // //           percentile: cdPercentile
// // //         },
// // //         anxiety: {
// // //           score: anxietyScore,
// // //           aboveCutoff: anxietyCutoff,
// // //           percentile: anxietyPercentile
// // //         }
// // //       },
// // //       diagnosis: primaryDiagnosis,
// // //       subtypeDetails: subtypeDetails,
// // //       comorbidities: getComorbidities(oddCutoff, cdCutoff, anxietyCutoff),
// // //       recommendations: getRecommendations(
// // //         inattentiveCutoff, 
// // //         hyperactiveCutoff, 
// // //         combinedCutoff,
// // //         oddCutoff,
// // //         cdCutoff,
// // //         anxietyCutoff
// // //       )
// // //     };
    
// // //     setReport(reportData);
// // //     setLoading(false);
// // //   };

// // //   // Helper functions for calculations
// // //   const calculateSubtypeScore = (responses, startId, endId) => {
// // //     let total = 0;
// // //     for (let i = startId; i <= endId; i++) {
// // //       total += responses[i] || 0;
// // //     }
// // //     return total;
// // //   };

// // //   const hasPerformanceProblems = (responses) => {
// // //     // Check if any performance questions (48-55) have scores of 1 or 2
// // //     for (let i = 48; i <= 55; i++) {
// // //       if (responses[i] === 1 || responses[i] === 2) {
// // //         return true;
// // //       }
// // //     }
// // //     return false;
// // //   };

// // //   const hasInattentiveCutoff = (responses, hasPerformanceIssues) => {
// // //     // Need 6+ questions with scores of 2 or 3 ("Often" or "Very Often") on questions 1-9
// // //     // AND at least one performance problem
// // //     if (!hasPerformanceIssues) return false;
    
// // //     let count = 0;
// // //     for (let i = 1; i <= 9; i++) {
// // //       if (responses[i] >= 2) {
// // //         count++;
// // //       }
// // //     }
// // //     return count >= 6;
// // //   };

// // //   const hasHyperactiveCutoff = (responses, hasPerformanceIssues) => {
// // //     // Need 6+ questions with scores of 2 or 3 on questions 10-18
// // //     // AND at least one performance problem
// // //     if (!hasPerformanceIssues) return false;
    
// // //     let count = 0;
// // //     for (let i = 10; i <= 18; i++) {
// // //       if (responses[i] >= 2) {
// // //         count++;
// // //       }
// // //     }
// // //     return count >= 6;
// // //   };

// // //   const hasODDCutoff = (responses, hasPerformanceIssues) => {
// // //     // Need 4+ questions with scores of 2 or 3 on questions 19-26
// // //     // AND at least one performance problem
// // //     if (!hasPerformanceIssues) return false;
    
// // //     let count = 0;
// // //     for (let i = 19; i <= 26; i++) {
// // //       if (responses[i] >= 2) {
// // //         count++;
// // //       }
// // //     }
// // //     return count >= 4;
// // //   };

// // //   const hasCDCutoff = (responses, hasPerformanceIssues) => {
// // //     // Need 3+ questions with scores of 2 or 3 on questions 27-40
// // //     // AND at least one performance problem
// // //     if (!hasPerformanceIssues) return false;
    
// // //     let count = 0;
// // //     for (let i = 27; i <= 40; i++) {
// // //       if (responses[i] >= 2) {
// // //         count++;
// // //       }
// // //     }
// // //     return count >= 3;
// // //   };

// // //   const hasAnxietyCutoff = (responses, hasPerformanceIssues) => {
// // //     // Need 3+ questions with scores of 2 or 3 on questions 41-47
// // //     // AND at least one performance problem
// // //     if (!hasPerformanceIssues) return false;
    
// // //     let count = 0;
// // //     for (let i = 41; i <= 47; i++) {
// // //       if (responses[i] >= 2) {
// // //         count++;
// // //       }
// // //     }
// // //     return count >= 3;
// // //   };

// // //   const calculatePercentile = (score, maxScore) => {
// // //     // Simple percentile calculation (just for demonstration)
// // //     // In a real app, this would use normed data tables
// // //     return Math.min(99.9, Math.round((score / maxScore) * 100));
// // //   };

// // //   const calculateAge = (birthDate) => {
// // //     if (!birthDate) return "Unknown";
    
// // //     const today = new Date();
// // //     const birth = new Date(birthDate);
// // //     let age = today.getFullYear() - birth.getFullYear();
    
// // //     // Adjust age if birthday hasn't occurred yet this year
// // //     if (
// // //       today.getMonth() < birth.getMonth() || 
// // //       (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
// // //     ) {
// // //       age--;
// // //     }
    
// // //     return age;
// // //   };

// // //   const getComorbidities = (oddCutoff, cdCutoff, anxietyCutoff) => {
// // //     const comorbidities = [];
    
// // //     if (oddCutoff) comorbidities.push("Oppositional Defiant Disorder");
// // //     if (cdCutoff) comorbidities.push("Conduct Disorder");
// // //     if (anxietyCutoff) comorbidities.push("Anxiety/Depression");
    
// // //     return comorbidities;
// // //   };

// // //   const getRecommendations = (inattentive, hyperactive, combined, odd, cd, anxiety) => {
// // //     const recommendations = [];
    
// // //     if (inattentive || hyperactive || combined) {
// // //       recommendations.push("Comprehensive ADHD evaluation with a qualified healthcare professional");
// // //       recommendations.push("Consider implementing classroom accommodations");
      
// // //       if (inattentive) {
// // //         recommendations.push("Strategies for improving organization and focus");
// // //       }
      
// // //       if (hyperactive) {
// // //         recommendations.push("Strategies for managing hyperactivity and impulsivity");
// // //       }
// // //     }
    
// // //     if (odd) {
// // //       recommendations.push("Evaluation for Oppositional Defiant Disorder");
// // //       recommendations.push("Parent management training may be beneficial");
// // //     }
    
// // //     if (cd) {
// // //       recommendations.push("Immediate evaluation for Conduct Disorder by a mental health professional");
// // //     }
    
// // //     if (anxiety) {
// // //       recommendations.push("Evaluation for anxiety and/or depression");
// // //     }
    
// // //     if (recommendations.length === 0) {
// // //       recommendations.push("No specific interventions indicated based on current results");
// // //       recommendations.push("Continue monitoring developmental progress");
// // //     }
    
// // //     return recommendations;
// // //   };

// // //   // Render loading state
// // //   if (loading) {
// // //     return (
// // //       <div className="report-container loading">
// // //         <div className="loading-spinner"></div>
// // //         <p>Generating report...</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="report-container">
// // //       <div className="report-header">
// // //         <h1>ADHD Assessment Report</h1>
// // //         <div className="report-meta">
// // //           <p><strong>Child:</strong> {report.childName}</p>
// // //           <p><strong>Age:</strong> {report.childAge}</p>
// // //           <p><strong>Assessment Date:</strong> {report.date}</p>
// // //         </div>
// // //       </div>

// // //       <div className="report-section">
// // //         <h2>Assessment Results</h2>
// // //         <table className="results-table">
// // //           <thead>
// // //             <tr>
// // //               <th>Scale</th>
// // //               <th>Score</th>
// // //               <th>Clinical Cutoff</th>
// // //               <th>Percentile</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             <tr>
// // //               <td>Inattentive Subtype</td>
// // //               <td>{report.scores.inattentive.score}</td>
// // //               <td>{report.scores.inattentive.aboveCutoff ? "Above" : "Below"}</td>
// // //               <td>{report.scores.inattentive.percentile}</td>
// // //             </tr>
// // //             <tr>
// // //               <td>Hyperactive/Impulsive Subtype</td>
// // //               <td>{report.scores.hyperactive.score}</td>
// // //               <td>{report.scores.hyperactive.aboveCutoff ? "Above" : "Below"}</td>
// // //               <td>{report.scores.hyperactive.percentile}</td>
// // //             </tr>
// // //             <tr>
// // //               <td>Combined Subtype</td>
// // //               <td>{report.scores.combined.score}</td>
// // //               <td>{report.scores.combined.aboveCutoff ? "Above" : "Below"}</td>
// // //               <td>{report.scores.combined.percentile}</td>
// // //             </tr>
// // //             <tr>
// // //               <td>Oppositional Defiant Disorder</td>
// // //               <td>{report.scores.odd.score}</td>
// // //               <td>{report.scores.odd.aboveCutoff ? "Above" : "Below"}</td>
// // //               <td>{report.scores.odd.percentile}</td>
// // //             </tr>
// // //             <tr>
// // //               <td>Conduct Disorder</td>
// // //               <td>{report.scores.cd.score}</td>
// // //               <td>{report.scores.cd.aboveCutoff ? "Above" : "Below"}</td>
// // //               <td>{report.scores.cd.percentile}</td>
// // //             </tr>
// // //             <tr>
// // //               <td>Anxiety/Depression</td>
// // //               <td>{report.scores.anxiety.score}</td>
// // //               <td>{report.scores.anxiety.aboveCutoff ? "Above" : "Below"}</td>
// // //               <td>{report.scores.anxiety.percentile}</td>
// // //             </tr>
// // //           </tbody>
// // //         </table>
// // //       </div>

// // //       <div className="report-section">
// // //         <h2>Percentile Comparison</h2>
// // //         <div className="percentile-chart">
// // //           {/* Visual representation of percentiles */}
// // //           <div className="chart-bars">
// // //             {Object.entries(report.scores).map(([key, data]) => (
// // //               <div className="chart-bar-container" key={key}>
// // //                 <div className="chart-bar-label">{getReadableScaleName(key)}</div>
// // //                 <div className="chart-bar-outer">
// // //                   <div 
// // //                     className={`chart-bar-inner ${data.aboveCutoff ? 'above-cutoff' : ''}`}
// // //                     style={{ width: `${data.percentile}%` }}
// // //                   ></div>
// // //                 </div>
// // //                 <div className="chart-bar-value">{data.percentile}%</div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //           <div className="chart-legend">
// // //             <p><span className="legend-normal"></span> Below clinical cutoff</p>
// // //             <p><span className="legend-clinical"></span> Above clinical cutoff</p>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <div className="report-section">
// // //         <h2>Clinical Impression</h2>
// // //         <div className="diagnosis-box">
// // //           <h3>Primary Diagnosis:</h3>
// // //           <p className="diagnosis">{report.diagnosis}</p>
// // //           {report.subtypeDetails && <p className="subtype-details">{report.subtypeDetails}</p>}
// // //         </div>
        
// // //         {report.comorbidities.length > 0 && (
// // //           <div className="comorbidities">
// // //             <h3>Potential Comorbid Conditions:</h3>
// // //             <ul>
// // //               {report.comorbidities.map((condition, index) => (
// // //                 <li key={index}>{condition}</li>
// // //               ))}
// // //             </ul>
// // //             <p className="comorbid-note">
// // //               <strong>Note:</strong> These potential comorbidities are screening indicators only 
// // //               and require further comprehensive evaluation for diagnosis.
// // //             </p>
// // //           </div>
// // //         )}
// // //       </div>

// // //       <div className="report-section">
// // //         <h2>Recommendations</h2>
// // //         <ul className="recommendations-list">
// // //           {report.recommendations.map((rec, index) => (
// // //             <li key={index}>{rec}</li>
// // //           ))}
// // //         </ul>
// // //       </div>

// // //       <div className="report-section disclaimer">
// // //         <h3>Important Notice</h3>
// // //         <p>
// // //           This report is generated based on the Vanderbilt ADHD Diagnostic Parent Rating Scale (VADPRS).
// // //           Results should be interpreted by qualified healthcare professionals as part of a comprehensive
// // //           evaluation. This screening tool alone is not sufficient for diagnosis.
// // //         </p>
// // //       </div>

// // //       <div className="report-actions">
// // //         <button 
// // //           className="secondary-button" 
// // //           onClick={() => navigate("/dashboard")}
// // //         >
// // //           Return to Dashboard
// // //         </button>
// // //         <button 
// // //           className="primary-button" 
// // //           onClick={() => window.print()}
// // //         >
// // //           Print Report
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );

// // //   // Helper function to convert scale keys to readable names
// // //   function getReadableScaleName(key) {
// // //     const names = {
// // //       inattentive: "Inattentive",
// // //       hyperactive: "Hyperactive",
// // //       combined: "Combined",
// // //       odd: "Oppositional",
// // //       cd: "Conduct",
// // //       anxiety: "Anxiety/Depression"
// // //     };
// // //     return names[key] || key;
// // //   }
// // // };

// // // export default ReportPage;

// // import React, { useEffect, useState } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import "./ReportPage.css";
// // import NavigationBar from "./NavigationBar"; // Assuming you have a NavigationBar component

// // const ReportPage = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(true);
// //   const [report, setReport] = useState(null);
// //   // childData state is still here, as it might be fetched,
// //   // but we won't directly use its name/age in the report object for display
// //   const [childData, setChildData] = useState(null);


// //   useEffect(() => {
// //     const responses = location.state?.responses;
// //     const childId = location.state?.childId;
// //     const navChildData = location.state?.childData; // Data passed from QuestionnaireForm

// //     const initializeReport = async () => {
// //         setLoading(true);
// //         try {
// //             let currentResponses = responses;
// //             let currentChildDetails = navChildData; // Use childData from nav state if available

// //             if (!responses || !childId) {
// //                 // If core data is missing from nav state, fetch everything needed.
// //                 // This assumes childId is available, or we'd need another strategy.
// //                 if (!childId) {
// //                     console.error("Critical: childId is missing. Cannot fetch report data.");
// //                     navigate("/dashboard", {state: {error: "Cannot load report: Child ID missing."}});
// //                     return;
// //                 }
// //                 console.log(`Fetching full report data for child ID: ${childId}`);
// //                 const resultsRes = await fetch(`http://localhost:8800/api/questionnaire/results/${childId}`, {
// //                     credentials: "include"
// //                 });
// //                 if (!resultsRes.ok) throw new Error("Failed to fetch questionnaire data");
// //                 const questionnaireData = await resultsRes.json();
// //                 currentResponses = questionnaireData.responses; // Assuming this structure

// //                 // Fetch child info if not passed or if we always want fresh data
// //                 // Using the session-based endpoint as discussed
// //                 const childProfileRes = await fetch(`http://localhost:8800/api/child/profile`, {
// //                     credentials: "include"
// //                 });
// //                 if (!childProfileRes.ok) {
// //                      // Handle 401 or other errors specifically if needed
// //                     if (childProfileRes.status === 401) {
// //                         console.error("Unauthorized to fetch child profile.");
// //                         navigate("/login"); // or appropriate error handling
// //                         return;
// //                     }
// //                     throw new Error("Failed to fetch child data via session");
// //                 }
// //                 currentChildDetails = await childProfileRes.json();
// //                 setChildData(currentChildDetails); // Update state if needed elsewhere

// //             } else if (!navChildData && childId) {
// //                 // Responses and childId are from nav state, but childData (name, age) is not. Fetch it.
// //                 console.log("Responses from nav, fetching child details via session");
// //                 const childProfileRes = await fetch(`http://localhost:8800/api/child/profile`, {
// //                     credentials: "include"
// //                 });
// //                 if (!childProfileRes.ok) {
// //                     if (childProfileRes.status === 401) {
// //                         console.error("Unauthorized to fetch child profile.");
// //                         navigate("/login");
// //                         return;
// //                     }
// //                     throw new Error("Failed to fetch child data via session");
// //                 }
// //                 currentChildDetails = await childProfileRes.json();
// //                 setChildData(currentChildDetails);
// //             }
// //             // If navChildData was present, currentChildDetails is already set.

// //             // Now generate the report with the data we have.
// //             // Pass currentChildDetails (which might be null if not fetched/passed and not strictly needed for this version of the report)
// //             generateReport(currentResponses, currentChildDetails);

// //         } catch (error) {
// //             console.error("Error initializing report data:", error);
// //             // Potentially set an error message to display to the user
// //             navigate("/dashboard", {state: {error: "Failed to load report data."}});
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     initializeReport();

// //   }, [location, navigate]); // Rerun if location changes

// //   // generateReport now takes childData but might not use name/age for the report object
// //   const generateReport = (responses, /* currentChildData */) => { // childData is received but not used for name/age in report object
// //     if (!responses) {
// //         console.error("Cannot generate report: responses are missing.");
// //         setReport(null); // Ensure report is cleared
// //         setLoading(false);
// //         return;
// //     }
// //     // Calculate scores for each subtype
// //     const inattentiveScore = calculateSubtypeScore(responses, 1, 9);
// //     const hyperactiveScore = calculateSubtypeScore(responses, 10, 18);
// //     const combinedScore = inattentiveScore + hyperactiveScore;
// //     const oddScore = calculateSubtypeScore(responses, 19, 26);
// //     const cdScore = calculateSubtypeScore(responses, 27, 40);
// //     const anxietyScore = calculateSubtypeScore(responses, 41, 47);
    
// //     const hasPerformanceIssues = hasPerformanceProblems(responses);
    
// //     const inattentiveCutoff = hasInattentiveCutoff(responses, hasPerformanceIssues);
// //     const hyperactiveCutoff = hasHyperactiveCutoff(responses, hasPerformanceIssues);
// //     const combinedCutoff = inattentiveCutoff && hyperactiveCutoff;
// //     const oddCutoff = hasODDCutoff(responses, hasPerformanceIssues);
// //     const cdCutoff = hasCDCutoff(responses, hasPerformanceIssues);
// //     const anxietyCutoff = hasAnxietyCutoff(responses, hasPerformanceIssues);
    
// //     const inattentivePercentile = calculatePercentile(inattentiveScore, 27);
// //     const hyperactivePercentile = calculatePercentile(hyperactiveScore, 27);
// //     const combinedPercentile = calculatePercentile(combinedScore, 54);
// //     const oddPercentile = calculatePercentile(oddScore, 24);
// //     const cdPercentile = calculatePercentile(cdScore, 42);
// //     const anxietyPercentile = calculatePercentile(anxietyScore, 21);
    
// //     let primaryDiagnosis = "No ADHD diagnosis indicated";
// //     let subtypeDetails = "";
    
// //     if (combinedCutoff) {
// //       primaryDiagnosis = "ADHD - Combined Type";
// //       subtypeDetails = "Meets criteria for both Inattentive and Hyperactive/Impulsive subtypes";
// //     } else if (inattentiveCutoff) {
// //       primaryDiagnosis = "ADHD - Predominantly Inattentive Type";
// //       subtypeDetails = "Meets criteria for Inattentive subtype";
// //     } else if (hyperactiveCutoff) {
// //       primaryDiagnosis = "ADHD - Predominantly Hyperactive/Impulsive Type";
// //       subtypeDetails = "Meets criteria for Hyperactive/Impulsive subtype";
// //     }
    
// //     const reportData = {
// //       date: new Date().toLocaleDateString(),
// //       // REMOVED: childName: currentChildData?.name || "Unknown",
// //       // REMOVED: childAge: currentChildData?.age || calculateAge(currentChildData?.birthDate) || "Unknown",
// //       scores: {
// //         inattentive: { score: inattentiveScore, aboveCutoff: inattentiveCutoff, percentile: inattentivePercentile },
// //         hyperactive: { score: hyperactiveScore, aboveCutoff: hyperactiveCutoff, percentile: hyperactivePercentile },
// //         combined: { score: combinedScore, aboveCutoff: combinedCutoff, percentile: combinedPercentile },
// //         odd: { score: oddScore, aboveCutoff: oddCutoff, percentile: oddPercentile },
// //         cd: { score: cdScore, aboveCutoff: cdCutoff, percentile: cdPercentile },
// //         anxiety: { score: anxietyScore, aboveCutoff: anxietyCutoff, percentile: anxietyPercentile }
// //       },
// //       diagnosis: primaryDiagnosis,
// //       subtypeDetails: subtypeDetails,
// //       comorbidities: getComorbidities(oddCutoff, cdCutoff, anxietyCutoff),
// //       recommendations: getRecommendations(inattentiveCutoff, hyperactiveCutoff, combinedCutoff, oddCutoff, cdCutoff, anxietyCutoff)
// //     };
    
// //     setReport(reportData);
// //     // setLoading(false); // setLoading is handled in initializeReport's finally block
// //   };

// //   // --- Helper functions (calculateSubtypeScore, hasPerformanceProblems, etc.) remain UNCHANGED ---
// //   const calculateSubtypeScore = (responses, startId, endId) => {
// //     let total = 0;
// //     if (!responses) return 0; // Add a check for responses
// //     for (let i = startId; i <= endId; i++) {
// //       total += responses[i] || 0;
// //     }
// //     return total;
// //   };

// //   const hasPerformanceProblems = (responses) => {
// //     if (!responses) return false;
// //     for (let i = 48; i <= 55; i++) {
// //       if (responses[i] === 1 || responses[i] === 2) {
// //         return true;
// //       }
// //     }
// //     return false;
// //   };

// //   const hasInattentiveCutoff = (responses, hasPerformanceIssues) => {
// //     if (!responses || !hasPerformanceIssues) return false;
// //     let count = 0;
// //     for (let i = 1; i <= 9; i++) {
// //       if (responses[i] >= 2) count++;
// //     }
// //     return count >= 6;
// //   };

// //   const hasHyperactiveCutoff = (responses, hasPerformanceIssues) => {
// //     if (!responses || !hasPerformanceIssues) return false;
// //     let count = 0;
// //     for (let i = 10; i <= 18; i++) {
// //       if (responses[i] >= 2) count++;
// //     }
// //     return count >= 6;
// //   };

// //   const hasODDCutoff = (responses, hasPerformanceIssues) => {
// //      if (!responses || !hasPerformanceIssues) return false;
// //     let count = 0;
// //     for (let i = 19; i <= 26; i++) {
// //       if (responses[i] >= 2) count++;
// //     }
// //     return count >= 4;
// //   };

// //   const hasCDCutoff = (responses, hasPerformanceIssues) => {
// //      if (!responses || !hasPerformanceIssues) return false;
// //     let count = 0;
// //     for (let i = 27; i <= 40; i++) {
// //       if (responses[i] >= 2) count++;
// //     }
// //     return count >= 3;
// //   };

// //   const hasAnxietyCutoff = (responses, hasPerformanceIssues) => {
// //      if (!responses || !hasPerformanceIssues) return false;
// //     let count = 0;
// //     for (let i = 41; i <= 47; i++) {
// //       if (responses[i] >= 2) count++;
// //     }
// //     return count >= 3;
// //   };

// //   const calculatePercentile = (score, maxScore) => {
// //     if (maxScore === 0) return 0;
// //     return Math.min(99.9, Math.round((score / maxScore) * 100));
// //   };

// //   const calculateAge = (birthDate) => { // This function is now unused if age isn't displayed
// //     if (!birthDate) return "Unknown";
// //     const today = new Date();
// //     const birth = new Date(birthDate);
// //     let age = today.getFullYear() - birth.getFullYear();
// //     if (
// //       today.getMonth() < birth.getMonth() || 
// //       (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
// //     ) {
// //       age--;
// //     }
// //     return age;
// //   };

// //   const getComorbidities = (oddCutoff, cdCutoff, anxietyCutoff) => {
// //     const comorbidities = [];
// //     if (oddCutoff) comorbidities.push("Oppositional Defiant Disorder");
// //     if (cdCutoff) comorbidities.push("Conduct Disorder");
// //     if (anxietyCutoff) comorbidities.push("Anxiety/Depression");
// //     return comorbidities;
// //   };

// //   const getRecommendations = (inattentive, hyperactive, combined, odd, cd, anxiety) => {
// //     const recommendations = [];
// //     if (inattentive || hyperactive || combined) {
// //       recommendations.push("Comprehensive ADHD evaluation with a qualified healthcare professional");
// //       recommendations.push("Consider implementing classroom accommodations");
// //       if (inattentive) recommendations.push("Strategies for improving organization and focus");
// //       if (hyperactive) recommendations.push("Strategies for managing hyperactivity and impulsivity");
// //     }
// //     if (odd) {
// //       recommendations.push("Evaluation for Oppositional Defiant Disorder");
// //       recommendations.push("Parent management training may be beneficial");
// //     }
// //     if (cd) recommendations.push("Immediate evaluation for Conduct Disorder by a mental health professional");
// //     if (anxiety) recommendations.push("Evaluation for anxiety and/or depression");
// //     if (recommendations.length === 0) {
// //       recommendations.push("No specific interventions indicated based on current results");
// //       recommendations.push("Continue monitoring developmental progress");
// //     }
// //     return recommendations;
// //   };
// //   // --- End of Helper Functions ---

// //   if (loading) {
// //     return (
// //       <div className="report-container loading">
// //         <div className="loading-spinner"></div>
// //         <p>Generating report...</p>
// //       </div>
// //     );
// //   }

// //   if (!report) { // Added a check for report object before rendering
// //     return (
// //       <div className="report-container error">
// //         <p>Could not load or generate the report.</p>
// //         <button onClick={() => navigate("/dashboard")} className="primary-button">
// //             Return to Dashboard
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="report-container">
// //       <div className="report-header">
// //         <h1>ADHD Assessment Report</h1>
// //         <div className="report-meta">
// //           {/* REMOVED: <p><strong>Child:</strong> {report.childName}</p> */}
// //           {/* REMOVED: <p><strong>Age:</strong> {report.childAge}</p> */}
// //           <p><strong>Assessment Date:</strong> {report.date}</p>
// //         </div>
// //       </div>

// //       {/* Rest of the JSX remains the same, as it uses report.scores, report.diagnosis etc. */}
// //       <div className="report-section">
// //         <h2>Assessment Results</h2>
// //         <table className="results-table">
// //           <thead>
// //             <tr>
// //               <th>Scale</th>
// //               <th>Score</th>
// //               <th>Clinical Cutoff</th>
// //               <th>Percentile</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {/* Make sure report.scores is defined before mapping */}
// //             {report.scores && Object.entries(report.scores).map(([key, scaleData]) => (
// //                  <tr key={key}>
// //                     <td>{getReadableScaleName(key)}</td>
// //                     <td>{scaleData.score}</td>
// //                     <td>{scaleData.aboveCutoff ? "Above" : "Below"}</td>
// //                     <td>{scaleData.percentile}</td>
// //                  </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       <div className="report-section">
// //         <h2>Percentile Comparison</h2>
// //         <div className="percentile-chart">
// //           <div className="chart-bars">
// //             {report.scores && Object.entries(report.scores).map(([key, data]) => (
// //               <div className="chart-bar-container" key={key}>
// //                 <div className="chart-bar-label">{getReadableScaleName(key)}</div>
// //                 <div className="chart-bar-outer">
// //                   <div 
// //                     className={`chart-bar-inner ${data.aboveCutoff ? 'above-cutoff' : ''}`}
// //                     style={{ width: `${data.percentile}%` }}
// //                   ></div>
// //                 </div>
// //                 <div className="chart-bar-value">{data.percentile}%</div>
// //               </div>
// //             ))}
// //           </div>
// //           <div className="chart-legend">
// //             <p><span className="legend-normal"></span> Below clinical cutoff</p>
// //             <p><span className="legend-clinical"></span> Above clinical cutoff</p>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="report-section">
// //         <h2>Clinical Impression</h2>
// //         <div className="diagnosis-box">
// //           <h3>Primary Diagnosis:</h3>
// //           <p className="diagnosis">{report.diagnosis}</p>
// //           {report.subtypeDetails && <p className="subtype-details">{report.subtypeDetails}</p>}
// //         </div>
        
// //         {report.comorbidities && report.comorbidities.length > 0 && (
// //           <div className="comorbidities">
// //             <h3>Potential Comorbid Conditions:</h3>
// //             <ul>
// //               {report.comorbidities.map((condition, index) => (
// //                 <li key={index}>{condition}</li>
// //               ))}
// //             </ul>
// //             <p className="comorbid-note">
// //               <strong>Note:</strong> These potential comorbidities are screening indicators only 
// //               and require further comprehensive evaluation for diagnosis.
// //             </p>
// //           </div>
// //         )}
// //       </div>

// //       <div className="report-section">
// //         <h2>Recommendations</h2>
// //         <ul className="recommendations-list">
// //           {report.recommendations && report.recommendations.map((rec, index) => (
// //             <li key={index}>{rec}</li>
// //           ))}
// //         </ul>
// //       </div>

// //       <div className="report-section disclaimer">
// //         <h3>Important Notice</h3>
// //         <p>
// //           This report is generated based on the Vanderbilt ADHD Diagnostic Parent Rating Scale (VADPRS).
// //           Results should be interpreted by qualified healthcare professionals as part of a comprehensive
// //           evaluation. This screening tool alone is not sufficient for diagnosis.
// //         </p>
// //       </div>

// //       <div className="report-actions">
// //         <button 
// //           className="secondary-button" 
// //           onClick={() => navigate("/dashboard")}
// //         >
// //           Return to Dashboard
// //         </button>
// //         <button 
// //           className="primary-button" 
// //           onClick={() => window.print()}
// //         >
// //           Print Report
// //         </button>
// //       </div>
// //     </div>
// //   );

// //   function getReadableScaleName(key) {
// //     const names = {
// //       inattentive: "Inattentive", hyperactive: "Hyperactive", combined: "Combined",
// //       odd: "Oppositional", cd: "Conduct", anxiety: "Anxiety/Depression"
// //     };
// //     return names[key] || key;
// //   }
// // };

// // export default ReportPage;

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./ReportPage.css"; // Make sure this file exists and contains necessary styles
// import NavigationBar from "./NavigationBar"; // Import the NavigationBar

// const ReportPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [report, setReport] = useState(null);
//   const [childDataForNav, setChildDataForNav] = useState(null); // For NavigationBar
//   // childData from state (passed or fetched for report context)
//   // This is separate from childDataForNav which is specifically for the navbar
//   const [contextualChildData, setContextualChildData] = useState(null);


//   useEffect(() => {
//     const responses = location.state?.responses;
//     const childIdFromState = location.state?.childId; // ID from questionnaire form for *this* report
//     const navChildDataFromState = location.state?.childData; // General child data passed for nav

//     const initializeReport = async () => {
//         setLoading(true);
//         try {
//             let currentResponses = responses;
//             let fetchedChildDetailsForNav = null; // To store fetched child data for nav
//             let fetchedChildDetailsForContext = null; // For report context if needed

//             // Priority 1: Use navChildDataFromState for the Navbar if passed
//             if (navChildDataFromState) {
//                 setChildDataForNav(navChildDataFromState);
//                 fetchedChildDetailsForNav = navChildDataFromState; // Keep a copy
//             }

//             // Determine the childId to use for fetching report/profile data
//             // This could be childIdFromState (for a specific report) or from session (for general profile)
//             const effectiveChildId = childIdFromState; // Assuming report is always for a specific childId passed

//             if (!effectiveChildId) {
//                  console.warn("Child ID for the report is missing, trying to fetch general profile for Navbar.");
//                  // Attempt to fetch general profile for navbar if no specific childId for report
//                 const childProfileRes = await fetch(`http://localhost:8800/api/child/profile`, { credentials: "include" });
//                 if (childProfileRes.ok) {
//                     fetchedChildDetailsForNav = await childProfileRes.json();
//                     setChildDataForNav(fetchedChildDetailsForNav);
//                 } else if (childProfileRes.status === 401) {
//                     navigate("/signin"); return;
//                 }
//                 // If still no childId for the report, we might have an issue
//                 // For now, let's assume if responses are missing, we need to fetch them too
//                 if (!responses) {
//                      console.error("Critical: Child ID and responses missing for report. Cannot proceed.");
//                      navigate("/dashboard", {state: {error: "Cannot load report: Child ID and responses missing."}});
//                      return;
//                 }

//             } else {
//                 // If effectiveChildId is present (from questionnaire form)
//                 // Fetch responses if not passed via state
//                 if (!responses) {
//                     console.log(`Fetching questionnaire results for child ID: ${effectiveChildId}`);
//                     const resultsRes = await fetch(`http://localhost:8800/api/questionnaire/results/${effectiveChildId}`, { credentials: "include" });
//                     if (!resultsRes.ok) throw new Error("Failed to fetch questionnaire data for report");
//                     const questionnaireData = await resultsRes.json();
//                     currentResponses = questionnaireData.responses;
//                 }

//                 // Fetch child profile for Navbar if not already set from navChildDataFromState
//                 // AND/OR if you want fresh data for the navbar even if some was passed.
//                 // This also serves as an auth check.
//                 if (!fetchedChildDetailsForNav) {
//                     console.log("Fetching child profile for Navbar via session");
//                     const childProfileRes = await fetch(`http://localhost:8800/api/child/profile`, { credentials: "include" });
//                     if (childProfileRes.ok) {
//                         fetchedChildDetailsForNav = await childProfileRes.json();
//                         setChildDataForNav(fetchedChildDetailsForNav);
//                     } else if (childProfileRes.status === 401) {
//                         navigate("/signin"); return;
//                     } else {
//                         console.warn("Could not fetch child profile for navbar, proceeding without it if possible.");
//                     }
//                 }
//             }

//             // For the report itself, you might decide you don't need to display child's name/age directly
//             // but if you did, you'd use 'fetchedChildDetailsForNav' or fetch it specifically for 'effectiveChildId'
//             setContextualChildData(fetchedChildDetailsForNav); // or fetch specific child data for report if different logic

//             if (!currentResponses) {
//                 console.error("Cannot generate report: Responses are still missing after fetch attempts.");
//                 // Optionally, set an error state to display to the user
//                 setReport(null);
//             } else {
//                  generateReport(currentResponses, fetchedChildDetailsForNav /* pass if generateReport uses it */);
//             }

//         } catch (error) {
//             console.error("Error initializing report data:", error);
//             navigate("/dashboard", {state: {error: "Failed to load report data."}});
//         } finally {
//             setLoading(false);
//         }
//     };

//     initializeReport();

//   }, [location.state, navigate]); // Depend on location.state for re-fetching if it changes

//   const generateReport = (responses, currentChildDetails /* if used */) => {
//     if (!responses) {
//         console.error("Cannot generate report: responses are missing.");
//         setReport(null);
//         return;
//     }
//     const inattentiveScore = calculateSubtypeScore(responses, 1, 9);
//     const hyperactiveScore = calculateSubtypeScore(responses, 10, 18);
//     const combinedScore = inattentiveScore + hyperactiveScore;
//     const oddScore = calculateSubtypeScore(responses, 19, 26);
//     const cdScore = calculateSubtypeScore(responses, 27, 40);
//     const anxietyScore = calculateSubtypeScore(responses, 41, 47);

//     const hasPerformanceIssues = hasPerformanceProblems(responses);

//     const inattentiveCutoff = hasInattentiveCutoff(responses, hasPerformanceIssues);
//     const hyperactiveCutoff = hasHyperactiveCutoff(responses, hasPerformanceIssues);
//     const combinedCutoff = inattentiveCutoff && hyperactiveCutoff;
//     const oddCutoff = hasODDCutoff(responses, hasPerformanceIssues);
//     const cdCutoff = hasCDCutoff(responses, hasPerformanceIssues);
//     const anxietyCutoff = hasAnxietyCutoff(responses, hasPerformanceIssues);

//     const inattentivePercentile = calculatePercentile(inattentiveScore, 27);
//     const hyperactivePercentile = calculatePercentile(hyperactiveScore, 27);
//     const combinedPercentile = calculatePercentile(combinedScore, 54);
//     const oddPercentile = calculatePercentile(oddScore, 24);
//     const cdPercentile = calculatePercentile(cdScore, 42);
//     const anxietyPercentile = calculatePercentile(anxietyScore, 21);

//     let primaryDiagnosis = "No ADHD diagnosis indicated";
//     let subtypeDetails = "";

//     if (combinedCutoff) {
//       primaryDiagnosis = "ADHD - Combined Type";
//       subtypeDetails = "Meets criteria for both Inattentive and Hyperactive/Impulsive subtypes";
//     } else if (inattentiveCutoff) {
//       primaryDiagnosis = "ADHD - Predominantly Inattentive Type";
//       subtypeDetails = "Meets criteria for Inattentive subtype";
//     } else if (hyperactiveCutoff) {
//       primaryDiagnosis = "ADHD - Predominantly Hyperactive/Impulsive Type";
//       subtypeDetails = "Meets criteria for Hyperactive/Impulsive subtype";
//     }

//     const reportData = {
//       date: new Date().toLocaleDateString(),
//       // If you decide to show child's name/age in the report header:
//       // childName: currentChildDetails?.name || "N/A",
//       // childAge: currentChildDetails?.age !== undefined ? currentChildDetails.age : "N/A",
//       scores: {
//         inattentive: { score: inattentiveScore, aboveCutoff: inattentiveCutoff, percentile: inattentivePercentile },
//         hyperactive: { score: hyperactiveScore, aboveCutoff: hyperactiveCutoff, percentile: hyperactivePercentile },
//         combined: { score: combinedScore, aboveCutoff: combinedCutoff, percentile: combinedPercentile },
//         odd: { score: oddScore, aboveCutoff: oddCutoff, percentile: oddPercentile },
//         cd: { score: cdScore, aboveCutoff: cdCutoff, percentile: cdPercentile },
//         anxiety: { score: anxietyScore, aboveCutoff: anxietyCutoff, percentile: anxietyPercentile }
//       },
//       diagnosis: primaryDiagnosis,
//       subtypeDetails: subtypeDetails,
//       comorbidities: getComorbidities(oddCutoff, cdCutoff, anxietyCutoff),
//       recommendations: getRecommendations(inattentiveCutoff, hyperactiveCutoff, combinedCutoff, oddCutoff, cdCutoff, anxietyCutoff)
//     };

//     setReport(reportData);
//   };

//   // --- Helper functions (unchanged) ---
//   const calculateSubtypeScore = (responses, startId, endId) => {
//     let total = 0;
//     if (!responses) return 0;
//     for (let i = startId; i <= endId; i++) {
//       total += responses[i] || 0;
//     }
//     return total;
//   };

//   const hasPerformanceProblems = (responses) => {
//     if (!responses) return false;
//     for (let i = 48; i <= 55; i++) {
//       if (responses[i] === 1 || responses[i] === 2) {
//         return true;
//       }
//     }
//     return false;
//   };

//   const hasInattentiveCutoff = (responses, hasPerformanceIssues) => {
//     if (!responses || !hasPerformanceIssues) return false;
//     let count = 0;
//     for (let i = 1; i <= 9; i++) {
//       if (responses[i] >= 2) count++;
//     }
//     return count >= 6;
//   };

//   const hasHyperactiveCutoff = (responses, hasPerformanceIssues) => {
//     if (!responses || !hasPerformanceIssues) return false;
//     let count = 0;
//     for (let i = 10; i <= 18; i++) {
//       if (responses[i] >= 2) count++;
//     }
//     return count >= 6;
//   };

//   const hasODDCutoff = (responses, hasPerformanceIssues) => {
//      if (!responses || !hasPerformanceIssues) return false;
//     let count = 0;
//     for (let i = 19; i <= 26; i++) {
//       if (responses[i] >= 2) count++;
//     }
//     return count >= 4;
//   };

//   const hasCDCutoff = (responses, hasPerformanceIssues) => {
//      if (!responses || !hasPerformanceIssues) return false;
//     let count = 0;
//     for (let i = 27; i <= 40; i++) {
//       if (responses[i] >= 2) count++;
//     }
//     return count >= 3;
//   };

//   const hasAnxietyCutoff = (responses, hasPerformanceIssues) => {
//      if (!responses || !hasPerformanceIssues) return false;
//     let count = 0;
//     for (let i = 41; i <= 47; i++) {
//       if (responses[i] >= 2) count++;
//     }
//     return count >= 3;
//   };

//   const calculatePercentile = (score, maxScore) => {
//     if (maxScore === 0) return 0;
//     return Math.min(99.9, Math.round((score / maxScore) * 100));
//   };

//   const getComorbidities = (oddCutoff, cdCutoff, anxietyCutoff) => {
//     const comorbidities = [];
//     if (oddCutoff) comorbidities.push("Oppositional Defiant Disorder");
//     if (cdCutoff) comorbidities.push("Conduct Disorder");
//     if (anxietyCutoff) comorbidities.push("Anxiety/Depression");
//     return comorbidities;
//   };

//   const getRecommendations = (inattentive, hyperactive, combined, odd, cd, anxiety) => {
//     const recommendations = [];
//     if (inattentive || hyperactive || combined) {
//       recommendations.push("Comprehensive ADHD evaluation with a qualified healthcare professional");
//       recommendations.push("Consider implementing classroom accommodations");
//       if (inattentive) recommendations.push("Strategies for improving organization and focus");
//       if (hyperactive) recommendations.push("Strategies for managing hyperactivity and impulsivity");
//     }
//     if (odd) {
//       recommendations.push("Evaluation for Oppositional Defiant Disorder");
//       recommendations.push("Parent management training may be beneficial");
//     }
//     if (cd) recommendations.push("Immediate evaluation for Conduct Disorder by a mental health professional");
//     if (anxiety) recommendations.push("Evaluation for anxiety and/or depression");
//     if (recommendations.length === 0) {
//       recommendations.push("No specific interventions indicated based on current results");
//       recommendations.push("Continue monitoring developmental progress");
//     }
//     return recommendations;
//   };
//   // --- End of Helper Functions ---


//   if (loading) {
//     return (
//       <>
//         <NavigationBar child={childDataForNav} /> {/* Show nav even during loading */}
//         <div className="report-container loading">
//           <div className="loading-spinner"></div>
//           <p>Generating report...</p>
//         </div>
//       </>
//     );
//   }

//   if (!report) {
//     return (
//       <>
//         <NavigationBar child={childDataForNav} />
//         <div className="report-container error">
//           <p>Could not load or generate the report data. Please ensure you have completed a questionnaire.</p>
//           {/* Removed Return to Dashboard button */}
//         </div>
//       </>
//     );
//   }

//   // Main content rendering
//   return (
//     <>
//       <NavigationBar child={childDataForNav} /> {/* Pass fetched child data to Nav */}
//       <div className="report-page-wrapper"> {/* Wrapper for content below navbar */}
//         <div className="report-container">
//           <div className="report-header no-print"> {/* Add no-print class to hide this on print if needed */}
//             <h1>ADHD Assessment Report</h1>
//             <div className="report-meta">
//               {/* If you decide to show child's name/age in the report header: */}
//               {/* <p><strong>Child:</strong> {report.childName}</p> */}
//               {/* <p><strong>Age:</strong> {report.childAge}</p> */}
//               <p><strong>Assessment Date:</strong> {report.date}</p>
//             </div>
//           </div>

//           <div className="report-section">
//             <h2>Assessment Results</h2>
//             <table className="results-table">
//               <thead>
//                 <tr>
//                   <th>Scale</th>
//                   <th>Score</th>
//                   <th>Clinical Cutoff</th>
//                   <th>Percentile</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {report.scores && Object.entries(report.scores).map(([key, scaleData]) => (
//                      <tr key={key}>
//                         <td>{getReadableScaleName(key)}</td>
//                         <td>{scaleData.score}</td>
//                         <td>{scaleData.aboveCutoff ? "Above" : "Below"}</td>
//                         <td>{scaleData.percentile}</td>
//                      </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="report-section">
//             <h2>Percentile Comparison</h2>
//             <div className="percentile-chart">
//               <div className="chart-bars">
//                 {report.scores && Object.entries(report.scores).map(([key, data]) => (
//                   <div className="chart-bar-container" key={key}>
//                     <div className="chart-bar-label">{getReadableScaleName(key)}</div>
//                     <div className="chart-bar-outer">
//                       <div
//                         className={`chart-bar-inner ${data.aboveCutoff ? 'above-cutoff' : ''}`}
//                         style={{ width: `${data.percentile}%` }}
//                       ></div>
//                     </div>
//                     <div className="chart-bar-value">{data.percentile}%</div>
//                   </div>
//                 ))}
//               </div>
//               <div className="chart-legend">
//                 <p><span className="legend-normal"></span> Below clinical cutoff</p>
//                 <p><span className="legend-clinical"></span> Above clinical cutoff</p>
//               </div>
//             </div>
//           </div>

//           <div className="report-section">
//             <h2>Clinical Impression</h2>
//             <div className="diagnosis-box">
//               <h3>Primary Diagnosis:</h3>
//               <p className="diagnosis">{report.diagnosis}</p>
//               {report.subtypeDetails && <p className="subtype-details">{report.subtypeDetails}</p>}
//             </div>

//             {report.comorbidities && report.comorbidities.length > 0 && (
//               <div className="comorbidities">
//                 <h3>Potential Comorbid Conditions:</h3>
//                 <ul>
//                   {report.comorbidities.map((condition, index) => (
//                     <li key={index}>{condition}</li>
//                   ))}
//                 </ul>
//                 <p className="comorbid-note">
//                   <strong>Note:</strong> These potential comorbidities are screening indicators only
//                   and require further comprehensive evaluation for diagnosis.
//                 </p>
//               </div>
//             )}
//           </div>

//           <div className="report-section">
//             <h2>Recommendations</h2>
//             <ul className="recommendations-list">
//               {report.recommendations && report.recommendations.map((rec, index) => (
//                 <li key={index}>{rec}</li>
//               ))}
//             </ul>
//           </div>

//           <div className="report-section disclaimer">
//             <h3>Important Notice</h3>
//             <p>
//               This report is generated based on the Vanderbilt ADHD Diagnostic Parent Rating Scale (VADPRS).
//               Results should be interpreted by qualified healthcare professionals as part of a comprehensive
//               evaluation. This screening tool alone is not sufficient for diagnosis.
//             </p>
//           </div>

//           <div className="report-actions no-print"> {/* Add no-print class */}
//             {/* Return to Dashboard button is removed as requested */}
//             <button
//               className="primary-button"
//               onClick={() => window.print()}
//             >
//               Print Report
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );

//   function getReadableScaleName(key) {
//     const names = {
//       inattentive: "Inattentive", hyperactive: "Hyperactive", combined: "Combined",
//       odd: "Oppositional", cd: "Conduct", anxiety: "Anxiety/Depression"
//     };
//     return names[key] || key;
//   }
// };

// export default ReportPage;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReportPage.css"; // Make sure this file exists and contains necessary styles
import NavigationBar from "./NavigationBar"; // Import the NavigationBar

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [childDataForNav, setChildDataForNav] = useState(null); // For NavigationBar
  // const [contextualChildData, setContextualChildData] = useState(null); // If needed for report content

  useEffect(() => {
    const responses = location.state?.responses;
    const childIdFromState = location.state?.childId; // ID from questionnaire form for *this* report
    const navChildDataFromState = location.state?.childData; // General child data passed for nav

    const initializeReport = async () => {
        setLoading(true);
        try {
            let currentResponses = responses;
            let fetchedChildDetailsForNav = null;

            if (navChildDataFromState) {
                setChildDataForNav(navChildDataFromState);
                fetchedChildDetailsForNav = navChildDataFromState;
            }

            const effectiveChildId = childIdFromState;

            if (!effectiveChildId && !currentResponses) { // If no specific report context and no responses
                console.warn("Attempting to fetch general profile for Navbar as no specific report context.");
                const childProfileRes = await fetch(`http://localhost:8800/api/child/profile`, { credentials: "include" });
                if (childProfileRes.ok) {
                    fetchedChildDetailsForNav = await childProfileRes.json();
                    setChildDataForNav(fetchedChildDetailsForNav);
                    // No report to generate in this case, perhaps show a message or redirect
                    console.log("No report data to display, showing page with Navbar only.");
                    setReport(null); // Explicitly set report to null
                } else if (childProfileRes.status === 401) {
                    navigate("/signin"); return;
                } else {
                    // Failed to fetch even general profile
                    console.error("Failed to fetch child profile for Navbar.");
                    navigate("/dashboard", {state: {error: "Failed to load page data."}});
                    return;
                }
            } else if (effectiveChildId) { // We have a childId, presumably for a specific report
                if (!responses) { // Fetch responses if not passed via state for this specific childId
                    console.log(`Fetching questionnaire results for child ID: ${effectiveChildId}`);
                    const resultsRes = await fetch(`http://localhost:8800/api/questionnaire/results/${effectiveChildId}`, { credentials: "include" });
                    if (!resultsRes.ok) throw new Error(`Failed to fetch questionnaire data for report (child ID: ${effectiveChildId})`);
                    const questionnaireData = await resultsRes.json();
                    currentResponses = questionnaireData.responses;
                }

                // Fetch child profile for Navbar if not already set from navChildDataFromState
                // This also serves as an auth check.
                if (!fetchedChildDetailsForNav) {
                    console.log("Fetching child profile for Navbar via session");
                    const childProfileRes = await fetch(`http://localhost:8800/api/child/profile`, { credentials: "include" });
                    if (childProfileRes.ok) {
                        fetchedChildDetailsForNav = await childProfileRes.json();
                        setChildDataForNav(fetchedChildDetailsForNav);
                    } else if (childProfileRes.status === 401) {
                        console.error("Unauthorized to fetch child profile for Navbar.");
                        navigate("/signin"); return;
                    } else {
                        console.warn("Could not fetch child profile for navbar, report generation might proceed without it if not strictly needed for report content.");
                    }
                }
                // setContextualChildData(fetchedChildDetailsForNav); // Or fetch specifically for effectiveChildId if different

                if (!currentResponses) {
                    console.error("Cannot generate report: Responses are still missing after fetch attempts for the given child ID.");
                    setReport(null);
                } else {
                     generateReport(currentResponses, fetchedChildDetailsForNav /* pass if generateReport uses it */);
                }

            } else if (currentResponses && !effectiveChildId) {
                // This case implies responses were passed but no specific childId for them
                // This might be an edge case or an error in how state is passed
                console.warn("Responses provided without a specific child ID for the report. Generating generic report.");
                 // Fetch general profile for Navbar if not already available
                if (!fetchedChildDetailsForNav) {
                    const childProfileRes = await fetch(`http://localhost:8800/api/child/profile`, { credentials: "include" });
                    if (childProfileRes.ok) {
                        fetchedChildDetailsForNav = await childProfileRes.json();
                        setChildDataForNav(fetchedChildDetailsForNav);
                    } else if (childProfileRes.status === 401) {
                         navigate("/signin"); return;
                    }
                }
                generateReport(currentResponses, fetchedChildDetailsForNav);
            }


        } catch (error) {
            console.error("Error initializing report data:", error);
            setReport(null); // Ensure report is null on error
            // navigate("/dashboard", {state: {error: "Failed to load report data."}}); // Or show error on page
        } finally {
            setLoading(false);
        }
    };

    initializeReport();

  }, [location.state, navigate]);

  const generateReport = (responses, currentChildDetails /* if used for name/age in report */) => {
    if (!responses) {
        console.error("Cannot generate report: responses are missing.");
        setReport(null);
        return;
    }
    const inattentiveScore = calculateSubtypeScore(responses, 1, 9);
    const hyperactiveScore = calculateSubtypeScore(responses, 10, 18);
    const combinedScore = inattentiveScore + hyperactiveScore;
    const oddScore = calculateSubtypeScore(responses, 19, 26);
    const cdScore = calculateSubtypeScore(responses, 27, 40);
    const anxietyScore = calculateSubtypeScore(responses, 41, 47);

    const hasPerformanceIssues = hasPerformanceProblems(responses);

    const inattentiveCutoff = hasInattentiveCutoff(responses, hasPerformanceIssues);
    const hyperactiveCutoff = hasHyperactiveCutoff(responses, hasPerformanceIssues);
    const combinedCutoff = inattentiveCutoff && hyperactiveCutoff;
    const oddCutoff = hasODDCutoff(responses, hasPerformanceIssues);
    const cdCutoff = hasCDCutoff(responses, hasPerformanceIssues);
    const anxietyCutoff = hasAnxietyCutoff(responses, hasPerformanceIssues);

    const inattentivePercentile = calculatePercentile(inattentiveScore, 27);
    const hyperactivePercentile = calculatePercentile(hyperactiveScore, 27);
    const combinedPercentile = calculatePercentile(combinedScore, 54);
    const oddPercentile = calculatePercentile(oddScore, 24);
    const cdPercentile = calculatePercentile(cdScore, 42);
    const anxietyPercentile = calculatePercentile(anxietyScore, 21);

    let primaryDiagnosis = "No ADHD diagnosis indicated";
    let subtypeDetails = "";

    if (combinedCutoff) {
      primaryDiagnosis = "ADHD - Combined Type";
      subtypeDetails = "Meets criteria for both Inattentive and Hyperactive/Impulsive subtypes";
    } else if (inattentiveCutoff) {
      primaryDiagnosis = "ADHD - Predominantly Inattentive Type";
      subtypeDetails = "Meets criteria for Inattentive subtype";
    } else if (hyperactiveCutoff) {
      primaryDiagnosis = "ADHD - Predominantly Hyperactive/Impulsive Type";
      subtypeDetails = "Meets criteria for Hyperactive/Impulsive subtype";
    }

    const reportData = {
      date: new Date().toLocaleDateString(),
      // Example if you want to include child's name/age in the report object (but not necessarily display it)
      // childName: currentChildDetails?.name || "N/A",
      // childAge: currentChildDetails?.age !== undefined ? currentChildDetails.age : "N/A",
      scores: {
        inattentive: { score: inattentiveScore, aboveCutoff: inattentiveCutoff, percentile: inattentivePercentile },
        hyperactive: { score: hyperactiveScore, aboveCutoff: hyperactiveCutoff, percentile: hyperactivePercentile },
        combined: { score: combinedScore, aboveCutoff: combinedCutoff, percentile: combinedPercentile },
        odd: { score: oddScore, aboveCutoff: oddCutoff, percentile: oddPercentile },
        cd: { score: cdScore, aboveCutoff: cdCutoff, percentile: cdPercentile },
        anxiety: { score: anxietyScore, aboveCutoff: anxietyCutoff, percentile: anxietyPercentile }
      },
      diagnosis: primaryDiagnosis,
      subtypeDetails: subtypeDetails,
      comorbidities: getComorbidities(oddCutoff, cdCutoff, anxietyCutoff),
      recommendations: getRecommendations(inattentiveCutoff, hyperactiveCutoff, combinedCutoff, oddCutoff, cdCutoff, anxietyCutoff)
    };

    setReport(reportData);
  };

  // --- Helper functions (unchanged from your provided code) ---
  const calculateSubtypeScore = (responses, startId, endId) => {
    let total = 0;
    if (!responses) return 0;
    for (let i = startId; i <= endId; i++) {
      total += responses[i] || 0;
    }
    return total;
  };

  const hasPerformanceProblems = (responses) => {
    if (!responses) return false;
    for (let i = 48; i <= 55; i++) {
      if (responses[i] === 1 || responses[i] === 2) {
        return true;
      }
    }
    return false;
  };

  const hasInattentiveCutoff = (responses, hasPerformanceIssues) => {
    if (!responses || !hasPerformanceIssues) return false;
    let count = 0;
    for (let i = 1; i <= 9; i++) {
      if (responses[i] >= 2) count++;
    }
    return count >= 6;
  };

  const hasHyperactiveCutoff = (responses, hasPerformanceIssues) => {
    if (!responses || !hasPerformanceIssues) return false;
    let count = 0;
    for (let i = 10; i <= 18; i++) {
      if (responses[i] >= 2) count++;
    }
    return count >= 6;
  };

  const hasODDCutoff = (responses, hasPerformanceIssues) => {
     if (!responses || !hasPerformanceIssues) return false;
    let count = 0;
    for (let i = 19; i <= 26; i++) {
      if (responses[i] >= 2) count++;
    }
    return count >= 4;
  };

  const hasCDCutoff = (responses, hasPerformanceIssues) => {
     if (!responses || !hasPerformanceIssues) return false;
    let count = 0;
    for (let i = 27; i <= 40; i++) {
      if (responses[i] >= 2) count++;
    }
    return count >= 3;
  };

  const hasAnxietyCutoff = (responses, hasPerformanceIssues) => {
     if (!responses || !hasPerformanceIssues) return false;
    let count = 0;
    for (let i = 41; i <= 47; i++) {
      if (responses[i] >= 2) count++;
    }
    return count >= 3;
  };

  const calculatePercentile = (score, maxScore) => {
    if (maxScore === 0) return 0;
    return Math.min(99.9, Math.round((score / maxScore) * 100));
  };

  const getComorbidities = (oddCutoff, cdCutoff, anxietyCutoff) => {
    const comorbidities = [];
    if (oddCutoff) comorbidities.push("Oppositional Defiant Disorder");
    if (cdCutoff) comorbidities.push("Conduct Disorder");
    if (anxietyCutoff) comorbidities.push("Anxiety/Depression");
    return comorbidities;
  };

  const getRecommendations = (inattentive, hyperactive, combined, odd, cd, anxiety) => {
    const recommendations = [];
    if (inattentive || hyperactive || combined) {
      recommendations.push("Comprehensive ADHD evaluation with a qualified healthcare professional");
      recommendations.push("Consider implementing classroom accommodations");
      if (inattentive) recommendations.push("Strategies for improving organization and focus");
      if (hyperactive) recommendations.push("Strategies for managing hyperactivity and impulsivity");
    }
    if (odd) {
      recommendations.push("Evaluation for Oppositional Defiant Disorder");
      recommendations.push("Parent management training may be beneficial");
    }
    if (cd) recommendations.push("Immediate evaluation for Conduct Disorder by a mental health professional");
    if (anxiety) recommendations.push("Evaluation for anxiety and/or depression");
    if (recommendations.length === 0) {
      recommendations.push("No specific interventions indicated based on current results");
      recommendations.push("Continue monitoring developmental progress");
    }
    return recommendations;
  };
  // --- End of Helper Functions ---


  if (loading) {
    return (
      <>
        <NavigationBar child={childDataForNav} />
        <div className="report-page-wrapper">
            <div className="report-container loading">
                <div className="loading-spinner"></div>
                <p>Generating report...</p>
            </div>
        </div>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <NavigationBar child={childDataForNav} />
         <div className="report-page-wrapper">
            <div className="report-container error">
                <p>Could not generate or load the report.</p>
                <p>Please ensure you have completed a questionnaire or try again later.</p>
                {/* Button to go back or to dashboard can be added here if desired for error state */}
                {/* <button onClick={() => navigate("/dashboard")} className="primary-button">Return to Dashboard</button> */}
            </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavigationBar child={childDataForNav} />
      <div className="report-page-wrapper">
        <div className="report-container">
          {/* Added 'no-print' class to this header */}
          <div className="report-header no-print">
            <h1>ADHD Assessment Report</h1>
            <div className="report-meta">
              {/* Child name and age can be displayed here if 'report.childName' and 'report.childAge' exist */}
              {/* <p><strong>Child:</strong> {report.childName || 'N/A'}</p> */}
              {/* <p><strong>Age:</strong> {report.childAge || 'N/A'}</p> */}
              <p><strong>Assessment Date:</strong> {report.date}</p>
            </div>
          </div>

          <div className="report-section">
            <h2>Assessment Results</h2>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Scale</th>
                  <th>Score</th>
                  <th>Clinical Cutoff</th>
                  <th>Percentile</th>
                </tr>
              </thead>
              <tbody>
                {report.scores && Object.entries(report.scores).map(([key, scaleData]) => (
                     <tr key={key}>
                        <td>{getReadableScaleName(key)}</td>
                        <td>{scaleData.score}</td>
                        <td>{scaleData.aboveCutoff ? "Above" : "Below"}</td>
                        <td>{scaleData.percentile}</td>
                     </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="report-section">
            <h2>Percentile Comparison</h2>
            <div className="percentile-chart">
              <div className="chart-bars">
                {report.scores && Object.entries(report.scores).map(([key, data]) => (
                  <div className="chart-bar-container" key={key}>
                    <div className="chart-bar-label">{getReadableScaleName(key)}</div>
                    <div className="chart-bar-outer">
                      <div
                        className={`chart-bar-inner ${data.aboveCutoff ? 'above-cutoff' : ''}`}
                        style={{ width: `${data.percentile}%` }}
                      >
                        {/* Optionally display percentile inside bar: data.percentile > 10 ? `${data.percentile}%` : '' */}
                      </div>
                    </div>
                    <div className="chart-bar-value">{data.percentile}%</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <p><span className="legend-normal"></span> Below clinical cutoff</p>
                <p><span className="legend-clinical"></span> Above clinical cutoff</p>
              </div>
            </div>
          </div>

          <div className="report-section">
            <h2>Clinical Impression</h2>
            <div className="diagnosis-box">
              <h3>Primary Diagnosis:</h3>
              <p className="diagnosis">{report.diagnosis}</p>
              {report.subtypeDetails && <p className="subtype-details">{report.subtypeDetails}</p>}
            </div>

            {report.comorbidities && report.comorbidities.length > 0 && (
              <div className="comorbidities">
                <h3>Potential Comorbid Conditions:</h3>
                <ul>
                  {report.comorbidities.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
                <p className="comorbid-note">
                  <strong>Note:</strong> These potential comorbidities are screening indicators only
                  and require further comprehensive evaluation for diagnosis.
                </p>
              </div>
            )}
          </div>

          <div className="report-section">
            <h2>Recommendations</h2>
            <ul className="recommendations-list">
              {report.recommendations && report.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="report-section disclaimer">
            <h3>Important Notice</h3>
            <p>
              This report is generated based on the Vanderbilt ADHD Diagnostic Parent Rating Scale (VADPRS).
              Results should be interpreted by qualified healthcare professionals as part of a comprehensive
              evaluation. This screening tool alone is not sufficient for diagnosis.
            </p>
          </div>

          {/* 'report-actions' div has 'no-print' class for hiding the print button during printing */}
          <div className="report-actions no-print">
            <button
              className="primary-button"
              onClick={() => window.print()}
            >
              Print Report
            </button>
          </div>
        </div>
      </div>
    </>
  );

  function getReadableScaleName(key) {
    const names = {
      inattentive: "Inattentive", hyperactive: "Hyperactive", combined: "Combined",
      odd: "Oppositional", cd: "Conduct", anxiety: "Anxiety/Depression"
    };
    return names[key] || key;
  }
};

export default ReportPage;