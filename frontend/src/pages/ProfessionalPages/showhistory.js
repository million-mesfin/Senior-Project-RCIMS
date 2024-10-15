import React, { useState, useEffect } from "react";
import axios from "axios";

import "./ProfessionalStyles/showhistory.css";
const PatientHistoryPage = ({ patientId, onGoBack }) => {
  const [patientHistory, setPatientHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch patient history when the component mounts
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

  return (
    <div className="patient-history-page">
      <button className="btn btn-back" onClick={onGoBack}>
        Back
      </button>
      <h2>Patient History</h2>
      {loading && <p>Loading history...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && patientHistory.length > 0 && (
        <ul className="history-list">
          {patientHistory.map((historyItem, index) => (
            <li key={index} className="history-item">
              <p><strong>Date:</strong> {new Date(historyItem.createdAt).toLocaleDateString()}</p>
              <p><strong>Details:</strong> {historyItem.historyData}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientHistoryPage;
