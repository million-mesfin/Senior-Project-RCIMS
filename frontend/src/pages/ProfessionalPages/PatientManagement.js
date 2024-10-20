import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfessionalStyles/PatientManagement.css";
import ShowPatientDetails from "./ShowPatientDetails"; 

const PatientManagement = () => {
  const [activeTab, setActiveTab] = useState("ListOfPatients");
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null); // Track selected patient ID for details

  useEffect(() => {
    fetchPatients();
  }, []);

  // Get current professional
  const currentProfessional = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        `http://localhost:5000/api/professionals/get-professional-by-user-id/${user._id}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching current professional:", error);
      throw error;
    }
  };

  // Fetch patients of the current professional
  const fetchPatients = async () => {
    try {
      const professionalResponse = await currentProfessional();
      if (
        professionalResponse &&
        professionalResponse.data &&
        professionalResponse.data.professional &&
        professionalResponse.data.professional.length > 0
      ) {
        const professional = professionalResponse.data.professional[0];
        const response = await axios.get(
          `http://localhost:5000/api/professionals/get-patients-of-professional/${professional._id}`
        );
        setPatients(response.data || []); // Use an empty array if undefined
      } else {
        console.error("No valid professional data available:", professionalResponse);
        setPatients([]); // Set to empty array if no professional data
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]); // Set to empty array on error
    }
  };

  // Handle click for viewing patient's history or details
  const handleViewPatient = (patientId) => {
    setSelectedPatientId(patientId); // Store the selected patient ID
    setActiveTab("ViewPatientDetails"); // Switch to the "ViewPatientDetails" tab
  };

  // Handle click for adding patient history
  const handleAddHistory = (patientId) => {
    setSelectedPatientId(patientId); // Store the selected patient ID
    setActiveTab("AddPatientHistory"); // Switch to "AddPatientHistory" tab
  };

  // Function to go back to the list of patients
  const handleGoBack = () => {
    setActiveTab("ListOfPatients"); // Return to "ListOfPatients"
  };

  // Function to render the correct component based on the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case "ListOfPatients":
        return (
          <ListOfPatients
            patients={patients}
            onViewPatient={handleViewPatient}
            
          />
        );
      case "ViewPatientDetails":
        return <ShowPatientDetails patientId={selectedPatientId} onGoBack={handleGoBack} fetchPatients={fetchPatients} />; // Pass fetchPatients to update the list after detachment
      default:
        return <ListOfPatients patients={patients} />;
    }
  };

  return (
    <div className="patient-management-page">
      {/* Navigation tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "ListOfPatients" ? "active" : ""}`}
          onClick={() => setActiveTab("ListOfPatients")}
        >
          View All Patients
        </button>
      </div>

      {/* Render the component based on the active tab */}
      <div className="tab-content">{renderActiveTab()}</div>
    </div>
  );
};

// ListOfPatients Component
const ListOfPatients = ({ patients, onViewPatient, onAddHistory }) => {
  return (
    <div>
      <h2>List of Patients</h2>
      {patients.length > 0 ? (
        <ul className="patients-list">
          {patients.map((patient) => (
            <li key={patient._id} className="patient-item">
              <div className="patient-info">
                <h3>{`${patient.user?.name} ${patient.user?.fatherName} ${patient.user?.grandfatherName}`}</h3>
                <p><strong>Phone Number:</strong> {patient.user?.phoneNumber}</p>
                <p><strong>Patient Type:</strong> {patient.patientType}</p>
              </div>
              <div className="patient-actions">
                <button className="btn btn-details" onClick={() => onViewPatient(patient._id)}>
                  View Details
                </button>
               
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No patients found.</p>
      )}
    </div>
  );
};

export default PatientManagement;
