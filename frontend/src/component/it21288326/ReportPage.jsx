import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReportPage.css";

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [childData, setChildData] = useState(null);

  useEffect(() => {
    // Get responses and child data from location state or API
    const responses = location.state?.responses;
    const childId = location.state?.childId;
    
    if (!responses || !childId) {
      // If no data in state, try to fetch from API
      fetchReportData(childId);
    } else {
      // Generate report from available data
      generateReport(responses, location.state?.childData);
    }
  }, [location]);

  const fetchReportData = async (childId) => {
    try {
      setLoading(true);
      // Fetch responses if not available in state
      const responseData = await fetch(`http://localhost:8800/api/questionnaire/results/${childId}`, {
        credentials: "include"
      });
      
      if (!responseData.ok) {
        throw new Error("Failed to fetch questionnaire data");
      }
      
      const data = await responseData.json();
      
      // Fetch child information
      const childResponse = await fetch(`http://localhost:8800/api/children/${childId}`, {
        credentials: "include"
      });
      
      if (!childResponse.ok) {
        throw new Error("Failed to fetch child data");
      }
      
      const childData = await childResponse.json();
      setChildData(childData);
      
      // Generate report
      generateReport(data.responses, childData);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const generateReport = (responses, childData) => {
    // Calculate scores for each subtype
    const inattentiveScore = calculateSubtypeScore(responses, 1, 9);
    const hyperactiveScore = calculateSubtypeScore(responses, 10, 18);
    const combinedScore = inattentiveScore + hyperactiveScore;
    const oddScore = calculateSubtypeScore(responses, 19, 26);
    const cdScore = calculateSubtypeScore(responses, 27, 40);
    const anxietyScore = calculateSubtypeScore(responses, 41, 47);
    
    // Calculate performance issues
    const hasPerformanceIssues = hasPerformanceProblems(responses);
    
    // Determine clinical cutoffs
    const inattentiveCutoff = hasInattentiveCutoff(responses, hasPerformanceIssues);
    const hyperactiveCutoff = hasHyperactiveCutoff(responses, hasPerformanceIssues);
    const combinedCutoff = inattentiveCutoff && hyperactiveCutoff;
    const oddCutoff = hasODDCutoff(responses, hasPerformanceIssues);
    const cdCutoff = hasCDCutoff(responses, hasPerformanceIssues);
    const anxietyCutoff = hasAnxietyCutoff(responses, hasPerformanceIssues);
    
    // Calculate percentiles (this would normally come from normed data)
    // For now, using simple estimation based on max possible scores
    const inattentivePercentile = calculatePercentile(inattentiveScore, 27); // max 27 (9 questions * 3 max score)
    const hyperactivePercentile = calculatePercentile(hyperactiveScore, 27);
    const combinedPercentile = calculatePercentile(combinedScore, 54);
    const oddPercentile = calculatePercentile(oddScore, 24);
    const cdPercentile = calculatePercentile(cdScore, 42);
    const anxietyPercentile = calculatePercentile(anxietyScore, 21);
    
    // Determine primary diagnosis
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
    
    // Create report object
    const reportData = {
      date: new Date().toLocaleDateString(),
      childName: childData?.name || "Unknown",
      childAge: childData?.age || calculateAge(childData?.birthDate) || "Unknown",
      scores: {
        inattentive: {
          score: inattentiveScore,
          aboveCutoff: inattentiveCutoff,
          percentile: inattentivePercentile
        },
        hyperactive: {
          score: hyperactiveScore,
          aboveCutoff: hyperactiveCutoff,
          percentile: hyperactivePercentile
        },
        combined: {
          score: combinedScore,
          aboveCutoff: combinedCutoff,
          percentile: combinedPercentile
        },
        odd: {
          score: oddScore,
          aboveCutoff: oddCutoff,
          percentile: oddPercentile
        },
        cd: {
          score: cdScore,
          aboveCutoff: cdCutoff,
          percentile: cdPercentile
        },
        anxiety: {
          score: anxietyScore,
          aboveCutoff: anxietyCutoff,
          percentile: anxietyPercentile
        }
      },
      diagnosis: primaryDiagnosis,
      subtypeDetails: subtypeDetails,
      comorbidities: getComorbidities(oddCutoff, cdCutoff, anxietyCutoff),
      recommendations: getRecommendations(
        inattentiveCutoff, 
        hyperactiveCutoff, 
        combinedCutoff,
        oddCutoff,
        cdCutoff,
        anxietyCutoff
      )
    };
    
    setReport(reportData);
    setLoading(false);
  };

  // Helper functions for calculations
  const calculateSubtypeScore = (responses, startId, endId) => {
    let total = 0;
    for (let i = startId; i <= endId; i++) {
      total += responses[i] || 0;
    }
    return total;
  };

  const hasPerformanceProblems = (responses) => {
    // Check if any performance questions (48-55) have scores of 1 or 2
    for (let i = 48; i <= 55; i++) {
      if (responses[i] === 1 || responses[i] === 2) {
        return true;
      }
    }
    return false;
  };

  const hasInattentiveCutoff = (responses, hasPerformanceIssues) => {
    // Need 6+ questions with scores of 2 or 3 ("Often" or "Very Often") on questions 1-9
    // AND at least one performance problem
    if (!hasPerformanceIssues) return false;
    
    let count = 0;
    for (let i = 1; i <= 9; i++) {
      if (responses[i] >= 2) {
        count++;
      }
    }
    return count >= 6;
  };

  const hasHyperactiveCutoff = (responses, hasPerformanceIssues) => {
    // Need 6+ questions with scores of 2 or 3 on questions 10-18
    // AND at least one performance problem
    if (!hasPerformanceIssues) return false;
    
    let count = 0;
    for (let i = 10; i <= 18; i++) {
      if (responses[i] >= 2) {
        count++;
      }
    }
    return count >= 6;
  };

  const hasODDCutoff = (responses, hasPerformanceIssues) => {
    // Need 4+ questions with scores of 2 or 3 on questions 19-26
    // AND at least one performance problem
    if (!hasPerformanceIssues) return false;
    
    let count = 0;
    for (let i = 19; i <= 26; i++) {
      if (responses[i] >= 2) {
        count++;
      }
    }
    return count >= 4;
  };

  const hasCDCutoff = (responses, hasPerformanceIssues) => {
    // Need 3+ questions with scores of 2 or 3 on questions 27-40
    // AND at least one performance problem
    if (!hasPerformanceIssues) return false;
    
    let count = 0;
    for (let i = 27; i <= 40; i++) {
      if (responses[i] >= 2) {
        count++;
      }
    }
    return count >= 3;
  };

  const hasAnxietyCutoff = (responses, hasPerformanceIssues) => {
    // Need 3+ questions with scores of 2 or 3 on questions 41-47
    // AND at least one performance problem
    if (!hasPerformanceIssues) return false;
    
    let count = 0;
    for (let i = 41; i <= 47; i++) {
      if (responses[i] >= 2) {
        count++;
      }
    }
    return count >= 3;
  };

  const calculatePercentile = (score, maxScore) => {
    // Simple percentile calculation (just for demonstration)
    // In a real app, this would use normed data tables
    return Math.min(99.9, Math.round((score / maxScore) * 100));
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "Unknown";
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (
      today.getMonth() < birth.getMonth() || 
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    
    return age;
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
      
      if (inattentive) {
        recommendations.push("Strategies for improving organization and focus");
      }
      
      if (hyperactive) {
        recommendations.push("Strategies for managing hyperactivity and impulsivity");
      }
    }
    
    if (odd) {
      recommendations.push("Evaluation for Oppositional Defiant Disorder");
      recommendations.push("Parent management training may be beneficial");
    }
    
    if (cd) {
      recommendations.push("Immediate evaluation for Conduct Disorder by a mental health professional");
    }
    
    if (anxiety) {
      recommendations.push("Evaluation for anxiety and/or depression");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("No specific interventions indicated based on current results");
      recommendations.push("Continue monitoring developmental progress");
    }
    
    return recommendations;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="report-container loading">
        <div className="loading-spinner"></div>
        <p>Generating report...</p>
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>ADHD Assessment Report</h1>
        <div className="report-meta">
          <p><strong>Child:</strong> {report.childName}</p>
          <p><strong>Age:</strong> {report.childAge}</p>
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
            <tr>
              <td>Inattentive Subtype</td>
              <td>{report.scores.inattentive.score}</td>
              <td>{report.scores.inattentive.aboveCutoff ? "Above" : "Below"}</td>
              <td>{report.scores.inattentive.percentile}</td>
            </tr>
            <tr>
              <td>Hyperactive/Impulsive Subtype</td>
              <td>{report.scores.hyperactive.score}</td>
              <td>{report.scores.hyperactive.aboveCutoff ? "Above" : "Below"}</td>
              <td>{report.scores.hyperactive.percentile}</td>
            </tr>
            <tr>
              <td>Combined Subtype</td>
              <td>{report.scores.combined.score}</td>
              <td>{report.scores.combined.aboveCutoff ? "Above" : "Below"}</td>
              <td>{report.scores.combined.percentile}</td>
            </tr>
            <tr>
              <td>Oppositional Defiant Disorder</td>
              <td>{report.scores.odd.score}</td>
              <td>{report.scores.odd.aboveCutoff ? "Above" : "Below"}</td>
              <td>{report.scores.odd.percentile}</td>
            </tr>
            <tr>
              <td>Conduct Disorder</td>
              <td>{report.scores.cd.score}</td>
              <td>{report.scores.cd.aboveCutoff ? "Above" : "Below"}</td>
              <td>{report.scores.cd.percentile}</td>
            </tr>
            <tr>
              <td>Anxiety/Depression</td>
              <td>{report.scores.anxiety.score}</td>
              <td>{report.scores.anxiety.aboveCutoff ? "Above" : "Below"}</td>
              <td>{report.scores.anxiety.percentile}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="report-section">
        <h2>Percentile Comparison</h2>
        <div className="percentile-chart">
          {/* Visual representation of percentiles */}
          <div className="chart-bars">
            {Object.entries(report.scores).map(([key, data]) => (
              <div className="chart-bar-container" key={key}>
                <div className="chart-bar-label">{getReadableScaleName(key)}</div>
                <div className="chart-bar-outer">
                  <div 
                    className={`chart-bar-inner ${data.aboveCutoff ? 'above-cutoff' : ''}`}
                    style={{ width: `${data.percentile}%` }}
                  ></div>
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
        
        {report.comorbidities.length > 0 && (
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
          {report.recommendations.map((rec, index) => (
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

      <div className="report-actions">
        <button 
          className="secondary-button" 
          onClick={() => navigate("/dashboard")}
        >
          Return to Dashboard
        </button>
        <button 
          className="primary-button" 
          onClick={() => window.print()}
        >
          Print Report
        </button>
      </div>
    </div>
  );

  // Helper function to convert scale keys to readable names
  function getReadableScaleName(key) {
    const names = {
      inattentive: "Inattentive",
      hyperactive: "Hyperactive",
      combined: "Combined",
      odd: "Oppositional",
      cd: "Conduct",
      anxiety: "Anxiety/Depression"
    };
    return names[key] || key;
  }
};

export default ReportPage;