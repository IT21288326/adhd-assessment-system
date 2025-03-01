import React from "react";
import { useLocation } from "react-router-dom";

const ResultsPage = () => {
  const location = useLocation();
  const { result } = location.state || {};

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Prediction Results</h3>
            </div>
            <div className="card-body">
              {result && result.backendResponseFormat ? (
                <div className="alert alert-success">
                  <p>
                    <strong>Future Challenge:</strong> {result.backendResponseFormat.futureChallenge}
                  </p>
                  <p>
                    <strong>Prevention Mechanism:</strong> {result.backendResponseFormat.preventionMechanism}
                  </p>
                </div>
              ) : (
                <div className="alert alert-danger">
                  No results available. Please try again.
                </div>
              )}
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.location.replace("/")}
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
