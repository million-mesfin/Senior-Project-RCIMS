import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfessionalStyles/showhistory.css";

const PatientHistoryPage = ({ patientId, onGoBack }) => {
  const [patientHistory, setPatientHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedHistory, setExpandedHistory] = useState(null); // To track which history is expanded

  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/patient-history/get-patient-history/${patientId}`
        );
        if (response.data.patientHistory.length > 0) {
          setPatientHistory(response.data.patientHistory);
        } else {
          setError("No history available for this patient.");
        }
      } catch (error) {
        setError("Failed to fetch patient history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientHistory();
  }, [patientId]);

  const toggleHistoryDetails = (index) => {
    if (expandedHistory === index) {
      setExpandedHistory(null); // Collapse if already open
    } else {
      setExpandedHistory(index); // Expand the clicked one
    }
  };

  return (
    <div className="patient-history-page">
      <button className="btn btn-back" onClick={onGoBack}>
        Back
      </button>
      <h2>Patient History</h2>
      {loading && <p>Loading history...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && patientHistory.length > 0 && (
        <div className="history-list">
          {patientHistory.map((historyItem, index) => (
            <div key={index} className="history-card">
              <p className="history-number">{index + 1}</p>
              <p><strong>Date:</strong> {new Date(historyItem.createdAt).toLocaleDateString()}</p>
              <p><strong>Details:</strong> {historyItem.historyData.slice(0, 50)}...</p>
              <div className="button-container">
                <button
                  className="btn btn-details"
                  onClick={() => toggleHistoryDetails(index)}
                >
                  {expandedHistory === index ? "Hide Details" : "View Details"}
                </button>
              </div>

              {expandedHistory === index && (
                <div className="expanded-details">
                  <p><strong>Full Details:</strong> {historyItem.historyData}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHistoryPage;
